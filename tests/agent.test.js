'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

// get Fixtures
const agentFixtures = require('./fixtures/agent')

const config = {
  logging: function () {

  }
}

// Simular la relacion
const MetricStub = {
  // belongsTo: function () {}
  // spy me permite do questions 
  // cuantas veces fue llamada 
  // no se llamo ? etc
  belongsTo: sinon.spy()
}

// Simular la relacion en Agents
// Get the clone object
// let single = Object.assign({},agentFixtures.single)
// Aunque creo q queda mejor asi
const id = 2
let single = {...agentFixtures.single}
let AgentStub = null
let db = null
let sandbox = null
let uuid = 'yyy-yyy-yyy'

// Para que la condicion sea igual
let uuidArgs = {
  where:{
    uuid
  }
}

test.beforeEach(async () => {
  sandbox = sinon.createSandbox()
  // sandbox es como un recolector solo sirve 
  // para cada ejecucion
  
  AgentStub = {
    // hasMany: function () {}
    hasMany: sandbox.spy()
  }

  // Crear la funcion byId como stub
  AgentStub.findById = sandbox.stub()
  AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixtures.byId(id)))
  
  // Model to findOne
  AgentStub.findOne = sandbox.stub()
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.byUuid(uuid)))
  
  // Model to update
  AgentStub.update = sandbox.stub()
  AgentStub.update.withArgs(single,uuidArgs).returns(Promise.resolve(single))




  // before
  // const setupDatabase = require('../')

  // after
  // Cuando yo solicite en index, duvuelva un objeto
  // proxyquiere REWRITE los devolverian
  const setupDatabase = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })
  db = await setupDatabase(config)
})

test.afterEach( (t) => sandbox && sandbox.restore());


test('should say me engineer', (t) => {
  // t.pass()
  t.truthy(db.Agent, 'Agent service should exist')
})


test.serial('Steup ', t => {
  
  AgentStub.hasMany()
  t.true(AgentStub.hasMany.called, 'AgentModel,hasmany was executed')
  t.true(AgentStub.hasMany.calledWith(MetricStub),'Argument should be the MetricModel ')
  t.true(MetricStub.belongsTo.called, 'MetricModel,belongsTo was executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub),'Argument should be the AgentModel ')
})

test.serial('Agent#findById ', async t => {
  let agent = await db.Agent.findById(id)

  t.true(AgentStub.findById.called, 'findById should be called on model')
  t.true(AgentStub.findById.calledOnce, 'findById should be called once')
  t.true(AgentStub.findById.calledWith(id), 'findById should be called with specified id')
  
  t.deepEqual(agent, agentFixtures.byId(id), 'Should be the same')
})

test.serial('Agent#createOrUpdate',async t => {

  let agent = await db.Agent.createOrUpdate(single)


  t.true(AgentStub.findOne.called, 'findOne should be called on model')
  t.true(AgentStub.findOne.calledTwice, 'findOne should be called twice')
  t.true(AgentStub.findOne.calledWith(uuidArgs), 'findOne should be called with uuid args')
  t.true(AgentStub.update.called, 'agent.update called on model')
  t.true(AgentStub.update.calledOnce, 'agent.update should be called once')
  t.true(AgentStub.update.calledWith(single), 'agent.update should be called with specified args')

  t.deepEqual(agent, single, 'agent should be the same')

})