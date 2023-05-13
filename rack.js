//include base.js
//include geom.js 
//include partCat.js
//include rail.js

//-----------------------------------------------------------------------------------------------------------------------
// globals

var RackClasV = [];

//-----------------------------------------------------------------------------------------------------------------------
// Rack: abstract base class. represents a specific racking system and panels on it.
//
// - subclassed for different type of rail system (e.g. IronRidge XR10, Unirac SM).
// - calculates overall rail lengths.
// - RailGroup takes care of figuring out specific lengths of rail and splices fit best.

class Rack {
    //static IdHtml
    //static RailGroupClas
    
    constructor(roof) {
	this.roof = roof;
	this.railGroup = roof.sys.railGroupGetOrNew(this.constructor.RailGroupClas);
	this.panelV = [];
    }

    draw(ctx) {
	for(const panelR of this.panelV)
	    panelR.drawPanel(ctx);
    }

    panelBlockLeftDn(orient, x0, y1, nX, nY) {
	let r;
	let y = y1;
	for(let iY = nY; iY--; ) {
	    let x = x0;
	    for(let iX = 0; iX < nX; iX++) {
		this.panelV.push(r = new PanelOrientR2(x, y - orient.sizeY, x + orient.sizeX, y, orient));
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
		this.panelV.push(r = new PanelOrientR2(x, y, x + orient.sizeX, y + orient.sizeY, orient));
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
		this.panelV.push(r = new PanelOrientR2(x - orient.sizeX, y - orient.sizeY, x, y, orient));
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
		this.panelV.push(r = new PanelOrientR2(x - orient.sizeX, y, x, y + orient.sizeY, orient));
		x = r.x0 - this.panelGapX;
	    }
	    y = r.y1 + this.panelGapY;
	}
	return new R2(r.x0, y0, x1, r.y1);
    }

    partAddNrail() {
	for(const panelR of this.panelV)
	    this.roof.partAddWatts(panelR.orient.part, 1, panelR.orient.part.watts);
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
	for(const panelR of this.panelV) {
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
	this.roof.partAdd(IronRidgeMlpe, this.panelV.length);
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
	this.roof.partAdd(UniracSmMlpe, this.panelV.length);
    }
}

RackClasV.push(RackUniracSm);
