import io from 'socket.io-client'

// const url = 'ris.r-wettstaedt.com'
const url = 'localhost:3003'
const _player = require('./player')(io, url)
const _world = require('./world')(io, url)

export default {
    player : _player,
    world : _world,
}
