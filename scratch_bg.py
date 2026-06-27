import zlib, struct, sys

def remove_white_bg(input_path, output_path):
    with open(input_path, 'rb') as f:
        data = f.read()

    pos = 8
    width = height = 0
    color_type = bit_depth = 0
    idat_chunks = []
    header = data[:8]

    while pos < len(data):
        length, chunk_type = struct.unpack('>I4s', data[pos:pos+8])
        chunk_data = data[pos+8:pos+8+length]
        pos += 12 + length

        if chunk_type == b'IHDR':
            width, height, bit_depth, color_type, compression, filter_method, interlace = struct.unpack('>IIBBBBB', chunk_data)
            print(f"Dimensions: {width}x{height}, ColorType: {color_type}, BitDepth: {bit_depth}")
        elif chunk_type == b'IDAT':
            idat_chunks.append(chunk_data)

    if color_type not in (2, 6) or bit_depth != 8:
        print("Unsupported PNG format for manual parsing")
        return False

    raw_data = zlib.decompress(b''.join(idat_chunks))
    bpp = 4 if color_type == 6 else 3
    stride = width * bpp + 1

    new_raw = bytearray()
    
    # Process scanlines
    for y in range(height):
        line_start = y * stride
        filter_byte = raw_data[line_start]
        new_raw.append(filter_byte) # keep filter
        
        for x in range(width):
            px_start = line_start + 1 + x * bpp
            r = raw_data[px_start]
            g = raw_data[px_start+1]
            b = raw_data[px_start+2]
            
            # Check if near white
            if r > 235 and g > 235 and b > 235:
                new_raw.extend([0, 0, 0, 0]) # transparent
            else:
                a = raw_data[px_start+3] if color_type == 6 else 255
                new_raw.extend([r, g, b, a])

    # Re-encode as RGBA PNG (color_type 6)
    new_idat = zlib.compress(bytes(new_raw))
    
    # Build new IHDR (color_type 6)
    new_ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    
    def make_chunk(ctype, cdata):
        crc = zlib.crc32(ctype + cdata) & 0xffffffff
        return struct.pack('>I', len(cdata)) + ctype + cdata + struct.pack('>I', crc)

    with open(output_path, 'wb') as f:
        f.write(b'\x89PNG\r\n\x1a\n')
        f.write(make_chunk(b'IHDR', new_ihdr))
        f.write(make_chunk(b'IDAT', new_idat))
        f.write(make_chunk(b'IEND', b''))
    print("Saved transparent PNG to", output_path)
    return True

remove_white_bg('/Users/aleefconcept/.gemini/antigravity-ide/brain/75897ee7-38d1-461d-9687-1616eb96a72a/vr_hero_ai_builder_transparent_1782545547239.png', 'src/assets/vr_hero_ai_builder_transparent.png')
