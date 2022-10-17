#!/usr/bin/env node

import cli from "./cli.js"

const [, , ...args]: readonly string[] = process.argv;
cli(args);