'use strict'

const agent = {
    id: 1,
    uuid: 'yyy-yyy-yyy',
    name: 'fixture',
    username: 'platzi',
    hostname: 'test-host',
    pid: 6,
    connected: true,
    createdAt: new Date(),
    updatedAt: new Date(),
}

const agents = [
    agent,
    { ...agent, id:2, uuid: 'yyy-yyy-yyx', connected:false },
    { ...agent, id:3, uuid: 'yyy-yyy-wwx', connected:false },
    { ...agent, id:4, uuid: 'yyy-yyy-ywx', username:'Plazo' },
]


// Funcion de clonacion 
// ahora los tres puntos lo reemplazron
function extend( obj, values ) {
    const clone  = Object.assign({}, obj)
    return Object.assign(clone, values)
}
// Y se utiliza algo asi
// extend(agent, {id:3, connected:false}) 



console.log("Sirve otra vez ", agents);

module.exports = {
    single: agent,
    all: agents,
    connected: agents.filter(a => a.connected ),
    platzi: agents.filter(a => a.name == 'Platzi'),
    byUuid: (id) => agents.find( a => a.uuid === id ),
    byId: (id) => agents.find( a => a.id === id )
}