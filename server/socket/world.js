import world from '../world/world'

module.exports = function(io, port) {
    const _world = io.of('/ris/world')

    _world.on('connection', socket => {

        console.log('world/connection')
        socket.on('request', () => {
            console.log('world/request')
            socket.emit('world', world.asShippable())
        })

    })

    return _world
}
