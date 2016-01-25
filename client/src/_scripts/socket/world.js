import world from '../world/world'

export default function(io, url) {
    const _world = io.connect(`http://${url}/ris/world`)

    _world.on('connect', () => {
        if (world.debug) console.log('world/connection')

        // _world.emit('request')

        // _world.on('world', data => {
        //     if (world.debug) console.log('world/world')
        //     let str = []
        //     for (let i = 0; i < data.map.length; i++) {
        //         if (i % (data.width) === 0) str.push('\n')
        //         str.push(data.map[i] ? 'x' : '-')
        //     }
        //     if (world.debug) console.log(data)
        //     if (world.debug) console.log(str.join(' '))

        //     world.map = data.map
        //     world.width = data.width
        //     world.height = data.height

        //     world.player.posX = Math.round(data.width)
        //     world.player.posY = Math.round(data.height)
        // })

        _world.on('gameover', data => {
            if (world.debug) console.log('world/gameover', data)
            world.isGameRunning = false
            setTimeout(() => {
                world.map = data.map,
                world.vPlayers = data.players
            }, 3000);
        })
    })


    return _world
}
