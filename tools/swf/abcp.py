import struct
def ru(b,p):
    r=0;s=0
    while True:
        c=b[p];p+=1;r|=(c&0x7f)<<s;s+=7
        if not c&0x80 or s>=35: return r,p
def wu(v):
    o=bytearray()
    while True:
        c=v&0x7f;v>>=7
        if v: o.append(c|0x80)
        else: o.append(c); return bytes(o)
class ABC:
    def __init__(s,b):
        s.b=b;p=4;o={}
        n,p=ru(b,p)
        for _ in range(max(0,n-1)): _,p=ru(b,p)
        n,p=ru(b,p)
        for _ in range(max(0,n-1)): _,p=ru(b,p)
        n,p=ru(b,p);p+=8*max(0,n-1)
        o['str']=p
        n,p=ru(b,p);s.strs=[None]
        for _ in range(max(0,n-1)):
            l,p=ru(b,p);s.strs.append(b[p:p+l].decode('utf8','replace'));p+=l
        o['strend']=p
        n,p=ru(b,p);s.ns=[None]
        for _ in range(max(0,n-1)):
            k=b[p];p+=1;nm,p=ru(b,p);s.ns.append((k,nm))
        n,p=ru(b,p)
        for _ in range(max(0,n-1)):
            c,p=ru(b,p)
            for _ in range(c): _,p=ru(b,p)
        o['mn']=p
        n,p=ru(b,p);s.mn=[None]
        for _ in range(max(0,n-1)):
            k=b[p];p+=1
            if k in(7,0xD): a,p=ru(b,p);c,p=ru(b,p);s.mn.append(('Q',a,c))
            elif k in(0xF,0x10): c,p=ru(b,p);s.mn.append(('RTQ',c))
            elif k in(0x11,0x12): s.mn.append(('RTQL',))
            elif k in(9,0xE): c,p=ru(b,p);a,p=ru(b,p);s.mn.append(('M',c,a))
            elif k in(0x1B,0x1C): a,p=ru(b,p);s.mn.append(('ML',a))
            elif k==0x1D:
                q,p=ru(b,p);c,p=ru(b,p);ps=[]
                for _ in range(c): x,p=ru(b,p);ps.append(x)
                s.mn.append(('T',q,ps))
            else: raise Exception('mn kind %x'%k)
        o['mnend']=p
        n,p=ru(b,p);s.nmeth=n
        for _ in range(n):
            pc,p=ru(b,p);_,p=ru(b,p)
            for _ in range(pc): _,p=ru(b,p)
            _,p=ru(b,p);f=b[p];p+=1
            if f&8:
                oc,p=ru(b,p)
                for _ in range(oc): _,p=ru(b,p);p+=1
            if f&0x80:
                for _ in range(pc): _,p=ru(b,p)
        n,p=ru(b,p)
        for _ in range(n):
            _,p=ru(b,p);c,p=ru(b,p)
            for _ in range(2*c): _,p=ru(b,p)
        n,p=ru(b,p);s.ncls=n;s.inst=[]
        for _ in range(n):
            nm,p=ru(b,p);sup,p=ru(b,p);f=b[p];p+=1
            if f&8: _,p=ru(b,p)
            c,p=ru(b,p)
            for _ in range(c): _,p=ru(b,p)
            ii,p=ru(b,p);tst=p;tr,p=s.traits(b,p);s.inst.append((nm,sup,ii,tr,tst,p))
        s.cls=[]
        for _ in range(n):
            st=p;ci,p=ru(b,p);tst=p;tr,p=s.traits(b,p);s.cls.append((ci,tr,tst,p))
        n,p=ru(b,p)
        for _ in range(n): _,p=ru(b,p);_,p=s.traits(b,p)
        n,p=ru(b,p);s.bodies={}
        for _ in range(n):
            st=p;m,p=ru(b,p);ms,p=ru(b,p);lc,p=ru(b,p);isd,p=ru(b,p);msd,p=ru(b,p)
            cl,p=ru(b,p);cs=p;p+=cl
            ec,p=ru(b,p)
            for _ in range(ec*5): _,p=ru(b,p)
            _,p=s.traits(b,p)
            s.bodies[m]=dict(start=st,ms=ms,lc=lc,isd=isd,msd=msd,code=(cs,cl),end=p)
        s.o=o
    def traits(s,b,p):
        n,p=ru(b,p);out=[]
        for _ in range(n):
            st=p;nm,p=ru(b,p);k=b[p];p+=1;kk=k&0xf
            if kk in(0,6):
                sid,p=ru(b,p);t,p=ru(b,p);v,p=ru(b,p)
                if v: p+=1
                d=('slot',sid,t,v)
            else:
                a,p=ru(b,p);c,p=ru(b,p);d=('k%d'%kk,a,c)
            if k>>4&4:
                c,p=ru(b,p)
                for _ in range(c): _,p=ru(b,p)
            out.append((nm,k,d,st,p))
        return out,p
    def mname(s,i):
        m=s.mn[i]
        if m and m[0]=='Q': return s.strs[m[2]]
        if m and m[0]=='M': return s.strs[m[1]]
        return str(m)
