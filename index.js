'use strict'

const omit = require('lodash/omit')
const uniq = require('lodash/uniq')

const allowedFlags = [
	'x', 'type'
]

const hasProp = (o, p) => Object.prototype.hasOwnProperty.call(o, p)
const validateField = (firstRow, flag, field) => {
	if (!hasProp(firstRow, field)) {
		throw new Error(`${flag} flag is invalid: first row does not have a field ${field}.`)
	}
}

const getFlags = (argv, firstRow) => {
	return Object.entries(omit(argv, ['_']))
	.map(([arg, val]) => {
		let flag = arg, axis = null
		if (flag.includes(':')) {
			[flag, axis] = flag.split(':')
		}
		if (!allowedFlags.includes(flag)) {
			throw new Error(`unknown flag ${arg}.`)
		}
		if (axis !== null) validateField(firstRow, arg, axis)
		return {arg, flag, val, axis}
	})
}

const getXs = (argv, firstRow) => {
	const flags = getFlags(argv, firstRow)
	.filter(({flag}) => flag === 'x')

	// handle `--x t`
	const globalX = flags.find(({axis}) => axis === null)
	if (globalX) {
		validateField(firstRow, globalX.arg, globalX.val)
		return {x: globalX.val}
	}

	for (const {arg, axis, val} of flags) {
		validateField(firstRow, arg, axis)
		validateField(firstRow, arg, val)
	}

	// handle `--x:foo t1 --x:bar t2`
	const xs = flags.map(({axis, val}) => [axis, val])
	return {xs: Object.fromEntries(xs)}
}

const getTypes = (argv, firstRow) => {
	const flags = getFlags(argv, firstRow)
	.filter(({flag}) => flag === 'type')

	// handle `--type spline`
	const globalType = flags.find(({axis}) => axis === null)
	if (globalType) {
		validateField(firstRow, globalType.arg, globalType.val)
		return {x: globalType.val}
	}

	for (const {arg, axis} of flags) validateField(firstRow, arg, axis)

	// handle `--type:foo spline --type:bar step`
	const types = flags.map(({axis, val}) => [axis, val])
	return {types: Object.fromEntries(types)}
}

const getConfig = (argv, firstRow) => {
	return {
		...getXs(argv, firstRow),
		...getTypes(argv, firstRow)
	}
}

// todo: optimize this using `Buffer`s of JSON?
const c3ConfigGenerator = (argv) => {
	const data = Object.create(null)
	let firstRow, cols, i = 0
	const ingest = (row) => {
		if (i === 0) {
			firstRow = row
			cols = Object.keys(row)
			for (const col of cols) data[col] = [col]
		}

		for (const col of cols) {
			if (!hasProp(row, col)) {
				throw new Error(`data[${i}]: missing field ${col}.`)
			}
			data[col].push(row[col])
		}
		i++
	}

	const generate = () => {
		return JSON.stringify({
			bindto: '#graph',
			data: {
				...getConfig(argv, firstRow),
				columns: Object.values(data)
			}
		}) + '\n'
	}

	return {ingest, generate}
}

module.exports = {
	getConfig,
	c3ConfigGenerator
}
