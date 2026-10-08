import logging
import sys
import json
from datetime import datetime, timezone
from typing import Any, Dict

class StructuredFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_entry: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if hasattr(record, "provider"):
            log_entry["provider"] = record.provider
        if hasattr(record, "status"):
            log_entry["status"] = record.status
        if hasattr(record, "latency_ms"):
            log_entry["latency_ms"] = record.latency_ms
        if hasattr(record, "cache_hit"):
            log_entry["cache_hit"] = record.cache_hit
        if hasattr(record, "fallback"):
            log_entry["fallback"] = record.fallback
        return json.dumps(log_entry)

def setup_logger(name: str = "pravah") -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(StructuredFormatter())
        logger.addHandler(handler)
    return logger

logger = setup_logger()
