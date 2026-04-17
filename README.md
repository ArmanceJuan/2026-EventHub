# EventHub

Application full-stack avec backend Node.js/TypeScript, frontend React, et outillage CI/CD (Jenkins + GitHub Actions).

## Sommaire

- [Architecture](#architecture)
- [Prerequis](#prerequis)
- [Installation locale](#installation-locale)
- [Lancer l'application](#lancer-lapplication)
- [Tests](#tests)
- [CI/CD](#cicd)
- [Jenkins local (optionnel)](#jenkins-local-optionnel)
- [Deploiement EC2 (resume)](#deploiement-ec2-resume)

---

## Architecture

- `backend/` API Express + Prisma + tests unitaires/integration
- `frontend/` application React (Vite) + tests
- `.github/workflows/` workflows GitHub Actions
- `Jenkinsfile` pipeline Jenkins declaratif
- `docker-compose.jenkins.yml` stack Jenkins Docker locale

---

## Prerequis

- Node.js 20+
- npm
- Docker
- Docker Compose plugin

---

## Installation locale

### Backend

```bash
cd backend
npm ci
```

### Frontend

```bash
cd frontend
npm ci
```

---

## Lancer l'application

### Backend (dev)

```bash
cd backend
npm run dev
```

### Frontend (dev)

```bash
cd frontend
npm run dev
```

---

## Tests

### Backend

```bash
cd backend
npm run test:unit
npm run test:integration
```

### Frontend

```bash
cd frontend
npm test
```

---

## CI/CD

### Jenkins

- Pipeline defini dans `Jenkinsfile`
- Stages principaux:
  - Install Dependencies
  - Lint
  - Tests
  - Build Backend
  - SonarQube Analysis / Quality Gate
  - Docker Build / Docker Push (`main`)
  - Deploy (`main`)

### GitHub Actions

Workflows disponibles dans `.github/workflows/`:
- `deploy.yml`
- `test.unit.yml`
- `test.e2e.yml`
- `docker-publish.yml`

Triggers utilises selon workflow:
- `push`
- `pull_request`
- `workflow_call`

---

## Jenkins local (optionnel)

Lancer Jenkins via Docker Compose:

```bash
docker compose -f docker-compose.jenkins.yml up -d --build
```

Verifier:

```bash
docker compose -f docker-compose.jenkins.yml ps
docker logs eventhub_jenkins --tail=50
```

Acces Jenkins:
- `http://localhost:8081`

Arret:

```bash
docker compose -f docker-compose.jenkins.yml down
```

---

## Deploiement EC2 (resume)

Sequence type:
1. `git pull`
2. preparation du `.env`
3. `docker compose build`
4. execution des migrations
5. `docker compose up -d`

Verification:

```bash
docker compose ps
```

---

## Notes

- Les secrets ne doivent pas etre commits (utiliser Jenkins Credentials / GitHub Secrets).
- Les workflows CI/CD sont versionnes avec le code et evoluent avec le projet.
