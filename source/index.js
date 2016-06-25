import {head} from "ramda"
import {map} from "ramda"
import {contains} from "ramda"
import {all} from "ramda"
import {call} from "ramda"
import {not} from "ramda"
import {pipe} from "ramda"
import {without} from "ramda"
import {flip} from "ramda"
import {filter} from "ramda"
import {length} from "ramda"
import {equals} from "ramda"
import immu from "immu"

// : Attribute shaped Array like [Anything named "key", Anything named "value"]
// : Defintion shaped Array like [Anything named "key", Type, Maybe Anything named "default"]
// : Column shaped Array like [Anything named "key", Array like [Type, Anything named "default"]]
// : Table shaped Array of Definition
// : Row shaped Array of Attribute

// : Array of Anything -> Anything -> Boolean
const within = flip(contains)
// : Array of Anything -> Function -> Anything
const using = flip(call)
// : Array of Array -> Array of Anything
const asHeads = map(head)
// : Defintion -> Column
const definitionToColumn = ([key, type, defaultValue]) => [key, [type, defaultValue]]
// : Array of Defintion -> Array of Column
const definitionsToColumns = map(definitionToColumn)
// : Array of Definition -> Array of Definition
const onlyRequired = filter(pipe(length, equals(2)))

// : Table-> Row -> Map
export default function record (definitions = []) {
  const definedKeys = asHeads(definitions)
  const requiredKeys = asHeads(onlyRequired(definitions))
  const hasSuperfluousKeys = pipe(all(within(definedKeys)), not)
  const isMissingRequiredKeys = pipe(within, all, using(requiredKeys), not)
  const table = new Map(definitionsToColumns(definitions))

  return function instantiate (attributes = []) {
    const givenKeys = asHeads(attributes)

    if (hasSuperfluousKeys(givenKeys)) {
      throw new Error(`You provided ${JSON.stringify(without(definedKeys, givenKeys))}, but the record doesn't define those`)
    }

    if (isMissingRequiredKeys(givenKeys)) {
      throw new Error(`You provided no value for ${JSON.stringify(without(givenKeys, definedKeys))}`)
    }

    attributes.forEach(([key, value]) => {
      const [type, defaultValue] = table.get(key)

      if (typeof value === "undefined" && typeof defaultValue === "undefined") {
        throw new Error(`You provided no value (or default value) for ${key}, which must be an ${type}`)
      }

      if (!(typeof (value || defaultValue) === type)) {
        throw new Error(`You provided ${JSON.stringify(value)} for ${key}, which is limited to ${type}`)
      }
    })

    return immu(new Map(attributes))
  }
}
