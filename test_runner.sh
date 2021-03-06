set -e

if [ -z $DATABASE_URL ]; then
  echo "No DATABASE_URL provided. Using default."
  DATABASE_URL="postgres://postgres:postgres@localhost:5432/cube-api-test"
else
  echo "Using database: $DATABASE_URL"
fi

export DATABASE_URL=$DATABASE_URL

echo "Resetting database..."
npx prisma migrate reset --force > /dev/null

echo "Running Jest..."
jest --detectOpenHandles "$@"
