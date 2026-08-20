"""SQLite-backed local server for the daily reflection app."""

from __future__ import annotations

import json
import mimetypes
import sqlite3
from datetime import date, datetime, timezone
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

BASE_DIR = Path(__file__).parent
DATABASE_PATH = BASE_DIR / "notes.db"


def initialize_database() -> None:
    """Create the database table when it does not exist yet."""
    with sqlite3.connect(DATABASE_PATH) as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                note_date TEXT NOT NULL UNIQUE,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )


class AppHandler(SimpleHTTPRequestHandler):
    """Serve the app files and its small JSON API."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_GET(self) -> None:
        if self.path == "/api/notes":
            self.list_notes()
            return
        if self.path.startswith("/api/notes/"):
            self.get_note()
            return
        super().do_GET()

    def do_POST(self) -> None:
        if self.path == "/api/notes":
            self.save_note()
            return
        self.send_error(HTTPStatus.NOT_FOUND)

    def get_note(self) -> None:
        note_date = self.path.removeprefix("/api/notes/")
        if not self.is_valid_date(note_date):
            self.send_json({"error": "日付の形式が正しくありません。"}, HTTPStatus.BAD_REQUEST)
            return

        with sqlite3.connect(DATABASE_PATH) as connection:
            connection.row_factory = sqlite3.Row
            row = connection.execute(
                "SELECT note_date, question, answer, updated_at FROM notes WHERE note_date = ?",
                (note_date,),
            ).fetchone()

        self.send_json(dict(row) if row else None)

    def list_notes(self) -> None:
        with sqlite3.connect(DATABASE_PATH) as connection:
            connection.row_factory = sqlite3.Row
            rows = connection.execute(
                "SELECT note_date, question, answer, updated_at FROM notes ORDER BY note_date DESC"
            ).fetchall()
        self.send_json([dict(row) for row in rows])

    def save_note(self) -> None:
        try:
            length = int(self.headers.get("Content-Length", "0"))
            data = json.loads(self.rfile.read(length))
            note_date = data["date"]
            question = data["question"].strip()
            answer = data["answer"].strip()
        except (json.JSONDecodeError, KeyError, AttributeError, ValueError):
            self.send_json({"error": "保存する内容の形式が正しくありません。"}, HTTPStatus.BAD_REQUEST)
            return

        if not self.is_valid_date(note_date) or not question:
            self.send_json({"error": "日付またはお題が正しくありません。"}, HTTPStatus.BAD_REQUEST)
            return

        now = datetime.now(timezone.utc).isoformat()
        with sqlite3.connect(DATABASE_PATH) as connection:
            connection.execute(
                """
                INSERT INTO notes (note_date, question, answer, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(note_date) DO UPDATE SET
                    question = excluded.question,
                    answer = excluded.answer,
                    updated_at = excluded.updated_at
                """,
                (note_date, question, answer, now, now),
            )
        self.send_json({"message": "保存しました。"})

    @staticmethod
    def is_valid_date(value: str) -> bool:
        try:
            date.fromisoformat(value)
            return True
        except ValueError:
            return False

    def send_json(self, data: object, status: HTTPStatus = HTTPStatus.OK) -> None:
        response = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response)))
        self.end_headers()
        self.wfile.write(response)


if __name__ == "__main__":
    initialize_database()
    server = ThreadingHTTPServer(("127.0.0.1", 8000), AppHandler)
    print("アプリを起動しました: http://127.0.0.1:8000")
    print("終了するには Ctrl + C を押してください。")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nサーバーを終了しました。")
    finally:
        server.server_close()
