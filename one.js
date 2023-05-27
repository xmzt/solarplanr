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
    svgSetXY(t, bx + tpad, by + tr.height, 'label');
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
    
function InverterGroup(dst, x, y, lab) {
    groupLabel(dst, svgAddUseXYHref(dst, x, y, '#inverter_110x0').getBBox(), 10, lab);
    this.lab = lab;
    this.linkDc0 = [ x + 0, y - 6 ];
    this.linkDc1 = [ x + 0, y + 0 ];
    this.linkDc2 = [ x + 0, y + 6 ];
    this.linkAc = [ x + 110, y + 0 ];
    this.linkCt = [ x + 100, y - 24 ];
}

function StringOptGroup(dst, x, y, lab) {
    groupLabel(dst, svgAddUseXYHref(dst, x, y, '#stringOpt_114x66').getBBox(), 10, lab);
    this.lab = lab;
    this.linkR = [ x + 114, y + 66 ];
}

function DiscoGroup(dst, x, y, lab) {
    groupLabel(dst, svgAddUseXYHref(dst, x, y, '#sw_24x0').getBBox(), 10, lab);
    this.lab = lab;
    this.linkL = [ x + 0, y + 0 ];
    this.linkR = [ x + 24, y + 0 ];
}

function MepGroup_36x134(dst, x, y, lab) {
    groupLabel(dst, svgAddUseXYHref(dst, x, y, '#mep_36x134').getBBox(), 10, lab);
    this.lab = lab;
    this.linkFeed = [ x + 18, y + 0 ];
    this.linkOcpdLB = [ x + 0, y + 134 ];
    this.linkCt = [ x + 18, y + 12 ];
}

function MeterGroup(dst, x, y, lab) {
    groupLabel(dst, svgAddUseXYHref(dst, x, y, '#meter_R8').getBBox(), 10, lab);
    this.lab = lab;
    this.linkL = [ x - 8, y + 0 ];
    this.linkR = [ x + 8, y + 0 ];
}

function Utility(dst, x, y) {
    svgAddUseXYHref(dst, x, y, '#utility');
    this.link = [ x, y ];
}

//-----------------------------------------------------------------------------------------------------------------------
// description boxes

function desStringOpt(dst, lab, ...rowV) {
    const box = dst.appendChild(temClone('desStringOpt_tem'));
    box.firstElementChild.firstElementChild.textContent = lab;
    const tab = box.children[1];
    for(const [qty, mod, opt] of rowV) {
	const tr = tab.insertRow(-1);
	tr.insertCell(-1).textContent = qty;
	tr.insertCell(-1).textContent = mod;
	tr.insertCell(-1).textContent = opt;
    }
}

function desModule(dst, lab, head, ...lineV) {
    const box = dst.appendChild(temClone('desModule_tem'));
    box.firstElementChild.firstElementChild.textContent = lab;
    box.firstElementChild.children[1].innerHTML = head;
    for(const line of lineV)
	box.children[1].appendChild(document.createElement('div')).innerHTML = line;
}
 
//-----------------------------------------------------------------------------------------------------------------------
// OneLine

class OneLine {
    constructor(div, svg) {
	this.div = div;
	this.svg = svg;
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// SiteBOneLine

class SiteBOneLine extends OneLine {
    constructor(div, svg) {
	super(div, svg);
	this.partByLab = {
	    M1: PanelQ400,
	    M2: PanelQ475,
	    O1: SolarEdgeP400,
	    O2: SolarEdgeS500,
	    I1: SolarEdgeSe11400h_us000bni4,
	};
    }
    
    popu() {
	let y = 30;
	const s1 = new StringOptGroup(this.svg, 20, y, 'STRING1');
	const s2 = new StringOptGroup(this.svg, 20, y += 120, 'STRING2');
	const s3 = new StringOptGroup(this.svg, 20, y += 120, 'STRING3');
	const utility = new Utility(this.svg, 680, 24);
	const meter = new MeterGroup(this.svg, 620, y = 36, 'METER');
	const mep = new MepGroup_36x134(this.svg, 520, y, 'MEP');
	const disco = new DiscoGroup(this.svg, 410, y = mep.linkOcpdLB[1], 'DISCO');
	const inv = new InverterGroup(this.svg, 220, y, 'INVERTER');

	svgSetXYHref(svgAddNu(this.svg, 'use'), mep.linkCt[0], mep.linkCt[1], '#ctL_R8');
	
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

	const col = this.div.querySelector('.desCol');
	desStringOpt(col, s1.lab, [ 1, 'Q.PEAK.400', 'SolarEdge.S500' ], [ 8, 'Q.PEAK.475', 'SolarEdge.S500' ]);
	desStringOpt(col, s2.lab, [ 1, 'Q.PEAK.400', 'SolarEdge.S500' ], [ 8, 'Q.PEAK.475', 'SolarEdge.S500' ]);
	desStringOpt(col, s3.lab, [ 10, 'Q.PEAK.400', 'SolarEdge.P400' ]);

	desModule(col, 'Q.PEAK.400', 'PV Module',
		  'Make: Q CELLS Q.PEAK blah blah',
		  'Output: 400W',
		  'Total quantity: 12');



    }
}

//-----------------------------------------------------------------------------------------------------------------------
// bodyOnload

function oneBodyOnload() {
    const one = new SiteBOneLine(document.getElementById('oneMeat'), document.getElementById('oneMeatSvg'));
    one.popu();
}
