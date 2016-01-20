import gl from '../webgl'
import buffer from '../buffer'
import shaderProgram from '../shaders'
import texture from '../texture'
import {degToRad, stack} from '../util'
import world from '../world/world'
const mat4 = require('./../../../node_modules/gl-matrix/src/gl-matrix.js').mat4

let neheTextures
let skippedFrames = Number.MAX_SAFE_INTEGER - 50

texture(['BODY_male.png'], {size : 64}).then( textures => { neheTextures = textures })

export default function draw (mvMatrix, pMatrix, pressedKeys) {

    stack.push(mvMatrix)

    mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -18.5])

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.plane.vertexPositionBuffer)
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffer.plane.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.plane.vertexTextureCoordBuffer)
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, buffer.plane.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0)

    gl.activeTexture(gl.TEXTURE0)
    if (neheTextures) {
        if (pressedKeys.asIndex >= 0 && ++skippedFrames >= 4) {
            skippedFrames = 0
            world.player.texture.dirIndex = (world.player.texture.dirIndex + 1) % 9
            world.player.texture.spritePos = world.player.texture.dirIndex + (pressedKeys.asIndex * 9)

            console.log(world.player)
        }

        gl.bindTexture(gl.TEXTURE_2D, neheTextures[0][world.player.texture.spritePos])
    }

    gl.uniform1i(shaderProgram.samplerUniform, 0)
    gl.uniform1f(shaderProgram.brightnessUniform, 1.0)

    gl.setMatrixUniforms(mvMatrix, pMatrix)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffer.plane.vertexPositionBuffer.numItems)

    stack.pop(mvMatrix)

    for (let index = 0; index < world.vPlayers.length; index++) {
        stack.push(mvMatrix)
        let vPlayer = world.vPlayers[index]
        let v = {
            posX : vPlayer.posX,
            posY : vPlayer.posY,
            X : vPlayer.posX - world.player.posX,
            Y : world.player.posY - vPlayer.posY,
        }

        mat4.translate(mvMatrix, mvMatrix, [
            v.X,
            v.Y,
            -18.5
        ])

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.plane.vertexPositionBuffer)
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffer.plane.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.plane.vertexTextureCoordBuffer)
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, buffer.plane.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0)

        gl.activeTexture(gl.TEXTURE0)
        if (neheTextures) {
            gl.bindTexture(gl.TEXTURE_2D, neheTextures[0][vPlayer.spritePos])
        }

        gl.uniform1i(shaderProgram.samplerUniform, 0)

        let length = Math.sqrt(Math.pow(v.X, 2) + Math.pow(v.Y, 2))
        let brightness = 1 - (length * 0.1)
        if (brightness < 0.05) brightness = 0.05

        gl.uniform1f(shaderProgram.brightnessUniform, brightness)

        gl.setMatrixUniforms(mvMatrix, pMatrix)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffer.plane.vertexPositionBuffer.numItems)

        stack.pop(mvMatrix)
    }
}
