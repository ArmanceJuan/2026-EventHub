pipeline {
  agent any

  tools {
    nodejs 'Node-20'
  }

  environment {
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    SONAR_TOKEN = credentials('sonarqube-token')
  }

  stages {
    stage('Install Dependencies') {
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

    stage('Lint') {
      steps {
        dir('backend') {
          sh 'npx eslint src/ || true'
        }
      }
    }

    stage('Tests') {
      parallel {
        stage('Backend Unit Tests') {
          steps {
            dir('backend') {
              sh 'npm run test:unit -- --coverage'
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

    stage('Build Backend') {
      steps {
        dir('backend') {
          sh 'npm run build'
        }
      }
    }

    stage('SonarQube Analysis') {
      steps {
        dir('backend') {
          withSonarQubeEnv('SonarQube') {
            sh "${tool('SonarScanner')}/bin/sonar-scanner"
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
        sh "docker build -t eventhub-backend:${IMAGE_TAG} ./backend"
        sh "docker build -t eventhub-frontend:${IMAGE_TAG} ./frontend"
      }
    }

    stage('Docker Push') {
      when {
        branch 'main'
      }
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-creds',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh '''
            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
            docker tag eventhub-backend:${IMAGE_TAG} ${DOCKER_USER}/eventhub-backend:${IMAGE_TAG}
            docker tag eventhub-frontend:${IMAGE_TAG} ${DOCKER_USER}/eventhub-frontend:${IMAGE_TAG}
            docker push ${DOCKER_USER}/eventhub-backend:${IMAGE_TAG}
            docker push ${DOCKER_USER}/eventhub-frontend:${IMAGE_TAG}
          '''
        }
      }
    }

    stage('Deploy') {
      when {
        branch 'main'
      }
      steps {
        dir('backend') {
          sh '''
            docker compose down || true
            docker compose up -d --build
            docker compose ps
          '''
        }
      }
    }
  }

  post {
    success {
      echo 'Déploiement réussi !'
    }
    failure {
      echo 'Le pipeline a échoué.'
    }
    always {
      sh 'docker system prune -f || true'
    }
  }
}
