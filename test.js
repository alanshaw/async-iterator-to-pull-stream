const test = require('ava')
const pull = require('pull-stream')
const toPull = require('.')

function futureValue (value, ms) {
  return new Promise((resolve, reject) => setTimeout(() => resolve(value), ms))
}

test.cb('should convert async iterator to pull stream', t => {
  const sourceValues = [1, 2, 3, 4, 5]

  const iterator = async function * () {
    for (let i = 0; i < sourceValues.length; i++) {
      yield await futureValue(sourceValues[i], sourceValues[i])
    }
  }

  pull(
    toPull(iterator()),
    pull.collect((err, values) => {
      t.falsy(err)
      t.deepEqual(values, sourceValues)
      t.end()
    })
  )
})

test.cb('should convert iterator to pull stream', t => {
  const sourceValues = [1, 2, 3, 4, 5]

  const iterator = function * () {
    for (let i = 0; i < sourceValues.length; i++) {
      yield sourceValues[i]
    }
  }

  pull(
    toPull(iterator()),
    pull.collect((err, values) => {
      t.falsy(err)
      t.deepEqual(values, sourceValues)
      t.end()
    })
  )
})

test.cb('should error in iterator', t => {
  const sourceValues = [1, 2, 3, 4, new Error('Boom!')]

  const iterator = function * () {
    for (let i = 0; i < sourceValues.length; i++) {
      if (sourceValues[i] instanceof Error) throw sourceValues[i]
      yield sourceValues[i]
    }
  }

  pull(
    toPull(iterator()),
    pull.collect((err, values) => {
      t.truthy(err)
      t.deepEqual(values, sourceValues.slice(0, -1))
      t.end()
    })
  )
})

test.cb('should accept iterable', t => {
  const sourceValues = [1, 2, 3, 4, 5]

  pull(
    toPull(sourceValues),
    pull.collect((err, values) => {
      t.falsy(err)
      t.deepEqual(values, sourceValues)
      t.end()
    })
  )
})

test.cb('should accept async iterable', t => {
  const sourceValues = [1, 2, 3, 4, 5]

  const iterator = async function * () {
    for (let i = 0; i < sourceValues.length; i++) {
      yield await futureValue(sourceValues[i], sourceValues[i])
    }
  }

  pull(
    toPull({ [Symbol.asyncIterator]: () => iterator() }),
    pull.collect((err, values) => {
      t.falsy(err)
      t.deepEqual(values, sourceValues)
      t.end()
    })
  )
})
