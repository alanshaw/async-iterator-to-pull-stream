# async-iterator-to-pull-stream

[![Build Status](https://travis-ci.org/alanshaw/async-iterator-to-pull-stream.svg?branch=master)](https://travis-ci.org/alanshaw/async-iterator-to-pull-stream) [![dependencies Status](https://david-dm.org/alanshaw/async-iterator-to-pull-stream/status.svg)](https://david-dm.org/alanshaw/async-iterator-to-pull-stream)

> Convert a (async) iterator to a pull stream

## Install

```sh
npm install async-iterator-to-pull-stream
```

## Usage

```js
const pull = require('pull-stream')
const toPull = require('async-iterator-to-pull-stream')

const iterator = async function * () {
  const sourceValues = [1, 2, 3, 4, 5]
  for (let i = 0; i < sourceValues.length; i++) {
    yield await new Promise(resolve => setTimeout(() => resolve(sourceValues[i])))
  }
}

pull(
  toPull(iterator()),
  pull.collect((err, values) => {
    console.log(values) // 1, 2, 3, 4, 5
  })
)
```

## API

### `toPull(iterator)`

Convert an async `iterator` into a pull stream. Returns a pull stream that can be used as a source in a pull pipeline.

## Contribute

Feel free to dive in! [Open an issue](https://github.com/alanshaw/async-iterator-to-pull-stream/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw
