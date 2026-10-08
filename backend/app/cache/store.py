import time
from typing import Any, Dict, Optional, Tuple

class CacheEntry:
    def __init__(self, data: Any, ttl_seconds: int, etag: Optional[str] = None):
        self.data = data
        self.etag = etag
        self.created_at = time.time()
        self.expires_at = self.created_at + ttl_seconds

    @property
    def is_expired(self) -> bool:
        return time.time() > self.expires_at

class CacheStore:
    def __init__(self):
        self._store: Dict[str, CacheEntry] = {}

    def get(self, key: str) -> Optional[Any]:
        entry = self._store.get(key)
        if entry and not entry.is_expired:
            return entry.data
        return None

    def get_with_metadata(self, key: str) -> Tuple[Optional[Any], Optional[str], bool, Optional[float]]:
        """Returns (data, etag, is_expired, created_at)"""
        entry = self._store.get(key)
        if entry:
            return entry.data, entry.etag, entry.is_expired, entry.created_at
        return None, None, True, None

    def get_stale_fallback(self, key: str) -> Optional[Tuple[Any, float]]:
        """Return last known data even if expired along with timestamp"""
        entry = self._store.get(key)
        if entry:
            return entry.data, entry.created_at
        return None

    def set(self, key: str, data: Any, ttl_seconds: int = 300, etag: Optional[str] = None) -> None:
        self._store[key] = CacheEntry(data, ttl_seconds, etag)

    def clear(self) -> None:
        self._store.clear()

cache = CacheStore()
