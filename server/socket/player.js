import world from '../world/world'

module.exports = function(io, port) {
    const _player = io.of('/ris/player')
    let basket = {}

    _player.on('connection', socket => {

        const id = socket.client.id
        basket[id] = socket
        console.log('player/connection', id)

        world.addPlayer(id)
        const player = world.getPlayers(id)

        if (!world.isGameRunning()) {
            socket.emit('registered', {
                id : id,
                texture : player.texture,
                hasGodMode : player.hasGodMode,
                isGameMaster : player.isGameMaster,
            })
            _player.emit('registeredAll', world.playersAsShippable())
        }


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
                    prevPosX : player.prevPosX,
                    prevPosY : player.prevPosY,
                    lastUpdate : player.lastUpdate,
                    posX : player.posX,
                    posY : player.posY,
                    dir : player.dir,
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

        socket.on('gameStart', () => {
            console.log('player/gameStart')
            if (!player.isGameMaster) return

            let players = world.getPlayers()
            for (let id of Object.keys(players)) {
                basket[id].emit('visibleArea', {
                    vPlayers : players[id].vPlayers,
                    map : players[id].map,
                })
            }

            _player.emit('gameStart')
            setTimeout(world.startGame.bind(world), 3000)
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
            _player.emit('disconnectedPlayer', id)
        })
    })

    return _player
}
