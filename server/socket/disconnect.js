import world from '../world/world'

export default function (server, basket, player, socket, data) {
    console.log('player/disconnect', player.id)

    world.removePlayer(player.id)
    basket[player.id] = null
    server.emit('lvPlayer', player.id)
    server.emit('disconnectedPlayer', player.id)

}
