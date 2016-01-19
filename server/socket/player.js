import world from '../world/world'

module.exports = function(io, port) {
    const _player = io.of('/ris/player')
    const basket = {}

    _player.on('connection', socket => {
        const id = socket.client.id
        basket[id] = socket
        console.log('player/connection', id)

        world.addPlayer(id)

        socket.on('move', data => {
            // console.log('player/move', id, data)
            const player = world.getPlayers(id)
            if (Math.abs(data.posX - player.posX) < 2 &&
                Math.abs(data.posY - player.posY) < 2) {
                world.setPlayerPosition(id, data)
            } else {
                console.log('player/move - diff too big', id)
            }
            // console.log(player.vPlayers)
            socket.emit('move', player)
            player.vPlayers.map( vPlayer => {
                const b = basket[vPlayer.id]
                if (!b) return
                b.emit('vPlayer', {
                    id   : id,
                    posX : player.posX,
                    posY : player.posY,
                    spritePos : player.spritePos
                })
            })
        })

        socket.on('disconnect', () => {
            console.log('player/disconnect', id)
            world.removePlayer(id)
            basket[id] = null
        })
    })

    return _player
}
