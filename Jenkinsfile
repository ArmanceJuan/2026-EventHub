pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Backend Unit Tests') {
      steps {
        dir('backend') {
          sh 'npm ci'
          sh 'npm run test:unit'
        }
      }
    }

    stage('Frontend Build') {
      steps {
        dir('frontend') {
          sh 'npm ci'
          sh 'npm run build'
        }
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -t eventhub-backend:${BUILD_NUMBER} ./backend'
        sh 'docker build -t eventhub-frontend:${BUILD_NUMBER} ./frontend'
      }
    }
  }

  post {
    success {
      echo 'Pipeline OK'
    }
    failure {
      echo 'Pipeline en echec'
    }
  }
}
