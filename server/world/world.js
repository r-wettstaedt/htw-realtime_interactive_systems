import generator from './generator'

class World {

    constructor () {
        const maze = generator()
        this.width = maze.width
        this.height = maze.height

        this.map = maze.maze

        this.players = {}

        this.textures = []
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
            lvPlayers : [],

            // hasGodMode : true,
        }
    }

    playerArrayContains (players, id) {
        for (let j = 0; j < players.length; j++) {
            if (id === players[j].id) return true
        }
        return false
    }

    removePlayer (id) {
        delete this.players[id]
    }

    setPlayerPosition (id, data) {
        const player = this.players[id]

        if (Math.abs(data.posX - player.posX) > 2 ||
            Math.abs(data.posY - player.posY) > 2) {
            return
        }

        const posX = Math.floor(data.posX / 2)
        const posY = Math.floor(data.posY / 2)
        const pos  = posY * this.width + posX
        const n = this.map[Math.round(pos)]

        if (player.hasGodMode ||
           (posX > 0 && posX < this.width &&
            posY > 0 && posY < this.height && n)) {

            player.posX = data.posX
            player.posY = data.posY
        }
        player.texture.spritePos = data.spritePos
    }

    getVisibleAreas (id) {
        const player = this.players[id]

        const oldVPlayers = new Array(player.vPlayers.length)
        let i = player.vPlayers.length
        while (i--) oldVPlayers[i] = player.vPlayers[i]
        player.vPlayers = []

        this.getPlayerCorridors(player)

        player.lvPlayers = oldVPlayers.filter( vPlayer => {
            return !this.playerArrayContains(player.vPlayers, vPlayer.id)
        })
    }

    getPlayerCorridors (player) {
        if (player.hasGodMode) return this.getNearbyPlayers(player)

        const posX = Math.floor(player.posX / 2)
        const posY = Math.floor(player.posY / 2)

        player.map = new Array(this.map.length)

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
                pPosY === posY) &&
                !this.playerArrayContains(player.vPlayers, _id))

                player.vPlayers.push({
                    id   : _id,
                    posX : _player.posX,
                    posY : _player.posY,
                    spritePos : _player.texture.spritePos,
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
    getVisibleAreas : function() {
        this.world.getVisibleAreas.apply(this.world, arguments)
        return this
    },
    setPlayerPosition : function() {
        this.world.setPlayerPosition.apply(this.world, arguments)
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
