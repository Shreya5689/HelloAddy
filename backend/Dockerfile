FROM python:3.11-slim

ENV PIP_DEFAULT_TIMEOUT=120 \
    PIP_NO_CACHE_DIR=1
    
WORKDIR /app

COPY requirements.txt .
RUN apt-get update && apt-get install -y --no-install-recommends build-essential gcc libpq-dev libssl-dev libffi-dev && \
    python -m pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir --timeout 120 --retries 10 -r requirements.txt && \
    apt-get purge -y --auto-remove build-essential gcc && \
    rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
EXPOSE 5678