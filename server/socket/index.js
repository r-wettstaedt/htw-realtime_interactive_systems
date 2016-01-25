import world from '../world/world'
import {register, registerAI} from './register'
import gamestart from './gamestart'
import move from './move'
import disconnect from './disconnect'

const port = 3003
const io = require('socket.io')(port)

const server = io.of('/ris')
const basket = {}

server.on('connection', function (socket) {

    const id = socket.client.id
    basket[id] = socket

    console.log('connection', id)

    const player = world.addPlayer(id)

    socket.on('register', bind(register))
    socket.on('registerAI', bind(registerAI))
    socket.on('gamestart', bind(gamestart))
    socket.on('move', bind(move))
    socket.on('disconnect', bind(disconnect))


    function bind (_module) {
        return _module.bind(this, server, basket, player, socket)
    }

})
