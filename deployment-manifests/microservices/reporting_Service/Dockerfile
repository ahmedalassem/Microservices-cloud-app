FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Set PYTHONPATH to include the current directory
ENV PYTHONPATH=/app

CMD ["python", "app.py"] 