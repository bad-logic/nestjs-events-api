#!/bin/bash

set -e

mysql -u "root" -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
    CREATE DATABASE events_test;
    GRANT ALL ON events_test.* TO $MYSQL_USER  WITH GRANT OPTION;
    CREATE DATABASE events;
    GRANT ALL ON events.* TO $MYSQL_USER  WITH GRANT OPTION;
EOSQL