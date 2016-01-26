import world from '../world/world'
import lobby from '../../_modules/lobby/lobby'

export function disconnectedPlayer (socket, data) {
    if (world.debug) console.log('disconnectedPlayer')

    delete world.players[data]
    lobby.setPlayers()

}


export function disconnect (socket, data) {
    if (world.debug) console.log('disconnect')

    location.reload()

}
