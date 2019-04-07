#!/usr/bin/env node
"use strict";

require("yargs")
  .usage("$0 <cmd> [args]")
  .commandDir("cmds")
  .demandCommand()
  .help("help").argv;
