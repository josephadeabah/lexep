#!/bin/sh
set -x  # Print all commands

echo "Starting Lexep backend..."

# Initialize database
echo "Initializing database..."
python -m app.init_db
echo "Database init completed with exit code: $?"

# Check if database needs seeding
echo "Checking if database needs seeding..."
if [ "$SEED_DATABASE" = "true" ] || [ "$SEED_DATABASE" = "1" ]; then
    echo "Seeding database..."
    python -m app.seed
    echo "Seed completed with exit code: $?"
else
    echo "Skipping seed (set SEED_DATABASE=true to enable)"
fi

# Start the application
echo "Starting uvicorn server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000
echo "Uvicorn exited with code: $?"