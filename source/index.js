import {all} from "ramda"
import {any} from "ramda"
import {call} from "ramda"
import {contains} from "ramda"
import {equals} from "ramda"
import {filter} from "ramda"
import {flip} from "ramda"
import {head} from "ramda"
import {isArrayLike} from "ramda"
import {length} from "ramda"
import {map} from "ramda"
import {not} from "ramda"
import {pipe} from "ramda"
import {type} from "ramda"
import {without} from "ramda"

// : Attribute shaped Array like [Anything named "key", Anything named "value"]
// : Defintion shaped Array like [Anything named "key", Type, Maybe Anything named "default"]
// : Column shaped Array like [Anything named "key", Array like [Type, Anything named "default"]]
// : Table shaped Map of Definition
// : Row shaped Array of Attribute

// : Array of Anything -> Anything -> Boolean
const within = flip(contains)
// : Array of Anything -> Function -> Anything
const using = flip(call)
// : Array of Array -> Array of Anything
const asHeads = map(head)
// : Defintion -> Column
const definitionToColumn = ([key, cast, defaultValue]) => [key, [cast, defaultValue]]
// : Table -> Array of Column
const definitionsToColumns = map(definitionToColumn)
// : Table -> Maybe Array of Definition
const onlyRequired = filter(pipe(length, equals(2)))
// : Array of Anything -> Boolean
const hasNonArray = any(pipe(isArrayLike, not))
// : [Row, Table] -> Array of Anything -> Row
const withDefault = ([row, table]) => (key) => {
  const [, defaultValue] = table.get(key)

  if (typeof row.get(key) === "undefined" && typeof defaultValue !== "undefined") {
    return [key, defaultValue]
  }

  return [key, row.get(key)]
}

// : Table-> Row -> Map
export default function record (definitions = []) {
  const definedKeys = asHeads(definitions)
  const requiredKeys = asHeads(onlyRequired(definitions))
  const hasSuperfluousKeys = pipe(all(within(definedKeys)), not)
  const isMissingRequiredKeys = pipe(within, all, using(requiredKeys), not)
  const table = new Map(definitionsToColumns(definitions))

  return function instantiate (attributes = []) {
    const givenKeys = asHeads(attributes)

    if (hasNonArray(attributes)) {
      throw new Error(`You provided a arguments that contain a non-array object: ${JSON.stringify(attributes)}`)
    }

    if (hasSuperfluousKeys(givenKeys)) {
      throw new Error(`You provided ${JSON.stringify(without(definedKeys, givenKeys))}, but the record doesn't define those`)
    }

    if (isMissingRequiredKeys(givenKeys)) {
      throw new Error(`You provided no value for ${JSON.stringify(without(givenKeys, requiredKeys))}`)
    }
    const fields = map(withDefault([new Map(attributes), table]), definedKeys)

    fields.forEach(([key, value]) => {
      const [cast, defaultValue] = table.get(key)

      if (typeof value === "undefined" && typeof defaultValue === "undefined") {
        throw new Error(`You provided no value (or default value) for ${key}, which must be an ${cast}`)
      }

      if (type(value || defaultValue) !== cast) {
        throw new Error(`You provided ${JSON.stringify(value)} for ${key}, which is limited to ${cast}`)
      }
    })

    return new Map(fields)
  }
}
