//include base.js
//include geom.js 
//include partCat.js
//include rail.js
//include rack.js

//-----------------------------------------------------------------------------------------------------------------------
// Layout

class Layout {
    constructor(idHtml, rackPopu) {
	this.idHtml = idHtml;
	this.rackPopu = rackPopu;
    }
}

var LayoutNone = new Layout('--Select panel layout--', null);

//-----------------------------------------------------------------------------------------------------------------------
// Roof: roof geometry (border, obstructions), with racks (racks have panels)
//
// - subclassed for a specific roof geometry. 

class Roof {
    //static IdHtml
    //static LayoutByIdHtml
    
    static layoutAdd(idHtml, rackPopu) { this.LayoutByIdHtml[idHtml] = new Layout(idHtml, rackPopu); }

    constructor(sys, id, canElem, canRailElem) {
	this.sys = sys;
	this.id = id;
	this.canElem = canElem;
	this.canRailElem = canRailElem;
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
	this.sys.partTab.partAddCol(part, n, this.partTabColI);
    }
    
    partAddWatts(part, n, watts) {
	this.sys.partTab.partAddColWatts(part, n, this.partTabColI, watts);
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
    
    canSizeCtx(can) {
	// todo allow for negative coords
	can.width = (RoofCanvasMargin*2 + this.boundR.x1 - this.boundR.x0) * RoofCanvasScale;
	can.height = (RoofCanvasMargin*2 + this.boundR.y1 - this.boundR.y0) * RoofCanvasScale;
	const xfrmY = can.height - (RoofCanvasMargin * RoofCanvasScale);
	const ctx = can.getContext('2d');
	ctx.setTransform(RoofCanvasScale, 0, 0, -RoofCanvasScale, RoofCanvasMargin, xfrmY);
	return ctx;
    }

    ctxClear(ctx) {
	const r = this.boundR;
	ctx.clearRect(r.x0, r.y0, r.x1-r.x0, r.y1-r.y0);
	return ctx;
    }
    
    sysFin() {
	this.ctx = this.ctxClear(this.canSizeCtx(this.canElem));
	this.ctxRail = this.ctxClear(this.canSizeCtx(this.canRailElem));
	this.draw(this.ctx);
	for(const rack of this.rackV) rack.sysFin();
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// RoofNone

class RoofNone extends Roof {
    static IdHtml = '--Select roof plan--';
    static LayoutByIdHtml = { [LayoutNone.idHtml]: LayoutNone };
}
