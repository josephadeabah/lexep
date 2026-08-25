#!/bin/sh
set -e

echo "Starting Lexep backend..."

# Initialize database
echo "Initializing database..."
python -m app.init_db

# Seed database if empty
echo "Checking if database needs seeding..."
if [ "$SEED_DATABASE" = "true" ] || [ "$SEED_DATABASE" = "1" ]; then
    echo "Seeding database..."
    python -m app.seed
else
    echo "Skipping seed (set SEED_DATABASE=true to enable)"
fi

# Start the application
echo "Starting uvicorn server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000