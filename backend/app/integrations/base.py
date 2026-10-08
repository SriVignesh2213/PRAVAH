import asyncio
from abc import ABC, abstractmethod
from typing import Any, Dict, Optional, Tuple
import time
from datetime import datetime, timezone
from app.models.domain import ProviderStatus, SystemProviderHealth
from app.cache.store import cache
from app.core.logging import logger

class BaseDataProvider(ABC):
    def __init__(self, name: str):
        self.name = name
        self.status = ProviderStatus.UNAVAILABLE
        self.last_sync = datetime.now(timezone.utc).isoformat()
        self.last_latency_ms: Optional[float] = None
        self.last_error: Optional[str] = None
        self.fallback_mode = "DEMO_FALLBACK"
        self._lock: Optional[asyncio.Lock] = None

    @abstractmethod
    def has_credentials(self) -> bool:
        """Check if necessary API keys/tokens are configured."""
        pass

    @abstractmethod
    async def fetch_live(self) -> Any:
        """Query the official remote service."""
        pass

    @abstractmethod
    def get_fallback_data(self) -> Any:
        """Deterministic, grounded Chennai fallback/demo scenario."""
        pass

    async def get_data(self) -> Tuple[Any, ProviderStatus, bool]:
        """
        Executes fetch with:
        1. TTL Cache check
        2. Async Lock to prevent stampede of duplicate concurrent requests
        3. Live API execution (if credentials/available)
        4. Stale cache fallback
        5. Grounded clean fallback with negative caching to avoid hammering upstream
        Returns: (data, status, is_live)
        """
        cache_key = f"provider_{self.name}"
        cached = cache.get(cache_key)
        if cached is not None:
            return cached, ProviderStatus.CONNECTED if self.last_error is None else ProviderStatus.USING_CACHE, True

        if self._lock is None:
            self._lock = asyncio.Lock()

        async with self._lock:
            # Re-check cache inside lock (in case a prior coroutine just resolved it)
            cached = cache.get(cache_key)
            if cached is not None:
                return cached, ProviderStatus.CONNECTED if self.last_error is None else ProviderStatus.USING_CACHE, True

            start = time.time()
            try:
                if not self.has_credentials():
                    self.status = ProviderStatus.NO_CREDENTIALS
                    self.last_latency_ms = 0.0
                    fb = self.get_fallback_data()
                    cache.set(cache_key, fb, ttl_seconds=300)
                    return fb, ProviderStatus.DEMO, False

                # Attempt live fetch
                data = await self.fetch_live()
                elapsed_ms = (time.time() - start) * 1000
                self.last_latency_ms = round(elapsed_ms, 2)
                self.last_sync = datetime.now(timezone.utc).isoformat()
                self.status = ProviderStatus.CONNECTED
                self.last_error = None
                
                # Cache live response for 10 minutes to prevent rate-limiting on shared deployment IPs
                cache.set(cache_key, data, ttl_seconds=600)
                return data, ProviderStatus.CONNECTED, True

            except Exception as e:
                elapsed_ms = (time.time() - start) * 1000
                self.last_latency_ms = round(elapsed_ms, 2)
                self.last_error = str(e)
                logger.warning(f"Provider {self.name} failed: {e}. Checking cache/fallback.")
                
                # Attempt stale cache
                stale = cache.get_stale_fallback(cache_key)
                if stale:
                    data, created_at = stale
                    self.status = ProviderStatus.USING_CACHE
                    return data, ProviderStatus.USING_CACHE, False

                self.status = ProviderStatus.DEGRADED
                fb = self.get_fallback_data()
                # Negative cache for 60 seconds to prevent hammering the upstream API
                cache.set(cache_key, fb, ttl_seconds=60)
                return fb, ProviderStatus.DEMO, False

    def get_health(self) -> SystemProviderHealth:
        return SystemProviderHealth(
            name=self.name,
            status=self.status,
            latency_ms=self.last_latency_ms,
            last_sync=self.last_sync,
            details=self.last_error if self.last_error else "Operational or validated fallback active",
            is_live=self.status in [ProviderStatus.CONNECTED, ProviderStatus.USING_CACHE],
            fallback_mode=self.fallback_mode
        )
