# bloglist-psql

A Node.js application using a Postgres relational database, developed through exercises for part 13 of Full Stack open course.

Connection to the database is made through a Docker container (since Fly.io doesn't offer managed Postgres databases).

To establish database connection with data persisted in a bind mount volume `db_data`, run:

```
docker run \
  --name bloglist-psql \
  -e POSTGRES_PASSWORD=PASS_FROM_ENV_FILE \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v ./db_data:/var/lib/postgresql/data \
  -p 5432:5432
  postgres
```

To access psql console while the container is running:
`docker exec -it CONTAINER_ID psql -U postgres postgres`

To restart a stopped container:
`docker container start CONTAINER_ID`

Run the server itself with `npm run dev`
