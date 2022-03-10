#!/bin/sh

set -e

cd /app

if [ $MIGRATE_DATABASE -eq 1 ]; then
  echo "Running migrations..."
  npx prisma migrate deploy
fi

exec "$@"
