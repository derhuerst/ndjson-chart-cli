#!/bin/bash
set -e
cd $(dirname $0)

./cli.js -x t --type:bar spline --type:baz step <example.ndjson >chart.html

echo 'open chart.html in your browser'
