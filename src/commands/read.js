const { Command, flags } = require('@oclif/command')
const { json } = require('../flags/format-output')
const debug = require('debug')('read')
const { findInAll, findInBenchmark, showResults } = require('../utils/read')

class ReadCommand extends Command {
  async run () {
    const { flags, args } = this.parse(ReadCommand)
    debug(flags, args)
    const { benchmarkId } = args
    const { json, rule } = flags

    if (benchmarkId) {
      const { err: fibErr, data: fibData } = await findInBenchmark({ benchmarkId, rule })
      if (fibErr) {
        throw fibErr
      }
      if (json) {
        console.log(JSON.stringify({ data: fibData }))
        return
      }
      const { err: showErr, output } = await showResults({ results: fibData })
      if (showErr) {
        throw fibErr
      }
      console.log(output)
      return
    }

    const { err: allErr, data: allData } = await findInAll({ rule })
    if (allErr) {
      throw allErr
    }

    console.log(allData)
    // look in ALL rules :O
  }
}

ReadCommand.description = `Read one or more rules from a specific benchmark.
Read the specific text of a rule along with it's metadata.
`

ReadCommand.args = [
  {
    name: 'benchmarkId',
    description: 'The benchmark id of the rule(s) you want to get content for. This is not required but makes queries faster'
  }
]

ReadCommand.flags = {
  rule: flags.string({
    char: 'r',
    description: 'A valid STIG Identifier for the rule. It can be a Vulnerability or Rule ID. Multiple rules can be specified',
    multiple: true,
    required: true
  }),
  json: flags.boolean(json())
}

module.exports = ReadCommand
