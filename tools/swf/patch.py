import sys,struct,zlib
sys.path.insert(0,'/home/claude/hudfix'); sys.path.insert(0,'/home/claude/swfx')
from abcp import ABC,ru,wu
from swfpatch import read, split, tagbytes
src,dst,cls,newname,copyfrom=sys.argv[1:6]
ver,body=read(src); hdr,tags=split(body); out=bytearray(hdr)
for code,data in tags:
    if code==82:
        e=data.index(b'\0',4); b=data[e+1:]; a=ABC(b)
        hit=[i for i,x in enumerate(a.inst) if a.mname(x[0])==cls]
        if hit:
            i=hit[0]; nm,sup,ii,tr,tst,tend=a.inst[i]
            assert newname not in [a.mname(t[0]) for t in tr]
            ref=[t for t in tr if a.mname(t[0])==copyfrom][0]
            refmn=a.mn[ref[0]]  # ('Q',ns,name)
            # string pool
            p=a.o['str']; n,q=ru(b,p)
            newstr=len(a.strs); strpool=wu(n+1)+b[q:a.o['strend']]+wu(len(newname))+newname.encode()
            p=a.o['mn']; n,q=ru(b,p)
            newmn=len(a.mn); mnpool=wu(n+1)+b[q:a.o['mnend']]+bytes([7])+wu(refmn[1])+wu(newstr)
            # instance traits: + slot
            n,q=ru(b,tst)
            traits=wu(n+1)+b[q:tend]+wu(newmn)+bytes([0])+wu(0)+wu(ref[2][2])+wu(0)
            # find class mn used for copyfrom in iinit: initproperty <ref name idx>
            bd=a.bodies[ii]; cs,cl=bd['code']; c=b[cs:cs+cl]
            pat=bytes([0x68])+wu(ref[0])
            k=c.index(pat); j=c.rindex(b'\xd0',0,k)
            seg=c[j:k]  # getlocal0 [debug] findpropstrict X getproperty X
            seg=bytes([0xd0])+seg[seg.index(b'\x5d'):]
            ins=seg+bytes([0x68])+wu(newmn)
            k2=k+len(pat)
            newcode=c[:k2]+ins+c[k2:]
            # rebuild body header up to code
            bs=bd['start']; m,p=ru(b,bs)
            for _ in range(4): _,p=ru(b,p)
            hdrb=b[bs:p]; _,p2=ru(b,p)
            body2=hdrb+wu(len(newcode))+newcode+b[cs+cl:bd['end']]
            nb=b[:a.o['str']]+strpool+b[a.o['strend']:a.o['mn']]+mnpool+b[a.o['mnend']:tst]+traits+b[tend:bs]+body2+b[bd['end']:]
            data=data[:e+1]+nb
            print('patched',cls,'+',newname,'=',copyfrom)
    out+=tagbytes(code,data)
full=b'FWS'+bytes([ver])+struct.pack('<I',8+len(out))+bytes(out)
open(dst,'wb').write(b'CWS'+full[3:8]+zlib.compress(full[8:],9))
