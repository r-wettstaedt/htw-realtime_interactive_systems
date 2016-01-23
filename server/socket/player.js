import world from '../world/world'

module.exports = function(io, port) {
    const _player = io.of('/ris/player')
    let basket = {}

    _player.on('connection', socket => {
        if (!world.isGameRunning()) {
            basket = {}
            world.createWorld()
        }

        const id = socket.client.id
        basket[id] = socket
        console.log('player/connection', id)

        world.addPlayer(id)
        const player = world.getPlayers(id)

        socket.emit('registered', {
            texture : player.texture,
            hasGodMode : player.hasGodMode,
        })


        socket.on('move', data => {
            // console.log('player/move', id, data)

            if (!world.isGameRunning()) return

            let s1 = Date.now()

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
                if (!b || vPlayer.isAI) return
                b.emit('vPlayer', {
                    id   : id,
                    posX : player.posX,
                    posY : player.posY,
                    texture : player.texture,
                    isAI : player.isAI,
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

        socket.on('registerAI', () => {
            world.registerAI(id)
            socket.emit('registeredAI', {
                posX : player.posX,
                posY : player.posY,
                texture : player.texture,
            })
        })

        socket.on('disconnect', () => {
            console.log('player/disconnect', id)
            world.removePlayer(id)
            basket[id] = null
            _player.emit('lvPlayer', id)
        })
    })

    return _player
}
