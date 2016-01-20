import gl from '../webgl'
import buffer from '../buffer'
import shaderProgram from '../shaders'
import texture from '../texture'
import {degToRad, stack} from '../util'
import world from '../world/world'
const mat4 = require('./../../../node_modules/gl-matrix/src/gl-matrix.js').mat4

let neheTextures

texture(['castleCenter.png', 'grassCenter.png', 'boxCoin.png']).then( textures => {neheTextures = textures })

export default function draw(mvMatrix, pMatrix, pressedKeys) {
    let startPosX = - world.player.posX - 1
    let startPosY = - world.player.posY - 0.5

    let posX = startPosX - 2
    let posY = startPosY
    let posZ = -20

    let str = []

    for (let index = 0; index < world.map.length; index++) {
        let m = world.map[index]

        if (index % world.width === 0) {
            posX = startPosX
            posY+= 2
        }
        posX += 2
        if (m === null) continue

        stack.push(mvMatrix)

        if (m) {
            mat4.translate(mvMatrix, mvMatrix, [posX, -posY, posZ])

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer.cube.vertexPositionBuffer)
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffer.cube.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)
        } else {
            mat4.translate(mvMatrix, mvMatrix, [posX, -posY, posZ + 2])

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

        let length = Math.sqrt(Math.pow(posX, 2) + Math.pow(posY, 2))
        let brightness = 1 - (length * 0.1)
        if (brightness < 0.05) brightness = 0.05

        gl.uniform1f(shaderProgram.brightnessUniform, brightness)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.cube.vertexIndexBuffer)
        gl.setMatrixUniforms(mvMatrix, pMatrix)
        gl.drawElements(gl.TRIANGLES, buffer.cube.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0)

        stack.pop(mvMatrix)

    }

}
