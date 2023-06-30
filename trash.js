class StringOptGroup {
    constructor(one, dst, x, y, id) {
	groupLabel(dst, svgUseXYHrefAdd(x, y, '#stringOpt_114x66', dst).getBBox(), 10, id);
	this.one = one;
	this.linkR = [ x + 114, y + 66 ];
    }
}

class LcGroup {
    constructor(dst, x, y, lab, part, ocpdMainA, ocpdMainPart, ocpdInvA, ocpdInvPart) {
	groupLabel(dst, svgUseXYHrefAdd(x, y, '#lc_36x134', dst).getBBox(), 10, lab);
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
	svgSetD(svgNuClasAdd('path', 'strok', this.svg), d);
	this.conduitAdd(new Conduit(this.svg, inv.linkDcV[0][0] - 30, 0.5*(ymin + ymax), 0.5*(ymax - ymin) + 6,
				    'C1', Emt_1, 19,
				    Wire_pv_10, Wire_pv_10, Wire_pv_10, Wire_pv_10, Wire_pv_10, Wire_pv_10,
				    Wire_thhn_10_grn));
    }
    
    popu() {
	const site = SiteB.NuByDes['Q475/Q400'](new OneEnv());

	let y;
	site.utility.oneAdd(this.svg, 640, 24);
	site.meter.oneAdd(this.svg, 590, y = 36);
	site.mep.oneAdd(this.svg, 486, y);
	//const ct = new Ct(this.svg, mep.linkCt[0], mep.linkCt[1], 'CT');
	site.disco.oneAdd(this.svg, 380, y = site.mep.linkOcpdLB[1]);
	site.inv.oneAdd(this.svg, 220, y);
	y = 30;
	for(const string of site.inv.stringV) {
	    string.oneAdd(this.svg, 20, y);
	    y += 120;
	}

	site.inv.oneWire(this.svg);
	svgSetD(svgNuClasAdd('path', 'strok', this.svg)
		, `M${inv.linkAc[0]},${inv.linkAc[1]} L${disco.linkL[0]},${disco.linkL[1]}`
		+ `M${disco.linkR[0]},${disco.linkR[1]} L${mep.linkOcpdLB[0]},${mep.linkOcpdLB[1]}`
		+ `M${inv.linkCt[0]},${inv.linkCt[1]} h20 V${inv.linkAc[1] - 6} H${disco.linkL[0] - 20}`
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
	this.conduitAdd(new Conduit(this.svg, disco.linkR[0] + 40, disco.linkR[1], 12,
				    'C3', Emt_34, 2,
				    Wire_thhn_6_blk,
				    Wire_thhn_6_red,
				    Wire_thhn_8_wht,
				    Wire_thhn_8_grn,
				    Wire_tffn_18_blk, Wire_tffn_18_wht,
				    Wire_tffn_18_blk, Wire_tffn_18_wht,
				   ));
	
	let row = this.div.appendChild(eleNuClas('div', 'desRowBot'));
	let col = desRowBotColNu(row);

	const modPartQtyD = {};
	const optPartQtyD = {};
	for(const string of sys.invsys.stringV)
	    col.appendChild(string.desBox(modPartQtyD, optPartQtyD));

	col = desRowBotColNu(row);
	for(const [part,qty] of Object.values(modPartQtyD))
	    col.appendChild(part.desBox(part.nick, qty));
	for(const [part,qty] of Object.values(optPartQtyD))
	    col.appendChild(part.desBox(part.nick, qty));

	col = desRowBotColNu(row);
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

class Port {
    tx(funK, ...argV) {
	for(let next = this.next; next !== this; next = next.next)
	    next[funK].apply(next, argV);
    }

    static passthroughPair(targ) {
	const a = new Port();
	const b = new Port();
	a.isourceIsink = (isource,isink) => {
	    targ.imaxSet(Math.max(isource,isink));
	    b.tx('isourceIsink', isource, isink);
	}
	b.isourceIsink = (isource,isink) => {
	    targ.imaxSet(Math.max(isource,isink));
	    a.tx('isourceIsink', isource, isink);
	}
	return [a,b];
    }

    static connect2(a, b) {
	a.next = b;
	b.next = a;
    }
}

class OffPort extends Port {
    constructor(up, xOff, yOff) {
	this.up = up;
	this.xOff = xOff;
	this.yOff = yOff;
    }

}

class Inv {
    oneLayout0(dst) {
	this.oneG = svgNuAdd('g', dst);
	svgUseXYHrefAdd(0, 0, '#inverter_60x0', this.oneG);
	svgSetD(svgNuClasAdd('path', 'strok', this.oneG), `M0,0 H${-6*(this.dcPortV.length-1)}`);
	oneBoxOutlineLabel(this.oneG, this.oneG.getBBox(), OneGroupLabelPad, this.id);

	let d = '';
	for(let i = 0, x = 20; i < this.dcPortV.length; ++i, x += 6) {
	    const sl = this.dcPortV[i].linkR;
	    const il = this.linkDcV[i];
	    d += `M${sl[0]},${sl[1]} h${x} V${il[1]} H${il[0]} `;
	    if(il[1] < ymin) ymin = il[1];
	    if(il[1] > ymax) ymax = il[1];
	}
	svgSetD(svgNuClasAdd('path', 'strok', dst), d);
	//todo(.getBBox(), 10, this.id);
    }
    
    oneAdd(dst, x, y) {
	groupLabel(dst, svgUseXYHrefAdd(x, y, '#inverter_80x0', dst).getBBox(), 10, this.id);
	this.linkDcV = [
	    [ x + 0, y - 6 ],
	    [ x + 0, y + 0 ],
	    [ x + 0, y + 6 ],
	];
	this.linkAc = [ x + 80, y + 0 ];
	this.linkCt = [ x + 80, y - 24 ];
    }

    oneWire(dst) {
	let ymin = Number.POSITIVE_INFINITY;
	let ymax = Number.NEGATIVE_INFINITY;
	let d = '';
	for(let i = 0, x = 20; i < this.dcPortV.length; ++i, x += 6) {
	    const sl = this.dcPortV[i].linkR;
	    const il = this.linkDcV[i];
	    d += `M${sl[0]},${sl[1]} h${x} V${il[1]} H${il[0]} `;
	    if(il[1] < ymin) ymin = il[1];
	    if(il[1] > ymax) ymax = il[1];
	}
	svgSetD(svgNuClasAdd('path', 'strok', dst), d);
	//todothis.conduitAdd(new Conduit(dst, this.linkDcV[0][0] - 30, 0.5*(ymin + ymax), 0.5*(ymax - ymin) + 6,
	//'C1', Emt_1, 19,
	//Wire_pv_10, Wire_pv_10, Wire_pv_10, Wire_pv_10, Wire_pv_10, Wire_pv_10,
	//Wire_thhn_10_grn));
    }
}

class seinv {
    oneBoxX0Get() { return this.up.oneBox.x0; }

    oneBoxX0Nego(prio, val) {
	if(this.up.oneBox.x0Nego(prio, val))
	    this.mate.oneBoxXMateChange();
    }

    oneXMateChange() {
	if(this.index == this.up.dcPortV.length - 1) {
	    this.up.oneBox.x0Nego(NegoPrio.Mate, this.mate.oneBoxX1Get() + 10);
	} else {
	    this.up.dcPortV[this.index + 1].oneBoxX0Nego(NegoPrio.Mate, this.mate.oneBoxX1Get() + 10);
	}
    }
}

class ModstringPort extends Port2 {
    oneBoxX0Get() { return this.up.oneBox.x0; }

    oneBoxX0Nego(prio, val) {
	if(this.up.oneBox.x0Nego(prio, val))
	    this.mate.oneBoxXMateChange();
    }

    oneBoxXMateChange() {
	this.up.oneBox.x1Nego(NegoPrio.Mate, this.mate.oneBoxX0Get() + 10);

    }

    // s1.port.oneBoxX0Nego(User, 10)
    // s1.port.mate.xMateChange

}




const x0L = wallA.x1 - (wallA.y1 - wallA.y0) * pitchX / pitchY;
	let bx = x0L + 400;
	let by = y0 + 400 * pitchY / pitchX;
	ax = bx - 517.5 * pitchX / pitchH;
	ay = by - 517.5 * pitchY / pitchH;
	const rafterL = new Quad(ax,ay, ax,ay+dy, bx,by+dy, bx,by);
	bx += Wid_x1;
	const ridgeBoard = new Xyxy(rafterL.x2,rafterL.y2-Wid_x8, bx, rafterL.y2);
	ax = bx + rafterL.x3 - rafterL.x0;
	const rafterR = new Quad(ax,ay, ax,ay+dy, bx,by+dy, bx,by);
	const x0R = bx + rafterL.x3 - x0L;
	const joist = new Xyxy(x0L,y0-Wid_x10, x0R,y0);
	
	this.svg.appendChild(wallA.svgNuClas('strok'));
	this.svg.appendChild(wallB.svgNuClas('strok'));
	this.svg.appendChild(wallD.svgNuClas('strok'));
	this.svg.appendChild(rafterL.svgNuClas('strok'));
	this.svg.appendChild(ridgeBoard.svgNuClas('strok'));
	this.svg.appendChild(rafterR.svgNuClas('strok'));
	this.svg.appendChild(joist.svgNuClas('strok'));



    .acqTab TD:nth-child(1) { text-align:right; }
.acqTab TD:nth-child(2) { text-align:right; }
.acqTab TD:nth-child(3) { text-align:right; }
.acqTab TD:nth-child(4) { text-align:right; }

.leftoverTab TD:nth-child(1) { text-align:right; }
.leftoverTab TD:nth-child(2) { text-align:right; }
.leftoverTab TD:nth-child(3) { text-align:right; }
.leftoverTab TD:nth-child(4) { text-align:right; }

.row { display:block flex; flex-direction:row; }
.rowFlex0 { flex:0 0 auto; }
.rowFlex1 { flex:1 1 auto; }
.rowFlex1Pad { flex:1 1 auto; padding-left:2px; }


Roof()
Roof.canDraw(ctx);

Rack(partSub);
Rack.panelFin(roof);
Rack.canDraw(ctx);
RackTwoRail.railGroupGo(railGroup);

Invsys(partSub);
Invsys.panelFin();

class Sys {
    invsysGetOrNu(clas) {
	return this.invsysByClasId[clas.ClasId] ??= new clas(this);
    }

    jboxSet(x) {
	this.jboxP = x;
    }

    rackAdd(rack) {
	this.rackV.push(rack);
    }

    railGroupGetOrNu(clas) {
	return this.railGroupByClasId[clas.ClasId] ??= this.railGroupAdd(new clas(this));
    }

    railGroupAdd(railGroup) {
	this.railGroupDiagVElem.appendChild(railGroup.diagElem);
	return railGroup;
    }
    roofAdd(roof) {
	this.roofV.push(roof);
	roof.partSubI = this.partTab.subAdd(roof.id);
    }

    solarEdgeStringGetOrNu(id) {
	return this.solarEdgeStringById[id] ??= [];
    }
    sysFin() {
	for(const roof of this.roofV)
	    roof.sysFin();
	for(const rack of this.rackV)
	    rack.sysFin();
	for(const k in this.railGroupByClasId) {
	    this.partTab.pendInc();
	    this.railGroupByClasId[k].railWkrReq();
	}
	for(const k in this.invsysByClasId)
	    this.invsysByClasId[k].sysFin();
    }

    terminate() {
	this.railWkrCtrl.terminate();
	for(const roof of this.roofV)
	    roof.ctxClearAll();
    }
}




//-----------------------------------------------------------------------------------------------------------------------
// old

class SiteB_RoofOld extends Roof {
    constructor(sys) {
	this.bpVSet([
	    this.aa = new P2(0,0),
	    this.ac = this.aa.addY(242 * 2.54), // n side, eave to ridge, 242"
	    this.bc = this.ac.addX(161 * 2.54), // ridge, drop to n side, 161" 
	    this.bd = this.bc.addY(20 * 2.54), // drop, 20"
	    this.dd = this.bd.addX(360 * 2.54), // ridge, s side to drop, 360"
	    this.db = this.dd.addY(-201 * 2.54), // s side, eave to ridge, 201"
	    this.cb = this.db.addX(-236 * 2.54), // eave, s side to hike, 236"
	    this.ca = this.cb.addY(-62 * 2.54), // hike, 62"
	    this.aa1 = this.ca.addX(-282.5 * 2.54), // eave, hike to n side, 282.5"
	]);
	this.edgeV = l2VFromP2V(this.bpV);
	this.edgePathV = edgePathVCwClose(this.edgeV);

	this.rafterV = [];
	for(let x = this.aa.x + 6; x <= this.cb.x; x += 16 * 2.54) {
	    this.rafterV.push(new L2(x, this.aa.y, x, this.dd.y));
	}
	for(let x = this.dd.x - 6; x > this.cb.x; x -= 16 * 2.54) {
	    this.rafterV.push(new L2(x, this.aa.y, x, this.dd.y));
	}

	this.fireWalkV = [
	    new R2(this.db.x - FireWalkWidth, this.db.y, this.dd.x, this.dd.y),
	];
	
	this.pipeV = [ new C2((this.cb.x + this.db.x)/2, this.db.y + 30, 5/2.0) ];

	let x = this.aa.x + 30;
	let y = (this.aa.y + this.ac.y)/2;
	this.vent0 = new R2(x, y, x + 31, y + 31);
	x = this.vent0.x1 + 39 * 30.48;
 	this.ventV = [ this.vent0, new R2(x, y, x + 31, y + 31) ];
    }
}


class Roof {
    
    constructor(sys, id, canElem, canRailElem) {
	this.sys = sys;
	this.id = id;
	this.canElem = canElem;
	this.canRailElem = canRailElem;
    }

    partAdd(part, n) {
	this.sys.partTab.partAdd(part, n, this.partSubI);
    }

    partAddPanel(part, n) {
	this.sys.partTab.partAddPanel(part, n, this.partSubI);
    }

    canDraw(ctx) {
	this.ctx = this.canSizeCtx(this.canElem);
	this.ctxRail = this.canSizeCtx(this.canRailElem);
    }
	// draw

    
}

class IronRidgeXRRack10Camo extends IronRidgeXRRackCamo {
    static IdHtml = 'IronRidge XR10, end:camo';
    static RailGroupClas = IronRidgeXR10RailGroup;
}

class IronRidgeXRRack10Stopper extends IronRidgeXRRackStopper {
    static IdHtml = 'IronRidge XR10, end:stopper';
    static RailGroupClas = IronRidgeXR10RailGroup;
}

class IronRidgeXRRack100Camo extends IronRidgeXRRackCamo {
    static IdHtml = 'IronRidge XR100, end:camo';
    static RailGroupClas = IronRidgeXR100RailGroup;
}

class IronRidgeXRRack100Stopper extends IronRidgeXRRackStopper {
    static IdHtml = 'IronRidge XR100, end:stopper';
    static RailGroupClas = IronRidgeXR100RailGroup;
}



class SvgText {
    constructor(dst, clas, text) {
	this.ele = svgAddText(dst, 'label', lab);
	this.eleB = this.ele.getBBox();
	this.pad = this.eleB.height + this.eleB.y;
    }
    
    posUR(x, y) {
	svgSetXY(this.ele, x, y - this.pad);
	this.bbox = [ x, y - this.eleB.height, this.eleB.width, this.eleB.height ];
	return this;
    }
    
    posDR(x, y) {
	svgSetXY(this.ele, x, y - this.eleB.y);
	this.bbox = [ x, y, this.eleB.width, this.eleB.height ];
	return this;
    }
}

    
class DesBox {
    constructor(dst0, lab) {
	const dst = this.dst = svgAddNu(dst0, 'svg');
	this.border = svgAddNu(dst, 'rect');
	const t = SvgText(dst, 'label', lab);
	t.posDR(t.pad, t.pad);
	this.y = t.bbox[1] + t.bbox[3];
    }

    line(text) {
	const t = SvgText(dst, 'label', text);
	
	
	labObj.posDR(labObj.pad, labObj.pad);
	
	
	const t = svgAddText(dst, 'label', lab);
	const tr = t.getBBox();
	const tpad = tr.height + tr.y;

	svgSetXY(t, bx + tpad, by + tr.height, 'label');
	
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
}

	
//-----------------------------------------------------------------------------------------------------------------------
// derivative

function comLabelR(dst, refB, id, ...noteV) {
    let bbox = comTextBoxed(dst, refB.x + refB.width + 2, refB.y, 'label', 'strok', id).getBBox();
    let y = bbox.y;
    for(const note of noteV) {
	y += bbox.height;
	bbox = svgTextBelow(dst, bbox.x, y, 'label', note).getBBox();
    }
}

function comIdBoxT(dst, refB, id) {
    const idText = dst.appendChild(svgTextHidden(id));
    const idB = idText.getBBox();
    const pad = idB.height + idB.y;
    const textY = refB
    svgTextUnhide(idText, refB.x + pad, refB.y - 2 - pad, 'label');
    const boxH = idB.height + pad;
    dst.appendChild(svgRect(refB.x, refB.y - 2 - boxH, idB.width + pad + pad, boxH, 'strok'));
}

function comLabelB(dst, refB, id, ...noteV) {
    let bbox = comTextBoxed(dst, refB.x, refB.y + refB.height + 2, 'label', 'strok', id).getBBox();
    console.log('comLabelB', refB, bbox);
    let y = bbox.y;
    for(const note of noteV) {
	y += bbox.height;
	bbox = svgTextBelow(dst, bbox.x, y, 'label', note).getBBox();
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// bounds accumulator

function bounNu() {
    return new R2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY,
		  Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
}

function bounBbox(boun, bbox) {
    if(bbox.x < boun.x0) boun.x0 = bbox.x;
    if(bbox.x > boun.x1) boun.x1 = bbox.x;
    if(bbox.y < boun.y0) boun.y0 = bbox.y;
    if(bbox.y > boun.y1) boun.y1 = bbox.y;
    const x1 = bbox.x + bbox.width;
    const y1 = bbox.y + bbox.height;
    if(x1 < boun.x0) boun.x0 = x1;
    if(x1 > boun.x1) boun.x1 = x1;
    if(y1 < boun.y0) boun.y0 = y1;
    if(y1 > boun.y1) boun.y1 = y1;
    return bbox;
}
       
function svgSymbolNu(id) {
    const ele = document.createElementNS('http://www.w3.org/2000/svg','symbol');
    ele.id = id;
    ele.setAttribute('overflow', 'visible');
    return ele;
}

	{
	    const cont = this.dst.appendChild(svgSymbolNu('bliza'));
	    svgText(cont, 4, 4, 'label', 'Label 4,4');
	    svgText(cont, 0, 20, 'label', 'Label 0,20');
	    console.log(cont);
	    //console.log('test0', cont.getBBox(), cont.getCTM(), cont.getScreenCTM());
	    const inst = this.dst.appendChild(svgUse(this.dst, 500, 200, '#bliza'));
	    console.log('test1', inst.getBBox(), inst.getCTM(), inst.getScreenCTM());
	    svgText(inst, 40, 20, 'label', 'Label 40,20');
	    console.log('test2', inst.getBBox(), inst.getCTM(), inst.getScreenCTM());
	}
	{
    	    const cont = this.dst.appendChild(svgSvgNu('bliza'));
	    svgText(cont, 4, 4, 'label', 'Label 4,4');
	    svgText(cont, 0, 20, 'label', 'Label 0,20');
	    console.log('test0', cont.getBBox(), cont.getCTM(), cont.getScreenCTM());
	    svgText(cont, 40, 20, 'label', 'Label 40,20');
	    console.log('test1', cont.getBBox(), cont.getCTM(), cont.getScreenCTM());
	    svgSetXY(cont, 500, 100);
	    console.log('test2', parseInt(cont.getAttribute('x')) + 69, cont.firstElementChild.getBBox());
	}



//-----------------------------------------------------------------------------------------------------------------------
// Rack
//-----------------------------------------------------------------------------------------------------------------------

class Rack {
    constructor() {
	this.panelV = [];
    }

    panelAdd(panel) {
	this.panelV.push(panel);
    }
    
    partAdd(col) {
	for(const panel of this.panelV)
	    col.partAdd(panel.shape.part, 1);
    }
    
    wattsGet() {
	return this.panelV.reduce((p,x) => p + x.shape.part.watts, 0);
    }

    draw(ctx) {
	for(const panel of this.panelV)
	    panel.draw(ctx);
    }

    dump(pre0, pre1) {
	console.log(pre0, `panelV`);
	for(const p of this.panelV)
	    console.log(pre1, `(${p.x0},${p.y0}) (${p.x1},${p.y1}) ${p.shape.part.des}`);
    }
    
    finalize(roof) {}
}

//-----------------------------------------------------------------------------------------------------------------------
// PartTab
//-----------------------------------------------------------------------------------------------------------------------

class PartTab {
    constructor(elemTbody) {
	this.elemTbody = elemTbody;
	this.colV = [];
	this.rowV = [];
	this.rowById = {};
	this.totalRow = new PartTabRow(elemTbody.querySelector('._totalTr'));
	this.totalRow.idCost = 0.00;
    }

    rowGetNew(part) { return this.rowById[part.id] ??= this.rowNew(part); }
    
    rowNew(part) {
	const row = new PartTabRow(temClone('partsTr_tem'));
	for(const col of this.colV) {
	    row[col.idN] = 0;
	    row[col.idCost] = 0;
	}
	part.desFill(row.tr.querySelector('._des'));
	row.price = part.priceFill(row.tr.querySelector('._price'));
	this.elemTbody.insertBefore(row.tr, this.totalRow.tr);
	this.rowV.push(row);
	return row;
    }

    rowAdd(row, col, n) {
	const costInc = n * row.price;
	row[col.idN] += n;
	row[col.idCost] += costInc;
	this.totalRow[col.idCost] += costInc;
	row.tr.querySelector(col.selN).textContent = toFixedMax(row[col.idN], 2);
	row.tr.querySelector(col.selCost).textContent = row[col.idCost].toFixed(2);
	this.totalRow.tr.querySelector(col.selCost).textContent = this.totalRow[col.idCost].toFixed(2);
	if(null !== col.up)
	    this.rowAdd(row, col.up, n);
s    }
}

class PartGroup {
    constructor(tab, up, idN, idCost, selN, selCost) {
	this.tab = tab;
	this.up = up;
	this.idN = idN;
	this.idCost = idCost;
	this.selN = selN;
	this.selCost = selCost;
	tab.colV.push(this);
	for(const row of tab.rowV) {
	    row[this.idN] = 0;
	    row[this.idCost] = 0;
	}
    }

    partAdd(part, n) { this.tab.rowAdd(this.tab.rowGetNew(part), this, n); }
}
    
class PartTabRow {
    constructor(tr) {
	this.tr = tr
    }
}

    go() {
	...
	this.col0 = new PartTabCol(this.tab, null, 'n', 'cost', '._n', '._cost');
	for(const lay of this.layV)
	    lay.col = new PartTabCol(this.tab, this.col0,
				     `${lay.id}N`, `${lay.id}Cost`, `._${lay.id}N`, `._${lay.id}Cost`);
	this.col0.partAdd(OtherParts, 1);
	this.logDiv = this.root.querySelector('._log');
	this.root.querySelector('._logShow').addEventListener('click', (ev) => this.logShowClick(ev));
	this.totalWatts = 0;
	this.railGroupSet = new Set();
	for(const lay of this.layV) {
	    lay.ctx = ctxFromCan(this.root.querySelector(`._${lay.id}Can`));
	    lay.roof.draw(lay.ctx);
	    lay.popu(lay.rack, lay.roof);
	    lay.rack.finalize(lay.roof);

	    lay.rack.draw(lay.ctx);
	    lay.rack.partAdd(lay.col);
	    this.railGroupSet.add(lay.railGroup);
	    for(const rail of lay.rack.railV)
		lay.railGroup.railAdd(rail, lay);
	    this.totalWatts += lay.rack.wattsGet();
	}
	this.tab.totalRow.tr.classList.add('pend');
	this.pendN = 1;
	for(const railGroup of this.railGroupSet.keys()) {
	    this.pendN++;
	    railGroup.railrPost(this);
	}
	this.pendNDec();
    }

    drawEdgePath(ctx) {
	
	const x = this.x1 - this.x0;
	const y = this.y1 - this.y0;
	const xy = Math.sqrt(x*x + y*y);
	ctx.save();
	ctx.transform(x/xy, y/xy, -y/xy, x/xy, this.x0, this.y0);
	ctx.fillStyle = EdgeFillStyle;
	ctx.beginPath();
	ctx.fillRect(0, 0, xy, -EdgeWidth);
	ctx.restore();
	return this;
    }

panelRow(roof, shape, panelV, iY) {
	this.panelV.push(...panelV);
	const pA = panelV[0]
	const pE = panelV[panelV.length-1]
	
	const sizeY = pA.y1 - pA.y0;
	const ys = [pA.y0 + shape.part.railOffL, pA.y1 - shape.part.railOffL];
	for(const y of ys) {
	    const rail = new L2(pA.x0, y, pE.x1, y);
	    this.railV.push(rail);
	    this.footV.push(...roof.footsGet(rail));
	    this.endV.push(new P2(pA.x0, y), new P2(pE.x1, y));
	}
	for(const p of panelV)
	    if(pA !== p)
		for(const y of ys)
		    this.midV.push(new P2(p.x0, y));
	this.groundLugN++;
    }

