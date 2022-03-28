#!/bin/sh

set -e

cd /app

if [ $MIGRATE_DATABASE -eq 1 ]; then
  echo "Running migrations..."
  npx prisma migrate deploy

  echo "Seeding database..."
  npx prisma db seed

  echo "Generating Prisma Client..."
  npx prisma generate
fi

exec "$@"
