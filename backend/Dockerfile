# Builder stage
FROM python:3.11-slim as builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Runtime stage
FROM python:3.11-slim

WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY ./src ./src

ENV PATH=/root/.local/bin:$PATH
ENV PYTHONPATH=/app/src  

CMD ["uvicorn", "src.server:app", "--host", "0.0.0.0", "--port", "8000"]
