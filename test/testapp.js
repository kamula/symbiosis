const assert = require("chai").assert
const app = require("../index")
const { describe } = require("mocha")

describe("app", () => {
    it("return object", () => {
        assert.typeOf(app, "object")
    })
})