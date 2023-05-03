//include solarBase.js
//include solarGeom.js 
//include solarParts.js
//worker solarRailr.js

//=======================================================================================================================
// globals
//=======================================================================================================================

var RailGroupClasId = 0;
var RackClasV = [];
var RoofClasV = []; // each Roof.LayoutV has roof-specific layouts

//=======================================================================================================================
// rail
//=======================================================================================================================

//-----------------------------------------------------------------------------------------------------------------------
// RailRegR2

class RailRegR2 extends R2 {
    constructor(x0,y0,x1,y1) {
	super(x0,y0,x1,y1);
	this.midXV = [];
	this.bondI = 0;
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// railr worker thread interface

var RailrHandlerIdAlloc;
var RailrHandlerById;
var RailrWorker;

function railrHandlerInit() {
    RailrHandlerIdAlloc = 0;
    RailrHandlerById = {};
    RailrWorker = new Worker('solarRailr.js');
    RailrWorker.onmessage = (ev) => {
	const handler = RailrHandlerById[ev.data[0]];
	handler[ev.data[1]].apply(handler, ev.data.slice(2));
    };
}

function railrReq(...argV) {
    const id = RailrHandlerIdAlloc++;
    RailrHandlerById[id] = argV[0];
    argV[0] = id;
    RailrWorker.postMessage(argV);
}

//-----------------------------------------------------------------------------------------------------------------------
// RailGroup

class RailGroup {
    //static ClasId = ++RailGroupClasId;
    //static RailPartV
    //static SplicePart

    constructor(sys) {
	this.sys = sys
	this.railV = [];
	this.statusDiv = temRootClone('railGroupStatus_tem');
	this.statusSpan = this.statusDiv.querySelector('._status');
	this.statusDiv.querySelector('._logShow').addEventListener('click', (ev) => this.logShowClick(ev));
	this.logDiv = temRootClone('railGroupLog_tem');
    }

    logShowClick() {
	this.logDiv.classList.toggle('displaynone');
    }	
    
    railAdd(rail) {
	this.railV.push(rail);
    }
    
    railrReq() {
	railrReq(this,
		  this.railV.map(rail => rail.x1 - rail.x0), // todo horizontal-only
		  this.constructor.RailPartV.map(x => [ x.dimL, x.price() ]));
    }

    // railRsp* are rpc from worker thread (solarRailr.js)
    
    railrRspLog(msg) {
	this.logDiv.innerHTML += `${msg}\n`;
    }

    railrRspStatus(s) {
	this.statusSpan.textContent =
	    `${s.iterI}/${s.iterN} -> ${s.accOkN} -> ${s.okN} -> ${s.bestN}, ${s.tsB - s.tsA} ms`;
    }

    railrRspFin(comV) {
	this.logDiv.innerHTML += `railrRspFin\n`;
	for(const com of comV) {
	    const rail = this.railV[com.railId];
	    this.logDiv.innerHTML +=
		`    rail=${com.railId}[${rail.x1 - rail.x0}] need=${com.need} partV=[${com.partIdV.map(x => this.constructor.RailPartV[x].dimL).join(' ')}]\n`;
	    if(1 < com.segN) this.sys.partAdd(this.constructor.SplicePart, com.segN - 1);
	    let x = 0;
	    for(const partId of com.partIdV) {
		const part = this.constructor.RailPartV[partId];
		this.sys.partAdd(part, 1);
		if(x)
		    new P2(rail.x0 + x, rail.y0).drawSplice(rail.rack.roof.ctx);
		x += part.dimL;
	    }
	    if(x && 0 < com.need)
		new P2(rail.x0 + x, rail.y0).drawSplice(rail.rack.roof.ctx);
	}
	this.sys.pendDec();
    }
}

class RailGroupIronRidgeXR10 extends RailGroup {
    static ClasId = ++RailGroupClasId;
    static RailPartV = IronRidgeXR10RailV;
    static SplicePart = IronRidgeXR10Splice;
}

class RailGroupIronRidgeXR100 extends RailGroup {
    static ClasId = ++RailGroupClasId;
    static RailPartV = IronRidgeXR100RailV;
    static SplicePart = IronRidgeXR100Splice;
}

class RailGroupUniracSm extends RailGroup {
    static ClasId = ++RailGroupClasId;
    static RailPartV = UniracSmRailV;
    static SplicePart = UniracSmSplice;
}

//=======================================================================================================================
// Rack
//=======================================================================================================================

class Rack {
    //static IdHtml
    //static RailGroupClas
    
    constructor(roof) {
	this.roof = roof;
	this.railGroup = roof.sys.railGroupGetOrNew(this.constructor.RailGroupClas);
	this.panelRV = [];
    }

    draw(ctx) {
	for(const panelR of this.panelRV)
	    panelR.drawPanel(ctx);
    }

    panelBlockLeftDn(orient, x0, y1, nX, nY) {
	let r;
	let y = y1;
	for(let iY = nY; iY--; ) {
	    let x = x0;
	    for(let iX = 0; iX < nX; iX++) {
		this.panelRV.push(r = new PanelOrientR2(x, y - orient.sizeY, x + orient.sizeX, y, orient));
		x = r.x1 + this.panelGapX;
	    }
	    y = r.y0 - this.panelGapY;
	}
	return new R2(x0, r.y0, r.x1, y1);
    }

    panelBlockLeftUp(orient, x0, y0, nX, nY) {
	let r;
	let y = y0;
	for(let iY = 0; iY < nY; iY++) {
	    let x = x0;
	    for(let iX = 0; iX < nX; iX++) {
		this.panelRV.push(r = new PanelOrientR2(x, y, x + orient.sizeX, y + orient.sizeY, orient));
		x = r.x1 + this.panelGapX;
	    }
	    y = r.y1 + this.panelGapY;
	}
	return new R2(x0, y0, r.x1, r.y1);
    }

    panelBlockRightDn(orient, x1, y1, nX, nY) {
	let r;
	let y = y1;
	for(let iY = nY; iY--; ) {
	    let x = x1;
	    for(let iX = nX; iX--; ) {
		this.panelRV.push(r = new PanelOrientR2(x - orient.sizeX, y - orient.sizeY, x, y, orient));
		x = r.x0 - this.panelGapX;
	    }
	    y = r.y0 - this.panelGapY;
	}
	return new R2(r.x0, r.y0, x1, y1);
    }

    panelBlockRightUp(orient, x1, y0, nX, nY) {
	let r;
	let y = y0;
	for(let iY = 0; iY < nY; iY++) {
	    let x = x1;
	    for(let iX = nX; iX--; ) {
		this.panelRV.push(r = new PanelOrientR2(x - orient.sizeX, y, x, y + orient.sizeY, orient));
		x = r.x0 - this.panelGapX;
	    }
	    y = r.y1 + this.panelGapY;
	}
	return new R2(r.x0, y0, x1, r.y1);
    }

    partAddNrail() {
	for(const panelR of this.panelRV) {
	    this.roof.partAdd(panelR.orient.part, 1);
	    this.roof.sys.totalWatts += panelR.orient.part.watts;
	}
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// RackTworail

class RackTworail extends Rack {
    constructor(roof) {
	super(roof);
	this.railRegV = [];
	this.railV = [];
	this.footV = [];
	this.endV = [];
	this.midV = [];
	this.groundLugN = null;
    }

    draw(ctx) {
	super.draw(ctx);
	for(const rail of this.railV)
	    rail.drawRail(ctx);
	for(const foot of this.footV)
	    foot.drawFoot(ctx);
	for(const end of this.endV)
	    end.drawEnd(ctx);
	for(const mid of this.midV)
	    mid.drawMid(ctx);
    }

    railRegAdd(x0, y0, x1, y1) {
	for(const reg of this.railRegV) {
	    if(y0 <= reg.y1 && reg.y0 < y1) {
		if(x0 < reg.x0 && (x1 + 2*this.panelGapX) >= reg.x0) {
		    // add panel and mid to left of existing reg
		    reg.midXV.push((x1 + reg.x0)/2);
		    reg.x0 = x0;
		    if(y0 > reg.y0) reg.y0 = y0;
		    if(y1 < reg.y1) reg.y1 = y1;
		    return reg;
		}
		else if(x0 > reg.x0 && (x0 - 2*this.panelGapX) <= reg.x1) {
		    // add panel and mid to right of existing reg
		    reg.midXV.push((reg.x1 + x0)/2);
		    reg.x1 = x1;
		    if(y0 > reg.y0) reg.y0 = y0;
		    if(y1 < reg.y1) reg.y1 = y1;
 		    return reg;
		}
	    }
	}
	// new reg
	const reg = new RailRegR2(x0, y0, x1, y1);
	this.railRegV.push(reg);
	return reg;
    }

    roofFin() {
	// compute rail regions
	let bondI = 0;
	for(const panelR of this.panelRV) {
	    const orient = panelR.orient;
	    const reg0 = this.railRegAdd(panelR.x0, panelR.y0 + orient.clamp0, panelR.x1, panelR.y0 + orient.clamp1);
	    const reg1 = this.railRegAdd(panelR.x0, panelR.y1 - orient.clamp1, panelR.x1, panelR.y1 - orient.clamp0);
	    if(! reg0.bondI) reg0.bondI = ++bondI;
	    if(! reg1.bondI) reg1.bondI = reg0.bondI;
	}

	// for each region, rail, ends, mids
	for(const reg of this.railRegV) {
	    const rail = this.roof.railFromReg(reg);
	    this.railV.push(rail);
	    this.footV.push(...rail.footV);
	    this.endV.push(new P2(rail.x0, rail.y0), new P2(rail.x1, rail.y1));
	    for(const midX of reg.midXV)
		this.midV.push(new P2(midX, rail.y0));
	}

	this.groundLugN = bondI;

	// draw and add parts
	this.draw(this.roof.ctx);
	this.partAddNrail();
	for(const rail of this.railV) {
	    rail.rack = this;
	    this.railGroup.railAdd(rail);
	}
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// RackIronRidgeXR

class RackIronRidgeXR extends RackTworail {
    constructor(roof) {
	super(roof);
	this.panelGapX = 2.54*0.5;
	this.panelGapY = 2.54*0.5;
    }

    partAddNrail() {
	super.partAddNrail()
	this.roof.partAdd(IronRidgeFoot, this.footV.length);
	this.roof.partAdd(IronRidgeBolt, this.footV.length);
	this.roof.partAdd(IronRidgeUfo, this.midV.length);
	this.roof.partAdd(IronRidgeGroundLug, this.groundLugN);
	this.roof.partAdd(IronRidgeMlpe, this.panelRV.length);
	// rest (i.e. endV) handled by subclass
    }
}

class RackIronRidgeXRCamo extends RackIronRidgeXR {
    partAddNrail() {
	super.partAddNrail()
	this.roof.partAdd(IronRidgeCamo, this.endV.length);
    }
}

class RackIronRidgeXRStopper extends RackIronRidgeXR {
    partAddNrail() {
	super.partAddNrail()
	this.roof.partAdd(IronRidgeUfo, this.endV.length);
	this.roof.partAdd(IronRidgeStopper38, this.endV.length); // todo panel-height dependent
    }
}

class RackIronRidgeXR10Camo extends RackIronRidgeXRCamo {
    static IdHtml = 'IronRidge XR10, end:camo';
    static RailGroupClas = RailGroupIronRidgeXR10;
}

class RackIronRidgeXR10Stopper extends RackIronRidgeXRStopper {
    static IdHtml = 'IronRidge XR10, end:stopper';
    static RailGroupClas = RailGroupIronRidgeXR10;
}

class RackIronRidgeXR100Camo extends RackIronRidgeXRCamo {
    static IdHtml = 'IronRidge XR100, end:camo';
    static RailGroupClas = RailGroupIronRidgeXR100;
}

class RackIronRidgeXR100Stopper extends RackIronRidgeXRStopper {
    static IdHtml = 'IronRidge XR100, end:stopper';
    static RailGroupClas = RailGroupIronRidgeXR100;
}

RackClasV.push(RackIronRidgeXR10Camo);
RackClasV.push(RackIronRidgeXR10Stopper);
RackClasV.push(RackIronRidgeXR100Camo);
RackClasV.push(RackIronRidgeXR100Stopper);

//-----------------------------------------------------------------------------------------------------------------------
// RackUniracSm

class RackUniracSm extends RackTworail {
    static IdHtml = 'Unirac SM';
    static RailGroupClas = RailGroupUniracSm;
    
    constructor(roof) {
	super(roof);
	this.panelGapX = 2.54*1;
	this.panelGapY = 2.54*1;
    }

    partAddNrail() {
	super.partAddNrail()
	this.roof.partAdd(UniracSmFoot, this.footV.length);
	this.roof.partAdd(UniracSmEnd, this.endV.length);
	this.roof.partAdd(UniracSmMid, this.midV.length);
	this.roof.partAdd(UniracSmGroundLug, this.groundLugN);
	this.roof.partAdd(UniracSmMlpe, this.panelRV.length);
    }
}

RackClasV.push(RackUniracSm);

//=======================================================================================================================
// Layout
//=======================================================================================================================

class Layout {
    constructor(idHtml, rackPopu) {
	this.idHtml = idHtml;
	this.rackPopu = rackPopu;
    }
}

//=======================================================================================================================
// Roof: geometry of a bare roof and its obstructions, with racks (with panels)
//=======================================================================================================================

class Roof {
    constructor(sys, id, descHtml) {
	this.sys = sys;
	this.id = id;
	this.descHtml = descHtml;
	this.rackV = [];
	
	//plan
	//this.bpV
	//this.boundR
	//this.edgeV
	this.edgePathV = [];
	this.rafterV = [];
	this.chimneyV = [];
	this.fireWalkV = [];
	this.pipeV = [];
	this.ventV = [];
    }

    bpVSet(bpV) {
	const boundR = new R2(bpV[0].x, bpV[0].y, bpV[0].x, bpV[0].y);
	const edgeV = [];
	for(let i = 1; i < bpV.length; ++i) {
	    if(bpV[i].x < boundR.x0) boundR.x0 = bpV[i].x;
	    if(bpV[i].x > boundR.x1) boundR.x1 = bpV[i].x;
	    if(bpV[i].y < boundR.y0) boundR.y0 = bpV[i].y;
	    if(bpV[i].y > boundR.y1) boundR.y1 = bpV[i].y;
	    edgeV.push(bpV[i-1].l2P(bpV[i]));
	}
	this.bpV = bpV;
	this.boundR = boundR;
	this.edgeV = edgeV;
    }

    draw(ctx) {
	drawPathV(ctx, this.bpV);
	if(this.edgePathV.length) drawEdgePathV(ctx, this.edgePathV);
	//for(const x of this.edgeV) x.drawLine(ctx);
	//for(const x of this.edgeV) x.xfrmParallel(-EdgeWidth).drawLine(ctx);
	
	for(const x of this.rafterV) x.drawRafter(ctx);
	for(const x of this.chimneyV) x.drawChimney(ctx);
	for(const x of this.fireWalkV) x.drawFireWalk(ctx);
	for(const x of this.pipeV) x.drawPipe(ctx);
	for(const x of this.ventV) x.drawVent(ctx);
	return this;
    }
    
    footVFromHoriz(horiz) {
	// footV = set of all intersections with rafters
	const footV = [];
	for(const rafter of this.rafterV) {
	    const foot = interSegSeg(rafter, horiz);
	    if(null !== foot) {
		footV.push(foot);
		// mark foot if close to edge
		foot.edgeP = false;
		for(const edge of this.edgeV) {
		    if(EdgeFootDist2 > dist2SegPoint(edge, foot)) {
			foot.edgeP = true;
			break;
		    }
		}
	    }
	}

	// sort footV
	footV.sort((a,b) => { return a.x - b.x; });

	// remove redundant foots due to cantilever
	while(2 < footV.length && CantiMax >= (footV[1].x - horiz.x0))
	    footV.shift();
	while(2 < footV.length && CantiMax >= (horiz.x1 - footV[footV.length - 2].x))
	    footV.pop();

	// remove redundant foots depending on edgeP
	for(let i = 2; i < footV.length; i++) {
	    const span = footV[i].x - footV[i-2].x;
	    const spanAllow = footV[i-1].edgeP ? FootSpanEdge : FootSpan;
	    if(spanAllow >= span) {
		footV.splice(i-1, 1);
		--i;
	    }
	}
	return footV;
    }
    
    partAdd(part, n) {
	this.sys.partTabRowGetOrNew(part).incNIdTotal(n, this.id, this.sys.partTotalRow);
    }
    
    rackAdd(rack) {
	this.rackV.push(rack);
    }

    railFromReg(reg) {
	let aRail = new L2(reg.x0, reg.y0, reg.x1, reg.y0);
	aRail.footV = this.footVFromHoriz(aRail);
	let bRail = new L2(reg.x0, reg.y1, reg.x1, reg.y1);
	bRail.footV = this.footVFromHoriz(bRail);
	if(bRail.footV.length <= aRail.footV.length)
	    aRail = bRail;
	let y = (reg.y0 + reg.y1) / 2;
	bRail = new L2(reg.x0, y, reg.x1, y);
	bRail.footV = this.footVFromHoriz(bRail);
	return (bRail.footV.length <= aRail.footV.length) ? bRail : aRail;
    }

    roofFin() {
	const roofElem = temRootClone('roof_tem');
	roofElem.querySelector('._desc').innerHTML = this.descHtml;
	const canvas = document.createElement('canvas');
	canvas.width = (RoofCanvasMargin*2 + this.boundR.x1 - this.boundR.x0) * RoofCanvasScale;
	canvas.height = (RoofCanvasMargin*2 + this.boundR.y1 - this.boundR.y0) * RoofCanvasScale;
	const xfrmY = canvas.height - (RoofCanvasMargin * RoofCanvasScale);
	roofElem.appendChild(canvas);
	this.sys.root.querySelector('._roofDiv').appendChild(roofElem);
	
	this.ctx = canvas.getContext('2d');
	this.ctx.setTransform(RoofCanvasScale, 0, 0, -RoofCanvasScale, RoofCanvasMargin, xfrmY);
	this.draw(this.ctx);
	for(const rack of this.rackV) rack.roofFin();
    }
}

//=======================================================================================================================
// parts table
//=======================================================================================================================

//-----------------------------------------------------------------------------------------------------------------------
// PartTabCell

class PartTabCell {
    constructor(nTd, costTd) {
	this.nTd = nTd;
	this.costTd = costTd;
	this.n = 0;
	this.cost = 0;
    }

    incCost(cost) {
	this.cost += cost;
	this.costTd.textContent = this.cost.toFixed(2);
    }

    incNCost(n, cost) {
	this.n += n;
	this.cost += cost;
	this.nTd.textContent = toFixedMax(this.n, 3);
	this.costTd.textContent = this.cost.toFixed(2);
    }
}
	
//-----------------------------------------------------------------------------------------------------------------------
// PartTabRow

class PartTabRow {
    constructor(tr, price) {
	this.tr = tr;
	this.price = price;
	this.cellById = {};
	this.totalCell = new PartTabCell(tr.querySelector('._totalN'), tr.querySelector('._totalCost'));
    }

    incCost(cost) {
	this.totalCell.incCost(cost);
    }

    incCostId(cost, id) {
	this.cellById[id].incCost(cost);
	this.totalCell.incCost(cost);
    }

    incNIdTotal(n, id, totalRow) {
	const cost = n * this.price;
	this.cellById[id].incNCost(n, cost);
	this.totalCell.incNCost(n, cost);
	totalRow.incCostId(cost, id);
    }

    incNTotal(n, totalRow) {
	const cost = n * this.price;
	this.totalCell.incNCost(n, cost);
	totalRow.incCost(cost);
    }
}

function partTabTrInsertTd(tr, td) {
    tr.insertBefore(td, tr.querySelector('._totalN'));
    return td;
}
    
//=======================================================================================================================
// Sys: multiple roofs and railGroups, parts table
//=======================================================================================================================

class Sys {
    constructor() {
	this.roofV = [];
	this.railGroupByClasId = {};
	this.pendN = 0;
	this.totalWatts = 0;

	this.root = temRootClone('sys_tem');
	this.partTabHeadTr = this.root.querySelector('._partTabHeadTr');
	this.partTabRowByPartId = {};
	this.partTotalRow = new PartTabRow(this.root.querySelector('._partTabTotalTr'), null);
    }

    roofAdd(roof) {
	this.roofV.push(roof);
	this.partAddRoof(roof);
    }
	    
    sysFin() {
	for(const roof of this.roofV)
	    roof.roofFin();

	this.root.querySelector('._totalWatts').textContent = this.totalWatts;

	for(const k in this.railGroupByClasId) {
	    if(0 == this.pendN++) this.partTotalRow.tr.classList.add('pend');
	    this.railGroupByClasId[k].railrReq();
	}
    }

    partAdd(part, n) {
	this.partTabRowGetOrNew(part).incNTotal(n, this.partTotalRow);
    }
    
    partAddRoof(roof) {
	partTabTrInsertTd(this.partTabHeadTr, temRootClone('partTabHeadTd_tem')).textContent = `${roof.id} N`;
	partTabTrInsertTd(this.partTabHeadTr, temRootClone('partTabHeadTd_tem')).textContent = `${roof.id} Cost`;
	for(const partId in this.partTabRowByPartId)
	    this.partTabRowAddRoof(this.partTabRowByPartId[partId], roof);
	this.partTabRowAddRoof(this.partTotalRow, roof);
    }

    partTabRowGetOrNew(part) {
	return this.partTabRowByPartId[part.id] ??= this.partTabRowNew(part);
    }

    partTabRowAddRoof(row, roof) {
	row.cellById[roof.id] = new PartTabCell(partTabTrInsertTd(row.tr, temRootClone('partTabTd_tem')),
						partTabTrInsertTd(row.tr, temRootClone('partTabTd_tem')));
    }

    partTabRowNew(part) {
	const tr = temRootClone('partTabTr_tem');
	this.partTotalRow.tr.parentNode.insertBefore(tr, this.partTotalRow.tr);
	part.descFill(tr.querySelector('._desc'));
	const price = part.priceFill(tr.querySelector('._price'));
	const row = new PartTabRow(tr, price);
	for(const roof of this.roofV)
	    this.partTabRowAddRoof(row, roof);
	return row;
    }

    pendDec() {
	if(0 == --this.pendN) {
	    this.partTotalRow.tr.classList.remove('pend');
	    this.root.querySelector('._totalDpw').textContent =
		(this.partTotalRow.totalCell.cost / this.totalWatts).toFixed(3);
	}
    }
    
    railGroupGetOrNew(clas) {
	return this.railGroupByClasId[clas.ClasId] ??= this.railGroupAdd(new clas(this));
    }

    railGroupAdd(railGroup) {
	this.root.querySelector('._railGroupStatusDiv').appendChild(railGroup.statusDiv);
	this.root.querySelector('._railGroupLogDiv').appendChild(railGroup.logDiv);
	return railGroup;
    }
}
