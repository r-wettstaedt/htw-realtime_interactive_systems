import world from '../world/world'
import loop from '../loop'

export default function (socket, data) {
    if (world.debug) console.log('gamestart')

    setTimeout(() => {
        world.isGameRunning = true
        loop()
    }, 3000)


}
