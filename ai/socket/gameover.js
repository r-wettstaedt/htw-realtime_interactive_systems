import world from '../world/world'

export default function (socket, data) {
    if (world.debug) console.log('gameover')

    world.isGameRunning = false

}
