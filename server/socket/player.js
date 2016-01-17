import world from '../world/world'

module.exports = function(io, port) {
    const _player = io.of('/ris/player')

    _player.on('connection', socket => {
        const id = socket.client.id
        console.log('player/connection', id)

        world.addPlayer(id)

        socket.on('move', data => {
            console.log('player/move', id, data)
            const player = world.getPlayers(id)
            if (Math.abs(data.posX - player.posX) < 2 &&
                Math.abs(data.posY - player.posY) < 2) {
                world.setPlayerPosition(id, data.posX, data.posY)
            } else {
                console.log('player/move - diff too big', id)
            }
            socket.emit('move', player)
        })

        socket.on('disconnect', () => {
            console.log('player/disconnect', id)
            world.removePlayer(id)
        })
    })

    return _player
}
