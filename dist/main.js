#!/usr/bin/env node
import cli from "./cli.js";
const [, , ...args] = process.argv;
cli(args);
