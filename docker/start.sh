#!/bin/sh

set -e

python - <<'PY'
import os
import socket
import sys
import time

host = os.getenv("MYSQL_HOST", "db")
port = int(os.getenv("MYSQL_PORT", "3306"))

for attempt in range(60):
    try:
        with socket.create_connection((host, port), timeout=2):
            print(f"Database is reachable at {host}:{port}")
            break
    except OSError:
        print(f"Waiting for database at {host}:{port}... ({attempt + 1}/60)")
        time.sleep(2)
else:
    print("Database connection timeout.")
    sys.exit(1)
PY

alembic upgrade head
exec uvicorn main:app --host 0.0.0.0 --port 8000
