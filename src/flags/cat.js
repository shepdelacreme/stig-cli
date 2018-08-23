const { flags } = require('@oclif/command')

module.exports.cats = flags.build({
  description: 'Rule categories to show from. If no arg is supplied, everything is listed',
  multiple: true,
  char: 'c',
  options: ['1', '2', '3'],
  default: ['1', '2', '3']
})
