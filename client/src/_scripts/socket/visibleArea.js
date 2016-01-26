import world from '../world/world'

export default function (socket, data) {
    if (world.debug) console.log('player/visibleArea', data)

    world.vPlayers = data.vPlayers
    world.map = data.map || world.map

}
