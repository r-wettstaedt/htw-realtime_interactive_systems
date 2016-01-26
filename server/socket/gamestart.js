import world from '../world/world'

export default function (server, basket, player, socket, data) {
    console.log('player/gamestart')

    if (!player.isGameMaster) return

    world.createMap()
    const players = world.getPlayers()
    for (let id in players) {
        basket[id].emit('visibleArea', {
            vPlayers : players[id].vPlayers,
            map : players[id].map,
        })
    }

    server.emit('gamestart')
    setTimeout(world.startGame.bind(world), 3000)

}
