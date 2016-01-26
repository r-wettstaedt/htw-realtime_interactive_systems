import world from '../world/world'
import lobby from '../../_modules/lobby/lobby'

// visible player
export function vPlayer (socket, data) {
    if (world.debug) console.log('vPlayer', data)

    let contains = false
    for (let index = 0; index < world.vPlayers.length; index++) {
        if (world.vPlayers[index].id === data.id) {
            contains = true
            world.vPlayers[index] = data
            break
        }
    }
    if (!contains) world.vPlayers.push(data)

}

// lost vision player
export function lvPlayer (socket, data) {
    if (world.debug) console.log('lvPlayer', data)

    for (let i = 0; i < world.vPlayers.length; i++) {
        if (world.vPlayers[i].id === data) {
            world.vPlayers.splice(i, 1)
            break
        }
    }

}
