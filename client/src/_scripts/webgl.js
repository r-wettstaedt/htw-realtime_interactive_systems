let canvas = document.getElementById('canvas')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let gl

try {
    gl = canvas.getContext('experimental-webgl')
    gl.viewportWidth = canvas.width
    gl.viewportHeight = canvas.height

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST)
} catch (e) {
    alert('Could not initialise WebGL, sorry :-(');
}

export default gl
