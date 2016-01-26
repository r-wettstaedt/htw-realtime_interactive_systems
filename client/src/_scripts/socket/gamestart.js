import world from '../world/world'
import lobby from '../../_modules/lobby/lobby'
import loop from '../loop'

export default function (socket, data) {
    if (world.debug) console.log('gamestart')

    lobby.startGame().then(() => {
        world.isGameRunning = true
        loop()
    })

}
