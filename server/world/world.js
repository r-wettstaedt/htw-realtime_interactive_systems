import generator, {printMaze} from './generator'

class World {

    constructor () {
        this.isGameRunning = false

        const maze = generator()
        this.width = maze.width
        this.height = maze.height

        this.map = maze.maze
        this.pointsOfInterest = maze.pointsOfInterest

        this.players = {}

        this.textures = []
        this._events = {}

        this.AIs = {
            needsGolden : true,
            needsPink : true,
        }
    }

    on (name, cb) {
        this._events[name] = cb
    }

    getPlayers (id) {
        if (id)
            return this.players[id]
        return this.players
    }

    addPlayer (id) {
        const sprite = Math.floor(Math.random() * 4)

        let isGameMaster = true
        for (let id of Object.keys(this.players)) {
            if (!this.players[id].isAI) isGameMaster = false
        }

        this.players[id] = {
            id : id,
            posX : this.width,
            posY : this.height,

            texture : {
                dirIndex : 0,
                spritePos : 18,
                sprite : sprite,
            },

            vPlayers : [],
            lvPlayers : [],

            isAI : false,
            isGameMaster : isGameMaster,

            // hasGodMode : true,
        }

        this.getVisibleAreas(id)
    }

    playerArrayContains (players, id) {
        for (let j = 0; j < players.length; j++) {
            if (id === players[j].id) return true
        }
        return false
    }

    removePlayer (id) {
        delete this.players[id]

        for (let id of Object.keys(this.players)) {
            if (!this.players[id].isAI) return false
        }
        return true
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

        if ((player.hasGodMode && !player.isAI) ||
           (posX > 0 && posX < this.width &&
            posY > 0 && posY < this.height && n)) {

            player.prevPosX = player.posX
            player.prevPosY = player.posY
            player.lastUpdate = Date.now()
            player.posX = data.posX
            player.posY = data.posY
            player.dir = data.dir

            if (n === 2) {
                this.isGameRunning = false
                this._events['gameover']({
                    map : this.map,
                    players : this.players
                })
            }

            // if (player.isAI)
            //     printMaze(pos)
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
        if (player.hasGodMode && !player.isAI) return this.getNearbyPlayers(player)

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
                    prevPosX : _player.prevPosX,
                    prevPosY : _player.prevPosY,
                    lastUpdate : _player.lastUpdate,
                    posX : _player.posX,
                    posY : _player.posY,
                    dir : _player.dir,
                    texture : _player.texture,
                    isAI : _player.isAI,
                })
        }
    }


    registerAI (id) {
        const player = this.players[id]
        player.isAI = true
        player.isGameMaster = false

        if (this.AIs.needsGolden) {

            player.texture.sprite = 6
            this.AIs.needsGolden = false

        } else if (this.AIs.needsPink) {

            player.texture.sprite = 5
            this.AIs.needsPink = false

        } else {

            player.texture.sprite = 4

        }

        let posX, posY
        let n = 0
        while (n !== 1) {
            posX = Math.floor(Math.random() * this.width)
            posY = Math.floor(Math.random() * this.height)
            const pos = posY * this.width + posX
            n = this.map[pos]
        }
        player.posX = posX * 2 + 1
        player.posY = posY * 2 + 1
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
    _events : [],

    isGameRunning : function() {
        return this.world.isGameRunning
    },

    on : function() {
        if (!this.world.on)
            return this._events.push(arguments)

        return this.world.on.apply(this.world, arguments)
    },

    createWorld : function () {
        if (this.world.destroy)
            this.world.destroy()
        this.world = new World()
        for (let event of this._events) {
            this.world.on.apply(this.world, event)
        }
        this._events = []
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
        let isEmpty = this.world.removePlayer.apply(this.world, arguments)
        if (isEmpty) {
            console.log('Last player left, restarting game')
            this.createWorld()
        }
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

    registerAI : function() {
        this.world.registerAI.apply(this.world, arguments)
        return this
    },

    playersAsShippable : function () {
        let players = {}
        for (let id of Object.keys(this.world.getPlayers())) {
            players[id] = {
                id : id,
                texture : this.world.players[id].texture,
                isAI : this.world.players[id].isAI,
            }
        }
        return players
    },

    startGame : function() {
        this.world.isGameRunning = true
    },

    asShippable : function () {
        return {
            map : this.world.map,
            width : this.world.width,
            height : this.world.height,
        }
    },
}
