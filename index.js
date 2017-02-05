#!/usr/bin/env node


/* eslint-disable no-console */

const fs = require('fs');
const exec = require('child_process').exec;
const tempWrite = require('temp-write');
const splitLines = require('split-lines');
const chalk = require('chalk');
const remark = require('remark');
const visit = require('unist-util-visit');
const codeFrame = require('babel-code-frame');

const NOT_FOUND = 127;
const ICONS = {
	warning: '⚠',
	error: '✘',
};
const COLORS = {
	warning: 'yellow',
	error: 'red',
};

/* ---------------- 8< -------- 8< ---------------- */

const filepath = process.argv[2];
if (!filepath) {
	usage();
	process.exit(1);
}

run(filepath);

/* ---------------- 8< -------- 8< ---------------- */

function run(filepath) {
	if (!fs.existsSync(filepath)) {
		fileNotFound(filepath);
		process.exit(1);
	}

	const contents = fs.readFileSync(filepath, 'utf8');
	const safeContents = replaceCodeBlocks(contents);
	const tempFilepath = tempWrite.sync(safeContents, filepath);

	exec(`proselint --json ${tempFilepath}`, (error, stdout) => {
		if (error) {
			if (error.code === NOT_FOUND) {
				binaryNotFound();
				process.exit(1);
			}

			const json = JSON.parse(stdout);
			printErrors(contents, json.data.errors);
		}
		else {
			console.log(chalk.green('No issues found.'));
		}
	});
}

// Replace all lines inside code blocks with empty lines becase proselint validates code by default.
// We use empty lines instead of just code removal to keep correct line numbers.
// Work with the original document because Remark changes formatting which makes error positions incorrect
function replaceCodeBlocks(contents) {
	function processCode() {
		return ast => {
			visit(ast, 'code', node => {
				const start = node.position.start.line;
				const end = node.position.end.line;
				for (let line = start; line < end - 1; line++) {
					lines[line] = '';
				}
			});
		};
	}

	const lines = splitLines(contents);
	remark()
		.use(processCode)
		.process(contents)
	;
	return lines.join('\n');
}

function printErrors(contents, errors) {
	errors.forEach(error => printError(contents, error));
}

function printError(contents, { line, column, severity, message, check, replacements }) {
	const code = codeFrame(contents, line, column);
	console.log([
		'',
		chalk.bold[COLORS[severity]](ICONS[severity] + ' ' + message) + ' ' + chalk.dim(check),
		replacements ? ('Suggestions: ' + replacements + '\n') : '',
		code,
		'',
	].join('\n'));
}

function usage() {
	console.log([
		chalk.underline('Usage'),
		'',
		'    ' + chalk.bold('proselintjs') + ' ' + chalk.cyan('<filename.md>'),
		'',
	].join('\n'));
}

function fileNotFound(filepath) {
	console.log([
		chalk.bold.red('File not found'),
		'',
		'    ' + filepath,
		'',
	].join('\n'));
}

function binaryNotFound() {
	console.log([
		chalk.bold.red('Proselint not found'),
		'',
		'Install proselint first:',
		'',
		'    pip install proselint',
		'',
		'More information:',
		'',
		'    ' + chalk.underline('https://github.com/amperser/proselint/'),
		'',
	].join('\n'));
}
