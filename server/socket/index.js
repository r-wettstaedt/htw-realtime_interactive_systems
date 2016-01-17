const port = 3003
const io = require('socket.io')(port)
const _player = require('./player')(io, port)
const _world = require('./world')(io, port)

export default {
    player : _player,
    world : _world,
}
