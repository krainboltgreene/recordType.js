import {describe, describe as context, it} from "mocha"
import {expect} from "chai"
import subject from "./index"

const nameField = ["name", "string", "Unknown"]
const ageField = ["age", "number"]

describe("record()", () => {
  it("returns a function", () => {
    expect(subject()).to.be.instanceof(Function)
  })

  context("instance creation", () => {
    const instance = subject([
      nameField,
      ageField
    ])

    context("with an missing required field", () => {
      const fields = [
        ["name", "Kurtis Rainbolt-Greene"]
      ]

      it("throws an error with a missing field", () => {
        expect(() => instance(fields)).to.throw(Error, "You provided no value for [\"age\"]")
      })
    })

    context("with an extra field", () => {
      const fields = [
        ["name", "Kurtis Rainbolt-Greene"],
        ["age", 24],
        ["friends", ["a", "b", "c"]],
        ["enemies", ["e", "f", "g"]]
      ]

      it("throws an error with a superflous fields", () => {
        expect(() => instance(fields)).to.throw(Error, "You provided [\"friends\",\"enemies\"], but the record doesn't define those")
      })
    })

    context("with a field that has the wrong type", () => {
      const fields = [
        ["name", "Kurtis Rainbolt-Greene"],
        ["age", "42"]
      ]

      it("throws an error with a bad fields type", () => {
        expect(() => instance(fields)).to.throw(Error, "You provided \"42\" for age, which is limited to number")
      })
    })
  })
})
