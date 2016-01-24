import texture from './texture'
import mat from './../../node_modules/gl-matrix/src/gl-matrix.js'
let mat4 = mat.mat4


export function degToRad (deg) {
    return deg * Math.PI / 180
}

export const stack = {

    stack : [],

    set : (a, b) => {
        b.map( (q, index) => {
            a[index] = q
        })
    },

    push : function (mvMatrix) {
        const copy = mat4.create()
        this.set(mvMatrix, copy)
        this.stack.push(mvMatrix)
    },

    pop : function (mvMatrix) {
        this.set(mvMatrix, this.stack.pop())
    },
}

export const textures = {
    players : null,
    world : null,
}

export function initTextures () {

    texture([
        'sprite_blonde.png',
        'sprite_hunter.png',
        'sprite_monk.png',
        'sprite_skeleton.png',
        'sprite_bunny.png',
        'sprite_bunny_pink.png',
        'sprite_bunny_gold.png',
        ], {size : 64})
    .then( pTextures => { textures.players = pTextures })


    texture([
        'castleCenter.png',
        'grassCenter.png',
        'boxCoin.png',
        'bg_castle.png'
        ])
    .then( wTextures => {textures.world = wTextures })
}
