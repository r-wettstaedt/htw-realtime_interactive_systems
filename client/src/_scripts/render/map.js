import gl from '../webgl'
import buffer from '../buffer'
import shaderProgram from '../shaders'
import texture from '../texture'
import {degToRad, stack} from '../util'
import map from '../world/world'
const mat4 = require('./../../../node_modules/gl-matrix/src/gl-matrix.js').mat4

let neheTextures

texture(['castleCenter.png', 'grassCenter.png']).then( textures => { neheTextures = textures })

let xRot = 0
let yRot = 0
let zRot = 0

export default function draw(mvMatrix, pMatrix, pressedKeys) {

    if (pressedKeys.W) map.player.posY+=0.15
    if (pressedKeys.S) map.player.posY-=0.15
    if (pressedKeys.D) map.player.posX-=0.15
    if (pressedKeys.A) map.player.posX+=0.15

    let startPosX = -map.width * 1.2 + map.player.posX
    let startPosY = -map.height + map.player.posY

    let posX = startPosX
    let posY = startPosY
    let posZ = -20

    map.array.map((m, index) => {

        if (index % map.width === 0) {
            posX = startPosX
            posY+= 2
        }

        stack.push(mvMatrix)

        if (m) {
            mat4.translate(mvMatrix, mvMatrix, [posX+=2, -posY, posZ])

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer.cube.vertexPositionBuffer)
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffer.cube.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)
        } else {
            mat4.translate(mvMatrix, mvMatrix, [posX+=2, -posY, posZ + 2])

            mat4.rotate(mvMatrix, mvMatrix, degToRad(90), [1, 0, 0])
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer.cuboid.vertexPositionBuffer)
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffer.cuboid.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.cube.vertexTextureCoordBuffer)
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, buffer.cube.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0)

        gl.activeTexture(gl.TEXTURE0)
        if (neheTextures)
            gl.bindTexture(gl.TEXTURE_2D, neheTextures[m])
        gl.uniform1i(shaderProgram.samplerUniform, 0)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.cube.vertexIndexBuffer)
        gl.setMatrixUniforms(mvMatrix, pMatrix)
        gl.drawElements(gl.TRIANGLES, buffer.cube.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0)

        stack.pop(mvMatrix)

    })

}
