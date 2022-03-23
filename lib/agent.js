'use strict'

module.exports = function setupAgent (AgentModel) {
  
  function findById (id) {
      return AgentModel.findById(id)
  }

  async function createOrUpdate(agent) {
    const  cond = {
      where:{
        uuid: agent.uuid
      }
    }

    // Buscar de acuedo a la consulta
    const existingAgent = await AgentModel.findOne(cond)
  
    if (existingAgent) {
      const updated = await AgentModel.update(agent, cond)

      // si lo actulizao retorne el objeto actualizado
      // si no pues busque el agente existente
      return updated ? AgentModel.findOne(cond) : existingAgent
    }

    // early return es evitarse el else  por lo q arriba lo hize retornar

    const result = await AgentModel.create(agent)
    return result.toJSON()


  }

  return {
    findById,
    createOrUpdate
  }

}