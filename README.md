# (Re)Source Relationnelles - API

## Usage with Docker

### As an API client (web & mobile)

Nothing fancy, get the API up and running with:

```sh
$ docker-compose up
```

The API now listens on [http://localhost:3000](http://localhost:3000)

**TODO: API DOC**

### As an API developer

Use the provided `docker-compose.yml` to start working right away.

---

### Tips with docker-compose

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
