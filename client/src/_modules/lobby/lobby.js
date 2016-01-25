import world from '../../_scripts/world/world'
import {textures} from '../../_scripts/util'

export default {

    $el : document.querySelectorAll('.lobby')[0],
    $list : document.querySelectorAll('.lobby__players')[0],
    $template : document.querySelectorAll('.lobby__player-item.hidden')[0],
    $btn : document.querySelectorAll('.lobby__btn')[0],
    $msg : document.querySelectorAll('.lobby__msg')[0],

    setPlayer : function (id, isMe) {
        let player = world.players[id]
        if (player.isAI) return

        const $clone = this.$template.cloneNode(true)
        const $icons = $clone.querySelectorAll('.lobby__player-icon')
        $clone.className = 'lobby__player-item'

        if (isMe) {
            $clone.className += ` ${$clone.className}--self`
        } else {
            $icons[1].remove()
        }

        if (!player.isGameMaster) {
            $icons[0].remove()
        }

        let $img = $clone.children[0]
        let t = textures
        if (t.players) {
            $img.src = t.players[player.texture.sprite][player.texture.spritePos].image.src
        } else {
            setTimeout(this.setPlayers.bind(this), 1000)
        }

        this.$list.appendChild($clone)
    },

    setPlayers : function () {
        this.$list.innerHTML = ''

        this.setPlayer(world.player.id, true)

        for (let id of Object.keys(world.players)) {
            if (id !== world.player.id) this.setPlayer(id)
        }
    },

    initBtn : function() {
        return new Promise( resolve => {
            this.$btn.className = 'lobby__btn'
            this.$btn.onclick = event => {
                event.preventDefault()
                resolve()
                this.$msg.innerHTML = 'Starting game..'
            }
        })
    },

    startGame : function() {
        return new Promise( resolve => {
            let i = 3
            this.$msg.className += ` ${this.$msg.className}--counting`
            const interval = setInterval(() => {
                this.$msg.innerHTML = i

                if (!i--) {
                    clearInterval(interval)
                    this.$el.className += ' hidden'
                    resolve()
                }
            }, 1000)
        })
    },

    endGame : function() {
        this.$msg.innerHTML = 'Game over'
        this.$msg.className = 'lobby__msg lobby__msg--panel'
        this.$list.className += ' hidden'
        this.$btn.className += ' hidden'
        this.$el.className = 'lobby'
    }

}
