const chalk = require("chalk");

exports.common = text => {
  console.log(text);
};
exports.warning = text => {
  console.log(chalk.yellow(text));
};
exports.error = text => {
  console.log(chalk.red(text));
};
exports.success = text => {
  console.log(chalk.green(text));
};
