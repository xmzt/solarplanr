//include solarParts.js
//include solarBase.js
//worker solarRailr.js

//-----------------------------------------------------------------------------------------------------------------------
// constants
//-----------------------------------------------------------------------------------------------------------------------

const x = 2.54*36; const EdgeFootDist2 = x*x; // todo? is this correct
const ChimneyFillStyle = '#4408';
const ClampFillStyle = '#0888';
const ClampLineWidth = 4;
const ClampRadius = 6;
const FootFillStyle = '#f008';
const FootRadius = 6;
const LinkFillStyle = '#0c08';
const LinkLineWidth = 4;
const LinkRadius = 6;
const PipeFillStyle = '#4408';
const PanelFillStyle = '#ccc8';
const RafterLineDash = [4,8];
const RafterStrokeStyle = '#6668';
const RailStrokeStyle = '#00f8';
const SkirtFillStyle = '#84c8';
const SkirtDimS = 6;
const SpliceFillStyle = '#0c08';
const SpliceRadiusX = 2;
const SpliceRadiusY = 10;
const VentFillStyle = '#4408';

//-----------------------------------------------------------------------------------------------------------------------
// geomemtry
//-----------------------------------------------------------------------------------------------------------------------

function drawPath(ctx, moveTo, ...lineTos) {
    ctx.beginPath();
    ctx.moveTo(moveTo.x, moveTo.y);
    for(const lineTo of lineTos)
	ctx.lineTo(lineTo.x, lineTo.y);
    ctx.stroke();
}

class C2 {
    constructor(x,y,r) { this.x = x; this.y = y; this.r = r; }
    drawPipe(ctx) {
	ctx.save();
	ctx.fillStyle = PipeFillStyle;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2.0, false);
	ctx.fill();
	ctx.restore();
	return this;
    }
}

class P2 {
    constructor(x,y) { this.x = x; this.y = y; }
    addX(x) { return new P2(this.x + x, this.y); }
    addY(y) { return new P2(this.x, this.y + y); }
    addXY(x,y) { return new P2(this.x + x, this.y + y); }

    drawFoot(ctx) {
	ctx.save();
	ctx.fillStyle = FootFillStyle;
	ctx.beginPath();
	ctx.arc(this.x, this.y, FootRadius, 0, Math.PI * 2.0, false);
	ctx.fill();
	ctx.restore();
	return this;
    }
    drawLink(ctx) {
	ctx.save();
	ctx.strokeStyle = LinkFillStyle;
	ctx.lineWidth = LinkLineWidth;
	ctx.beginPath();
	ctx.moveTo(this.x - LinkRadius, this.y - LinkRadius);
	ctx.lineTo(this.x + LinkRadius, this.y + LinkRadius);
	ctx.moveTo(this.x - LinkRadius, this.y + LinkRadius);
	ctx.lineTo(this.x + LinkRadius, this.y - LinkRadius);
	ctx.stroke();
	ctx.restore();
	return this;
    }
    drawSplice(ctx) {
	ctx.save();
	ctx.fillStyle = SpliceFillStyle;
	ctx.beginPath();
	ctx.fillRect(this.x - SpliceRadiusX, this.y - SpliceRadiusY, 2*SpliceRadiusX, 2*SpliceRadiusY);
	ctx.restore();
	return this;
    }
    drawEnd(ctx) {
	ctx.save();
	ctx.strokeStyle = ClampFillStyle;
	ctx.lineWidth = ClampLineWidth;
	ctx.beginPath();
	ctx.moveTo(this.x - ClampRadius, this.y - ClampRadius);
	ctx.lineTo(this.x + ClampRadius, this.y + ClampRadius);
	ctx.stroke();
	ctx.restore();
	return this;
    }
    drawMid(ctx) {
	ctx.save();
	ctx.strokeStyle = ClampFillStyle;
	ctx.lineWidth = ClampLineWidth;
	ctx.beginPath();
	ctx.moveTo(this.x - ClampRadius, this.y - ClampRadius);
	ctx.lineTo(this.x + ClampRadius, this.y + ClampRadius);
	ctx.moveTo(this.x - ClampRadius, this.y + ClampRadius);
	ctx.lineTo(this.x + ClampRadius, this.y - ClampRadius);
	ctx.stroke();
	ctx.restore();
	return this;
    }
}

class L2 {
    constructor(x0,y0,x1,y1) { this.x0 = x0; this.y0 = y0; this.x1 = x1; this.y1 = y1; }
    addX(x) { return new L2(this.x0 + x, this.y0, this.x1 + x, this.y1); }
    drawLine(ctx) {
	ctx.beginPath();
	ctx.moveTo(this.x0, this.y0);
	ctx.lineTo(this.x1, this.y1);
	ctx.stroke();
	return this;
    }	
    drawRafter(ctx) {
	ctx.save();
	ctx.setLineDash(RafterLineDash);
	ctx.strokeStyle = RafterStrokeStyle;
	this.drawLine(ctx);
	ctx.restore();
	return this;
    }
    drawRail(ctx) {
	ctx.save();
	ctx.strokeStyle = RailStrokeStyle;
	this.drawLine(ctx);
	ctx.restore();
	return this;
    }
}

class R2 {
    constructor(x0,y0,x1,y1) { this.x0 = x0; this.y0 = y0; this.x1 = x1; this.y1 = y1; }
    drawFillStyle(ctx, fillStyle) {
	ctx.save();
	ctx.fillStyle = fillStyle;
	ctx.beginPath();
	ctx.fillRect(this.x0, this.y0, this.x1 - this.x0, this.y1 - this.y0);
	ctx.restore();
	return this;
    }
    drawChimney(ctx) { return this.drawFillStyle(ctx, ChimneyFillStyle); }
    drawSkirt(ctx) { return this.drawFillStyle(ctx, SkirtFillStyle); }
    drawVent(ctx) { return this.drawFillStyle(ctx, VentFillStyle); }
}

class ShapeR2 extends R2 {
    constructor(shape,x0,y0,x1,y1) { super(x0,y0,x1,y1); this.shape = shape; }
    
    draw(ctx) { return this.drawFillStyle(ctx, this.shape.fillStyle); }
}

//-----------------------------------------------------------------------------------------------------------------------
// math
//-----------------------------------------------------------------------------------------------------------------------

function interpX(a, b, y) { return a.x + ((b.x - a.x) * (y - a.y) / (b.y - a.y)); }
function interpY(a, b, x) { return a.y + ((b.y - a.y) * (x - a.x) / (b.x - a.x)); }

function intersect(l0, l1) {
    //https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    //t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4)) / ((x1-x2)*(y3-y4) - (y1-y2)*(x3-x4))
    //u = ((x1-x3)*(y1-y2) - (y1-y3)*(x1-x2)) / ((x1-x2)*(y3-y4) - (y1-y2)*(x3-x4))
    //Px = x1 + t*(x2-x1) = x3 + u*(x4-x3)
    //Py = y1 + t*(y2-y1) = y3 + u*(y4-y3)

    const xa = l0.x0 - l0.x1;
    const xb = l0.x0 - l1.x0;
    const xc = l1.x0 - l1.x1;
    const ya = l0.y0 - l0.y1;
    const yb = l0.y0 - l1.y0;
    const yc = l1.y0 - l1.y1;
    const ub = xa*yc - ya*xc;
    if(ub) {
	let u0 = xb*yc - yb*xc;
	const u1 = xb*ya - yb*xa;
	if((0 < ub) ? (0 <= u0 && u0 <= ub && 0 <= u1 && u1 <= ub) : (0 >= u0 && u0 >= ub && 0 >= u1 && u1 >= ub)) {
	    u0 /= ub;
	    return new P2(l0.x0 - u0*xa, l0.y0 - u0*ya)
	}
    }
    return null;
}

function dist2LinePoint(l, p) {
    const xa = l.x1 - l.x0;
    const xb = l.x0 - p.x;
    const ya = l.y1 - l.y0;
    const yb = l.y0 - p.y;
    const det = xa*yb - xb*ya;
    return (det*det) / (xa*xa + ya*ya);
}
    
//-----------------------------------------------------------------------------------------------------------------------
// helper
//-----------------------------------------------------------------------------------------------------------------------

//todofunction sumByIdAdd(dst, id, n) { dst[id] ??= 0; dst[id] += n; }
//todofunction listByIdAdd(dst, id, x) { dst[id] ??= []; dst[id].push(x); }

function ctxFromCan(can) {
    const ctx = can.getContext('2d');
    ctx.setTransform(0.75, 0, 0, -0.75, 0, can.clientHeight);
    return ctx;
}

//-----------------------------------------------------------------------------------------------------------------------
// PanelShape
//-----------------------------------------------------------------------------------------------------------------------

class PanelShape {
    constructor(part, landscape, fillStyle) {
	this.part = part;
	if(landscape) {
	    this.sizeX = part.dimL;
	    this.sizeY = part.dimS;
	} else {
	    this.sizeX = part.dimS;
	    this.sizeY = part.dimL;
	}
	this.fillStyle = fillStyle;
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// RailGroup
//-----------------------------------------------------------------------------------------------------------------------

class RailGroup {
    constructor(railPartV, splicePart) {
	this.railPartV = railPartV;
	this.splicePart = splicePart;
	this.railV = [];
    }

    railAdd(rail, lay) {
	rail.lay = lay;
	this.railV.push(rail);
    }
    
    railrPost(layg) {
	this.layg = layg;
	railrPost(this,
		  this.railV.map(rail => rail.x1 - rail.x0), // todo horizontal-only
		  this.railPartV.map(x => [ x.dimL, x.price() ]));
    }
    
    railrLog(msg) {
	this.layg.root.querySelector('._log').innerHTML += `${msg}\n`;
    }

    railrStatus(status) {
	status.dur = status.tsB - status.tsA;
	delete status.tsB;
	delete status.tsA;
	this.layg.root.querySelector('._status').innerHTML =
	    Object.entries(status).map(x => `${x[0]}: ${x[1]}`).join('\n');
	//console.log(status);
    }

    railrRsp(comV) {
	this.layg.root.querySelector('._log').innerHTML += `railrRsp\n`;
	for(const com of comV) {
	    const rail = this.railV[com.railId];
	    this.layg.root.querySelector('._log').innerHTML +=
		`    rail=${com.railId}[${rail.x1 - rail.x0}] need=${com.need} partV=[${com.partIdV.map(x => this.railPartV[x].dimL).join(' ')}]\n`;
	    if(1 < com.segN) this.layg.col0.partAdd(this.splicePart, com.segN - 1);
	    let x = 0;
	    for(const partId of com.partIdV) {
		const part = this.railPartV[partId];
		this.layg.col0.partAdd(part, 1);
		if(x)
		    new P2(rail.x0 + x, rail.y0).drawSplice(rail.lay.ctx);
		x += part.dimL;
	    }
	    if(x && 0 < com.need)
		new P2(rail.x0 + x, rail.y0).drawSplice(rail.lay.ctx);
	}
	this.layg.pendNDec();
    }
}

class RailGroupIronRidgeXR10 extends RailGroup {
    constructor() { super(IronRidgeXR10RailV, IronRidgeXR10Splice); }
}

class RailGroupIronRidgeXR100 extends RailGroup {
    constructor() { super(IronRidgeXR100RailV, IronRidgeXR100Splice); }
}

class RailGroupUniracSm extends RailGroup {
    constructor() { super(UniracSmRailV, UniracSmSplice); }
}

//-----------------------------------------------------------------------------------------------------------------------
// Rack
//-----------------------------------------------------------------------------------------------------------------------

class Rack {
    constructor() {
	this.panelV = [];
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
	    console.log(pre1, `(${p.x0},${p.y0}) (${p.x1},${p.y1}) ${p.shape.part.desc}`);
    }
    
    panelBlockLeftDown(roof, shape, x0, y1, nX, nY) {
	var p;
	let y = y1;
	for(let iY = nY; iY--; ) {
	    let x = x0;
	    const panelV = [];
	    for(let iX = 0; iX < nX; iX++) {
		panelV.push(p = new ShapeR2(shape, x, y - shape.sizeY, x + shape.sizeX, y));
		x = p.x1 + this.panelGapX;
	    }
	    this.panelRow(roof, shape, panelV, iY);
	    y = p.y0 - this.panelGapY;
	}
	this.panelBlock();
	return new R2(x0, p.y0, p.x1, y1);
    }

    panelBlockLeftUp(roof, shape, x0, y0, nX, nY) {
	var p;
	let y = y0;
	for(let iY = 0; iY < nY; iY++) {
	    let x = x0;
	    const panelV = [];
	    for(let iX = 0; iX < nX; iX++) {
		panelV.push(p = new ShapeR2(shape, x, y, x + shape.sizeX, y + shape.sizeY));
		x = p.x1 + this.panelGapX;
	    }
	    this.panelRow(roof, shape, panelV, iY);
	    y = p.y1 + this.panelGapY;
	}
	this.panelBlock();
	return new R2(x0, y0, p.x1, p.y1);
    }

    panelBlockRightDown(roof, shape, x1, y1, nX, nY) {
	var p;
	let y = y1;
	for(let iY = nY; iY--; ) {
	    let x = x1;
	    const panelV = [];
	    for(let iX = nX; iX--; ) {
		panelV.push(p = new ShapeR2(shape, x - shape.sizeX, y - shape.sizeY, x, y));
		x = p.x0 - this.panelGapX;
	    }
	    panelV.reverse()
	    this.panelRow(roof, shape, panelV, iY);
	    y = p.y0 - this.panelGapY;
	}
	this.panelBlock();
	return new R2(p.x0, p.y0, x1, y1);
    }

    panelBlockRightUp(roof, shape, x1, y0, nX, nY) {
	var p;
	let y = y0;
	for(let iY = 0; iY < nY; iY++) {
	    let x = x1;
	    const panelV = [];
	    for(let iX = nX; iX--; ) {
		panelV.push(p = new ShapeR2(shape, x - shape.sizeX, y, x, y + shape.sizeY));
		x = p.x0 - this.panelGapX;
	    }
	    panelV.reverse()
	    this.panelRow(roof, shape, panelV, iY);
	    y = p.y1 + this.panelGapY;
	}
	this.panelBlock();
	return new R2(p.x0, y0, x1, p.y1);
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// RackTworail
//-----------------------------------------------------------------------------------------------------------------------

class RackTworail extends Rack {
    constructor() {
	super();
	this.railV = [];
	this.footV = [];
	this.endV = [];
	this.midV = [];
	this.groundLugN = 0;
    }

    dump(pre0, pre1) {
	super.dump(pre0, pre1);
	console.log(pre0, `railV`);
	for(const r of this.railV)
	    console.log(pre1, `(${r.x0},${r.y0}) (${r.x1},${r.y1})`);
	return this;
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

    panelBlock() {} 

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
}

class RackUniracSm extends RackTworail {
    constructor() {
	super();
	this.panelGapX = 2.54*1;
	this.panelGapY = 2.54*1;
    }

    partAdd(col) {
	super.partAdd(col);
	col.partAdd(UniracSmFoot, this.footV.length);
	col.partAdd(UniracSmEnd, this.endV.length);
	col.partAdd(UniracSmMid, this.midV.length);
	col.partAdd(UniracSmGroundLug, this.groundLugN);
	col.partAdd(UniracSmMlpe, this.panelV.length);
    }
}

class RackIronRidgeXR extends RackTworail {
    constructor() {
	super();
	this.panelGapX = 2.54*0.5;
	this.panelGapY = 2.54*0.5;
    }

    partAdd(col) {
	super.partAdd(col);
	col.partAdd(IronRidgeFoot, this.footV.length);
	col.partAdd(IronRidgeBolt, this.footV.length);
	col.partAdd(IronRidgeUfo, this.midV.length);
	col.partAdd(IronRidgeGroundLug, this.groundLugN);
	col.partAdd(IronRidgeMlpe, this.panelV.length);
	// rest (i.e. endV) handled by subclass
    }
}

class RackIronRidgeXRStopper extends RackIronRidgeXR {
    partAdd(col) {
	super.partAdd(col);
	col.partAdd(IronRidgeUfo, this.endV.length);
	col.partAdd(IronRidgeStopper38, this.endV.length); // todo panel-height dependent
    }
}

class RackIronRidgeXRCamo extends RackIronRidgeXR {
    partAdd(col) {
	super.partAdd(col);
	col.partAdd(IronRidgeCamo, this.endV.length);
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// RackNorail
//-----------------------------------------------------------------------------------------------------------------------

class RackNorail extends Rack {
    skirtAdd(ctx, x0, y, x1, n) {
	new R2(x0, y, x1, y - SkirtDimS).drawSkirt(ctx);
	col.partAdd(this.skirtPart, 1);
    }

    skirtFootAdd(ctx, foot) {
	foot.drawFoot(ctx);
	col.partAdd(this.skirtFootPart, 1);
    }

    skirtSpliceAdd(ctx, x, y) {
	new P2(x, y).drawSplice(ctx);
	col.partAdd(this.skirtSplicePart, 1);
    }
    
    skirtRow(ctx, roof, row) {
	const pA = row[0]
	const pE = row[row.length-1]
	const foots = roof.footsGet(new L2(pA.x0, pA.y0, pE.x1, pE.y0));
	for(const foot of foots) this.skirtFootAdd(ctx, foot);
	for(let x = pA.x0; ;) {
	    if(x > pA.x0) this.skirtSpliceAdd(ctx, x, pA.y0);
	    const w = pE.x1 - x;
	    const dimL = this.skirtPart.dimL;
	    if(w >= dimL) {
		this.skirtAdd(ctx, x, pA.y0, x + dimL, 1);
		x += dimL;
	    }
	    else {
		if(w > 0) this.skirtAdd(ctx, x, pA.y0, x + w, w / dimL);
		break;
	    }
	}
    }

    linkAdd(ctx, x, y) {
	new P2(x, y).drawLink(ctx);
	col.partAdd(this.linkPart, 1);
    }

    panelBlock() {
	this.groundLugAdd();
    }

    panelRow(ctx, roof, shape, row, iY) {
	const pA = row[0]
	const pE = row[row.length-1]
	const horiz = new L2(pA.x0, pA.y1, pE.x1, pE.y1);
	const foots = roof.footsGet(horiz);
	for(const foot of foots) this.footAdd(ctx, foot);
	for(const p of row) {
	    if(row[0] !== p) this.linkAdd(ctx, p.x0, p.y1);
	}
	if(0 == iY) this.skirtRow(ctx, roof, row);
    }
}

class RackUniracSfm extends RackNorail {
    constructor(partAddCb) {
	super(partAddCb);
	this.panelGapX = 2.0;
	this.panelGapY = 2.54*1;

	this.skirtPart = this.part0(UniracSfmTrim);
	this.skirtSplicePart = this.part0(UniracSfmTrimSplice);
	this.skirtFootPart = this.part0(UniracSfmTrimFoot);
	this.skirtClipPart = this.part0(UniracSfmTrimClip);
	this.skirtCapPart = this.part0(UniracSfmTrimCap);
	this.skirtBondPart = this.part0(UniracSfmTrimBond);
	this.microrailPart = this.part0(UniracSfmMicrorail);
	this.microrailSplicePart = this.part0(UniracSfmAttSplice);
	this.linkPart = this.part0(UniracSfmSplice);
	this.footPart = this.part0(UniracSfmFoot);
	this.nsBondPart = this.part0(UniracSfmNsbond);
	this.groundLugPart = this.part0(UniracSmGroundLug);
	this.mlpePart = this.part0(UniracSmMlpe);
    }
    
    footAdd(ctx, foot) {
	foot.drawFoot(ctx);
	col.partAdd(this.microrailPart, 1);
	col.partAdd(this.footPart, 1);
    }

    skirtRow(ctx, roof, row) {
	super.skirtRow(ctx, roof, row);
	col.partAdd(this.skirtClipPart, 2*row.length);
	col.partAdd(this.skirtCapPart, 2);
	col.partAdd(this.skirtBondPart, 1);
    }

    panelRow(ctx, roof, shape, row, iY) {
	super.panelRow(roof, shape, row, iY);
	if(0 < iY) col.partAdd(this.nsBondPart, 1);
    }
}

class RackSnapnrackRlu extends RackNorail {
    constructor(partAddCb) {
	super(partAddCb);
	this.panelGapX = 2.0;
	this.panelGapY = 2.54*1;

	this.flashingPart = this.part0(SnapnrackRluCompFlash);
	this.flashTrackPart = this.part0(SnapnrackRluCompTrack);
	this.umbrellaLagPart = this.part0(SnapnrackRluUmbrellaLag);
	this.speedTrackPart = this.part0(SnapnrackRluSpeedsealTrack);
	this.speedLagPart = this.part0(SnapnrackRluSpeedsealLag);
	this.mountPart = this.part0(SnapnrackRluMount);
	this.linkPart = this.part0(SnapnrackRluLink);
	this.skirtPart = this.part0(SnapnrackRluSkirt);
	this.skirtSpacerPart = this.part0(SnapnrackRluSkirtSpacer40); // todo panel-height dependent
	this.groundLugPart = this.part0(SnapnrackRluGroundLug);
	this.mlpePart = this.part0(SnapnrackRluMlpe);
    }

    skirtFootAdd(ctx, foot) {
	this.footAdd(ctx, foot);
	col.partAdd(this.skirtSpacerPart, 1);
    }

    skirtSpliceAdd(ctx, x, y) {
	this.linkAdd(ctx, x, y);
	col.partAdd(this.skirtSpacerPart, 2);
    }
}

class RackSnapnrackRluFlashtrack extends RackSnapnrackRlu {
    footAdd(ctx, foot) {
	foot.drawFoot(ctx);
	col.partAdd(this.flashingPart, 1);
	col.partAdd(this.flashTrackPart, 1);
	col.partAdd(this.umbrellaLagPart, 1);
	col.partAdd(this.mountPart, 1);
    }
}

class RackSnapnrackRluSpeedtrack extends RackSnapnrackRlu {
    footAdd(ctx, foot) {
	foot.drawFoot(ctx);
	col.partAdd(this.speedTrackPart, 1);
	col.partAdd(this.speedLagPart, 1);
	col.partAdd(this.mountPart, 1);
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// Roof
//-----------------------------------------------------------------------------------------------------------------------

class Roof {
    constructor() {
	this.footSpan = 2.54*48.0 + 1.0;
	this.footSpanEdge = 2.54*24.0 + 1.0;
    }

    edgeFootP(p) {
	for(const edge of this.edges) {
	    if(EdgeFootDist2 >= dist2LinePoint(edge, p)) {
		return true;
	    }
	}
	return false;
    }

    footsGet(horiz) {
	// get intersections with rafters and sort by foot.x
	const inters = [];
	for(const rafter of this.rafters) {
	    const p = intersect(horiz, rafter);
	    if(null !== p) {
		inters.push(p);
	    }
	}
	inters.sort((a,b) => { return a.x - b.x; });

	// remove redundant feet
	const foots = [];
	for(const p of inters) {
	    if(2 <= foots.length) {
		const span = this.edgeFootP(foots[foots.length-1]) ? this.footSpanEdge : this.footSpan;
		if(span >= p.x - foots[foots.length-2].x) {
		    foots.pop();
		}
	    }
	    foots.push(p);
	}
	return foots;
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// LayGroup
//-----------------------------------------------------------------------------------------------------------------------

class Lay {
    constructor(id, roof, rack, railGroup, popu) {
	this.id = id;
	this.roof = roof;
	this.rack = rack;
	this.railGroup = railGroup;
	this.popu = popu;
    }
}

class LayGroup {
    constructor(note) {
	this.note = note;
	this.layV = [];
    }

    layAdd(lay) { this.layV.push(lay); }

    go() {
	this.root = temRootClone('sys_tem');
	document.getElementById('syss').appendChild(this.root);
	this.root.querySelector('._note').textContent = this.note;
	this.tab = new PartTab(this.root.querySelector('._partsTbody'));
	this.col0 = new PartTabCol(this.tab, null, 'n', 'cost', '._n', '._cost');
	for(const lay of this.layV)
	    lay.col = new PartTabCol(this.tab, this.col0,
				     `${lay.id}N`, `${lay.id}Cost`, `._${lay.id}N`, `._${lay.id}Cost`);
	this.col0.partAdd(OtherParts, 1);
	this.wattsTotal = 0;
	this.railGroupSet = new Set();
	for(const lay of this.layV) {
	    lay.ctx = ctxFromCan(this.root.querySelector(`._${lay.id}Can`));
	    lay.roof.draw(lay.ctx);
	    lay.popu(lay.rack, lay.roof);
	    lay.rack.draw(lay.ctx);
	    lay.rack.partAdd(lay.col);
	    this.railGroupSet.add(lay.railGroup);
	    for(const rail of lay.rack.railV)
		lay.railGroup.railAdd(rail, lay);
	    this.wattsTotal += lay.rack.wattsGet();
	}
	this.tab.totalRow.tr.classList.add('pend');
	this.pendN = 1;
	for(const railGroup of this.railGroupSet.keys()) {
	    this.pendN++;
	    railGroup.railrPost(this);
	}
	this.pendNDec();
    }

    pendNDec() {
	if(! --this.pendN) {
	    this.tab.totalRow.tr.classList.remove('pend');
	    this.root.querySelector('._wattsTotal').textContent = this.wattsTotal;
	    this.root.querySelector('._wattsDpw').textContent = (this.tab.totalRow.cost / this.wattsTotal).toFixed(3);
	}
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// PartTab
//-----------------------------------------------------------------------------------------------------------------------

class PartTab {
    constructor(elemTbody) {
	this.elemTbody = elemTbody;
	this.colV = [];
	this.totalRow = new PartTabRow();
	this.totalRow.tr.querySelector('._desc').textContent = 'total';
	this.elemTbody.appendChild(this.totalRow.tr);
	this.rowV = [ this.totalRow ];
	this.rowById = {};
    }

    rowGetNew(part) { return this.rowById[part.id] ??= this.rowNew(part); }
    
    rowNew(part) {
	const row = new PartTabRow();
	for(const col of this.colV) {
	    row[col.idN] = 0;
	    row[col.idCost] = 0;
	}
	part.descFill(row.tr.querySelector('._desc'));
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
    }
}

class PartTabCol {
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
    constructor() {
	this.tr = temRootClone('partsTr_tem');
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// railr
//-----------------------------------------------------------------------------------------------------------------------

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

function railrPost(...argV) {
    const id = RailrHandlerIdAlloc++;
    RailrHandlerById[id] = argV[0];
    argV[0] = id;
    RailrWorker.postMessage(argV);
}
