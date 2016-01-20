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

            if (!world.isGameRunning()) return

            let s1 = Date.now()

            const player = world.getPlayers(id)
            world.setPlayerPosition(id, data)
            socket.emit('moveConfirmation', {
                posX : player.posX,
                posY : player.posY,
            })

            world.getVisibleAreas(id)
            socket.emit('visibleArea', {
                vPlayers : player.vPlayers,
                map : player.map,
            })

            player.vPlayers.map( vPlayer => {
                const b = basket[vPlayer.id]
                if (!b) return
                b.emit('vPlayer', {
                    id   : id,
                    posX : player.posX,
                    posY : player.posY,
                    spritePos : player.texture.spritePos,
                })
            })

            player.lvPlayers.map( lvPlayer => {
                const b = basket[lvPlayer.id]
                if (!b) return
                b.emit('lvPlayer', id)
            })

            let e1 = Date.now()
            // console.log(e1 - s1)
        })

        socket.on('disconnect', () => {
            console.log('player/disconnect', id)
            world.removePlayer(id)
            basket[id] = null
        })
    })

    return _player
}
