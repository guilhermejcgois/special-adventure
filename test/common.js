'use strict'

const app = require('../server/server')
const chai = require('chai')
const supertest = require('supertest')

const expect = chai.expect
const request = supertest(app)

module.exports = {
  app,
  expect,
  request,
}
