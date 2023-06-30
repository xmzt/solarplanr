//include base.js
//include geom.js 
//include partCat.js
//include rail.js

class RackR2 extends R2 {
    constructor(x0,y0,x1,y1, rack) {
	super(x0,y0,x1,y1);
	this.rack = rack;
    }
    gapL() { return this.x0 - this.rack.gapX(); }
    gapR() { return this.x1 + this.rack.gapX(); }
    gapD() { return this.y0 - this.rack.gapY(); }
    gapU() { return this.y1 + this.rack.gapY(); }
}

//-----------------------------------------------------------------------------------------------------------------------
// Rack: abstract base class. represents a specific racking system and panels on it.
//
// - subclassed for different type of rail system (e.g. IronRidge XR10, Unirac SM).
// - calculates overall rail lengths.
// - RailGroup takes care of figuring out specific lengths of rail and splices fit best.

class Rack {
    constructor(env, partSub, panelPartSub, roof) {
	this.env = env;
	this.partSub = partSub;
	this.panelPartSub = panelPartSub;
	this.roof = roof;
	this.panelV = [];
    }
    
    gapX() { return 2.54*0.5; }
    gapY() { return 2.54*0.5; }

    panelAdd(panel) {
	this.panelV.push(panel);
	this.roof.drawr.addPanel(panel);
	this.panelPartSub.partAddPanel(panel, 1);
    }
    
    panelBlockLtDn(orient, x1, y1, nX, nY) {
	let r;
	let y = y1;
	for(let iY = nY; iY--; ) {
	    let x = x1;
	    for(let iX = nX; iX--; ) {
		this.panelAdd(r = orient.instNuLtDn(x,y, this));
		x = r.x0 - this.gapX();
	    }
	    y = r.y0 - this.gapY();
	}
	return new RackR2(r.x0, r.y0, x1, y1, this);
    }

    panelBlockLtUp(orient, x1, y0, nX, nY) {
	let r;
	let y = y0;
	for(let iY = 0; iY < nY; iY++) {
	    let x = x1;
	    for(let iX = nX; iX--; ) {
		this.panelAdd(r = orient.instNuLtUp(x,y, this));
		x = r.x0 - this.gapX();
	    }
	    y = r.y1 + this.gapY();
	}
	return new RackR2(r.x0, y0, x1, r.y1, this);
    }

    panelBlockRtDn(orient, x0, y1, nX, nY) {
	let r;
	let y = y1;
	for(let iY = nY; iY--; ) {
	    let x = x0;
	    for(let iX = 0; iX < nX; iX++) {
		this.panelAdd(r = orient.instNuRtDn(x,y, this));
		x = r.x1 + this.gapX();
	    }
	    y = r.y0 - this.gapY();
	}
	return new RackR2(x0, r.y0, r.x1, y1, this);
    }

    panelBlockRtUp(orient, x0, y0, nX, nY) {
	let r;
	let y = y0;
	for(let iY = 0; iY < nY; iY++) {
	    let x = x0;
	    for(let iX = 0; iX < nX; iX++) {
		this.panelAdd(r = orient.instNuRtUp(x,y, this));
		x = r.x1 + this.gapX();
	    }
	    y = r.y1 + this.gapY();
	}
	return new RackR2(x0, y0, r.x1, r.y1, this);
    }

    optMount(partSub) { partSub.partAdd(TbdMlpePart, 1); }

    layoutFin() {}
}

//-----------------------------------------------------------------------------------------------------------------------
// RackTworail

class RackTworail extends Rack {
    constructor(env, partSub, panelPartSub, roof, railGroup) {
	super(env, partSub, panelPartSub, roof);
	this.railGroup = railGroup;
	railGroup.rackAdd(this);
	this.railRegV = [];
	this.railV = [];
	this.footV = [];
	this.endV = [];
	this.midV = [];
	this.groundLugN = null;
    }

    railRegAdd(clampR) {
	for(const reg of this.railRegV) {
	    if(clampR.y0 <= reg.y1 && reg.y0 < clampR.y1) {
		if(clampR.x0 < reg.x0 && (clampR.x1 + 2*this.gapX()) >= reg.x0) {
		    // add panel and mid to left of existing reg
		    reg.midXV.push((clampR.x1 + reg.x0)/2);
		    reg.x0 = clampR.x0;
		    if(clampR.y0 > reg.y0) reg.y0 = clampR.y0;
		    if(clampR.y1 < reg.y1) reg.y1 = clampR.y1;
		    return reg;
		}
		else if(clampR.x0 > reg.x0 && (clampR.x0 - 2*this.gapX()) <= reg.x1) {
		    // add panel and mid to right of existing reg
		    reg.midXV.push((reg.x1 + clampR.x0)/2);
		    reg.x1 = clampR.x1;
		    if(clampR.y0 > reg.y0) reg.y0 = clampR.y0;
		    if(clampR.y1 < reg.y1) reg.y1 = clampR.y1;
 		    return reg;
		}
	    }
	}
	// new reg
	const reg = new RailRegR2(clampR.x0, clampR.y0, clampR.x1, clampR.y1);
	this.railRegV.push(reg);
	return reg;
    }

    layoutFin() {
	// compute panel area and rail regions
	let bondI = 0;
	for(const panel of this.panelV) {
	    const reg0 = this.railRegAdd(panel.clampR0());
	    const reg1 = this.railRegAdd(panel.clampR1());
	    if(! reg0.bondI) reg0.bondI = ++bondI;
	    if(! reg1.bondI) reg1.bondI = reg0.bondI;
	}
	
	// for each region, rail, ends, mids
	for(const reg of this.railRegV) {
	    const rail = this.roof.railFromReg(reg);
	    this.railV.push(rail);
	    this.roof.drawr.addRail(rail);
	    rail.rack = this;
	    this.railGroup.railAdd(rail);
	    
	    for(const foot of rail.footV) {
		this.footV.push(foot);
		this.roof.drawr.addFoot(foot);
	    }
	    for(const end of [ new P2(rail.x0, rail.y0), new P2(rail.x1, rail.y1) ]) {
		this.endV.push(end);
		this.roof.drawr.addEnd(end);
	    }
	    for(const mid of reg.midXV.map(x => new P2(x, rail.y0))) {
		this.midV.push(mid);
		this.roof.drawr.addMid(mid);
	    }
	}

	this.groundLugN = bondI;
	this.railGroup.rackFin(this);
    }

    panelArea() { return this.panelV.reduce((acc,x) => acc + x.dimL * x.dimS, 0); }
}
