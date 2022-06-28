# (Re)Source Relationnelles - API

[![integration](https://github.com/CUBE-TTRB/api/actions/workflows/integration.yml/badge.svg)](https://github.com/CUBE-TTRB/api/actions/workflows/integration.yml)
[![delivery](https://github.com/CUBE-TTRB/api/actions/workflows/delivery.yml/badge.svg)](https://github.com/CUBE-TTRB/api/actions/workflows/delivery.yml)

## Usage with Docker

```sh
$ docker-compose up
```

This fires up a PostgreSQL database, the API on port [:3000](http://localhost:3000)
and Prisma Studio on port [:5555](http://localhost:5555).

## Endpoints

Every endpoints (except `POST /users` and `POST /sessions`) require a valid
JWT token in the `token` field.

If the operation is successful, the response contains the `result` field,
otherwise it contains the `errors` fields.

All responses have a `token` fields. All models have a `createdAt` and an `updatedAt`.

Parameters inside of `()` are optional.

URL       | Method    | Description     | Payload | Response (in `result`) |
----------|-----------|-----------------| ------- | -------- |
`/users`  | `POST`    | Create (signup) a new user | `{ user: { name, lastName, email, (backgroundImage) }, auth: { password } }` | `{ id, name, lastName, email, backgroundImage bornedAt, confirmedAt, createdAt, updatedAt }`
`/users/:id`  | `GET` | Retrieve one user | | `{ user: { id, name, lastName, email, backgroundImage, bornedAt, confirmedAt, createdAt, updatedAt } }`
`/sessions` | `POST` | Create a new session (get a JWT) | `{ email, password }` | `{ token }`
`/resources` | `GET` | Retrieve all resources | | `[{ id, userId, visibility, state, type, categoryId, title, body, date, location }, ...]`
`/resources` | `POST` | Create a new resource | `{ resource: { type, visibility, title, body, (categoryId) } }` | `{ id, userId, visibility, state, type, categoryId, title, body, date, location }`
`/resources/:id` | `GET` | Retrieve a resource | | `{ id, userId, visibility, state, type, categoryId, title, body, date, location }`
`/resources/:id` | `PATCH` | Update a resource | `{ resource: { (visibility), (title), (body), (categoryId) } }` | `{ id, userId, visibility, state, type, categoryId, title, body, date, location }`
`/resources/:id` | `DELETE` | Delete a resource | | N/A
`/comments` | `GET` | Retrieve all comments (admin/moderator only) | | `[{ id, userId, resourceId, text, parentCommentId }, ... ]`
`/comments` | `POST` | Create a new comment | `{ comment: { resourceId, (parentCommentId), text } }` | `{ id, userId, resourceId, text, parentCommentId }`
`/comments/:id` | `PATCH` | Update a comment | `{ comment: { (resourceId), (parentCommentId), (text) } }` | `{ id, userId, resourceId, text, parentCommentId }`
`/commentds/:id` | `DELETE` | Delete a comment | | N/A
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
