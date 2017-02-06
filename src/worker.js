/* eslint-disable no-console */

const fs = require('fs');
const exec = require('child_process').exec;
const padStart = require('lodash/padStart');
const tempWrite = require('temp-write');
const chalk = require('chalk');
const ora = require('ora');
const splitLines = require('split-lines');
const remark = require('remark');
const visit = require('unist-util-visit');
const async = require('async');
const constants = require('./constants');

module.exports = function(files, cb) {
	let amountOfErrors = 0;

	async.eachSeries(
		files,
		(filepath, cb) => {
			const contents = fs.readFileSync(filepath, 'utf8');
			const safeContents = replaceCodeBlocks(contents);
			const tempFilepath = tempWrite.sync(safeContents, filepath);

			const spinner = ora(filepath).start();
			exec(`proselint --json ${tempFilepath}`, (error, stdout) => {
				if (error) {
					spinner.fail(chalk.underline.bold(filepath));

					if (error.code === constants.NOT_FOUND) {
						binaryNotFound();
						process.exit(1);
					}

					const json = JSON.parse(stdout);

					printErrors(contents, json.data.errors);

					amountOfErrors += json.data.errors.length;
				}
				else {
					spinner.stop();
				}

				cb();
			});
		},
		(err) => {
			if (err) {
				return cb(err);
			}

			if (amountOfErrors > 0) {
				return cb(new Error(`${amountOfErrors} issue${amountOfErrors > 1 ? 's' : ''} found.`));
			}

			return cb();
		}
	);
};

function printErrors(contents, errors) {
	errors.forEach(error => printError(contents, error));
	console.log();
}

function printError(contents, { line, column, start, end, severity, message, check, replacements }) {
	const length = end - start;
	const block = formatLines(contents, line, column, length);
	console.log([
		'',
		chalk.bold[constants.COLORS[severity]](
			constants.ICONS[severity] + ' ' + message
		) + ' ' + chalk.dim(check),
		replacements ? ('Suggestions: ' + replacements + '\n') : '',
		block,
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

function formatLines(contents, line, col, length) {
	const lines = splitLines(contents);
	const start = Math.max(0, line - constants.LINES_BEFORE - 1);
	const end = Math.min(lines.length, line + constants.LINES_AFTER - 1);
	const totalDigits = String(lines.length + start - 1).length;

	const resultLines = [];
	for (let lineNum = start; lineNum <= end; lineNum++) {
		const number = padStart(lineNum, totalDigits);

		let text = lines[lineNum];
		if (lineNum === line - 1) {
			text = text.substr(0, col - 1) +
				chalk.bold.magenta(text.substr(col - 1, length)) +
				text.substr(col + length - 1)
			;
		}
		else {
			text = chalk.dim(text);
		}

		resultLines.push(chalk.dim(number) + '  ' + text);
	}

	return resultLines.join('\n');
}
