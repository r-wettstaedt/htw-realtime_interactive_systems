import world from '../world/world'
import lobby from '../../_modules/lobby/lobby'

export default function (socket, data) {
    if (world.debug) console.log('disconnectedPlayer')

    delete world.players[data]
    lobby.setPlayers()

}
