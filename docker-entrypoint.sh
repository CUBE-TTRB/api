#!/bin/sh

set -e

cd /app
s
if [ $MIGRATE_DATABASE -eq 1 ]; then
  echo "Running migrations..."
  npx prisma migrate deploy

  echo "Seeding database..."
  npx prisma db seed
fi

exec "$@"
