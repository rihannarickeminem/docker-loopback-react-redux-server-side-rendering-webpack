#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
CREATE DATABASE test_database;
CREATE USER test_user WITH password 'qwerty';
GRANT ALL privileges ON DATABASE test_database TO test_user;
EOSQL
