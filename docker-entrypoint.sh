#!/bin/sh

set -e

cd /app

echo "Generating Prisma Client..."
npx prisma generate

if [ -n "$MIGRATE_DATABASE" ]; then
  echo "Running migrations..."
  npx prisma migrate deploy

  echo "Seeding database..."
  npx prisma db seed
fi

exec "$@"
