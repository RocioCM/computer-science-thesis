pipeline {
    agent any
    environment {
        DOCKER_TAG = 'template-web'
        PORT = "3020"
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'docker build -t $DOCKER_TAG:1.0 .'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Stopping previous version...'
                sh 'docker stop $DOCKER_TAG || echo Nothing to stop'
                sh 'docker rm $DOCKER_TAG || echo Nothing to remove'
                echo 'Deploying....'
                sh 'docker run -d -e BASE_PATH -p $PORT:3000 --name $DOCKER_TAG $DOCKER_TAG:1.0'
            }
        }
    }
}
