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
    stage('publish') {
      steps {
        sshPublisher(
          publishers: [
            sshPublisherDesc(configName: 'Pi', 
              transfers: [
                sshTransfer(
                  cleanRemote: true, 
                  excludes: '', 
                  execCommand: '', 
                  execTimeout: 120000, 
                  flatten: false, 
                  makeEmptyDirs: true, 
                  noDefaultExcludes: false, 
                  patternSeparator: '[, ]+', 
                  remoteDirectory: '/gloomhaven-shop/shop',
                  remoteDirectorySDF: false, 
                  removePrefix: 'build', 
                  sourceFiles: 'build/**'
                )
              ],
              usePromotionTimestamp: false, 
              useWorkspaceInPromotion: false, 
              verbose: true
            )
          ]
        )
      }
    }
  }
}
