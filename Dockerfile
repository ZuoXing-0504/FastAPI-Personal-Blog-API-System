FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY alembic ./alembic
COPY app ./app
COPY docker ./docker
COPY sql ./sql
COPY alembic.ini .
COPY main.py .
COPY .env.example .

RUN chmod +x docker/start.sh

EXPOSE 8000

CMD ["./docker/start.sh"]
