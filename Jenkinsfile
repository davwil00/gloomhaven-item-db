pipeline {
  agent any
  environment { 
    REACT_APP_GIST_ID = '465d3de5a1fe3c32fc082d4089b864a4'
  }
  stages {
    stage('build') {
      steps {
        nodejs(nodeJSInstallationName: 'node') {
          sh 'yarn install'
          sh 'yarn build'
        }
      }
    }
  }
}
