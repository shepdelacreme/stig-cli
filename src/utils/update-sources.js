const fetch = require('node-fetch')
const cheerio = require('cheerio')
const debug = require('debug')('utils:update-sources')

module.exports.getVerRel = ({ link }) => {
  debug('getVerRel()')
  const regex = /^.*_V(\d*)R(\d*).*zip$/
  const match = regex.exec(link)
  let ver, rel
  try {
    ver = match[1]
    rel = match[2]
    return { ver, rel }
  } catch (err) {
    return { err }
  }
}

module.exports.getHTML = async url => {
  try {
    debug('getHTML()')
    debug(url)
    const res = await fetch(url)
    const html = await res.text()
    return { data: cheerio.load(html) }
  } catch (err) {
    return { err }
  }
}
