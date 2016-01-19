import generator from './generator'

class World {

    constructor () {
        const maze = generator()
        this.width = maze.width
        this.height = maze.height

        this.map = maze.maze

        this.players = {}
    }

    getPlayers (id) {
        if (id)
            return this.players[id]
        return this.players
    }

    addPlayer (id) {
        this.players[id] = {
            id : id,
            posX : this.width,
            posY : this.height,

            texture : {
                dirIndex : 0,
                spritePos : 18,
            },

            vPlayers : [],

            // hasGodMode : true,
        }
    }

    removePlayer (id) {
        delete this.players[id]
    }

    setPlayerPosition (id, data) {
        const player = this.players[id]
        const posX = Math.floor(data.posX / 2)
        const posY = Math.floor(data.posY / 2)
        const pos  = posY * this.width + posX
        const n = this.map[Math.round(pos)]

        if (player.hasGodMode ||
            (posX > 0 && posX < this.width &&
            posY > 0 && posY < this.height &&
            this.map[Math.round(pos)])) {

            player.posX = data.posX
            player.posY = data.posY
        }
        player.spritePos = data.spritePos

        if (player.hasGodMode) this.getNearbyPlayers(player)
        else this.setPlayerCorridors(id)
    }

    setPlayerCorridors(id) {
        const player = this.players[id]
        const posX = Math.floor(player.posX / 2)
        const posY = Math.floor(player.posY / 2)

        player.map = new Array(this.map.length)
        player.vPlayers = []

        for (let x = posX; x < this.width; x++) {
            let pos = posY * this.width + x
            player.map[pos] = this.map[pos]

            this.getNearbyPlayers(player, x, posY)
            if (!this.map[pos]) break

            pos = (posY + 1) * this.width + x
            player.map[pos] = this.map[pos]
            pos = (posY - 1) * this.width + x
            player.map[pos] = this.map[pos]
        }
        for (let x = posX; x >= 0; x--) {
            let pos = posY * this.width + x
            player.map[pos] = this.map[pos]

            this.getNearbyPlayers(player, x, posY)
            if (!this.map[pos]) break

            pos = (posY + 1) * this.width + x
            player.map[pos] = this.map[pos]
            pos = (posY - 1) * this.width + x
            player.map[pos] = this.map[pos]
        }

        for (let y = posY; y < this.height; y++) {
            let pos = y * this.width + posX
            player.map[pos] = this.map[pos]

            this.getNearbyPlayers(player, posX, y)
            if (!this.map[pos]) break

            pos = y * this.width + (posX + 1)
            player.map[pos] = this.map[pos]
            pos = y * this.width + (posX - 1)
            player.map[pos] = this.map[pos]
        }
        for (let y = posY; y >= 0; y--) {
            let pos = y * this.width + posX
            player.map[pos] = this.map[pos]

            this.getNearbyPlayers(player, posX, y)
            if (!this.map[pos]) break

            pos = y * this.width + (posX + 1)
            player.map[pos] = this.map[pos]
            pos = y * this.width + (posX - 1)
            player.map[pos] = this.map[pos]
        }

        const positions = [
            (posY + 1) * this.width + (posX + 1),
            (posY - 1) * this.width + (posX + 1),
            (posY + 1) * this.width + (posX - 1),
            (posY - 1) * this.width + (posX - 1)
        ]
        for (let pos of positions) {
            player.map[pos] = this.map[pos]
        }
    }

    getNearbyPlayers (player, posX, posY) {
        let ids = Object.keys(this.players)

        for (let _id of ids) {
            if (_id === player.id) continue
            let _player = this.players[_id]
            let pPosX = Math.floor(_player.posX / 2)
            let pPosY = Math.floor(_player.posY / 2)

            if (player.hasGodMode ||
                (pPosX === posX &&
                pPosY === posY))

                player.vPlayers.push({
                    id   : _id,
                    posX : _player.posX,
                    posY : _player.posY,
                    spritePos : _player.spritePos,
                })
        }
    }


    destroy () {
        this.width = null
        this.height = null
        this.map = null
        this.players = null
    }

}



export default {
    world : {},

    createWorld : function () {
        if (this.world.destroy)
            this.world.destroy()
        this.world = new World()
        return this
    },

    getPlayers : function() {
        return this.world.getPlayers.apply(this.world, arguments)
    },
    addPlayer : function () {
        this.world.addPlayer.apply(this.world, arguments)
        return this
    },
    removePlayer : function () {
        this.world.removePlayer.apply(this.world, arguments)
        return this
    },
    setPlayerPosition : function() {
        this.world.setPlayerPosition.apply(this.world, arguments)
        return this
    },
    getNearbyPlayers : function() {
        this.world.getNearbyPlayers.apply(this.world, arguments)
        return this
    },

    asShippable : function () {
        return {
            map : this.world.map,
            width : this.world.width,
            height : this.world.height,
        }
    },
}
