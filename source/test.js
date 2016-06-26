import {describe, describe as context, it} from "mocha"
import {expect} from "chai"
import subject from "./index"

const nameField = ["name", "String", "Unknown"]
const ageField = ["age", "Number"]
const idField = ["id", "String"]
const friendsField = ["friends", "Array", []]
const friend = subject([
  idField
])

describe("record()", () => {
  it("returns a function", () => {
    expect(subject()).to.be.instanceof(Function)
  })

  context("instance creation", () => {
    context("with attributes", () => {
      const instance = subject([
        nameField,
        ["nickname", "String", "Unknown"],
        ageField,
        friendsField
      ])
      const attributes = [
        ["name", "Kurtis Rainbolt-Greene"],
        ["age", 24],
        ["friends", [
          friend([
            ["id", "b"]
          ])
        ]]
      ]

      it("returns the right Map value", () => {
        expect(instance(attributes)).to.deep.equal(new Map([
          ["name", "Kurtis Rainbolt-Greene"],
          ["nickname", "Unknown"],
          ["age", 24],
          ["friends", [
            new Map([
              ["id", "b"]
            ])
          ]]
        ]))
      })
    })

    context("without attributes or definitions", () => {
      const instance = subject([])
      const attributes = []

      it("returns the right Map value", () => {
        expect(instance(attributes)).to.deep.equal(new Map())
      })
    })

    context("with an missing required field", () => {
      const instance = subject([
        nameField,
        ageField,
        friendsField
      ])
      const attributes = [
        ["name", "Kurtis Rainbolt-Greene"]
      ]

      it("throws an error", () => {
        expect(() => instance(attributes)).to.throw(Error, "You provided no value for [\"age\"]")
      })
    })

    context("with an extra field", () => {
      const instance = subject([
        nameField,
        ageField,
        friendsField
      ])
      const attributes = [
        ["name", "Kurtis Rainbolt-Greene"],
        ["age", 24],
        ["allies", ["a", "b", "c"]],
        ["enemies", ["e", "f", "g"]]
      ]

      it("throws an error", () => {
        expect(() => instance(attributes)).to.throw(Error, "You provided [\"allies\",\"enemies\"], but the record doesn't define those")
      })
    })

    context("with a field that has the wrong type", () => {
      const instance = subject([
        nameField,
        ageField,
        friendsField
      ])
      const attributes = [
        ["name", "Kurtis Rainbolt-Greene"],
        ["age", "42"]
      ]

      it("throws an error", () => {
        expect(() => instance(attributes)).to.throw(Error, "You provided \"42\" for age, which is limited to Number")
      })
    })

    context("with a default value that is the wrong type", () => {
      const instance = subject([
        ["name", "String", 42],
        ageField
      ])
      const attributes = [
        ["age", 24]
      ]

      it("throws an error", () => {
        expect(() => instance(attributes)).to.throw(Error, "You provided 42 for name, which is limited to String")
      })
    })
  })
})
