
"use strict";

const inquirer = require("inquirer");
const log = require("../utils/logs");

exports.command = "add <component_type>";

exports.describe = "Add a new component to gshell project";

exports.builder = {};

exports.handler = async function(argv) {
  const componentType = argv.component_type;

  let question = {};
  switch (componentType) {
    case "server":
      question = {
        type: "list",
        name: "option",
        message: `Which http server you want to add?`,
        choices: ["express", "http", "micro (by zeit)"]
      }
      break;
    case "database":
      question = {
        type: "list",
        name: "option",
        message: `Which database you want to add?`,
        choices: ["mongodb", "mysql", "postgres", "influxdb"]
      }
      break;
    case "message_broker":
      question = {
        type: "list",
        name: "option",
        message: `Which message broker you want to add?`,
        choices: ["rabbitmq", "kafka"]
      }
      break;
  }

  log.success(`\nLet's configure your new ${componentType}\n`);



  const questions = await inquirer
    .prompt([
      question,
      {
        type: "input",
        name: "name",
        message: `What name do you want to give to ${componentType}?`
      }
    ]);


  log.success(`Your new ${componentType} has been added to your project`);

};
