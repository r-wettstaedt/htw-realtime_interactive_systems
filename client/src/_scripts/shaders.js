import gl from './webgl'

let fs = require('../_data/shader.fs')
let vs = require('../_data/shader.vs')

function getShader(shaderStr, type) {
    let shader = gl.createShader(gl[type])

    gl.shaderSource(shader, shaderStr)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader))
        return null
    }

    return shader
}


let fragmentShader = getShader(fs(), 'FRAGMENT_SHADER')
let vertexShader = getShader(vs(), 'VERTEX_SHADER')

let shaderProgram = gl.createProgram()
gl.attachShader(shaderProgram, fragmentShader)
gl.attachShader(shaderProgram, vertexShader)
gl.linkProgram(shaderProgram)

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('Could not initialise shaders')
}

gl.useProgram(shaderProgram)

shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute)

shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, 'aTextureCoord')
gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute)

shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix')
shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix')
shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, 'uSampler')

gl.setMatrixUniforms = function (mvMatrix, pMatrix) {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix)
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix)
}

export default shaderProgram
