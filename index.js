'use strict'

const setupDatabase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')

// let to meter funciones al modelo 
// Interesting mocel de hacerlo 
// Es muy organizado
const setupAgent = require('./lib/agent') 

const defaults = require('defaults')
// Values default

module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  })

  const sequalize = setupDatabase(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)

  // Relations
  // No hay need to create la llave foraniea
  // the model sequilize do por we
  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  await sequalize.authenticate()

  // if no exist una db then crea una
  if (config.setup) {
    await sequalize.sync({ force: true })
  }
  // Esto viene a ser una mirgracion
  // sequalize.sync()

  const Agent = setupAgent(AgentModel)
  const Metric = {}

  return {
    Agent,
    Metric
  }
}
