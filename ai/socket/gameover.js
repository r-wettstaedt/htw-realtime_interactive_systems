import world from '../world/world'

export default function (socket, data) {
    if (world.debug) console.log('gameover', data)

    world.isGameRunning = false

}
