pipeline {
    agent any

    environment {
        IMAGE_NAME = "hostamar-enterprise"
        TAG = "${env.BUILD_NUMBER}"
        KUBECONFIG = credentials('k8s-secret')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Quality Gate') {
            steps {
                // Ensure code quality before building
                sh 'pip install ruff pytest'
                sh 'ruff check .'
                sh 'pytest tests/'
            }
        }

        stage('Build Brain') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${TAG} .'
                sh 'docker tag ${IMAGE_NAME}:${TAG} ${IMAGE_NAME}:latest'
            }
        }

        stage('Security Scan') {
            steps {
                // Scan for vulnerabilities in Python packages
                sh 'trivy image ${IMAGE_NAME}:${TAG}'
            }
        }

        stage('Deploy to Cluster') {
            steps {
                script {
                    // Update the deployment manifest with new image tag
                    sh "sed -i 's|image: .*|image: ${IMAGE_NAME}:${TAG}|' k8s-deployment.yaml"
                    sh "kubectl apply -f k8s-deployment.yaml"
                }
            }
        }
    }
}
