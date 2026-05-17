"""Local dev server for GSBB Control Tower.
Usage: python3 serve.py [port]   (default 8080)
"""
import http.server
import socketserver
import sys
import os
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
ROOT = Path(__file__).parent
APP_DIR = ROOT / "app"
DATA_DIR = ROOT.parent / "DATA_LAYER"


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(APP_DIR), **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        # Cho phép app fetch /data/<domain>/<file>.json từ DATA_LAYER/
        if self.path.startswith("/data/"):
            rel = self.path[len("/data/"):].split("?", 1)[0]
            target = DATA_DIR / rel
            if target.is_file():
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(target.read_bytes())
                return
            self.send_error(404, f"Data file not found: {rel}")
            return
        return super().do_GET()


if __name__ == "__main__":
    os.chdir(APP_DIR)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"GSBB Control Tower → http://localhost:{PORT}")
        print(f"Data served from: {DATA_DIR}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")
