
"use strict";

const inquirer = require("inquirer");
const log = require("../utils/logs");
var shell = require('shelljs');

exports.command = "init <project_name>";

exports.describe = "Initialize a new gshell project";

exports.builder = {};

exports.handler = async function(argv) {
  const projectName = argv.project_name;

  log.success(`\nLet's configure ${projectName}, your new gshell project\n`);

  const questions = await inquirer
    .prompt([
      {
        type: "list",
        name: "structure",
        message: `How do you want to structure ${projectName}?`,
        choices: ["Dependency Injection (Recommended)", "Singleton pattern"]
      },
      {
        type: "list",
        name: "server",
        message: `Which http server you want to use in ${projectName}?`,
        choices: ["express", "http", "micro (by zeit)", "I don't want to config a server"]
      },
      {
        type: "list",
        name: "database",
        message: `Which database you want to use in ${projectName}?`,
        choices: ["mongodb", "mysql", "postgres", "influxdb",  "I don't want to config a database"]
      },
      {
        type: "confirm",
        name: "redis",
        message: `Do you want to use Redis for caching in ${projectName}`
      },
      {
        type: "list",
        name: "queuing",
        message: `Which queuing solution you want to use in ${projectName}?`,
        choices: ["rabbitmq", "kafka",  "I don't want to config a queuing solution"]
      },
      {
        type: "checkbox",
        name: "extras",
        message: `What utils you want to add to the project?`,
        choices: ["metrics", "tracing", "code quality", "CI", "logging"]
      },
      {
        type: "list",
        name: "platform",
        message: `Which cloud platform you want to use in ${projectName}?`,
        choices: ["google cloud", "microsoft azure", "aws", "alibaba cloud", "none"]
      },
    ]);


    const cookiecutter = shell.exec(`cookiecutter /Users/crodriguezanton/Development/hackathon/copenhacks2019/gshell/packages/templates/crud-using-ioc project_name=${projectName} --no-input`);
    shell.exec(`cd ${projectName} && yarn`)

};
