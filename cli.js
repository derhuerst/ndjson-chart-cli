#!/usr/bin/env node
'use strict'

const mri = require('mri')
const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v'
	]
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    cat data.ndjson | ndjson-to-chart >chart.html
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`ndjson-to-chart v${pkg.version}\n`)
	process.exit(0)
}

const showError = (err) => {
	if (!err) return;
	if (process.env.NODE_ENV === 'dev') console.error(err)
	else console.error(err && err.message || (err + ''))
	process.exit(1)
}

const pump = require('pump')
const {parse: ndjsonParser} = require('ndjson')
const {createIngester} = require('.')

pump(
	process.stdin,
	ndjsonParser(),
	createIngester(argv),
	// todo: head, tail
	process.stdout,
	showError
)
// todo
