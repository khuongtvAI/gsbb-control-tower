"""Orchestrator: chạy tất cả extract script và validate JSON output.

Phase 1: đọc file Excel từ templates/<domain>/inbox/ (paste tay).
Phase 2: thay bằng API connectors (Bravo · MES · Sheets).

Usage:
    python3 extract/refresh_all.py             # chạy tất cả domain
    python3 extract/refresh_all.py finance     # chạy 1 domain
"""
import sys
import json
import logging
from pathlib import Path
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(levelname)s %(message)s')
log = logging.getLogger("refresh_all")

ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = ROOT / "DATA_LAYER"
TEMPLATES = ROOT / "templates"

DOMAINS = ["finance", "customer", "production", "quality", "campaign"]


def run_domain(domain: str) -> bool:
    """Run extract for 1 domain. Return True if success, False on error."""
    extract_module = f"extract_{domain}"
    inbox = TEMPLATES / domain / "inbox"

    log.info(f"[{domain}] inbox={inbox.exists()} module={extract_module}")

    # TODO Phase 1: import extract_<domain> và gọi run()
    # try:
    #     from importlib import import_module
    #     mod = import_module(extract_module)
    #     mod.run(inbox_dir=inbox, out_dir=DATA_DIR / domain)
    # except Exception as e:
    #     log.exception(f"[{domain}] failed: {e}")
    #     return False

    log.warning(f"[{domain}] extract_{domain}.py CHƯA implement — dùng sample data sẵn có")
    return True


def main(targets=None):
    targets = targets or DOMAINS
    log.info(f"=== Refresh started @ {datetime.now().isoformat()} ===")
    log.info(f"Targets: {targets}")
    results = {d: run_domain(d) for d in targets}
    ok = sum(results.values())
    log.info(f"=== Done: {ok}/{len(results)} succeeded ===")
    sys.exit(0 if ok == len(results) else 1)


if __name__ == "__main__":
    args = sys.argv[1:]
    main(args if args else None)
