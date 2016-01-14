import gl from './webgl'

export default function initTextures(imageNames, opts = {}) {

    opts.imagePath = opts.imagePath || 'images/'
    let textures  = []
    let callbacks = 0

    function handleSpriteSheet (image) {
        const canvas1 = document.createElement('canvas')
        const canvas2 = document.createElement('canvas')

        canvas1.width = image.width
        canvas1.height = image.height

        canvas2.width = opts.size
        canvas2.height = opts.size

        document.body.appendChild(canvas1)
        document.body.appendChild(canvas2)

        const ctx1 = canvas1.getContext('2d')
        const ctx2 = canvas2.getContext('2d')

        ctx1.drawImage(image, 1, 1)

        let posX = 0
        let posY = 0
        let imageDatas = []

        while (posX <= image.width - opts.size && posY <= image.height - opts.size) {
            const data = ctx1.getImageData(posX, posY, opts.size, opts.size)
            ctx2.putImageData(data, 1, 1)
            imageDatas.push(canvas2.toDataURL())

            posX += opts.size
            if (posX >= image.width) {
                posX =  0
                posY += opts.size
            }
        }

        return Promise.resolve(imageDatas)
    }

    function loadImage (imageName) {
        return new Promise( resolve => {
            const image = new Image()
            image.onload = () => { resolve(image) }
            let dataImg = imageName.startsWith('data:')
            image.src = dataImg ? imageName : opts.imagePath + imageName
        })
    }

    function prepareImage (imageName, index) {
        return new Promise( resolve => {
            if (opts.size) {
                return loadImage.apply(null, arguments).then( image => {
                    return handleSpriteSheet(image)
                }).then( imageDatas => {
                    imageNames[index] = imageDatas
                    return Promise.all(imageDatas.map(loadImage))
                }).then( images => {
                    return Promise.all(images.map( (image, i) => {
                        textures[index] = {}
                        textures[index][i] = gl.createTexture()
                        textures[index][i].image = image
                        bindTexture(textures[index][i])
                        return Promise.resolve(textures[index][i])
                    }))
                }).then( textures => {
                    resolve(textures)
                }).catch( err => {
                    console.error(err)
                })
            }
            loadImage.apply(null, arguments)
            .then( image => {
                textures[index] = gl.createTexture()
                textures[index].image = image
                bindTexture(textures[index])
                resolve(textures[index])
            })
        })
    }

    function bindTexture (texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.bindTexture(gl.TEXTURE_2D, null)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        gl.enable(gl.BLEND)
    }

    return new Promise( resolve => {
        Promise.all(imageNames.map(prepareImage)).then( data => {
            resolve(data)
        })
    })

}
