# EventHub - CI/CD (Jenkins + GitHub Actions)

Ce document explique comment reproduire la chaine CI/CD du projet EventHub.

## Objectif

Automatiser les verifications et la livraison:
- tests automatiques,
- build standardise,
- deploiement plus fiable.

Stack utilisee:
- Jenkins execute dans Docker,
- GitHub Actions pour la CI cote GitHub,
- tests unitaires et integration,
- deploiement sur AWS EC2.

---

## 1) Jenkins dans Docker

Fichier utilise: `docker-compose.jenkins.yml`

### Prerequis
- Docker
- Docker Compose plugin

### Lancer Jenkins

```bash
docker compose -f docker-compose.jenkins.yml up -d
```

### Verifier que Jenkins tourne

```bash
docker ps
```

Acces Jenkins:
- URL: `http://localhost:8081` (ou `http://<IP_SERVEUR>:8081`)

### Arreter Jenkins

```bash
docker compose -f docker-compose.jenkins.yml down
```

### Pourquoi cette configuration
- Image officielle `jenkins/jenkins:lts`
- Volume `jenkins_home:/var/jenkins_home` pour la persistance des jobs/configurations
- Socket Docker monte pour executer des commandes Docker depuis Jenkins

---

## 2) Pipeline Jenkins

Fichier: `Jenkinsfile` (a la racine)

Le pipeline est declaratif et versionne avec le code (*Pipeline as Code*).

Exemples de stages:
- Install Dependencies
- Lint
- Tests
- Build Backend
- SonarQube Analysis / Quality Gate
- Docker Build / Docker Push (condition branche `main`)
- Deploy (condition branche `main`)

### Preuve attendue en soutenance
- Stage View Jenkins (vert/rouge)
- Console Output lisible

---

## 3) GitHub Actions

Workflows presents dans `.github/workflows/`:
- `deploy.yml`
- `test.unit.yml`
- `test.e2e.yml`
- `docker-publish.yml`

Triggers utilises selon workflow:
- `push`
- `pull_request`
- `workflow_call`

### Role dans l'architecture
- GitHub Actions: validation rapide cote depot (CI)
- Jenkins: orchestration pipeline plus complete (build/deploy)

Les deux outils sont complementaires.

---

## 4) Tests

### Backend
- Tests unitaires: `backend/src/tests/unit/`
- Tests integration: `backend/src/tests/integration/`

### Frontend
- Tests composants/formulaires: `frontend/src/modules/**/testing/`

### Commandes utiles

Backend:
```bash
cd backend
npm ci
npm run test:unit
npm run test:integration
```

Frontend:
```bash
cd frontend
npm ci
npm test
```

---

## 5) Deploiement EC2 (resume)

Logique de deploiement:
1. recuperer le code (`git pull`),
2. preparer l'environnement (`.env`),
3. reconstruire les images (`docker compose build`),
4. appliquer les migrations,
5. redemarrer les services (`docker compose up -d`).

Verification:
```bash
docker compose ps
```

---

## 6) Points de verification pour la soutenance

- Jenkins dans Docker demarre correctement
- Volume persistant Jenkins actif
- Jenkinsfile present a la racine
- Workflows GitHub Actions valides
- Tests presents et executes
- Preuves visuelles (Actions, Stage View, Console Output)
- Deploiement EC2 visible

---

## 7) Limites / travail restant

- Stabilisation complete du webhook GitHub -> Jenkins selon environnement reseau
- Consolidation des preuves de declenchement automatique
- Documentation d'exploitation a completer

Ce projet est fonctionnel sur les briques principales et suit une logique CI/CD coherent.

# EventHub - Jenkins Docker + Webhook (EC2)

Ce projet inclut maintenant une stack Jenkins Docker prête pour l'evaluation.

## 1) Lancer Jenkins dans Docker (EC2)

Depuis la racine du depot:

```bash
docker compose -f docker-compose.jenkins.yml up -d --build
```

Verifier:

```bash
docker compose -f docker-compose.jenkins.yml ps
docker logs eventhub_jenkins --tail=50
```

Acces Jenkins:
- URL: `http://<IP_EC2>:8080`
- utilisateur admin: `admin` (ou valeur `JENKINS_ADMIN_ID`)
- mot de passe admin: `admin123` (ou valeur `JENKINS_ADMIN_PASSWORD`)

## 2) Pourquoi cette config valide les criteres 1.1-1.4

- 1.1 image officielle Jenkins: `jenkins/Dockerfile` utilise `FROM jenkins/jenkins:lts`.
- 1.2 persistance: volume `jenkins_home` monte sur `/var/jenkins_home`.
- 1.3 reseau + securite:
  - port `8080` expose pour l'UI
  - script `jenkins/init.groovy.d/security.groovy` cree l'admin automatiquement
  - port agent `50000` expose.
- 1.4 reproductibilite: une seule commande `docker compose ... up -d --build`.

## 3) Preparation Jenkins pour ce repo

1. Se connecter a Jenkins (`http://<IP_EC2>:8080`).
2. Creer un job **Pipeline** pointe sur ce repo GitHub.
3. Dans la configuration du job:
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Script Path: `Jenkinsfile`
4. Ajouter les credentials necessaires dans Jenkins:
   - `sonarqube-token`
   - `dockerhub-creds`

## 4) Webhook GitHub (criteres 5.1 et 5.2)

### 4.1 Configurer le webhook GitHub

Dans `GitHub > Settings > Webhooks > Add webhook`:
- Payload URL: `http://<IP_EC2>:8080/github-webhook/`
- Content type: `application/json`
- Secret: optionnel mais recommande
- Events: `Just the push event` (ou `Let me select individual events`)
- Active: coche

Sur EC2, ouvrir le Security Group en entree:
- TCP 8080 depuis ton IP (ou temporairement 0.0.0.0/0 pour la demo)

### 4.2 Configurer Jenkins pour ecouter le webhook

Dans le job Pipeline:
- cocher `GitHub hook trigger for GITScm polling`

### 4.3 Prouver le declenchement automatique

1. Faire un commit + push sur la branche cible.
2. Verifier dans GitHub webhook deliveries: status `200`.
3. Verifier dans Jenkins qu'un nouveau build demarre sans clic manuel.
4. Montrer la console du build (stages + resultat vert/rouge).

## 5) A quoi sert la procedure donnee par le prof

Les commandes servent a installer **Docker CLI + Docker Compose dans le conteneur Jenkins**.
But: permettre au pipeline d'executer `docker build`, `docker push`, `docker compose ...`.

Dans cette version du projet, cette installation est deja automatisee dans `jenkins/Dockerfile`.
Tu n'as donc pas besoin de la refaire a la main apres chaque redemarrage.

## 6) Checks rapides a montrer au jury

```bash
# Jenkins en conteneur + ports
docker compose -f docker-compose.jenkins.yml ps

# Persistance (apres restart, jobs toujours presents)
docker compose -f docker-compose.jenkins.yml restart

# Outils Docker disponibles dans Jenkins
docker exec -it eventhub_jenkins docker version
docker exec -it eventhub_jenkins docker compose version
```
