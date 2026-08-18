# pm2-postgres
PostgreSQL module for Keymetrics

![pm2-postgres screenshot](https://raw.githubusercontent.com/vladonv/pm2-postgres/master/pm2-postgres.jpg)

## Description

PM2 module to monitor key PostgreSQL server metrics:

* Tables / Indexes Count
* Backends Active / Idle
* Exclusive / Access Share Locks
* Total Tables Size
* Transactions Committed / Rollback
* Tuples Fetched / Updated / Inserted / Deleted

## Requirements

This module requires a PostgreSQL install (v9.3+, including SCRAM-SHA-256 auth on PostgreSQL 10-18).

## Install

```bash
$ npm install pm2 -g

$ pm2 install @vladonv/pm2-postgres
```

## Setting up a monitoring user

Instead of using a superuser account, it's recommended to create a dedicated, restricted user for monitoring. Connect to your database as an administrator (`psql -U postgres`) and run:

```sql
-- 1. Create a dedicated monitoring user
CREATE USER pm2_monitor WITH ENCRYPTED PASSWORD 'your_strong_password';

-- 2. Allow it to connect to your specific database
GRANT CONNECT ON DATABASE your_database_name TO pm2_monitor;

-- 3. Grant the built-in role for reading system statistics. This is a safe,
-- built-in role: it lets the user read system views (such as pg_stat_activity,
-- pg_stat_database) to see connection counts, database load, and file sizes,
-- without granting access to table data (no SELECT, INSERT, or DELETE on tables).
GRANT pg_monitor TO pm2_monitor;
```

Then use `pm2_monitor` and its password as the `username`/`password` config values below.

## Config

The default connection details are :    
"hostname": "localhost"  
"port": 5432  
"username": "guest"  
"password": "guest"  
"database": "postgres"  

To modify the config values you can use the commands:
```bash
$ pm2 set @vladonv/pm2-postgres:hostname localhost
$ pm2 set @vladonv/pm2-postgres:port 5432
$ pm2 set @vladonv/pm2-postgres:username guest
$ pm2 set @vladonv/pm2-postgres:password guest
$ pm2 set @vladonv/pm2-postgres:database postgres
```

## Uninstall

```bash
$ pm2 uninstall @vladonv/pm2-postgres
```

# License

MIT
