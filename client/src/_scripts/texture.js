import gl from './webgl'

export default function initTextures(imageName, imagePath = 'images/') {

    return new Promise( resolve => {

        let neheTexture

        function handleLoadedTexture () {
            gl.bindTexture(gl.TEXTURE_2D, neheTexture)
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, neheTexture.image)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
            gl.bindTexture(gl.TEXTURE_2D, null)
            resolve(neheTexture)
        }

        neheTexture = gl.createTexture()
        neheTexture.image = new Image()
        neheTexture.image.onload = handleLoadedTexture

        neheTexture.image.src = imagePath + imageName

    })
}
