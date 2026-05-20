# CORE_SCRIPTS — Shared Python Modules

Mọi project khác import qua:

```python
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "CORE_SCRIPTS" / "scripts"))
```

## Modules planned

| Module | Mục đích | Trạng thái |
|---|---|---|
| `bravo_client.py`     | Bravo ERP extraction        | ⏳ chờ build (Phase 2) |
| `mes_client.py`       | MES/Xunyue extraction       | ⏳ chờ build (Phase 2) |
| `sheets_client.py`    | Google Sheets API           | ⏳ chờ build |
| `schema_validator.py` | JSON schema validation      | ✅ stub có sẵn |
| `ai_insights.py`      | Claude API narrative        | ⏳ chờ build (Phase 2) |
| `telegram_notify.py`  | Telegram notification       | ⏳ chờ build (optional) |
| `excel_reader.py`     | Excel inbox standard reader | ✅ stub có sẵn |

KHÔNG duplicate logic giữa các project — chuyển vào đây.

## Liên kết

- [[DATA_LAYER/CLAUDE|DATA_LAYER]] — schema_validator.py validate JSON trước khi ghi
- [[CONTROL_TOWER/CLAUDE|CONTROL_TOWER]] — dùng excel_reader + bravo_client
- [[WAR_ROOM/CLAUDE|WAR_ROOM]] — dùng sheets_client
- [[CLAUDE_LAYER/CLAUDE|CLAUDE_LAYER]] — dùng ai_insights.py + telegram_notify
