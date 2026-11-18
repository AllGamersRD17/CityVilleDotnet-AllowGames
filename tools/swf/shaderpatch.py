import sys,struct,zlib
sys.path.insert(0,'/home/claude/hudfix'); sys.path.insert(0,'/home/claude/swfx')
from abcp import ABC,ru,wu
from swfpatch import read, split, tagbytes
src,dst=sys.argv[1:3]
ver,body=read(src); hdr,tags=split(body); out=bytearray(hdr); done=False
def ops_with_idx(a,b,cs,cl):
    # returns list of (offset, opcode, [operands]) using dis table
    from dis import OPS
    c=b[cs:cs+cl]; p=0; res=[]
    while p<len(c):
        op=c[p]; st=p; p+=1; name,fmt=OPS.get(op,('?',''))
        args=[]
        for f in fmt:
            if f=='b': args.append(c[p]); p+=1
            elif f=='s': args.append(int.from_bytes(c[p:p+3],'little',signed=True)); p+=3
            elif f=='L': raise Exception('switch')
            else: v,p=ru(c,p); args.append(v)
        res.append((st,name,args))
    return res
for code,data in tags:
    if code==82 and not done:
        e=data.index(b'\0',4); b=data[e+1:]; a=ABC(b)
        idx=[i for i,x in enumerate(a.inst) if a.mname(x[0])=='Processor']
        if not idx: out+=tagbytes(code,data); continue
        P=a.inst[idx[0]]; meth=[t for t in P[3] if a.mname(t[0])=='doShaderJob'][0][2][2]
        bd=a.bodies[meth]; cs,cl=bd['code']
        ins=ops_with_idx(a,b,cs,cl)
        mn={}
        for st,name,args in ins:
            if name=='findpropstrict' and a.mname(args[0])=='BitmapData': mn['BD']=args[0]
            if name=='constructprop' and a.mname(args[0])=='BitmapData': mn['BDc']=args[0]
            if name=='getproperty' and a.mname(args[0]) in('width','height'): mn[a.mname(args[0])]=args[0]
        A=[i for i,x in enumerate(a.inst) if a.mname(x[0])=='AnimatedShaderBitmap'][0]
        at=[t for t in a.inst[A][3] if a.mname(t[0])=='applyTexture'][0][2][2]
        abd=a.bodies[at]
        for st,name,args in ops_with_idx(a,b,*abd['code']):
            if name=='getproperty' and a.mname(args[0])=='rect': mn['rect']=args[0]
            if name=='getproperty' and a.mn[args[0]][0]=='ML': mn['ML']=args[0]
        print('mn',mn)
        wmn=a.mn[mn['width']]; assert wmn[0] in('M','Q'),wmn
        # new strings + multinames getVector/setVector (same kind/ns as width)
        p=a.o['str']; n,q=ru(b,p)
        newnames=['getVector','setVector']; base=len(a.strs)
        strpool=wu(n+len(newnames))+b[q:a.o['strend']]+b''.join(wu(len(s))+s.encode() for s in newnames)
        p=a.o['mn']; n,q=ru(b,p); mbase=len(a.mn)
        if wmn[0]=='M': extra=b''.join(bytes([9])+wu(base+i)+wu(wmn[2]) for i in range(2))
        else: extra=b''.join(bytes([7])+wu(wmn[1])+wu(base+i) for i in range(2))
        mnpool=wu(n+2)+b[q:a.o['mnend']]+extra
        mn['getVector']=mbase; mn['setVector']=mbase+1
        # ---- assembler ----
        cb=[]; labels={}; fix=[]
        def E(*bs):
            for x in bs: cb.extend(x if isinstance(x,(bytes,bytearray)) else [x])
        def U(v): return wu(v)
        def L(name): labels[name]=len(cb)
        def J(op,name): E(op); fix.append((len(cb),name)); E(0,0,0)
        gl=lambda i: E({0:0xd0,1:0xd1,2:0xd2,3:0xd3}[i]) if i<4 else E(0x62,U(i))
        sl=lambda i: E({0:0xd4,1:0xd5,2:0xd6,3:0xd7}[i]) if i<4 else E(0x63,U(i))
        gp=lambda m: E(0x66,U(mn[m]))
        def pb(v): E(0x24,v)
        def ps(v): E(0x25,U(v))
        E(0xd0,0x30)
        E(0x5d,U(mn['BD'])); gl(1); gp('width'); gl(1); gp('height'); E(0x26); pb(0); E(0x4a,U(mn['BDc']),U(4)); sl(3)
        gl(1); gp('width'); gl(1); gp('height'); E(0xa2,0x73); sl(4)
        for (img,loc) in ((1,6),(2,7),(1,8)):
            gl(img); gl(img); gp('rect'); E(0x46,U(mn['getVector']),U(1)); sl(loc)
        gl(2); gp('width'); E(0x73); sl(19)
        gl(2); gp('height'); E(0x73); sl(20)
        pb(0); sl(5)
        J(0x10,'COND')
        L('BODY'); E(0x09)
        gl(6); gl(5); E(0x66,U(mn['ML'])); E(0x74); sl(9)
        gl(9); pb(16); E(0xa7); ps(255); E(0xa8); sl(10)
        gl(9); pb(8); E(0xa7); ps(255); E(0xa8); sl(11)
        gl(9); ps(255); E(0xa8); sl(12)
        gl(12); pb(4); E(0xa7); sl(18)
        gl(10); gl(11); E(0xa9); pb(0); J(0x13,'ZERO')
        gl(18); pb(0); J(0x13,'ZERO')
        gl(10); gl(19); J(0x15,'OKR'); gl(19); E(0xc1); sl(10); L('OKR'); E(0x09)
        gl(11); gl(20); J(0x15,'OKG'); gl(20); E(0xc1); sl(11); L('OKG'); E(0x09)
        gl(7); gl(11); gl(19); E(0xc7); gl(10); E(0xc5); E(0x66,U(mn['ML'])); E(0x74); sl(13)
        gl(13); pb(16); E(0xa7); ps(255); E(0xa8); E(0x75); sl(15)
        gl(13); pb(8); E(0xa7); ps(255); E(0xa8); E(0x75); sl(16)
        gl(13); ps(255); E(0xa8); E(0x75); sl(17)
        gl(12); pb(15); E(0xa8); E(0x75); pb(15); E(0xa3); sl(14)
        gl(14); E(0x2f,U(9)); J(0x15,'DARK')
        pb(1); gl(14); E(0x2f,U(9)); E(0xa1); E(0xa1); sl(14)
        for loc in (15,16,17):
            ps(255); ps(255); gl(loc); E(0xa1); gl(14); E(0xa2); E(0xa1); sl(loc)
        J(0x10,'PACK')
        L('DARK'); E(0x09)
        gl(14); pb(2); E(0xa2); sl(14)
        for loc in (15,16,17):
            gl(loc); gl(14); E(0xa2); sl(loc)
        L('PACK'); E(0x09)
        gl(8); gl(5)
        gl(18); pb(17); E(0xc7); pb(24); E(0xa5)
        gl(15); E(0x73); pb(16); E(0xa5); E(0xa9)
        gl(16); E(0x73); pb(8); E(0xa5); E(0xa9)
        gl(17); E(0x73); E(0xa9); E(0x74)
        E(0x61,U(mn['ML']))
        J(0x10,'NEXT')
        L('ZERO'); E(0x09)
        gl(8); gl(5); pb(0); E(0x74); E(0x61,U(mn['ML']))
        L('NEXT'); E(0x09)
        E(0xc2,U(5))
        L('COND'); E(0x09)
        gl(5); gl(4); J(0x15,'BODY')
        gl(3); gl(3); gp('rect'); gl(8); E(0x4f,U(mn['setVector']),U(2))
        gl(3); E(0x48)
        for pos,name in fix:
            off=labels[name]-(pos+3)
            cb[pos:pos+3]=list(off.to_bytes(3,'little',signed=True))
        newcode=bytes(cb)
        bs=bd['start']; m,p=ru(b,bs)
        hdrb=wu(m)+wu(12)+wu(21)+wu(bd['isd'])+wu(bd['msd'])
        body2=hdrb+wu(len(newcode))+newcode+b[cs+cl:bd['end']]
        nb=b[:a.o['str']]+strpool+b[a.o['strend']:a.o['mn']]+mnpool+b[a.o['mnend']:bs]+body2+b[bd['end']:]
        data=data[:e+1]+nb; done=True
        print('patched doShaderJob, code',len(newcode),'bytes')
    out+=tagbytes(code,data)
full=b'FWS'+bytes([ver])+struct.pack('<I',8+len(out))+bytes(out)
open(dst,'wb').write(b'CWS'+full[3:8]+zlib.compress(full[8:],9))
