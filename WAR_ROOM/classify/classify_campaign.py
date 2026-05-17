"""Classify 14 OC vào 5 bucket: Accelerate / Support / Watch / Reset / Close.

Input:  ../DATA_LAYER/campaign/oc_status_data.json (or *_sample.json fallback)
Output: ../DATA_LAYER/campaign/campaign_portfolio_classification.json

Rule mặc định (CEO + PMO sẽ override):
  - Green + completion >= 60%   → Accelerate
  - Green + completion < 60%    → Support
  - Amber                       → Watch (mặc định)
  - Red + completion >= 40%     → Support
  - Red + completion < 40%      → Reset
  - Có blocker > 30 ngày        → Escalate / Close (PMO chốt)
"""
from __future__ import annotations
import json
import logging
from pathlib import Path
from datetime import datetime, timezone, timedelta

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)
VN_TZ = timezone(timedelta(hours=7))

ROOT = Path(__file__).resolve().parent.parent.parent
SRC = ROOT / "DATA_LAYER/campaign"


def classify(oc: dict) -> str:
    s = oc.get("status")
    c = oc.get("completion_pct", 0) or 0
    if s == "green":
        return "Accelerate" if c >= 60 else "Support"
    if s == "amber":
        return "Watch"
    if s == "red":
        return "Support" if c >= 40 else "Reset"
    return "Watch"


def run() -> None:
    src = SRC / "oc_status_data.json"
    if not src.exists():
        src = SRC / "oc_status_data_sample.json"
        log.warning(f"Using sample: {src.name}")
    raw = json.loads(src.read_text(encoding="utf-8"))
    classified: dict[str, list] = {b: [] for b in ["Accelerate", "Support", "Watch", "Reset", "Close"]}
    for oc in raw["data"]["oc_list"]:
        bucket = classify(oc)
        classified[bucket].append({
            "id": oc["id"], "name": oc["name"], "owner": oc.get("owner"),
            "status": oc["status"], "completion_pct": oc.get("completion_pct"),
            "blocker": oc.get("blocker", ""),
        })
    output = {
        "meta": {
            "extracted_at": datetime.now(VN_TZ).isoformat(),
            "source": f"WAR_ROOM/classify/classify_campaign.py · src={src.name}",
            "rule_version": "v1-default",
        },
        "data": {
            "total": len(raw["data"]["oc_list"]),
            "buckets": classified,
            "counts": {k: len(v) for k, v in classified.items()},
        },
    }
    out_file = SRC / "campaign_portfolio_classification.json"
    out_file.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    log.info(f"Wrote {out_file}")
    log.info(f"Counts: {output['data']['counts']}")


if __name__ == "__main__":
    run()
