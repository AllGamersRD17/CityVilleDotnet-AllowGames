import zlib, struct
from PIL import Image
def read(path):
    d=open(path,'rb').read(); sig=d[:3]; ver=d[3]
    if sig==b'CWS':
        body = zlib.decompress(d[8:])
    elif sig==b'ZWS':
        import lzma, struct as _s
        props=d[12:17]; ulen=_s.unpack('<I',d[4:8])[0]-8
        body = lzma.LZMADecompressor(lzma.FORMAT_ALONE).decompress(props+_s.pack('<Q',ulen)+d[17:])
    else:
        body = d[8:]
    return ver, body
def split(body):
    nbits=body[0]>>3; rect=(5+4*nbits+7)//8; hdr=body[:rect+4]; p=rect+4; tags=[]
    while p<len(body):
        h=struct.unpack('<H',body[p:p+2])[0]; code=h>>6; ln=h&63; q=p+2
        if ln==63: ln=struct.unpack('<I',body[q:q+4])[0]; q+=4
        tags.append([code, body[q:q+ln]]); p=q+ln
        if code==0: break
    return hdr, tags
def lossless2(cid, im):
    im=im.convert('RGBA'); w,h=im.size; px=im.tobytes(); out=bytearray(w*h*4)
    for i in range(w*h):
        r,g,b,a=px[i*4:i*4+4]
        out[i*4:i*4+4]=bytes((a, r*a//255, g*a//255, b*a//255))   # ARGB premultiplicado
    return struct.pack('<HBHH',cid,5,w,h)+zlib.compress(bytes(out),9)
def tagbytes(code,data):
    return struct.pack('<HI',(code<<6)|63,len(data))+data
def cid_of(code,data):
    return struct.unpack('<H',data[:2])[0] if code in (6,20,21,35,36,90) else None
def patch(src, dst, repl):
    ver, body = read(src); hdr, tags = split(body); done=set()
    out=bytearray(hdr)
    for code,data in tags:
        cid=cid_of(code,data)
        if cid in repl:
            out+=tagbytes(36, lossless2(cid, repl[cid])); done.add(cid)
        else:
            out+=tagbytes(code,data) if len(data)>=63 or code in (6,20,21,35,36,90) else struct.pack('<H',(code<<6)|len(data))+data
    missing=set(repl)-done
    assert not missing, missing
    full=b'FWS'+bytes([ver])+struct.pack('<I',8+len(out))+bytes(out)
    comp=b'CWS'+full[3:8]+zlib.compress(full[8:],9)
    open(dst,'wb').write(comp)
    return dict((c, [t for t,d in tags if cid_of(t,d)==c][0]) for c in repl)
