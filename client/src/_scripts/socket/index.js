import io from 'socket.io-client'

const _player = require('./player')(io, 3003)
const _world = require('./world')(io, 3003)

export default {
    player : _player,
    world : _world,
}
