#!/bin/bash

# Wait for Postgres
echo "Waiting for PostgreSQL..."
while ! nc -z postgres 5432; do
  sleep 0.1
done
echo "PostgreSQL started"

# Initialize Django Project if manage.py doesn't exist
if [ ! -f "manage.py" ]; then
    echo "Initializing Django Project..."
    django-admin startproject crm_system .
fi

# Run Migrations
echo "Running Migrations..."
python manage.py migrate

# Create Superuser if needed (optional automation)
# python manage.py createsuperuser --noinput --username admin --email admin@hostamar.com || true

# Start Server
echo "Starting Server..."
python manage.py runserver 0.0.0.0:8000
