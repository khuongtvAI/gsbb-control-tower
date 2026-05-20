"""Query tools — Claude/Kayson đọc DATA_LAYER qua các function này.

Sample:
    from query_tools import list_red_oc, get_waiting_decisions
    red = list_red_oc()  # → [{'id': 'OC-03', ...}, ...]
"""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "DATA_LAYER"


def _load(rel: str) -> dict:
    path = DATA_DIR / rel
    if not path.exists():
        sample = path.with_name(path.stem + "_sample.json")
        if sample.exists():
            path = sample
    return json.loads(path.read_text(encoding="utf-8"))


def get_oc_status(oc_id: str | None = None) -> list | dict:
    """Lấy trạng thái 1 hoặc tất cả 14 OC."""
    data = _load("campaign/oc_status_data.json")["data"]["oc_list"]
    if oc_id:
        return next((o for o in data if o["id"] == oc_id), {})
    return data


def list_red_oc() -> list:
    """Danh sách OC đang Red/At-Risk."""
    return [o for o in get_oc_status() if o.get("status") == "red"]


def get_ipam_case(case_id: str) -> dict:
    """Chi tiết 1 IPAM case."""
    entries = _load("campaign/ipam_log.json")["data"]["entries"]
    return next((e for e in entries if e["id"] == case_id), {})


def get_customer_portfolio(segment: str | None = None) -> list:
    """Top customers, lọc theo segment (protect/grow/fix/price-up/exit) nếu có."""
    data = _load("customer/customer_data.json")["data"]["top_customers"]
    if segment:
        return [c for c in data if c.get("status") == segment]
    return data


def get_quality_hotspots(top_n: int = 5) -> list:
    """Top N quality defects (theo cost)."""
    defects = _load("quality/quality_data.json")["data"]["top_defects"]
    return sorted(defects, key=lambda d: d.get("cost_mn", 0), reverse=True)[:top_n]


def get_waiting_decisions() -> list:
    """Danh sách quyết định đang chờ CEO/PMO."""
    try:
        return _load("campaign/waiting_decisions.json")["data"]["decisions"]
    except FileNotFoundError:
        return []


def get_escalation_queue() -> list:
    """Escalation queue hiện tại."""
    try:
        return _load("campaign/escalation_queue.json")["data"]["escalations"]
    except FileNotFoundError:
        return []


def get_ebitda_bridge(period: str = "current_month") -> dict:
    """EBITDA bridge breakdown."""
    try:
        return _load("finance/ebitda_bridge.json")["data"]
    except FileNotFoundError:
        return {}


if __name__ == "__main__":
    print("Red OC:", [(o["id"], o["name"]) for o in list_red_oc()])
    print("Top quality hotspots:", get_quality_hotspots(3))
    print("Protect customers:", [c["name"] for c in get_customer_portfolio("protect")])
