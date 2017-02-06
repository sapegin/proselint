#!/usr/bin/env node

/* eslint-disable no-console */

const chalk = require('chalk');
const glob = require('glob');
const flatten = require('lodash/flatten');
const worker = require('./worker');
const constants = require('./constants');

/* ---------------- 8< -------- 8< ---------------- */

const patterns = process.argv.slice(2);
if (patterns.length === 0) {
	usage();
	process.exit(1);
}

const files = flatten(patterns.map(pattern => glob.sync(pattern)));
if (files.length === 0) {
	console.log(chalk.bold.red('File pattern did not match any files'));
	console.log();
	usage();
	process.exit(1);
}

run(files);

/* ---------------- 8< -------- 8< ---------------- */

function run(files) {
	worker(
		files,
		(err) => {
			console.log();

			if (err) {
				console.error(chalk[constants.COLORS.warning](err.message));
				process.exit(1);
			}

			console.log(chalk[constants.COLORS.info]('No issues found.'));

			return null;
		}
	);
}

function usage() {
	console.log([
		chalk.underline('Usage'),
		'',
		'    ' + chalk.bold('proselintjs') + ' ' + chalk.cyan('filename.md'),
		'    ' + chalk.bold('proselintjs') + ' ' + chalk.cyan('*.md'),
		'    ' + chalk.bold('proselintjs') + ' ' + chalk.cyan("'pattern/**/*.md'"),
		'',
	].join('\n'));
}
