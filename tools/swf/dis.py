import sys
sys.path.insert(0,'/home/claude/hudfix'); sys.path.insert(0,'/home/claude/swfx')
from abcp import ABC,ru
from swfpatch import read, split
# operand kinds: u=u30, s24, b=byte
OPS={0x01:('bkpt',''),0x02:('nop',''),0x03:('throw',''),0x04:('getsuper','m'),0x05:('setsuper','m'),0x06:('dxns','u'),0x07:('dxnslate',''),0x08:('kill','u'),0x09:('label',''),0x0c:('ifnlt','s'),0x0d:('ifnle','s'),0x0e:('ifngt','s'),0x0f:('ifnge','s'),0x10:('jump','s'),0x11:('iftrue','s'),0x12:('iffalse','s'),0x13:('ifeq','s'),0x14:('ifne','s'),0x15:('iflt','s'),0x16:('ifle','s'),0x17:('ifgt','s'),0x18:('ifge','s'),0x19:('ifstricteq','s'),0x1a:('ifstrictne','s'),0x1b:('lookupswitch','L'),0x1c:('pushwith',''),0x1d:('popscope',''),0x1e:('nextname',''),0x1f:('hasnext',''),0x20:('pushnull',''),0x21:('pushundefined',''),0x23:('nextvalue',''),0x24:('pushbyte','b'),0x25:('pushshort','u'),0x26:('pushtrue',''),0x27:('pushfalse',''),0x28:('pushnan',''),0x29:('pop',''),0x2a:('dup',''),0x2b:('swap',''),0x2c:('pushstring','S'),0x2d:('pushint','u'),0x2e:('pushuint','u'),0x2f:('pushdouble','u'),0x30:('pushscope',''),0x31:('pushnamespace','u'),0x32:('hasnext2','uu'),0x40:('newfunction','u'),0x41:('call','u'),0x42:('construct','u'),0x43:('callmethod','uu'),0x44:('callstatic','uu'),0x45:('callsuper','mu'),0x46:('callproperty','mu'),0x47:('returnvoid',''),0x48:('returnvalue',''),0x49:('constructsuper','u'),0x4a:('constructprop','mu'),0x4c:('callproplex','mu'),0x4e:('callsupervoid','mu'),0x4f:('callpropvoid','mu'),0x53:('applytype','u'),0x55:('newobject','u'),0x56:('newarray','u'),0x57:('newactivation',''),0x58:('newclass','u'),0x59:('getdescendants','m'),0x5a:('newcatch','u'),0x5d:('findpropstrict','m'),0x5e:('findproperty','m'),0x5f:('finddef','m'),0x60:('getlex','m'),0x61:('setproperty','m'),0x62:('getlocal','u'),0x63:('setlocal','u'),0x64:('getglobalscope',''),0x65:('getscopeobject','u'),0x66:('getproperty','m'),0x68:('initproperty','m'),0x6a:('deleteproperty','m'),0x6c:('getslot','u'),0x6d:('setslot','u'),0x6e:('getglobalslot','u'),0x6f:('setglobalslot','u'),0x70:('convert_s',''),0x71:('esc_xelem',''),0x72:('esc_xattr',''),0x73:('convert_i',''),0x74:('convert_u',''),0x75:('convert_d',''),0x76:('convert_b',''),0x77:('convert_o',''),0x78:('checkfilter',''),0x80:('coerce','m'),0x81:('coerce_b',''),0x82:('coerce_a',''),0x83:('coerce_i',''),0x84:('coerce_d',''),0x85:('coerce_s',''),0x86:('astype','m'),0x87:('astypelate',''),0x88:('coerce_u',''),0x89:('coerce_o',''),0x90:('negate',''),0x91:('increment',''),0x92:('inclocal','u'),0x93:('decrement',''),0x94:('declocal','u'),0x95:('typeof',''),0x96:('not',''),0x97:('bitnot',''),0xa0:('add',''),0xa1:('subtract',''),0xa2:('multiply',''),0xa3:('divide',''),0xa4:('modulo',''),0xa5:('lshift',''),0xa6:('rshift',''),0xa7:('urshift',''),0xa8:('bitand',''),0xa9:('bitor',''),0xaa:('bitxor',''),0xab:('equals',''),0xac:('strictequals',''),0xad:('lessthan',''),0xae:('lessequals',''),0xaf:('greaterthan',''),0xb0:('greaterequals',''),0xb1:('instanceof',''),0xb2:('istype','m'),0xb3:('istypelate',''),0xb4:('in',''),0xc0:('increment_i',''),0xc1:('decrement_i',''),0xc2:('inclocal_i','u'),0xc3:('declocal_i','u'),0xc4:('negate_i',''),0xc5:('add_i',''),0xc6:('subtract_i',''),0xc7:('multiply_i',''),0xd0:('getlocal0',''),0xd1:('getlocal1',''),0xd2:('getlocal2',''),0xd3:('getlocal3',''),0xd4:('setlocal0',''),0xd5:('setlocal1',''),0xd6:('setlocal2',''),0xd7:('setlocal3',''),0xef:('debug','bubu'),0xf0:('debugline','u'),0xf1:('debugfile','u'),0x35:('li8',''),0x36:('li16',''),0x37:('li32',''),0x38:('lf32',''),0x39:('lf64',''),0x3a:('si8',''),0x3b:('si16',''),0x3c:('si32',''),0x3d:('sf32',''),0x3e:('sf64',''),0x50:('sxi1',''),0x51:('sxi8',''),0x52:('sxi16','')}
def dis(a,b,cs,cl):
    c=b[cs:cs+cl]; p=0; out=[]
    while p<len(c):
        op=c[p]; st=p; p+=1
        name,fmt=OPS.get(op,('op%02x'%op,''))
        args=[]
        for f in fmt:
            if f=='b': args.append(str(c[p])); p+=1
            elif f=='s':
                v=int.from_bytes(c[p:p+3],'little',signed=True); p+=3; args.append(str(v))
            elif f=='L':
                v=int.from_bytes(c[p:p+3],'little',signed=True); p+=3; n,p=ru(c,p)
                for _ in range(n+1): p+=3
                args.append('switch')
            else:
                v,p=ru(c,p)
                if f=='m': args.append(a.mname(v) if v<len(a.mn) else '?')
                elif f=='S': args.append(repr(a.strs[v]))
                else: args.append(str(v))
        if name not in('debugline','debugfile','debug'): out.append('%4d %s %s'%(st,name,' '.join(args)))
    return out
ver,body=read(sys.argv[1]); hdr,tags=split(body)
for code,data in tags:
    if code in(82,72):
        e=data.index(b'\0',4) if code==82 else -1; b=data[e+1:]; a=ABC(b)
        for i,(nm,sup,ii,tr,*_) in enumerate(a.inst):
            if a.mname(nm)==sys.argv[2]:
                for t in tr:
                    if t[2][0]!='slot' and (len(sys.argv)<4 or a.mname(t[0]) in sys.argv[3].split(',')):
                        bd=a.bodies.get(t[2][2])
                        if not bd: continue
                        print('== ',a.mname(t[0])); print('\n'.join(dis(a,b,*bd['code'])))
