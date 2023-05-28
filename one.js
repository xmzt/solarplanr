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

function partDesBox(dst, head0, head1, ...lineV) {
    const box = dst.appendChild(temClone('partDesBox_tem'));
    box.firstElementChild.firstElementChild.innerHTML = head0;
    box.firstElementChild.children[1].innerHTML = head1;
    for(const line of lineV) 
	eleNuAdd('div', box.children[1]).innerHTML = line;
    return box;
}

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

function conduitLabel(dst, x, y, ry, lab) {
    svgSetCxCyRxRyClas(svgAddNu(dst, 'ellipse'), x, y, 0.75*ry, ry, 'strok');
    y += ry;
    svgSetDClas(svgAddNu(dst, 'path'), `M${x},${y} v20`, 'strok');
    y += 20;
    const t = svgAddText(dst, 'label', lab);
    const tr = t.getBBox();
    svgSetXY(t, x - 0.5*tr.width, y + tr.height);
}
    
class PartN {
    constructor(part) {
	this.part = part;
	this.n = 0;
    }
    inc(n) {
	this.n += n;
    }
}
    
class StringOptGroup {
    constructor(one, dst, x, y, lab, ...nModOptV) {
	groupLabel(dst, svgAddUseXYHref(dst, x, y, '#stringOpt_114x66').getBBox(), 10, lab);
	this.one = one;
	this.lab = lab;
	this.linkR = [ x + 114, y + 66 ];
	this.nModOptV = nModOptV;
	for(const [n,mod,opt] of nModOptV) {
	    this.one.modInc(mod, n);
	    this.one.optInc(opt, n);
	}
    }

    desBox(dst) {
	const box = dst.appendChild(temClone('desStringOpt_tem'));
	box.firstElementChild.firstElementChild.textContent = this.lab;
	const tab = box.children[1];
	for(const [n,mod,opt] of this.nModOptV) {
	    const tr = tab.insertRow(-1);
	    tr.insertCell(-1).textContent = n;
	    tr.insertCell(-1).textContent = mod.nick;
	    tr.insertCell(-1).textContent = opt.nick;
	}
    }
}

class InverterGroup {
    constructor(dst, x, y, lab, part) {
	groupLabel(dst, svgAddUseXYHref(dst, x, y, '#inverter_110x0').getBBox(), 10, lab);
	this.lab = lab;
	this.linkDc0 = [ x + 0, y - 6 ];
	this.linkDc1 = [ x + 0, y + 0 ];
	this.linkDc2 = [ x + 0, y + 6 ];
	this.linkAc = [ x + 110, y + 0 ];
	this.linkCt = [ x + 100, y - 24 ];
	this.part = part;
    }

    desBox(dst) {
	partDesBox(dst, this.lab, 'Inverter',
		   `Make: ${this.part.make}`,
		   `Model: ${this.part.model}`,
		   `DC Watts: ${this.part.dcWatts}`,
		   `AC Watts: ${this.part.acWatts}`,
		   
		  );
    }
}

class DiscoGroup {
    constructor(dst, x, y, lab, part) {
	groupLabel(dst, svgAddUseXYHref(dst, x, y, '#sw_24x0').getBBox(), 10, lab);
	this.lab = lab;
	this.linkL = [ x + 0, y + 0 ];
	this.linkR = [ x + 24, y + 0 ];
	this.part = part;
    }

    desBox(dst) {
	partDesBox(dst, this.lab, 'AC Disconnect',
		   `Make: ${this.part.make}`,
		   `Model: ${this.part.model}`,
		   this.part.boxDesc,
		  );
    }
}

class LoadCenterGroup {
    constructor(dst, x, y, lab, part, ocpdMainA, ocpdMainPart, ocpdInvA, ocpdInvPart) {
	groupLabel(dst, svgAddUseXYHref(dst, x, y, '#loadCenter_36x134').getBBox(), 10, lab);
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

    desBox(dst) {
	partDesBox(dst, this.lab, 'Load center',
		   `Make: ${this.part.make}`,
		   `Model: ${this.part.model}`,
		   this.part.boxDesc,
		   `Breaker, main: ${this.ocpdMainA}A ${this.ocpdMainPart.model}`,
		   `Breaker, inverter: ${this.ocpdInvA}A ${this.ocpdInvPart.model}`,
		  );
    }
}

class Ct {
    constructor(dst, x, y, lab, part) {
	svgAddUseXYHref(dst, x, y, '#ctL_R8');
	const t = svgAddText(dst, 'label', lab);
	const tr = t.getBBox();
	const tpad = tr.height + tr.y;
	svgSetXY(t, x + 2 + tpad, y - 0.5*tr.y);
	this.lab = lab;
	this.link = [ x - 2, y + 0 ];
	this.part = part;
    }

    desBox(dst) {
	partDesBox(dst, this.lab, 'Current transformer',
		   `Make: ${this.part.make}`,
		   `Model: ${this.part.model}`,
		   this.part.boxDesc,
		  );
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

function modDesBox(dst, part, n) {
    partDesBox(dst, part.nick, 'PV Module',
	       `Make: ${part.make}`,
	       `Model: ${part.model}`,
	       `Watts: ${part.watts}`,
	       `Voc: ${part.voc}`,
	       `Isc: ${part.isc}`,
	       `Quantity: ${n}`,
	      );
}

function optDesBox(dst, part, n) {
    partDesBox(dst, part.nick, 'Optimizer',
	       `Make: ${part.make}`,
	       `Model: ${part.model}`,
	       `Input: ${part.watts}W, ${part.vin}V, ${part.iin}A`,
	       `Output: ${part.watts}W, ${part.vout}V, ${part.iout}A`,
	       `Quantity: ${n}`,
	      );
}

function desColNu(row) {
    const col = eleNuClasAdd('div', 'desCol', desRow);
    eleNuClasAdd('div', 'desBox0', col);
    return col;
}

//-----------------------------------------------------------------------------------------------------------------------
// OneLine

class OneLine {
    constructor(div, svg) {
	this.div = div;
	this.svg = svg;
	this.modNByPid = {};
	this.optNByPid = {};
    }

    modInc(mod, n) { (this.modNByPid[mod.id] ??= new PartN(mod)).inc(n); }
    optInc(opt, n) { (this.optNByPid[opt.id] ??= new PartN(opt)).inc(n); }
}

//-----------------------------------------------------------------------------------------------------------------------
// SiteBOneLine

class SiteBOneLine extends OneLine {
    constructor(div, svg) {
	super(div, svg);
    }
    
    popu() {
	let y = 30;
	const s1 = new StringOptGroup(this, this.svg, 20, y, 'STRING1',
				      [ 1, PanelQ400, SolarEdgeS500 ],
				      [ 8, PanelQ475, SolarEdgeS500 ]);
	const s2 = new StringOptGroup(this, this.svg, 20, y += 120, 'STRING2',
				      [ 1, PanelQ400, SolarEdgeS500 ],
				      [ 8, PanelQ475, SolarEdgeS500 ]);
	const s3 = new StringOptGroup(this, this.svg, 20, y += 120, 'STRING3',
				      [ 10, PanelQ400, SolarEdgeP400 ]);
	const utility = new Utility(this.svg, 680, 24);
	const meter = new MeterGroup(this.svg, 620, y = 36, 'METER');
	const mep = new LoadCenterGroup(this.svg, 520, y, 'MEP', LoadCenterSquaredQO130M200,
					175, Breaker_QOM2175VH, 60, Breaker_QO260CP);
	const disco = new DiscoGroup(this.svg, 410, y = mep.linkOcpdLB[1], 'DISCO', DisconnectLnf222ra);
	const inv = new InverterGroup(this.svg, 220, y, 'INVERTER', SolarEdgeSe11400h_us000bni4);

	const ct = new Ct(this.svg, mep.linkCt[0], mep.linkCt[1], 'CT', SolarEdgeCt225);
	
	svgSetDClas(svgAddNu(this.svg, 'path')
		    , `M${s1.linkR[0]},${s1.linkR[1]} h20 V${inv.linkDc0[1]} H${inv.linkDc0[0]}`
		    + `M${s2.linkR[0]},${s2.linkR[1]} h26 V${inv.linkDc1[1]} H${inv.linkDc1[0]}`
		    + `M${s3.linkR[0]},${s3.linkR[1]} h32 V${inv.linkDc2[1]} H${inv.linkDc2[0]}`
		    + `M${inv.linkAc[0]},${inv.linkAc[1]} L${disco.linkL[0]},${disco.linkL[1]}`
		    + `M${disco.linkR[0]},${disco.linkR[1]} L${mep.linkOcpdLB[0]},${mep.linkOcpdLB[1]}`
		    + `M${inv.linkCt[0]},${inv.linkCt[1]} h30 V${inv.linkAc[1] - 6} H${disco.linkL[0] - 20}`
		    + ` v-40 H${disco.linkR[0] + 20} v40 H${mep.linkOcpdLB[0] - 20} V${mep.linkCt[1]} H${mep.linkCt[0]}`
		    + `M${mep.linkFeed[0]},${mep.linkFeed[1]} L${meter.linkL[0]},${meter.linkL[1]}`
		    + `M${meter.linkR[0]},${meter.linkR[1]} H${utility.link[0]} V${utility.link[1]}`
		    , 'strok');

	conduitLabel(this.svg, inv.linkDc1[0] - 30, inv.linkDc1[1], 12, 'C1');
	conduitLabel(this.svg, inv.linkAc[0] + 40, inv.linkAc[1], 12, 'C2');
	conduitLabel(this.svg, disco.linkR[0] + 48, disco.linkR[1], 12, 'C2');

	const desRow = document.getElementById('desRow');

	let col = desColNu(desRow);
	for(const s of [s1,s2,s3])
	    s.desBox(col);

	col = desColNu(desRow);
	for(const partN of Object.values(this.modNByPid))
	    modDesBox(col, partN.part, partN.n);

	col = desColNu(desRow);
	for(const partN of Object.values(this.optNByPid))
	    optDesBox(col, partN.part, partN.n);

	col = desColNu(desRow);
	inv.desBox(col);
	disco.desBox(col);
	mep.desBox(col);
	ct.desBox(col);
	

    }
}

//-----------------------------------------------------------------------------------------------------------------------
// bodyOnload

function oneBodyOnload() {
    const one = new SiteBOneLine(document.getElementById('oneMeat'), document.getElementById('oneMeatSvg'));
    one.popu();
}
