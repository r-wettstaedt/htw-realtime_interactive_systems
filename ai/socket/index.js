import io from 'socket.io-client'

import world from '../world/world'

import registered from './register'
import move from './move'
import visibleArea from './visibleArea'
import {vPlayer, lvPlayer} from './player'
import gameover from './gameover'

// const url = 'ris.r-wettstaedt.com'
const url = 'localhost:3003'
const socket = io.connect(`http://${url}/ris`)

socket.on('connect', function () {
    socket.emit('registerAI')
})

socket.on('registeredAI', bind(registered))
socket.on('moveConfirmation', bind(move))
socket.on('visibleArea', bind(visibleArea))
socket.on('vPlayer', bind(vPlayer))
socket.on('lvPlayer', bind(lvPlayer))
socket.on('gameover', bind(gameover))


function bind (_module) {
    return _module.bind(this, socket)
}

export default socket
