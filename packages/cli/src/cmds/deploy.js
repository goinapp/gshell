
"use strict";

const log = require("../utils/logs");
var shell = require('shelljs');

exports.command = "deploy <project>";

exports.describe = "Deploy your gshell project";

exports.builder = {};

exports.handler = async function(argv) {
  const project = argv.project;

  log.success(`\nDeploying your project to google cloud...\n`);

  shell.exec('docker build -t crodriguezanton/gshell-test-${string}')
  shell.exec('gcloud endpoints deploy api/endpoints.yaml')
  shell.exec('kubectl apply -R -f ./kubernetes')

};
