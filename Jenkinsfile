pipeline {
    agent  {
        docker {
            image 'mcr.microsoft.com/playwright:v1.51.0-noble'
            args '--network qatw-primeira-edicao_skynet'
        }

    }

    stages {
        stage('Node.js Deps') {
            steps {
                sh 'npm install'
            }
        }
         stage('Testes Unitários') {
            steps {
                sh 'npx playwright test'
            }
        }
    }
}
