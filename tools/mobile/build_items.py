#!/usr/bin/env python3
"""Allow Games: crea el catalogo compacto (items.json) para la app de celular sin Flash.
Uso: python build_items.py <gameSettings.xml> <salida items.json>"""
import sys, json, xml.etree.ElementTree as ET

SKIP = {'tool', 'quest_item', 'collectable', 'npc', 'doober', 'themed_bundle', 'mystery_crate', 'energy',
        'goods', 'genericItem', 'coin', 'genericBundle', 'lootable', 'client_prop', 'theme_collection', None}

def num(v):
    if v is None: return None
    try:
        f = float(v); return int(f) if f.is_integer() else f
    except ValueError: return None

def layer(e):
    url = e.get('url')
    if not url:
        a = e.find('asset')
        url = a.get('url') if a is not None else None
    if not url: return None
    L = {'u': url}
    for k, kk in (('offsetX', 'x'), ('offsetY', 'y'), ('frameWidth', 'fw'), ('frameHeight', 'fh'), ('numFrames', 'n'), ('fps', 'fps')):
        v = num(e.get(k))
        if v: L[kk] = v
    if e.get('type'): L['t'] = e.get('type')
    return L

def images(it):
    out = {}
    icon = None
    for im in it.findall('image'):
        name = im.get('name') or 'static'
        if name == 'icon':
            icon = im.get('url'); continue
        layers = []
        if im.get('url') or im.find('asset') is not None and not im.findall('image'):
            l = layer(im)
            if l: layers.append(l)
        for ch in im.findall('image'):
            l = layer(ch)
            if l: layers.append(l)
        if not layers: continue
        d = im.get('direction') or 'ALL'
        ph = im.get('phase')
        key = name + ('#' + ph if ph else '')
        out.setdefault(key, {}).setdefault(d, layers)
    return out, icon

def main(src, dst):
    root = ET.parse(src).getroot()
    farming = root.find('.//farming')
    cat = {'day': num(farming.get('inGameDaySeconds')) if farming is not None else 82800,
           'grow': num(farming.get('growMultiplier')) if farming is not None else 1, 'items': {}}
    market = {}
    mk = root.find('.//marketItems')
    if mk is not None:
        for cg in mk.findall('category'):
            market[cg.get('name')] = [i.get('name') for i in cg.findall('item') if i.get('name')]
    cat['market'] = market
    for it in root.find('items').findall('item'):
        t = it.get('type')
        if t in SKIP: continue
        imgs, icon = images(it)
        if not imgs and not icon: continue
        o = {'t': t}
        if it.get('className'): o['c'] = it.get('className')
        for tag, k in (('sizeX', 'sx'), ('sizeY', 'sy'), ('cost', 'cost'), ('requiredLevel', 'lvl'), ('growTime', 'g'),
                       ('coinYield', 'coin'), ('xpYield', 'xp'), ('buildTime', 'bt'), ('commodityReq', 'req'), ('numberOfStages', 'ns')):
            v = num(it.findtext(tag))
            if v is not None: o[k] = v
        ec = it.find('energyCost')
        if ec is not None:
            if num(ec.get('harvest')): o['eh'] = num(ec.get('harvest'))
            if num(ec.get('build')): o['eb'] = num(ec.get('build'))
        if it.find('fbc') is not None or it.find('cash') is not None or it.find('cashCost') is not None: o['prem'] = 1
        if it.get('buyable') == 'true': o['buy'] = 1
        if it.get('placeable') == 'true': o['pl'] = 1
        cp = it.findtext('contractPlaceableOn')
        if cp: o['on'] = cp
        kw = [k.text for k in it.findall('keyword') if k.text]
        if kw: o['kw'] = kw[:6]
        con = it.findtext('construction')
        if con: o['con'] = con
        if icon: o['icon'] = icon
        if imgs: o['img'] = imgs
        cat['items'][it.get('name')] = o
    json.dump(cat, open(dst, 'w'), separators=(',', ':'))
    print(len(cat['items']), 'items')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
