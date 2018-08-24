stig
====

A simple command line interface to read and interface with DISA STIG benchmarks

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/stig.svg)](https://npmjs.org/package/stig)
[![CircleCI](https://circleci.com/gh/defionscode/stig-cli/tree/master.svg?style=shield)](https://circleci.com/gh/defionscode/stig-cli/tree/master)
[![Codecov](https://codecov.io/gh/defionscode/stig-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/defionscode/stig-cli)
[![Downloads/week](https://img.shields.io/npm/dw/stig.svg)](https://npmjs.org/package/stig)
[![License](https://img.shields.io/npm/l/stig.svg)](https://github.com/defionscode/stig-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g stig
$ stig COMMAND
running command...
$ stig (-v|--version|version)
stig/0.1.0 darwin-x64 node-v10.7.0
$ stig --help [COMMAND]
USAGE
  $ stig COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`stig help [COMMAND]`](#stig-help-command)
* [`stig ls [BENCHMARKID]`](#stig-ls-benchmarkid)
* [`stig read [BENCHMARKID]`](#stig-read-benchmarkid)

## `stig help [COMMAND]`

display help for stig

```
USAGE
  $ stig help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.0/src/commands/help.ts)_

## `stig ls [BENCHMARKID]`

List STIG Information

```
USAGE
  $ stig ls [BENCHMARKID]

ARGUMENTS
  BENCHMARKID  OPTIONAL: List rules for a specific STIG Benchmark

OPTIONS
  -c, --cats=1|2|3  [default: 1,2,3] Rule categories to show from. If no arg is supplied, everything is listed
  --json            Return results in JSON format

DESCRIPTION
  The 'ls' command is the entry point into reading STIG information.
  When supplied without arguments it returns a list of all available benchmarks.
```

_See code: [src/commands/ls.js](https://github.com/defionscode/stig-cli/blob/v0.1.0/src/commands/ls.js)_

## `stig read [BENCHMARKID]`

Read one or more rules from a specific benchmark.

```
USAGE
  $ stig read [BENCHMARKID]

ARGUMENTS
  BENCHMARKID  The benchmark id of the rule(s) you want to get content for. This is not required but makes queries
               faster

OPTIONS
  -r, --rule=rule  (required) A valid STIG Identifier for the rule. It can be a Vulnerability or Rule ID. Multiple rules
                   can be specified

  --json           Return results in JSON format

DESCRIPTION
  Read the specific text of a rule along with it's metadata.
```

_See code: [src/commands/read.js](https://github.com/defionscode/stig-cli/blob/v0.1.0/src/commands/read.js)_
<!-- commandsstop -->
