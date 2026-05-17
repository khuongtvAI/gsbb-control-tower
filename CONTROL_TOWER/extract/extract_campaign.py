"""Extract campaign domain — read Master Action Tracker Excel → JSON.

Source: templates/campaign/inbox/<latest>.xlsx (PMO Master Action Tracker format)
Output: DATA_LAYER/campaign/campaign_data.json + oc_status_data.json
"""
from __future__ import annotations
import json
import sys
import logging
from pathlib import Path
from datetime import datetime, timezone, timedelta
import openpyxl

log = logging.getLogger(__name__)
VN_TZ = timezone(timedelta(hours=7))


def find_latest_excel(inbox: Path) -> Path | None:
    files = sorted(inbox.glob("*.xlsx"), key=lambda p: p.stat().st_mtime, reverse=True)
    return files[0] if files else None


def extract_master_tracker(xlsx: Path) -> dict:
    """Read 'MASTER ACTION TRACKER' sheet → list of action rows."""
    wb = openpyxl.load_workbook(xlsx, data_only=True, read_only=True)
    sheet_name = next((s for s in wb.sheetnames if "ACTION" in s.upper()), wb.sheetnames[0])
    ws = wb[sheet_name]
    headers = []
    rows = []
    for i, r in enumerate(ws.iter_rows(values_only=True)):
        if i == 2:  # header at row index 2 based on W19 sample
            headers = [str(c or "").strip() for c in r]
            continue
        if i > 2 and any(r):
            rows.append(dict(zip(headers, r)))
    wb.close()
    return {"sheet": sheet_name, "headers": headers, "rows": rows}


def run(inbox_dir: Path, out_dir: Path) -> None:
    inbox_dir.mkdir(parents=True, exist_ok=True)
    out_dir.mkdir(parents=True, exist_ok=True)
    xlsx = find_latest_excel(inbox_dir)
    if not xlsx:
        log.warning(f"No xlsx in {inbox_dir} — skip")
        return
    log.info(f"Reading {xlsx.name}")
    raw = extract_master_tracker(xlsx)
    output = {
        "meta": {
            "extracted_at": datetime.now(VN_TZ).isoformat(),
            "source": f"PMO Master Action Tracker · {xlsx.name}",
            "week_label": datetime.now(VN_TZ).strftime("%Y-W%V"),
        },
        "data": {
            "total_actions": len(raw["rows"]),
            "headers": raw["headers"],
            "rows": raw["rows"][:50],  # cap để JSON không quá to
        },
    }
    out_file = out_dir / "campaign_data.json"
    out_file.write_text(json.dumps(output, ensure_ascii=False, indent=2, default=str), encoding="utf-8")
    log.info(f"Wrote {out_file}")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    ROOT = Path(__file__).resolve().parent.parent.parent
    run(ROOT / "templates/campaign/inbox", ROOT / "DATA_LAYER/campaign")
