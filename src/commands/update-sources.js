const { Command } = require('@oclif/command')
const { join, basename } = require('path')
const { cli } = require('cli-ux')
const { getHTML, getVerRel } = require('../utils/update-sources')
const JsonDB = require('node-json-db')
const { convert, extract, download } = require('../utils')
const debug = require('debug')('update-sources')

const bDB = new JsonDB('data/benchmarks', true, true)

const URLS = [
  'https://iase.disa.mil/stigs/Pages/a-z.aspx',
  'https://iase.disa.mil/stigs/Pages/a-z.aspx?Paged=TRUE&p_Title=MySQL%20STIG&p_ID=879&PageFirstRow=301&&View={25A09AF8-178B-447B-B42B-8839EBD71CAD}'
]

const getLatestMeta = async (cacheDir) => {
  const links = []
  try {
    const pushData = async (url) => {
      const { err, data: $ } = await getHTML(url)
      if (err) {
        throw err
      }

      const rows = $('a', '.ms-rtestate-field')

      rows.each((i, el) => {
        const link = $(el).attr('href')
        const isStigZip = /^.*iasecontent.*stigs.*STIG.zip$/.test(link)

        if (isStigZip) {
          const { ver, rel, err } = getVerRel({link})
          if (err) {
            return { err }
          }

          const bRawText = $(el).text().trim()
          let title = bRawText
            .replace(/\sSTIG.*/, '')
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            .replace('/Manual/i', '')

          // The td string for Apache is not like the others
          if (link.includes('UNIX')) {
            title += ' (UNIX)'
          }

          if (link.includes('WIN')) {
            title += ' (Windows)'
          }

          const date = $(el).closest('td').next().text()
          const xmlFile = basename(link).replace('.zip', '.xml')
          const zipFile = basename(link)
          links.push({
            title,
            ver,
            rel,
            date,
            xmlPath: join('./data/benchmarks/', xmlFile),
            zipCache: join('./zip_archives/', zipFile),
            url: link
          })
        }
      })
    }

    const promises = URLS.map(pushData)
    await Promise.all(promises)

    return {
      data: { links }
    }
  } catch (err) {
    return { err }
  }
}

const writeSources = async (data) => {
  try {
    debug('source length ' + data.length)
    if (data.length < 200) {
      return { err: new Error('HTML parse issue, less than 200 benchmarks scraped') }
    }
    const comp = (a, b) => {
      if (a.title < b.title) return -1
      if (a.title > b.title) return 1
      return 0
    }

    bDB.push('/benchmarks', data.sort(comp))
    return { data: 'success' }
  } catch (err) {
    return { err }
  }
}

const downloadSources = async (tmpDir) => {
  try {
    const benchmarks = bDB.getData('/benchmarks')
    const dl = async (b) => {
      await download({ url: b.url, title: b.title, tmpDir })
    }
    const promises = benchmarks.map(dl)
    await Promise.all(promises)
    return { data: 'success' }
  } catch (err) {
    return { err }
  }
}

const unzip = async (b, cacheDir) => {
  const archivePath = join(cacheDir, b.zipCache)
  const desiredFile = b.xmlPath
  const { err, data } = await extract({ archivePath, desiredFile })
  if (err) {
    debug(err)
    throw err
  }
  return { data }
}

const extractSources = async (cacheDir) => {
  try {
    debug('extractSources invoked')
    const benchmarks = bDB.getData('/benchmarks')

    for (const b of benchmarks) {
      await unzip(b, cacheDir)
    }

    return { message: 'success' }
  } catch (err) {
    return { err }
  }
}

class UpdateSourcesCommand extends Command {
  async run () {
    cli.action.start('Updating STIG sources')

    const { err, data } = await getLatestMeta(this.config.cacheDir)
    if (err) {
      throw err
    }

    const { err: writeErr } = await writeSources(data.links)
    if (writeErr) {
      throw writeErr
    }

    const { err: dlErr } = await downloadSources(this.config.cacheDir)
    if (dlErr) {
      throw dlErr
    }
    debug('downloadSources() finished')

    const { err: extErr } = await extractSources(this.config.cacheDir)
    if (extErr) {
      debug(extErr)
      throw extErr
    }

    debug('Convert start')
    const { err: convertErr } = await convert()
    if (convertErr) {
      throw convertErr
    }
    debug('Convert done')

    cli.action.stop('done!')
  }
}

UpdateSourcesCommand.hidden = true

UpdateSourcesCommand.description = `Updates Benchmark Sourcing Data
Updates a benchmark's source data directly from the DISA STIG web portal. This does several things:
- updates the, title, download endpoint, and revision from DISA's website.
- downloads every public STIG zip archive
- extracts every XML file and places it into the data directory of this library

You probably don't need or want to run this unless you are submitting an update PR to the repository of this CLI itself.
`

module.exports = UpdateSourcesCommand
