# wn-fake-db
Mock data script for [Write-Now](https://github.com/UmarovJX/wn-back) project

Needs Env variables to work:
+ pg_connection_string
+ users_num to create
+ posts_num to create

Comments and likes numbers are generated via hardcoded values. 

Also there are some delays hardcoded in inserting comments, cos I didn't know about committing sessions in postgres 😆

