#!/usr/bin/env node
'use strict'

const mri = require('mri')
const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v',

		// todo: tick fit, tick count, timeseries?
		// see https://c3js.org/reference.html
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

const {readFileSync} = require('fs')
const {join} = require('path')
const {Transform} = require('stream')
const pump = require('pump')
const {parse: ndjsonParser} = require('ndjson')
const {c3ConfigGenerator} = require('.')

const head = readFileSync(join(__dirname, 'lib', 'head.html'))
const tail = readFileSync(join(__dirname, 'lib', 'tail.html'))

const {ingest, generate} = c3ConfigGenerator(argv)
const transform = (row, _, cb) => {
	ingest(row)
	cb()
}

const flush = (cb) => {
	const html = Buffer.concat([
		head,
		Buffer.from(generate(), 'utf-8'),
		tail
	])
	cb(null, html)
}

pump(
	process.stdin,
	ndjsonParser(),
	new Transform({objectMode: true, transform, flush}),
	process.stdout,
	showError
)
