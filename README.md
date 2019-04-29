dumpdis
=======

Dump discord channels and servers

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dumpdis.svg)](https://npmjs.org/package/dumpdis)
[![Downloads/week](https://img.shields.io/npm/dw/dumpdis.svg)](https://npmjs.org/package/dumpdis)
[![License](https://img.shields.io/npm/l/dumpdis.svg)](https://github.com/willyb321/dumpdis/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g dumpdis
$ dumpdis COMMAND
running command...
$ dumpdis (-v|--version|version)
dumpdis/0.0.0 win32-x64 node-v12.0.0
$ dumpdis --help [COMMAND]
USAGE
  $ dumpdis COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`dumpdis hello [FILE]`](#dumpdis-hello-file)
* [`dumpdis help [COMMAND]`](#dumpdis-help-command)

## `dumpdis hello [FILE]`

describe the command here

```
USAGE
  $ dumpdis hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ dumpdis hello
  hello world from ./src/hello.ts!
```

_See code: [src\commands\hello.ts](https://github.com/willyb321/dumpdis/blob/v0.0.0/src\commands\hello.ts)_

## `dumpdis help [COMMAND]`

display help for dumpdis

```
USAGE
  $ dumpdis help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src\commands\help.ts)_
<!-- commandsstop -->
