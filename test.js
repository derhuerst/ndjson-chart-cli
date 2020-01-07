'use strict'

const {deepStrictEqual, throws} = require('assert')
const {getConfig} = require('.')

const firstRow = {t: 1578414525, foo: 1, bar: 2, baz: 3}
const argv = {
	_: ['hey'],
	'x:foo': 't',
	'x:bar': 't',
	'type:foo': 'spline',
	'type:bar': 'area-spline'
}

deepStrictEqual(getConfig(argv, firstRow), {
	xs: {foo: 't', bar: 't'},
	types: {foo: 'spline', bar: 'area-spline'}
})

throws(() => {
	getConfig({...argv, 'invalid': true}, firstRow)
}, /Error: unknown flag invalid\./)
throws(() => {
	getConfig({...argv, 'x:blub': '_'}, firstRow)
}, /Error: x:blub flag is invalid: first row does not have a field blub\./)
throws(() => {
	getConfig({...argv, 'x:foo': 'blub'}, firstRow)
}, /Error: x:foo flag is invalid: first row does not have a field blub\./)

console.info('tests passed ✔︎')
