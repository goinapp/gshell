
"use strict";

const log = require("../utils/logs");
var shell = require('shelljs');

exports.command = "deploy";

exports.describe = "Deploy your gshell project";

exports.builder = {};

exports.handler = async function(argv) {
  const project = shell.exec(`basename "$PWD"`).stdout.replace('\n','');

  log.success(`\nDeploying your project ${project} to google cloud...\n`);

  log.success('Building docker');
  shell.exec(`docker build -t crodriguezanton/gshell-example-${project}:latest .`)
  log.success('Pushing docker to registry');
  shell.exec(`docker push crodriguezanton/gshell-example-${project}:latest`)
  log.success('Deploying endpoints');
  shell.exec('gcloud endpoints services deploy api/endpoints.yaml')
  log.success('Deploying to Kubernetes');
  shell.exec('kubectl apply -R -f ./kubernetes')

};
