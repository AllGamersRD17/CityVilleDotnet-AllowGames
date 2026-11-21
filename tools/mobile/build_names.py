#!/usr/bin/env python3
"""Allow Games: saca los nombres de los items (friendlyName) de los idiomas del juego para la app de celular.
Uso: python build_names.py <carpeta del juego> <carpeta salida> <items.json>"""
import sys, os, re, zlib, json, xml.etree.ElementTree as ET

def from_xml(p):
    out = {}
    for s in ET.parse(p).getroot().iter('string'):
        k = s.get('key') or ''
        if k.endswith('_friendlyName'):
            v = s.findtext('original')
            if v: out[k[:-13]] = v
    return out

def u29(b, i):
    v = 0
    for n in range(4):
        c = b[i]; i += 1
        if n < 3:
            v = (v << 7) | (c & 0x7f)
            if not c & 0x80: return v, i
        else:
            v = (v << 8) | c
    return v, i

def from_swf(p):
    d = open(p, 'rb').read()
    body = zlib.decompress(d[8:]) if d[:3] == b'CWS' else d[8:]
    out = {}
    for m in re.finditer(rb'_friendlyName', body):
        e = m.end()
        for s in range(e - 14, max(0, e - 120), -1):
            if body[s - 1] == e - s and re.fullmatch(rb'[A-Za-z0-9_\-]+', body[s:e]):
                try:
                    ln, j = u29(body, e)
                    v = body[j:j + ln].decode('utf-8') if 0 < ln < 200 else ''
                    if v and '_friendlyName' not in v and not re.fullmatch(r'[a-z0-9_]+', v):
                        out[body[s:e - 13].decode()] = v
                except Exception:
                    pass
                break
    return out

def main(game, outdir, items):
    keep = set(json.load(open(items))['items'])
    src = {'es': ('xml', 'es_ES.xml'), 'de': ('xml', 'lang/de_DE.xml'), 'en': ('swf', 'lang/locale_en_US.swf'),
           'fr': ('swf', 'lang/locale_fr_FR.swf'), 'it': ('swf', 'lang/locale_it_IT.swf')}
    for lang, (kind, f) in src.items():
        p = os.path.join(game, f)
        if not os.path.exists(p): continue
        n = from_xml(p) if kind == 'xml' else from_swf(p)
        n = {k: v for k, v in n.items() if k in keep}
        json.dump(n, open(os.path.join(outdir, 'names_%s.json' % lang), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
        print(lang, len(n))

if __name__ == '__main__':
    main(*sys.argv[1:4])
