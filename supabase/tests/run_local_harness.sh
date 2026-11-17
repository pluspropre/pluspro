#!/usr/bin/env bash
# Validates the migration set, the seed and the RLS policies on a BARE local Postgres (no Docker needed).
# Usage: bash supabase/tests/run_local_harness.sh [database_url]
# Without an argument it (re)creates a scratch database `pluspropre_test` on localhost.
set -euo pipefail
cd "$(dirname "$0")"

DB_URL="${1:-}"
if [ -z "$DB_URL" ]; then
  dropdb --if-exists pluspropre_test
  createdb pluspropre_test
  DB_URL="postgresql:///pluspropre_test"
fi

psql "$DB_URL" -v ON_ERROR_STOP=1 -q -f harness_stub.sql

for f in ../migrations/*.sql; do
  echo "== applying $f"
  psql "$DB_URL" -v ON_ERROR_STOP=1 -q -f "$f"
done

echo "== applying seed"
psql "$DB_URL" -v ON_ERROR_STOP=1 -q -f ../seed.sql

echo "== running RLS tests"
psql "$DB_URL" -v ON_ERROR_STOP=1 -q -f rls_tests.sql
echo "== all database tests passed"
