# wn-fake-db

Mock data script for [Write-Now](https://github.com/UmarovJX/wn-back) project

Needs Env variables to work:

- pg_connection_string
- users_num to create
- posts_num to create
- password_end - string that is used on creating fake users' passwords. Pattern - username+password_end

Comments and likes numbers are generated via hardcoded values.

Also there are some delays hardcoded in inserting comments, cos I didn't know about committing sessions in postgres 😆
