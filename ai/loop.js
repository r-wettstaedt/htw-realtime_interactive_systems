import world from './world/world'

function getDirections () {
    const pPosX = Math.floor(world.player.posX / 2)
    const pPosY = Math.floor(world.player.posY / 2)
    let dirs = [{
        posX : world.player.posX, pPosX : pPosX,
        posY : world.player.posY - 2.0, pPosY : pPosY - 1.0,
        dir : 0,
    }, {
        posX : world.player.posX - 2.0, pPosX : pPosX - 1.0,
        posY : world.player.posY, pPosY : pPosY,
        dir : 1,
    }, {
        posX : world.player.posX, pPosX : pPosX,
        posY : world.player.posY + 2.0, pPosY : pPosY + 1.0,
        dir : 2,
    }, {
        posX : world.player.posX + 2.0, pPosX : pPosX + 1.0,
        posY : world.player.posY, pPosY : pPosY,
        dir : 3,
    }]

    return dirs
}

function getAvailablePaths (dirs) {
    let _dirs = dirs.slice(0)
    for (let i = 0; i < _dirs.length; i++) {
        const dir  = _dirs[i]
        dir.pos = dir.pPosY * world.width + dir.pPosX
        dir.n = world.map[Math.round(dir.pos)]

        if (dir.n !== 1) _dirs.splice(i--, 1)
    }

    return _dirs
}

function runAway (dirs, aDirs) {
    const pPosX = Math.floor(world.player.posX / 2)
    const pPosY = Math.floor(world.player.posY / 2)

    const vpPosX = Math.floor(world.vPlayers[0].posX / 2)
    const vpPosY = Math.floor(world.vPlayers[0].posY / 2)

    const v = {
        x : world.player.posX - world.vPlayers[0].posX,
        y : world.player.posY - world.vPlayers[0].posY,
    }
    const length = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2))

    for (let i = 0; i < aDirs.length; i++) {
        const dir = aDirs[i]
        const _v = {
            x : dir.posX - world.vPlayers[0].posX,
            y : dir.posY - world.vPlayers[0].posY,
        }
        const _length = Math.sqrt(Math.pow(_v.x, 2) + Math.pow(_v.y, 2))

        if (_length < length) aDirs.splice(i--, 1)
    }

    return aDirs[Math.floor(Math.random() * aDirs.length)]
}

function runRandomly (dirs, aDirs, lastDir) {

    const r = Math.random()
    for (let i = 0; i < aDirs.length; i++) {
        const dir = aDirs[i]

        if (lastDir.dir === dir.dir && r > 0.75) {
            // 66% chance to walk in the same direction as before
            aDirs = [dir]
            break
        }
    }
    return aDirs[Math.floor(Math.random() * aDirs.length)]
}

export default function loop(lastDir = {}) {
    let dirs = getDirections()
    let aDirs = getAvailablePaths(dirs)
    let dir
    let timeout

    if (world.vPlayers.length && !world.player.hasGodMode) {
        dir = runAway(dirs, aDirs)
        timeout = 500
    } else {
        dir = runRandomly(dirs, aDirs, lastDir)
        timeout = 1000
    }

    if (dir) world.updatePos(dir.posX, dir.posY, dir.dir)
    lastDir = dir

    setTimeout(() => {
        loop(dir)
    }, timeout)
}
