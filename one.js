//include geom.js

//-----------------------------------------------------------------------------------------------------------------------
// svg helper

function svgNu(typ) { return document.createElementNS('http://www.w3.org/2000/svg', typ); }

function svgAddNu(dst, typ) { return dst.appendChild(svgNu(typ)); }

function svgAddText(dst, clas, text) {
    const ele = svgAddNu(dst, 'text');
    ele.classList.add(clas);
    ele.appendChild(document.createTextNode(text));
    return ele;
}

function svgAddUseXYHref(dst, x, y, href) {
    return svgSetXYHref(svgAddNu(dst, 'use'), x, y, href);
}

function svgSetCxCyRxRyClas(ele, cx, cy, rx, ry, clas) {
    ele.setAttribute('cx', cx);
    ele.setAttribute('cy', cy);
    ele.setAttribute('rx', rx);
    ele.setAttribute('ry', ry);
    ele.classList.add(clas);
    return ele;
}

function svgSetDClas(ele, d, clas) {
    ele.setAttribute('d', d);
    ele.classList.add(clas);
    return ele;
}

function svgSetRectClas(ele, x, y, w, h, clas) {
    ele.setAttribute('x', x);
    ele.setAttribute('y', y);
    ele.setAttribute('width', w);
    ele.setAttribute('height', h);
    ele.classList.add(clas);
    return ele;
}

function svgSetXY(ele, x, y) {
    ele.setAttribute('x', x);
    ele.setAttribute('y', y);
    return ele;
}

function svgSetXYHref(ele, x, y, href) {
    ele.setAttribute('x', x);
    ele.setAttribute('y', y);
    ele.setAttribute('href', href);
    return ele;
}

//-----------------------------------------------------------------------------------------------------------------------
// composite functions

function groupLabel(dst, r, pad, lab) {
    const b = svgAddNu(dst, 'rect');
    const t = svgAddText(dst, 'label', lab);
    const tr = t.getBBox();
    const tpad = tr.height + tr.y;
    let bx = r.x - pad;
    const by = r.y - pad - tpad - tr.height;
    const bh = r.y + r.height + pad - by;
    let bw = r.width + pad + pad;
    const bw1 = tr.width + tpad + tpad;
    if(bw1 >= bw) {
	bx -= 0.5*(bw1 - bw);
	bw = bw1;
    }
    svgSetRectClas(b, bx, by, bw, bh, 'group');
    svgSetXY(t, bx + tpad, by + tr.height);
}

class Conduit {
    constructor(dst, x, y, ry, lab, part, len, ...wirePartV) {
	svgSetCxCyRxRyClas(svgAddNu(dst, 'ellipse'), x, y, 0.75*ry, ry, 'strok');
	y += ry;
	svgSetDClas(svgAddNu(dst, 'path'), `M${x},${y} v20`, 'strok');
	y += 20;
	const t = svgAddText(dst, 'label', lab);
	const tr = t.getBBox();
	svgSetXY(t, x - 0.5*tr.width, y + tr.height);
	this.lab = lab;
	this.part = part;
	this.len = len;
	this.wirePartV = wirePartV;
    }
    
    desBox() {
	const wirePartQtyD = {};
	for(const part of this.wirePartV) {
	    const partQty = wirePartQtyD[part.id] ??= [ part, 0 ];
	    ++partQty[1];
	}

	const box = eleNuClas('div', 'desBox');
	const head = eleNuAdd('div', box);
	eleNuAdd('span', head).innerHTML = this.lab;
	eleNuAdd('span', head).innerHTML = 'Conduit';
	this.part.desBoxHeadFill(eleNuAdd('div', box));
	const tab = eleNuClasAdd('table', 'desBoxTab', box);
	let tr = tab.createTHead().insertRow(-1);
	tr.insertCell(-1).textContent = 'Quantity';
	tr.insertCell(-1).textContent = 'Wire';
	const tbody = tab.createTBody();
	for(const [part,qty] of Object.values(wirePartQtyD)) {
	    tr = tbody.insertRow(-1);
	    tr.insertCell(-1).textContent = qty;
	    tr.insertCell(-1).textContent = `${part.awg} AWG, ${part.typ}, ${part.color}`;
	}
	return box;
    }
}
    
class StringOptGroup {
    constructor(one, dst, x, y, id) {
	groupLabel(dst, svgAddUseXYHref(dst, x, y, '#stringOpt_114x66').getBBox(), 10, id);
	this.one = one;
	this.linkR = [ x + 114, y + 66 ];
    }
}

class InverterGroup {
    constructor(dst, x, y, lab) {
	groupLabel(dst, svgAddUseXYHref(dst, x, y, '#inverter_110x0').getBBox(), 10, lab);
	this.lab = lab;
	this.linkDcV = [
	    [ x + 0, y - 6 ],
	    [ x + 0, y + 0 ],
	    [ x + 0, y + 6 ],
	];
	this.linkAc = [ x + 110, y + 0 ];
	this.linkCt = [ x + 100, y - 24 ];
    }
}

class DiscoGroup {
    constructor(dst, x, y, lab) {
	groupLabel(dst, svgAddUseXYHref(dst, x, y, '#sw_24x0').getBBox(), 10, lab);
	this.lab = lab;
	this.linkL = [ x + 0, y + 0 ];
	this.linkR = [ x + 24, y + 0 ];
    }
}

class LcGroup {
    constructor(dst, x, y, lab, part, ocpdMainA, ocpdMainPart, ocpdInvA, ocpdInvPart) {
	groupLabel(dst, svgAddUseXYHref(dst, x, y, '#lc_36x134').getBBox(), 10, lab);
	this.lab = lab;
	this.linkFeed = [ x + 18, y + 0 ];
	this.linkOcpdLB = [ x + 0, y + 134 ];
	this.linkCt = [ x + 18, y + 12 ];
	this.part = part;
	this.ocpdMainA = ocpdMainA;
	this.ocpdMainPart = ocpdMainPart;
	this.ocpdInvA = ocpdInvA;
	this.ocpdInvPart = ocpdInvPart;
    }

    //todo make part instantiable along with panelpart etc.
    desBox() {
	return desBox(
	    this.lab, 'Load center',
	    `Make: ${this.part.make}`,
	    `Model: ${this.part.model}`,
	    this.part.spec1,
	    `Breaker, main: ${this.ocpdMainA}A ${this.ocpdMainPart.model}`,
	    `Breaker, inverter: ${this.ocpdInvA}A ${this.ocpdInvPart.model}`,
	);
    }
}

class Ct {
    constructor(dst, x, y, lab) {
	svgAddUseXYHref(dst, x, y, '#ctL_R8');
	const t = svgAddText(dst, 'label', lab);
	const tr = t.getBBox();
	const tpad = tr.height + tr.y;
	svgSetXY(t, x + 2 + tpad, y - 0.5*tr.y);
	this.lab = lab;
	this.link = [ x - 2, y + 0 ];
    }
}

class MeterGroup {
    constructor(dst, x, y, lab) {
	groupLabel(dst, svgAddUseXYHref(dst, x, y, '#meter_R8').getBBox(), 10, lab);
	this.lab = lab;
	this.linkL = [ x - 8, y + 0 ];
	this.linkR = [ x + 8, y + 0 ];
    }
}

class Utility {
    constructor(dst, x, y) {
	svgAddUseXYHref(dst, x, y, '#utility');
	this.link = [ x, y ];
    }
}


//-----------------------------------------------------------------------------------------------------------------------
// description boxes

function oneDesRowColNu(row) {
    const col = eleNuClasAdd('div', 'desRowCol', row);
    eleNuClasAdd('div', 'desBox0', col);
    return col;
}

//-----------------------------------------------------------------------------------------------------------------------
// desBox

function desBox(head0, head1, ...lineV) {
    const box = eleNuClas('div', 'desBox');
    const head = eleNuAdd('div', box);
    eleNuAdd('span', head).innerHTML = head0;
    eleNuAdd('span', head).innerHTML = head1;
    const body = eleNuAdd('div', box);
    for(const line of lineV) 
	eleNuAdd('div', body).innerHTML = line;
    return box;
}

//-----------------------------------------------------------------------------------------------------------------------
// OneLine

class OneLine {
    constructor(div, svg) {
	this.div = div;
	this.svg = svg;
	this.conduitV = [];
    }

    conduitAdd(conduit) {
	this.conduitV.push(conduit);
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// OneEnv

class OneEnv {
    constructor() {
	this.partTab = new PartTab();
	this.railGroupMgr = new RailGroupMgr();
    }

    drawrNu() {
	return DrawrNopSingleton;
    }

    terminate() {
	this.railGroupMgr.terminate();
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// SiteBOneLine

class SiteBOneLine extends OneLine {
    constructor(div, svg) {
	super(div, svg);
    }

    wireStringVInv(stringV, inv) {
	let ymin = Number.POSITIVE_INFINITY;
	let ymax = Number.NEGATIVE_INFINITY;
	let d = '';
	for(let i = 0, x = 20; i < stringV.length; ++i, x += 6) {
	    const sl = stringV[i].linkR;
	    const il = inv.linkDcV[i];
	    d += `M${sl[0]},${sl[1]} h${x} V${il[1]} H${il[0]} `;
	    if(il[1] < ymin) ymin = il[1];
	    if(il[1] > ymax) ymax = il[1];
	}
	svgSetDClas(svgAddNu(this.svg, 'path'), d, 'strok');
	this.conduitAdd(new Conduit(this.svg, inv.linkDcV[0][0] - 30, 0.5*(ymin + ymax), 0.5*(ymax - ymin) + 6,
				    'C1', Emt_1, 19,
				    Wire_pv_10, Wire_pv_10, Wire_pv_10, Wire_pv_10, Wire_pv_10, Wire_pv_10,
				    Wire_thhn_10_grn));
    }
    
    popu() {
	const env = new OneEnv();
	const sys = new SiteB(env, SiteB.LayoutById['Q475/Q400']);
	
	let y = 30;
	const stringV = []; 
	for(const string of sys.invsys.stringV) {
	    stringV.push(new StringOptGroup(this, this.svg, 20, y, string.id));
	    y += 120;
	}
	const utility = new Utility(this.svg, 680, 24);
	const meter = new MeterGroup(this.svg, 620, y = 36, 'METER');
	const mep = new LcGroup(this.svg, 520, y, 'MEP', LcSquaredQO130M200,
				175, Breaker_QOM2175VH, 60, Breaker_QO260CP);
	const disco = new DiscoGroup(this.svg, 410, y = mep.linkOcpdLB[1], 'DISCO');
	const inv = new InverterGroup(this.svg, 220, y, 'INVERTER', SolarEdgeSe11400h_us000bni4);

	const ct = new Ct(this.svg, mep.linkCt[0], mep.linkCt[1], 'CT');
	
	this.wireStringVInv(stringV, inv);
	svgSetDClas(svgAddNu(this.svg, 'path')
		    , `M${inv.linkAc[0]},${inv.linkAc[1]} L${disco.linkL[0]},${disco.linkL[1]}`
		    + `M${disco.linkR[0]},${disco.linkR[1]} L${mep.linkOcpdLB[0]},${mep.linkOcpdLB[1]}`
		    + `M${inv.linkCt[0]},${inv.linkCt[1]} h30 V${inv.linkAc[1] - 6} H${disco.linkL[0] - 20}`
		    + ` v-40 H${disco.linkR[0] + 20} v40 H${mep.linkOcpdLB[0] - 20} V${mep.linkCt[1]} H${mep.linkCt[0]}`
		    + `M${mep.linkFeed[0]},${mep.linkFeed[1]} L${meter.linkL[0]},${meter.linkL[1]}`
		    + `M${meter.linkR[0]},${meter.linkR[1]} H${utility.link[0]} V${utility.link[1]}`
		    , 'strok');

	this.conduitAdd(new Conduit(this.svg, inv.linkAc[0] + 40, inv.linkAc[1], 12,
				    'C2', Emt_34, 2,
				    Wire_thhn_6_blk,
				    Wire_thhn_6_red,
				    Wire_thhn_8_wht,
				    Wire_thhn_8_grn,
				    Wire_tffn_18_blk, Wire_tffn_18_wht,
				    Wire_tffn_18_blk, Wire_tffn_18_wht,
				   ));
	this.conduitAdd(new Conduit(this.svg, disco.linkR[0] + 48, disco.linkR[1], 12,
				    'C3', Emt_34, 2,
				    Wire_thhn_6_blk,
				    Wire_thhn_6_red,
				    Wire_thhn_8_wht,
				    Wire_thhn_8_grn,
				    Wire_tffn_18_blk, Wire_tffn_18_wht,
				    Wire_tffn_18_blk, Wire_tffn_18_wht,
				   ));
	
	let row = document.getElementById('desRowBot');
	let col = oneDesRowColNu(row);

	const modPartQtyD = {};
	const optPartQtyD = {};
	for(const string of sys.invsys.stringV)
	    col.appendChild(string.desBox(modPartQtyD, optPartQtyD));

	col = oneDesRowColNu(row);
	for(const partQty of Object.values(modPartQtyD))
	    col.appendChild(partQty.part.desBox(partQty.part.nick, partQty.qty));
	for(const partQty of Object.values(optPartQtyD))
	    col.appendChild(partQty.part.desBox(partQty.part.nick, partQty.qty));

	col = oneDesRowColNu(row);
	col.appendChild(sys.invsys.invPart.desBox(inv.lab, 1));
	col.appendChild(DisconnectLnf222ra.desBox(disco.lab, 1));
	col.appendChild(mep.desBox());
	col.appendChild(SolarEdgeCt225.desBox(ct.lab, 1));

	row = eleNuClasAdd('div', 'desRow', this.div);
	row.style.position = 'absolute';
	row.style.top = '220px';
	row.style.left = '200px';
	for(const conduit of this.conduitV) {
	    row.appendChild(conduit.desBox());
	}
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// bodyOnload

function oneBodyOnload() {
    const one = new SiteBOneLine(document.getElementById('oneMeat'), document.getElementById('oneMeatSvg'));
    one.popu();
}
