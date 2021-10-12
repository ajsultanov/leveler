
// const png = require('xyz.png')
// png.open('', 'w')

const calc = (() => {
    console.log('its ya boi')

    // let sum = 0
    // for (let i = 0; i<256;i++) {
    //     sum += i*i
    // }
    // console.log(sum.toString(10))
})()

const initMessage = 'lorem ipsum dolor sit amet'
const fileTypes = [
    'image/bmp',
    'image/gif',
    'image/png'
]
const fakeThroughput = () => {
    // this is what you want to get from a the png
    // a matrix, basically
    return [
        [1,1,1,1,1,1,1,1],
        [1,0,5,0,0,0,0,1],  // remove 0s?
        [1,2,2,2,2,0,2,1],
        [1,0,0,3,0,0,0,1],
        [1,4,0,0,0,4,4,1],
        [1,1,6,7,6,8,8,1],
        [1,1,1,6,8,8,8,1],
        [1,1,1,1,1,1,1,1]
    ]
}

const form = document.querySelector('form')
const input = document.querySelector('input')
const preview = document.querySelector('.preview')
const reset = document.querySelector('.reset')
const show = document.querySelector('.show')
const submit = document.querySelector('#submit')

input.style.opacity = 0

input.addEventListener('change', updateImgPre)
reset.addEventListener('click', clearImgPre)
show.addEventListener('click', e => showImgPath(e))
form.addEventListener('submit', e => submitImg(e))
const image = document.createElement('img')

function clearPreview() {
    // get rid of stuff in pre
    while(preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }
}

function updateImgPre() {
    const file = input.files[0]
    if (file?.type) {

        // display name, size, type, and preview
        const para = document.createElement('p')
        const list = document.createElement('ul')
    
        clearPreview()
        
        if (validFileType(file)) {
            para.textContent = 'yes! file info:'
            let name = document.createElement('li')
            name.textContent = `filename: ${file.name}`
            list.appendChild(name)
            let size = document.createElement('li')
            size.textContent = `file size: ${returnFileSize(file)}`
            list.appendChild(size)
            let type = document.createElement('li')
            type.textContent = `filetype: ${file.type}`
            list.appendChild(type)
            
            image.src = URL.createObjectURL(file)
            image.className = 'thumbnail'
        } else {
            para.textContent = `${file.name} is not a valid filetype, please choose bmp, gif, or png`
        }
        preview.appendChild(para)
        preview.appendChild(list)
        preview.appendChild(image)

        // validFileType func
        //  file = good, 
        //      print file name and size into an li
        //      generate thumbnail with URL.createObjectURL
        //          create new img
        //          set src to thumbnail url
        //  file = no good, print message in pre
        function validFileType(file) {
            return fileTypes.includes(file.type)
        }
        
        function returnFileSize(file) {
            let size = file.size ? file.size : 0
            if (size < 1024) {
                return `${size} bytes`
            } else if (size >= 1048576) {
                return `${(size/1048576).toFixed(2)} mb`
            } else {
                return `${(size/1024).toFixed(2)} kb`
            }
        }
    }
}// updateImagePre

function clearImgPre() {
    clearPreview()
    const para = document.createElement('p')
    para.textContent = 'no files currently selected for upload'
    preview.appendChild(para)
}
function showImgPath(e) {
    e.preventDefault()
    const filename = input.files[0] ? input.files[0].name : 'none'
    show.textContent = filename
    setTimeout(() => {
        show.textContent = 'check file'
    }, 1000)
}

async function submitImg(e) {
    e.preventDefault()
    const file = input.files[0] || 'none'
    if (file === 'none') return
    const arrayBuffer = await file.arrayBuffer()
    const rawPNG = new Uint8Array(arrayBuffer)
    const chunks = rawPNG.slice(8)
    
    // const img = document.getElementById('my-img')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    canvas.width = image.width * 2
    canvas.height = image.height * 2
    // ctx.drawImage(image, 0, 0, image.width * 2, image.height * 2)
    
    let pixelArr = []
    for (let i = 0; i < image.height; i++) {
        pixelArr.push(new Array(image.width))
    }

    const pixelData = ctx.getImageData(0, 0, image.width, image.height)
    let pixels = []
    for (let i = 0; i < image.height; i++) {
        for (let j = 0; j < image.width; j++) {
            let rgba = ctx.getImageData(j, i, 1, 1).data
            pixelArr[i][j] = rgbToHex(rgba)
        }
    }

    function rgbToHex(quad) {
        let color = ''
        for (let i = 0; i < 4; i++) {
            let hex = quad[i].toString(16)
            if (hex.length === 1) color += '0'
            color += hex
        }
        if (color.slice(6) === '00') return '#ffffff'
        return '#' + color.slice(0, 6)
    }
    console.log(pixelArr)

    const rgbIndex = {
        '#000000': 0,
        '#800000': 1,
        '#804000': 2,
        '#808000': 3,
        '#008000': 4,
        '#008080': 5,
        '#0000ff': 6,
        '#8000ff': 7,
        '#ffffff': 8,
        '#ff0000': 9,
        '#ff8000': 10,
        '#ffff00': 11,
        '#00ff00': 12,
        '#00ffff': 13,
        '#0080ff': 14,
        '#ff00ff': 15
    }
    function getColorByIndex(index, value) {
        return Object.keys(index).find(key => index[key] === value)
      }

    let index = {}
    for (let i = 0; i < pixelArr.length; i++) {
        for (let j = 0; j < pixelArr[i].length; j++) {
            if (index[rgbIndex[pixelArr[i][j]]] === undefined) {
                index[rgbIndex[pixelArr[i][j]]] = [[i, j]]
            } else {
                index[rgbIndex[pixelArr[i][j]]].push([i, j])
            }
            // ctx.drawImage(image, i*2, j*2, 2, 2)
            // ctx.fillRect(i, j, 10, 10)

        }
    }
    console.log(index)
    paint.appendChild(image)


}





