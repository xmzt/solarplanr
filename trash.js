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

Rack(partTabSub);
Rack.panelFin(roof);
Rack.canDraw(ctx);
RackTwoRail.railGroupGo(railGroup);

Invsys(partTabSub);
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
	roof.partTabSubI = this.partTab.subAdd(roof.id);
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
	this.sys.partTab.partAdd(part, n, this.partTabSubI);
    }

    partAddPanel(part, n) {
	this.sys.partTab.partAddPanel(part, n, this.partTabSubI);
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

