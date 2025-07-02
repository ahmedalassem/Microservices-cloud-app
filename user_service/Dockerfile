FROM python:3.9-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy all application files
COPY . .

# Set PYTHONPATH to include the current directory
ENV PYTHONPATH=/app

CMD ["python", "app.py"] 