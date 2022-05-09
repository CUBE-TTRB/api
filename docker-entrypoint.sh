#!/bin/sh

set -e

cd /app

if [ -n $MIGRATE_DATABASE ]; then
  echo "Generating Prisma Client..."
  npx prisma generate

  echo "Running migrations..."
  npx prisma migrate deploy

  echo "Seeding database..."
  npx prisma db seed
fi

exec "$@"
