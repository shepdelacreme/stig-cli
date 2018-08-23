const { Parser } = require('xml2js')
const { readFile } = require('fs')
const { promisify } = require('util')
const debug = require('debug')('utils:ls')
const { tidy } = require('htmltidy')

module.exports.fillTableArr = async ({ data, array }) => {
  try {
    for (const [index, b] of data.entries()) {
      const { title, ver, rel, date } = b
      array.push([index, title, rel, ver, date])
    }
    return { data: array }
  } catch (err) {
    return { err }
  }
}

module.exports.fillRulesArr = async ({ data, array }) => {
  try {
    for (const [index, b] of data.entries()) {
      const { title, vulnId, ruleId, severity } = b
      array.push([index, title, vulnId, ruleId, severity])
    }
    return { data: array }
  } catch (err) {
    return { err }
  }
}

module.exports.parseXML = async (xmlString) => {
  try {
    const tidyPromise = promisify(tidy)
    const tidyString = await tidyPromise(xmlString, {
      'input-xml': true,
      'output-xml': true
    })
    const parser = new Parser()
    const parseString = promisify(parser.parseString)
    const data = await parseString(tidyString)
    return { data }
  } catch (err) {
    return { err }
  }
}

module.exports.listRules = async ({ xmlPath }) => {
  try {
    debug(xmlPath)
    const rules = []
    const rFile = promisify(readFile)
    const file = await rFile(xmlPath)
    const cData = file.toString()
    const { err: parseErr, data: xmlData } = await module.exports.parseXML(cData)
    if (parseErr) {
      return { parseErr }
    }
    for (const [index, r] of xmlData.Benchmark.Group.entries()) {
      const title = r.Rule[0].title[0].replace(/[\x00-\x1F\x7F-\x9F]/g, '')
      const { err: descErr, data: descData } = await module.exports.parseXML(r.Rule[0].description[0])
      if (descErr || !descData) {
        debug('desc err')
        debug(xmlPath)
        debug(title)
        return { err: descErr }
      }
      const benchmarkTitle = xmlData.Benchmark.title[0]
      const checkContent = r.Rule[0].check && r.Rule[0].check[0]['check-content'][0]
      const fixText = r.Rule[0].fixtext[0]._
      const desc = descData['VulnDiscussion']
      const vulnId = r.$.id
      const ruleId = r.Rule[0].$.id
      const severity = r.Rule[0].$.severity
      rules.push({ index, benchmarkTitle, title, vulnId, ruleId, severity, fixText, desc, checkContent })
    }
    return { data: rules }
  } catch (err) {
    debug('ERROR listRules')
    debug(err)
    return { err }
  }
}
