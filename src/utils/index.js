const {
  unlinkSync,
  existsSync,
  mkdirSync,
  createWriteStream,
  createReadStream
} = require('fs')
const { join } = require('path')
const unzipper = require('unzipper')
const debug = require('debug')('utils')
const fetch = require('node-fetch')
const D2UConverter = require('@dpwolfe/dos2unix').dos2unix

module.exports.download = async ({ url, title, tmpDir }) => {
  try {
    const fileName = url.substring(url.lastIndexOf('/') + 1)
    const archiveDir = join(tmpDir, 'zip_archives')
    const archivePath = join(archiveDir, fileName)

    if (!existsSync(archiveDir)) mkdirSync(archiveDir)

    if (!existsSync(archivePath)) {
      const data = await fetch(url)
        .then((res) => res.ok ? res
          : Promise.reject(new Error(`Initial error downloading file => ${res.error}`))
        )
        .then((res) => {
          if (!res.ok) {
            return Promise.reject(new Error({
              reason: 'Initial error downloading file',
              meta: {url, error: new Error(res.statusText)}
            }))
          }

          const stream = createWriteStream(archivePath)
          let timer

          return new Promise((resolve, reject) => {
            const errorHandler = (error) => {
              debug('errorHandler')
              reject(new Error(error))
            }

            res.body
              .on('error', errorHandler)
              .pipe(stream)

            stream
              .on('open', () => {
                timer = setTimeout(() => {
                  stream.close()
                  debug('dl timeout')
                  reject(new Error(`Timed out downloading file from ${url}`))
                }, 10e5)
              })
              .on('error', errorHandler)
              .on('finish', () => {
                debug(`Finished downloading ${url}`)
                resolve(archivePath)
              })
          }).then((archivePath) => {
            clearTimeout(timer)
            return archivePath
          }, (err) => {
            clearTimeout(timer)
            return Promise.reject(err)
          })
        })
      return { data }
    } else {
      return { data: archivePath }
    }
  } catch (err) {
    return { err }
  }
}

module.exports.extract = ({ archivePath, desiredFile }) => {
  return new Promise((resolve, reject) => {
    try {
      const desiredFileFullPath = join(__dirname, '../../', desiredFile)
      if (!archivePath.includes('U_Apple_OS_X_10-8')) {
        createReadStream(archivePath)
          .pipe(unzipper.ParseOne(/.*Manual-xccdf.xml/i))
          .on('error', err => {
            debug(err)
            debug('ERROR')
            debug(`No xccdf found in ${archivePath}`)
            unlinkSync(desiredFileFullPath)
            return reject(err)
          })
          .pipe(createWriteStream(desiredFileFullPath))
          .on('finish', () => {
            return resolve({ data: 'complete' })
          })
      } else {
        // for some reason Apple Workstation 10.8 STIGs xccdf is zipped up
        // inside a zip. ¯\_(ツ)_/¯
        debug('Working on a zip inside a zip')
        const secondZipPath = archivePath.replace('.zip', '-secondary.zip')
        createReadStream(archivePath)
          .pipe(unzipper.ParseOne(/.*.zip/i)) // nested ZIP archives YAY!
          .on('error', err => {
            debug(err)
            debug('ERROR')
            unlinkSync()
            return reject(err)
          })
          .pipe(createWriteStream(secondZipPath))
          .on('finish', () => {
            createReadStream(secondZipPath)
              .pipe(unzipper.ParseOne(/.*Manual-xccdf.xml/i))
              .on('error', err => {
                debug(err)
                debug('ERROR')
                unlinkSync()
                return reject(err)
              })
              .pipe(createWriteStream(desiredFileFullPath))
              .on('finish', () => {
                return resolve({ data: 'complete' })
              })
          })
      }
    } catch (err) {
      debug(err)
      return reject(err)
    }
  })
}

module.exports.convert = () => {
  debug('convert()')
  return new Promise((resolve, reject) => {
    const d2u = new D2UConverter({
      glob: {
        cwd: join(__dirname, '../../data/benchmarks'),
        ignore: [
          // these are the particular benchmarks
          // that dont come with ^M
          // ¯\_(ツ)_/¯
          '*AIX*',
          '*ASD*',
          '*Ubuntu_16*',
          '*Windows_10*',
          '*Windows_2008_DC*',
          '*Windows_2008_MS*',
          '*Windows_2008_R2*',
          '*Windows_2012*R2_DC*',
          '*Windows_2012*R2_MS*',
          '*Windows_Ser*2016*',
          '*Network_Devices*',
          '*Oracle*11*',
          '*Oracle*12*',
          '*HPUX_11*',
          '*Red*6*',
          '*Red*7*',
          '*SLES*',
          '*zOS*',
          '*Solaris*',
          '*Network_Perimeter_Router*'
        ] // MOAR snowflakes!
      },
      maxConcurrency: 200
    })
      .on('processing.skip', (d) => {
        debug('SKIPPED')
        debug(d)
      })
      .on('error', (err) => {
        debug('ERROR')
        debug(err)
        return resolve({ err })
      })
      .on('end', (stats) => {
        debug(stats)
        debug('conversion done')
        return resolve({ data: stats })
      })
    debug(d2u)
    d2u.process(['*.xml'])
  })
}
