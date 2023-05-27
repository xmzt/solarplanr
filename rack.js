//include base.js
//include geom.js 
//include partCat.js
//include rail.js

class RackR2 extends R2 {
    constructor(x0,y0,x1,y1, rack) {
	super(x0,y0,x1,y1);
	this.rack = rack;
    }
    gapL() { return this.x0 - this.rack.constructor.GapX; }
    gapR() { return this.x1 + this.rack.constructor.GapX; }
    gapD() { return this.y0 - this.rack.constructor.GapY; }
    gapU() { return this.y1 + this.rack.constructor.GapY; }
}

//-----------------------------------------------------------------------------------------------------------------------
// Rack: abstract base class. represents a specific racking system and panels on it.
//
// - subclassed for different type of rail system (e.g. IronRidge XR10, Unirac SM).
// - calculates overall rail lengths.
// - RailGroup takes care of figuring out specific lengths of rail and splices fit best.

class Rack {
    //static IdHtml
    //static GapX
    //static GapY

    constructor(roof) {
	this.roof = roof;
	this.panelV = [];
    }

    panelAdd(panel) {
	this.panelV.push(panel);
	this.roof.partAddPanel(panel.orient.part, 1);
    }
    
    panelBlockLeftDn(orient, x0, y1, nX, nY) {
	let r;
	let y = y1;
	for(let iY = nY; iY--; ) {
	    let x = x0;
	    for(let iX = 0; iX < nX; iX++) {
		this.panelAdd(r = new PanelR2(x, y - orient.sizeY, x + orient.sizeX, y, orient, this));
		x = r.x1 + this.constructor.GapX;
	    }
	    y = r.y0 - this.constructor.GapY;
	}
	return new RackR2(x0, r.y0, r.x1, y1, this);
    }

    panelBlockLeftUp(orient, x0, y0, nX, nY) {
	let r;
	let y = y0;
	for(let iY = 0; iY < nY; iY++) {
	    let x = x0;
	    for(let iX = 0; iX < nX; iX++) {
		this.panelAdd(r = new PanelR2(x, y, x + orient.sizeX, y + orient.sizeY, orient, this));
		x = r.x1 + this.constructor.GapX;
	    }
	    y = r.y1 + this.constructor.GapY;
	}
	return new RackR2(x0, y0, r.x1, r.y1, this);
    }

    panelBlockRightDn(orient, x1, y1, nX, nY) {
	let r;
	let y = y1;
	for(let iY = nY; iY--; ) {
	    let x = x1;
	    for(let iX = nX; iX--; ) {
		this.panelAdd(r = new PanelR2(x - orient.sizeX, y - orient.sizeY, x, y, orient, this));
		x = r.x0 - this.constructor.GapX;
	    }
	    y = r.y0 - this.constructor.GapY;
	}
	return new RackR2(r.x0, r.y0, x1, y1, this);
    }

    panelBlockRightUp(orient, x1, y0, nX, nY) {
	let r;
	let y = y0;
	for(let iY = 0; iY < nY; iY++) {
	    let x = x1;
	    for(let iX = nX; iX--; ) {
		this.panelAdd(r = new PanelR2(x - orient.sizeX, y, x, y + orient.sizeY, orient, this));
		x = r.x0 - this.constructor.GapX;
	    }
	    y = r.y1 + this.constructor.GapY;
	}
	return new RackR2(r.x0, y0, x1, r.y1, this);
    }

    // other things may call this like invsys
    partAddMlpe(n) {}
    
    sysFin() {
	// draw and add panels
	for(const panel of this.panelV) {
	    panel.drawPanel(this.roof.ctx);
	}
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// RackNone

class RackNone extends Rack {
    static IdHtml = '--Rack--';
    static GapX = 2.54*0.5;
    static GapY = 2.54*0.5;
}

//-----------------------------------------------------------------------------------------------------------------------
// RackTworail

class RackTworail extends Rack {
    //static RailGroupClas

    constructor(roof) {
	super(roof);
	this.railGroup = roof.sys.railGroupGetOrNew(this.constructor.RailGroupClas);
	this.railRegV = [];
	this.railV = [];
	this.footV = [];
	this.endV = [];
	this.midV = [];
	this.groundLugN = null;
    }

    railRegAdd(x0, y0, x1, y1) {
	for(const reg of this.railRegV) {
	    if(y0 <= reg.y1 && reg.y0 < y1) {
		if(x0 < reg.x0 && (x1 + 2*this.constructor.GapX) >= reg.x0) {
		    // add panel and mid to left of existing reg
		    reg.midXV.push((x1 + reg.x0)/2);
		    reg.x0 = x0;
		    if(y0 > reg.y0) reg.y0 = y0;
		    if(y1 < reg.y1) reg.y1 = y1;
		    return reg;
		}
		else if(x0 > reg.x0 && (x0 - 2*this.constructor.GapX) <= reg.x1) {
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

    sysFin() {
	super.sysFin();

	// compute rail regions
	let bondI = 0;
	for(const panel of this.panelV) {
	    const orient = panel.orient;
	    const reg0 = this.railRegAdd(panel.x0, panel.y0 + orient.clamp0, panel.x1, panel.y0 + orient.clamp1);
	    const reg1 = this.railRegAdd(panel.x0, panel.y1 - orient.clamp1, panel.x1, panel.y1 - orient.clamp0);
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

	// draw rail and feet
	for(const rail of this.railV)
	    rail.drawRail(this.roof.ctx);
	for(const foot of this.footV)
	    foot.drawFoot(this.roof.ctx);
	for(const end of this.endV)
	    end.drawEnd(this.roof.ctx);
	for(const mid of this.midV)
	    mid.drawMid(this.roof.ctx);

	this.partAddNpanelNrail();
	for(const rail of this.railV) {
	    rail.rack = this;
	    this.railGroup.railAdd(rail);
	}
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// RackIronRidgeXR

class RackIronRidgeXR extends RackTworail {
    static GapX = 2.54*0.5;
    static GapY = 2.54*0.5;
    
    partAddMlpe(n) {
	this.roof.partAdd(IronRidgeMlpe, n);
    }

    partAddNpanelNrail() {
	this.roof.partAdd(IronRidgeFoot, this.footV.length);
	this.roof.partAdd(IronRidgeBolt, this.footV.length);
	this.roof.partAdd(IronRidgeUfo, this.midV.length);
	this.roof.partAdd(IronRidgeGroundLug, this.groundLugN);
	// rest (i.e. endV) handled by subclass
    }
}

class RackIronRidgeXRCamo extends RackIronRidgeXR {
    partAddNpanelNrail() {
	super.partAddNpanelNrail()
	this.roof.partAdd(IronRidgeCamo, this.endV.length);
    }
}

class RackIronRidgeXRStopper extends RackIronRidgeXR {
    partAddNpanelNrail() {
	super.partAddNpanelNrail()
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

//-----------------------------------------------------------------------------------------------------------------------
// RackUniracSm

class RackUniracSm extends RackTworail {
    static IdHtml = 'Unirac SM';
    static GapX = 2.54*1;
    static GapY = 2.54*1;
    static RailGroupClas = RailGroupUniracSm;
    
    partAddMlpe(n) {
	this.roof.partAdd(UniracSmMlpe, this.panelV.length);
    }
    
    partAddNpanelNrail() {
	this.roof.partAdd(UniracSmFoot, this.footV.length);
	this.roof.partAdd(UniracSmEnd, this.endV.length);
	this.roof.partAdd(UniracSmMid, this.midV.length);
	this.roof.partAdd(UniracSmGroundLug, this.groundLugN);
    }
}
