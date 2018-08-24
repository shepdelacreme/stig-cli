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

## Installers and standalone tarballs
While this utility is built with node, you do not not need node to use `stig` cli. You can use one of the following sources.

| System                       | Type   | Download Link      |
|------------------------------|--------|--------------------|
| MacOS                        | tar.gz | [Stable][macostar] |
| MacOS Installer              | pkg    | [Stable][macospkg] |
| Linux ARM                    | tar.gz | [Stable][linuxarm] |
| Linux x64                    | tar.gz | [Stable][linux64]: |
| Windows x64                  | tar.gz | [Stable][win86tar] |
| Windows x86                  | tar.gz | [Stable][win64tar] |
| Windows x86 Installer        | exe    | [Stable][win86exe] |
| Windows x64 Installer        | exe    | [Stable][win64exe] |
| Plain (requires nodejs > 10) | tar.gz | [Stable][vanilla]  |


<!-- usage -->
```sh-session
$ npm install -g stig
$ stig COMMAND
running command...
$ stig (-v|--version|version)
stig/0.1.4 darwin-x64 node-v10.7.0
$ stig --help [COMMAND]
USAGE
  $ stig COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`stig autocomplete [SHELL]`](#stig-autocomplete-shell)
* [`stig help [COMMAND]`](#stig-help-command)
* [`stig ls [BENCHMARKID]`](#stig-ls-benchmarkid)
* [`stig read [BENCHMARKID]`](#stig-read-benchmarkid)
* [`stig update [CHANNEL]`](#stig-update-channel)

## `stig autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ stig autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ stig autocomplete
  $ stig autocomplete bash
  $ stig autocomplete zsh
  $ stig autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.1.0/src/commands/autocomplete/index.ts)_

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

_See code: [src/commands/ls.js](https://github.com/defionscode/stig-cli/blob/v0.1.4/src/commands/ls.js)_

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

_See code: [src/commands/read.js](https://github.com/defionscode/stig-cli/blob/v0.1.4/src/commands/read.js)_

## `stig update [CHANNEL]`

update the stig CLI

```
USAGE
  $ stig update [CHANNEL]
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.3.1/src/commands/update.ts)_
<!-- commandsstop -->

[macostar]: https://s3.amazonaws.com/stigcli/stig-darwin-x64.tar.gz
[macospkg]: https://s3.amazonaws.com/stigcli/stig.pkg
[linuxarm]: https://s3.amazonaws.com/stigcli/stig-linux-arm.tar.gz
[linux64]: https://s3.amazonaws.com/stigcli/stig-linux-x64.tar.gz
[win86tar]: https://s3.amazonaws.com/stigcli/stig-win32-x86.tar.gz
[win64tar]: https://s3.amazonaws.com/stigcli/stig-win32-x64.tar.gz
[win86exe]: https://s3.amazonaws.com/stigcli/stig-x86.exe
[win64exe]: https://s3.amazonaws.com/stigcli/stig-x64.exe
[vanilla]: https://s3.amazonaws.com/stigcli/stig.tar.gz
