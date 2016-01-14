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
