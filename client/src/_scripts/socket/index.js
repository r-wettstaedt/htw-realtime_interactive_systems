import io from 'socket.io-client'

import world from '../world/world'

import {registered, registeredAll} from './register'
import gamestart from './gamestart'
import move from './move'
import visibleArea from './visibleArea'
import {vPlayer, lvPlayer} from './player'
import disconnect from './disconnect'
import gameover from './gameover'

// const url = 'ris.r-wettstaedt.com'
const url = 'localhost:3003'
const socket = io.connect(`http://${url}/ris`)

socket.on('connect', function () {
    socket.emit('register')

    console.log('connection')
})

socket.on('registered', bind(registered))
socket.on('registeredAll', bind(registeredAll))
socket.on('gamestart', bind(gamestart))
socket.on('moveConfirmation', bind(move))
socket.on('visibleArea', bind(visibleArea))
socket.on('vPlayer', bind(vPlayer))
socket.on('lvPlayer', bind(lvPlayer))
socket.on('disconnectedPlayer', bind(disconnect))
socket.on('gameover', bind(gameover))


function bind (_module) {
    return _module.bind(this, socket)
}

export default socket
