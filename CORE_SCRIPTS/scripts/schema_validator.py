"""Schema validator — verify JSON output against DATA_LAYER/schemas/*.schema.json."""
from __future__ import annotations
import json
from pathlib import Path
import jsonschema

ROOT = Path(__file__).resolve().parent.parent.parent
SCHEMA_DIR = ROOT / "DATA_LAYER/schemas"


def validate(data: dict, schema_name: str) -> None:
    """Raise jsonschema.ValidationError if invalid."""
    schema_file = SCHEMA_DIR / f"{schema_name}.schema.json"
    if not schema_file.exists():
        raise FileNotFoundError(f"Schema not found: {schema_file}")
    schema = json.loads(schema_file.read_text(encoding="utf-8"))
    jsonschema.validate(instance=data, schema=schema)


if __name__ == "__main__":
    # Self-test: validate sample data files
    import sys
    targets = [
        ("finance",  "finance/finance_data_sample.json"),
        ("campaign", "campaign/oc_status_data_sample.json"),
        ("customer", "customer/customer_data_sample.json"),
        ("quality",  "quality/quality_data_sample.json"),
        ("production","production/production_data_sample.json"),
    ]
    failed = 0
    for schema_name, rel in targets:
        f = ROOT / "DATA_LAYER" / rel
        try:
            validate(json.loads(f.read_text(encoding="utf-8")), schema_name)
            print(f"  OK   {rel}")
        except Exception as e:
            print(f"  FAIL {rel} → {e.__class__.__name__}: {e}")
            failed += 1
    sys.exit(0 if failed == 0 else 1)
