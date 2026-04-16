pipeline {
  agent any

  tools {
    nodejs 'Node-20'
  }

  environment {
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    REPO_DIR = "/home/ubuntu/2026-EventHub"
  }

  stages {
    stage('Install') {
      parallel {
        stage('Backend Deps') {
          steps {
            dir('backend') {
              sh 'npm ci'
            }
          }
        }
        stage('Frontend Deps') {
          steps {
            dir('frontend') {
              sh 'npm ci'
            }
          }
        }
      }
    }

    stage('Tests') {
      parallel {
        stage('Backend Unit Tests') {
          steps {
            dir('backend') {
              sh 'npm run test:unit'
            }
          }
        }
        stage('Frontend Build') {
          steps {
            dir('frontend') {
              sh 'npm run build'
            }
          }
        }
      }
    }

    stage('SonarQube Analysis') {
      steps {
        dir('backend') {
          withSonarQubeEnv('SonarQube') {
            withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
              sh """
                ${tool('SonarScanner')}/bin/sonar-scanner \
                  -Dsonar.projectKey=eventhub-backend \
                  -Dsonar.projectName=eventhub-backend \
                  -Dsonar.sources=src \
                  -Dsonar.tests=src/tests \
                  -Dsonar.test.inclusions=src/tests/** \
                  -Dsonar.typescript.tsconfigPath=tsconfig.json \
                  -Dsonar.token=$SONAR_TOKEN
              """
            }
          }
        }
      }
    }

    stage('Quality Gate') {
      steps {
        timeout(time: 5, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -t eventhub-backend:${IMAGE_TAG} ./backend'
        sh 'docker build -t eventhub-frontend:${IMAGE_TAG} ./frontend'
      }
    }

    stage('Docker Push') {
      when {
        expression {
          return env.GIT_BRANCH == null || env.GIT_BRANCH == 'main' || env.GIT_BRANCH.endsWith('/main')
        }
      }
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh '''
            set -e
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker tag eventhub-backend:${IMAGE_TAG} ${DOCKER_USER}/eventhub-backend:${IMAGE_TAG}
            docker tag eventhub-frontend:${IMAGE_TAG} ${DOCKER_USER}/eventhub-frontend:${IMAGE_TAG}
            docker tag eventhub-backend:${IMAGE_TAG} ${DOCKER_USER}/eventhub-backend:latest
            docker tag eventhub-frontend:${IMAGE_TAG} ${DOCKER_USER}/eventhub-frontend:latest
            docker push ${DOCKER_USER}/eventhub-backend:${IMAGE_TAG}
            docker push ${DOCKER_USER}/eventhub-frontend:${IMAGE_TAG}
            docker push ${DOCKER_USER}/eventhub-backend:latest
            docker push ${DOCKER_USER}/eventhub-frontend:latest
          '''
        }
      }
    }

    stage('Deploy') {
      when {
        expression {
          return env.GIT_BRANCH == null || env.GIT_BRANCH == 'main' || env.GIT_BRANCH.endsWith('/main')
        }
      }
      steps {
        sh '''
          set -e
          if [ ! -d "$REPO_DIR/.git" ]; then
            git clone https://github.com/ArmanceJuan/2026-EventHub.git "$REPO_DIR"
          fi
          cd "$REPO_DIR"
          git fetch origin main
          git reset --hard origin/main

          cd backend
          docker compose up -d --build
          docker compose ps
        '''
      }
    }
  }

  post {
    success {
      echo 'Deploiement reussi !'
    }
    failure {
      echo 'Le pipeline a echoue.'
    }
    always {
      sh 'docker system prune -f || true'
    }
  }
}
