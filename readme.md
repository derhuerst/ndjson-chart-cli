# ndjson-chart-cli

**Visualize [newline-delimited JSON](http://ndjson.org/) as an interactive line chart.**

[![npm version](https://img.shields.io/npm/v/ndjson-chart-cli.svg)](https://www.npmjs.com/package/ndjson-chart-cli)
[![build status](https://api.travis-ci.org/derhuerst/ndjson-chart-cli.svg?branch=master)](https://travis-ci.org/derhuerst/ndjson-chart-cli)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/ndjson-chart-cli.svg)
![minimum Node.js version](https://img.shields.io/node/v/ndjson-chart-cli.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installation

```shell
npm install ndjson-chart-cli
```

Or use [`npx`](https://npmjs.com/package/npx). ✨


## Usage

```
Usage:
    cat data.ndjson | ndjson-to-chart >chart.html
Options:
	--x             Set the X axis of all fields to another field.
	--x:{field}     Set the X axis of {field} to another field.
	--type          Show all fields as a specific type of chart.
	                  see https://c3js.org/reference.html#data-type
	--type:{field}  Show {field} as a type of chart.
	                  see https://c3js.org/reference.html#data-type
Examples:
	ndjson-to-chart --x t <node_modules/ndjson-chart-cli/example.ndjson
	ndjson-to-chart --x:temperature time1 --type:temperature area-spline <measurements.ndjson
```


## Related

- [`chart-csv`](https://github.com/watson/chart-csv) – Chart a comma separated list of numbers on a line-graph that can be viewed in a web browser.


## Contributing

If you have a question or need support using `ndjson-chart-cli`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/ndjson-chart-cli/issues).
