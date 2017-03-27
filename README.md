# recordType

[![Greenkeeper badge](https://badges.greenkeeper.io/krainboltgreene/recordType.js.svg)](https://greenkeeper.io/)

An implementation of the Record datatype.

![Version][BADGE_VERSION]
![Tests][BADGE_TRAVIS]
![Stability][BADGE_STABILITY]
![Dependencies][BADGE_DEPENDENCY]


## using

Here's a simple recordType:

``` javascript
import record from "recordType"

// We define the record here.
const friend = record([
  // Fields are a list of "array"s, and unordered
  ["id", "String"]
])

// You can even nest records
const person = record([
  // Each field has a name, type, and default (optional)
  ["name", "String", "Unknown Name"],
  ["age", "Number"],
  ["friends", "Array"]
])

// We instantiate a record here:
const kurtis = person([
  ["name", "Kurtis Rainbolt-Greene"],
  ["age", 27],
  ["friends", [
    friend([
      ["id", "2"]
    ])
  ]]
])
// What you get is a Map containing the keys "name", "age", and "friends"

console.log(kurtis)
// Map {
//   'name' => 'Kurtis Rainbolt-Greene',
//   'age' => 27,
//   'friends' => [ Map { 'id' => '2' } ] }
```

Here's what happens when you break the type contract:

``` javascript
// Using the example above...

// If you provide the wrong type for a field, you get this error:
const john = person([
  ["name", "John B."],
  ["age", "25"],
  ["friends", []]
])
// Error: You provided "25" for field age, which is limited to Number

// If you miss information you get this error:
const kaity = person([
  ["name", "Kaity Willburough"],
  ["age"]
])
// Error: You provided no value or default value for field age, which must be an Number

// If you add a field not defined:
const william = person([
  ["name", "Kurtis Rainbolt-Greene"],
  ["age", 27],
  ["friends", []],
  ["married", false]
])
// Error: You provided ["allies","enemies"], but the record doesn't define those
```

[BADGE_TRAVIS]: https://img.shields.io/travis/krainboltgreene/recordType.js.svg?maxAge=2592000&style=flat-square
[BADGE_VERSION]: https://img.shields.io/npm/v/recordType.svg?maxAge=2592000&style=flat-square
[BADGE_STABILITY]: https://img.shields.io/badge/stability-strong-green.svg?maxAge=2592000&style=flat-square
[BADGE_DEPENDENCY]: https://img.shields.io/david/krainboltgreene/recordType.js.svg?maxAge=2592000&style=flat-square
