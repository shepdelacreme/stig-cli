const tape = require('tape')
const { fillTableArr } = require('../src/utils/ls')

tape.test('stig ls', async t => {
  t.test('fill table array', async t => {
    const array = [['alpha', 'bravo', 'charlie', 'delta', 'echo']]
    const data = [
      {title: 'foo', rel: 1, ver: 2, date: '10/10/2018'},
      {title: 'far', rel: 2, ver: 2, date: '10/11/2018'}
    ]
    const { err, data: newArr } = await fillTableArr({data, array})
    t.ok(!err, 'no error filling table')
    t.ok(newArr, 'value received')
    t.equals(newArr.length, 3, 'three elements found')
    t.end()
  })
  t.end()
})
