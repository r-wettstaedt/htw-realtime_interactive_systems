import world from '../world/world'
import lobby from '../../_modules/lobby/lobby'

export default function (socket, data) {
    if (world.debug) console.log('gameover', data)

    world.isGameRunning = false
    world.map = data.map
    world.players = data.players
    world.vPlayers = []

    for (let id of Object.keys(data.players)) {
        if (id === world.player.id)
            world.player = data.players[id]
        else
            world.vPlayers.push(data.players[id])
    }

    lobby.endGame()
    setTimeout(lobby.showEndScreen.bind(lobby), 3000)

}
