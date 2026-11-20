# Allow Games: convierte Game.js_quickNav (callback "quickNav") en un puente generico JS->juego.
# quickNav([claseRaiz, "ruta.a.propiedad", args...])  claseRaiz "" = Global
import sys,struct,zlib
sys.path.insert(0,'/home/claude/hudfix'); sys.path.insert(0,'/home/claude/swfx')
from abcp import ABC,ru,wu
from swfpatch import read, split, tagbytes
src,dst=sys.argv[1:3]
ver,body=read(src); hdr,tags=split(body); out=bytearray(hdr); done=False
for code,data in tags:
    if code==82 and not done:
        e=data.index(b'\0',4); b=data[e+1:]; a=ABC(b)
        gi=[i for i,x in enumerate(a.inst) if a.mname(x[0])=='Game']
        if not gi: out+=tagbytes(code,data); continue
        M=[t for t in a.inst[gi[0]][3] if a.mname(t[0])=='js_quickNav'][0][2][2]
        # nssets (para encontrar ML con namespace publico)
        p=4
        n,p=ru(b,p)
        for _ in range(max(0,n-1)): _,p=ru(b,p)
        n,p=ru(b,p)
        for _ in range(max(0,n-1)): _,p=ru(b,p)
        n,p=ru(b,p);p+=8*max(0,n-1)
        n,p=ru(b,p)
        for _ in range(max(0,n-1)): l,p=ru(b,p);p+=l
        n,p=ru(b,p)
        for _ in range(max(0,n-1)): p+=1;_,p=ru(b,p)
        n,p=ru(b,p); nss=[None]
        for _ in range(max(0,n-1)):
            c,p=ru(b,p); l=[]
            for _ in range(c): x,p=ru(b,p); l.append(x)
            nss.append(l)
        pub=[i for i,x in enumerate(a.ns) if x and x[0]==22 and a.strs[x[1]]=='']
        ML=[i for i,m in enumerate(a.mn) if m and m[0]=='ML' and any(q in pub for q in nss[m[1]])][0]
        def Q(name,nsname):
            for i,m in enumerate(a.mn):
                if m and m[0]=='Q' and a.strs[m[2]]==name and a.strs[a.ns[m[1]][1]]==nsname: return i
            raise Exception(name)
        mn=dict(Global=Q('Global',''),length=Q('length',''),apply=Q('apply',''),pop=Q('pop',''),
                split=Q('split','http://adobe.com/AS3/2006/builtin'),slice=Q('slice','http://adobe.com/AS3/2006/builtin'),
                gdbn=Q('getDefinitionByName','flash.utils'))
        S=lambda s:a.strs.index(s)
        st=dict(empty=S(''),fn=S('function'),dot=S('.'),obj=S('object'))
        print('ML',ML,mn,st)
        cb=[]; labels={}; fix=[]
        def E(*bs):
            for x in bs: cb.extend(x if isinstance(x,(bytes,bytearray)) else [x])
        U=wu
        def L(nm): labels[nm]=len(cb); E(0x09)
        def J(op,nm): E(op); fix.append((len(cb),nm)); E(0,0,0)
        gl=lambda i: E(0xd0+i) if i<4 else E(0x62,U(i))
        sl=lambda i: E(0xd4+i) if i<4 else E(0x63,U(i))
        ps=lambda k: E(0x2c,U(st[k]))
        pb=lambda v: E(0x24,v)
        gML=lambda: E(0x66,U(ML))
        E(0xd0,0x30)
        TRY0=len(cb)
        gl(1); pb(0); gML(); E(0x70); ps('empty'); J(0x1a,'DEF')
        E(0x60,U(mn['Global'])); sl(2); J(0x10,'ROOT')
        L('DEF')
        E(0x5d,U(mn['gdbn'])); gl(1); pb(0); gML(); E(0x70); E(0x46,U(mn['gdbn']),U(1)); sl(2)
        L('ROOT')
        gl(1); pb(2); E(0x46,U(mn['slice']),U(1)); sl(7)
        gl(1); pb(1); gML(); E(0x70); sl(8)
        gl(8); ps('empty'); J(0x1a,'HASPATH')
        gl(2); E(0x95); ps('fn'); J(0x1a,'RETROOT')
        gl(2); E(0x20); gl(7); E(0x46,U(mn['apply']),U(2)); J(0x10,'RET')
        L('RETROOT'); gl(2); J(0x10,'RET')
        L('HASPATH')
        gl(8); ps('dot'); E(0x46,U(mn['split']),U(1)); sl(3)
        gl(3); E(0x46,U(mn['pop']),U(0)); E(0x70); sl(4)
        pb(0); E(0x73); sl(5)
        J(0x10,'COND')
        L('LOOP')
        gl(2); gl(3); gl(5); gML(); gML(); sl(2)
        E(0xc2,U(5))
        L('COND')
        gl(5); gl(3); E(0x66,U(mn['length'])); J(0x15,'LOOP')
        gl(2); gl(4); gML(); sl(6)
        gl(6); E(0x95); ps('fn'); J(0x1a,'NOTFN')
        gl(6); gl(2); gl(7); E(0x46,U(mn['apply']),U(2)); J(0x10,'RET')
        L('NOTFN')
        gl(7); E(0x66,U(mn['length'])); pb(0); J(0x16,'GET')
        gl(2); gl(4); gl(7); pb(0); gML(); E(0x61,U(ML)); E(0x20); J(0x10,'RET')
        L('GET'); gl(6)
        L('RET')
        sl(8)
        gl(8); E(0x95); ps('obj'); J(0x1a,'OUT')
        gl(8); E(0x20); J(0x19,'OUT')
        gl(8); E(0x70); E(0x48)
        L('OUT'); gl(8); E(0x48)
        TRY1=len(cb)
        HANDLER=len(cb)
        E(0x29); E(0x20); E(0x48)
        for pos,nm in fix:
            off=labels[nm]-(pos+3)
            cb[pos:pos+3]=list(off.to_bytes(3,'little',signed=True))
        newcode=bytes(cb)
        bd=a.bodies[M]; cs,cl=bd['code']
        exc=wu(1)+wu(TRY0)+wu(TRY1)+wu(HANDLER)+wu(0)+wu(0)
        body2=wu(M)+wu(8)+wu(9)+wu(bd['isd'])+wu(max(bd['msd'],bd['isd']+1))+wu(len(newcode))+newcode+exc+wu(0)
        # method_info M: 1 parametro sin tipo, retorno sin tipo
        p=a.o['mnend']; n,p=ru(b,p)
        for i in range(n):
            ms=p
            pc,p=ru(b,p);_,p=ru(b,p)
            for _ in range(pc): _,p=ru(b,p)
            nm,p=ru(b,p);f=b[p];p+=1
            if f&8:
                oc,p=ru(b,p)
                for _ in range(oc): _,p=ru(b,p);p+=1
            if f&0x80:
                for _ in range(pc): _,p=ru(b,p)
            if i==M: mstart,mend,mname=ms,p,nm; break
        newmi=wu(1)+wu(0)+wu(0)+wu(mname)+bytes([0])
        nb=b[:mstart]+newmi+b[mend:bd['start']]+body2+b[bd['end']:]
        data=data[:e+1]+nb; done=True
        print('patched js_quickNav method',M,'code',len(newcode))
    out+=tagbytes(code,data)
full=b'FWS'+bytes([ver])+struct.pack('<I',8+len(out))+bytes(out)
open(dst,'wb').write(b'CWS'+full[3:8]+zlib.compress(full[8:],9))
