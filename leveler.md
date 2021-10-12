> http://www.libpng.org/pub/png/book/toc.html
 
'89 50 4e 47 0d 0a 1a 0a' is PNG file signature:
89 - 137- byte with most significant bit set?
    detects transmission over 7-bit channel...
50 - 80 - P
4e - 78 - N
47 - 71 - G
0d - 13 - carriage-return (ctrl-m)
0a - 10 - line-feed (ctrl-j)
1a - 26 - ctrl-z
0a - 10 - line-feed (ctrl-j)

chunks are:
    a 4-byte length (big-endian),
    a 4-byte chunk type,
    between 0 - 2147483647 bytes of data,
    a 4-byte crc

chunk types:
    line up with ASCII upper and lower case
    generally mnemonic
    1st character case bit (bit 5)
        A - critical, or a - ancillary
    2nd character case bit 
        A - public, or a - private
    3rd character case bit res for future use
        should be uppercase
    4th character case bit, for image editors 
        A - not safe to copy unknown ancillary chunk

smallest possible PNG:
8-byte signature
IHDR    image header chunk
        height, width, pixel depth, compression, filtering, interlacing, alpha, truecolor/grayscale/colormapped
IDAT    data chunk
        compressed data usu split into multiple
IEND    end-of-image chunk
        contains no data

palette-based images require PLTE chunk, before IDAT
    rgb triplets:
    1-bit pixel depth - 2 max palette entries
    2-bit pixel depth - 4 max palette entries
    4-bit pixel depth - 16 max palette entries
    16-bit pixel depth - 256 max palette entries

tRNS - transparency chunk, analogous to PLTE, can contain as many trans entries as palette entries
comes after PLTE and before IDAT
turns rgb lookup table to rgba table

grayscale pixel depths of 1, 2, 4, 8, and 16-bits
8 and 16 can have alpha channel of same size

truecolor rgb pngs only in 8- and 16-bit depths (24 or 48 bits per pixel)

rgba supports 8 and 16 bits per sample (32 or 64 bits per pixel)




MDN Transforming PNG to grayscale:

class GrayscalePNGTransformer

@param {Uint8Array} ?
@param {TransformStreamDefaultController} ?

method transform (chunk, controller)

position and length of chunk
buffer = Uint8Array
source = DataView(chunk.buffer)
target = DataView(buffer.buffer)

while loop:
    switch (this._mode) ?
        'magic' ??
        'header': 
            read chunk info
            read image dimensions
        'data':
            read chunk info
            extract data from PNG stream
            decompress with pako.js
            remove PNG filters from each scanline
            grayscale image
            compress again
            write data to target
        'end': write IEND chunk

@param {DataView} ?
@param {number} x2 ?
method readString (dataView, position, length)

@param {DataView} ?
@param {number} ?
@param {string} ?
method writeString (dataView, position, string)

@param {number} ?
@param {string} ?
method colorType (number)
    switch (number)
        0   grayscale
        2   rgb
        3   palette
        4   grayscale-alpha
        6   rgb-alpha

@return {number} ?
method bytesPerPixel ()
    byteDepth = this._bitDepth / 8
    if
        grayscale           byteDepth
        rgb                 byteDepth *= 3
        palette             byteDepth
        grayscale-alpha     byteDepth *= 2
        rgb-alpha           ?
    return byteDepth *= 4

method removeFilters (src, bytesPerCol, bytesPerRow)
    ...yike

method grayscale (src, bytesPerCol, bytesPerRow)


