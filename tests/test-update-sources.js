const tape = require('tape')
const { getHTML, getVerRel } = require('../src/utils/update-sources')

tape.test('update-sources', t => {
  t.test('getHTML()', t => {
    const { err, data } = getHTML('https://google.com')
    t.ok(!err, 'no errors getting html')
    t.ok(!data, 'received html data')
    t.end()
  })

  t.test('getVerRel()', async t => {
    const link = 'http://iasecontent.disa.mil/stigs/zip/U_A10_Networks_ADC_ALG_V1R1_STIG.zip'
    const { err, ver, rel, draft } = await getVerRel({ link })
    t.ok(!err, 'no errors invoking getVerRel()')
    t.ok(ver === '1', 'ver retrieved from getVerRel()')
    t.ok(rel === '1', 'rel retrieved from getVerRel()')
    t.ok(typeof draft === 'boolean', 'draft retrieved from getVerRel()')
    t.end()
  })
  t.end()
})
