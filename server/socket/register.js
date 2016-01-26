import world from '../world/world'

export function register (server, basket, player, socket, data) {
    console.log('registered', player.id)

    socket.emit('registered', {
        width : world.asShippable().width,
        height : world.asShippable().height,

        id : player.id,
        texture : player.texture,
        hasGodMode : player.hasGodMode,
        isGameMaster : player.isGameMaster,

        isGameRunning : world.isGameRunning(),
    })
    if (world.isGameRunning()) {
        socket.emit('visibleArea', {
            vPlayers : player.vPlayers,
            map : player.map,
        })
    }
    server.emit('registeredAll', world.playersAsShippable())

}

export function registerAI (server, basket, player, socket, data) {
    console.log('registerAI')

    world.registerAI(player.id)
    socket.emit('registeredAI', {
        posX : player.posX,
        posY : player.posY,
        texture : player.texture,
        world : world.asShippable(),
    })

}
