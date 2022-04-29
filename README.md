# (Re)Source Relationnelles - API

[![delivery](https://github.com/CUBE-TTRB/api/actions/workflows/deploy.yml/badge.svg)](https://github.com/CUBE-TTRB/api/actions/workflows/deploy.yml)
[![delivery](https://github.com/CUBE-TTRB/api/actions/workflows/deploy.yml/badge.svg)](https://github.com/CUBE-TTRB/api/actions/workflows/deploy.yml)

## Usage with Docker

```sh
$ docker-compose up
```

This fires up a PostgreSQL database, the API on port [:3000](http://localhost:3000)
and Prisma Studio on port [:5555](http://localhost:5555).

## Endpoints

Every endpoints (except `POST` `/users` and `POST` `/sessions`) require a valid
JWT token in the `token` field. All responses have a `token` fields.

If the operation is successful, the response contains the `result` field,
otherwise it contains the `errors` fields.

Parameters inside of `()` are optional.

URL       | Method    | Description     | Payload | Response (in `result`) |
----------|-----------|-----------------| ------- | -------- |
`/users`  | `POST`    | Create (signup) a new user | `{ user: { name, email }, auth: { password } }` | `{ id, name, email }`
`/users/:id`  | `GET` | Retrieve one user | | `{ user: { name, email } }`
`/sessions` | `POST` | Create a new session (get a JWT) | `{ email, password }` | `{ token }`
`/resources` | `GET` | Retrieve all resources | | `[{ id, visibility, state, type, categoryId, title, body, date, location }, ...]`
`/resources` | `POST` | Create a new resource | `{ resource: { type, visibility, title, body, (categoryId) } }` | `{ id, visibility, state, type, categoryId, title, body, date, location }`
`/resources/:id` | `GET` | Retrieve a resource | | `{ id, visibility, state, type, categoryId, title, body, date, location }`
`/resources/:id` | `PATCH` | Update a resource | `{ resource: { type, visibility, title, body, (categoryId) } }` | `{ id, visibility, state, type, categoryId, title, body, date, location }`
`/resources/:id` | `DELETE` | Delete a resource | | `null`

---

## Tips with docker-compose

One can also run the services independantly with:

```yml
# Spin up the database only
$ docker-compose up postgres

# Spin up the API only
$ docker-compose up api

# Spin up the API container and run a single command
$ docker-compose run api npx prisma migrate dev

# Run a command in the running API container
$ docker-compose exec npx prisma studio
```

It might be convenient to define aliases for these `docker-compose` commands:

```bash
alias dcu="docker-compose up"
alias dcr="docker-compose run"
alias dce="docker-compose exec"
```
