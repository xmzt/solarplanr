//include base.js (for constants)

//-----------------------------------------------------------------------------------------------------------------------
// C2: circle 2d
//-----------------------------------------------------------------------------------------------------------------------

class C2 {
    constructor(x,y,r) { this.x = x; this.y = y; this.r = r; }
}

//-----------------------------------------------------------------------------------------------------------------------
// L2: line 2d
//-----------------------------------------------------------------------------------------------------------------------

class L2 {
    constructor(x0,y0,x1,y1) { this.x0 = x0; this.y0 = y0; this.x1 = x1; this.y1 = y1; }
    addX(x) { return new L2(this.x0 + x, this.y0, this.x1 + x, this.y1); }
    addY(y) { return new L2(this.x0, this.y0 + y, this.x1, this.y1 + y); }
    xfrmParallel(off) {
	const dx = this.x1 - this.x0;
	const dy = this.y1 - this.y0;
	const dxy = Math.sqrt(dx*dx + dy*dy);
	const mA = dx/dxy;
	const mB = -dy/dxy;
	const mC = dy/dxy;
	const mD = dx/dxy;
	return new L2(mA*0   + mB*off + this.x0, mC*0   + mD*off + this.y0,
		      mA*dxy + mB*off + this.x0, mC*dxy + mD*off + this.y0);
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// P2: point 2d
//-----------------------------------------------------------------------------------------------------------------------

class P2 {
    constructor(x,y) { this.x = x; this.y = y; }
    addX(x) { return new P2(this.x + x, this.y); }
    addY(y) { return new P2(this.x, this.y + y); }
    addXY(x,y) { return new P2(this.x + x, this.y + y); }
    l2P(p1) { return new L2(this.x, this.y, p1.x, p1.y); }
}

//-----------------------------------------------------------------------------------------------------------------------
// R2: rectangle 2d
//-----------------------------------------------------------------------------------------------------------------------

class R2 {
    static fromBboxPlus(bbox, dx0, dy0, dx1, dy1) {
	return new this(bbox.x + dx0, bbox.y + dy0, bbox.x + bbox.width + dx1, bbox.y + bbox.height + dy1);
    }

    constructor(x0,y0,x1,y1) { this.x0 = x0; this.y0 = y0; this.x1 = x1; this.y1 = y1; }
}

//-----------------------------------------------------------------------------------------------------------------------
// math
//
// https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
//
// "Given two points on each line segment"
// ua/ud = wikipedia.t = scaling factor for a [result = (a.x0 - ax*ua/ud, a.y0 - ay*ua/ud) ]
// ub/ud = wikipedia.u = scaling factor for b [result = (b.x0 - bx*ua/ud, b.y0 - by*ua/ud) ]
//-----------------------------------------------------------------------------------------------------------------------

function interpX(a, b, y) { return a.x + ((b.x - a.x) * (y - a.y) / (b.y - a.y)); }
function interpY(a, b, x) { return a.y + ((b.y - a.y) * (x - a.x) / (b.x - a.x)); }

function interLineLine(a, b) {
    const ax = a.x0 - a.x1;
    const ay = a.y0 - a.y1;
    const abx = a.x0 - b.x0;
    const aby = a.y0 - b.y0;
    const bx = b.x0 - b.x1;
    const by = b.y0 - b.y1;

    const ud = ax*by - ay*bx;
    if(ud) {
	const ua_ud = (abx*by - aby*bx) / ud;
	return new P2(a.x0 - ax*ua_ud, a.y0 - ay*ua_ud);
    }
    return null;
}

function interSegSeg(a, b) {
    const ax = a.x0 - a.x1;
    const ay = a.y0 - a.y1;
    const abx = a.x0 - b.x0;
    const aby = a.y0 - b.y0;
    const bx = b.x0 - b.x1;
    const by = b.y0 - b.y1;

    const ud = ax*by - ay*bx;
    if(ud) {
	const ua = abx*by - aby*bx;
	const ub = abx*ay - aby*ax;
	if((0 < ud) ? (0 <= ua && ua <= ud && 0 <= ub && ub <= ud) : (0 >= ua && ua >= ud && 0 >= ub && ub >= ud)) {
	    const ua_ud = ua / ud;
	    return new P2(a.x0 - ax*ua_ud, a.y0 - ay*ua_ud);
	}
    }
    return null;
}

function dist2LinePoint(a, p) {
    const ax = a.x0 - a.x1;
    const ay = a.y0 - a.y1;
    const abx = a.x0 - p.x;
    const aby = a.y0 - p.y;

    const ub = abx*ay - aby*ax;
    return (ub*ub) / (ax*ax + ay*ay);
}

function dist2SegPoint(a, p) {
    // implicit line b is perpendicular to a, passing through p
    const ax = a.x0 - a.x1;
    const ay = a.y0 - a.y1;
    const abx = a.x0 - p.x;
    const aby = a.y0 - p.y;
    const bx = -ay;
    const by = ax;

    let ud = ax*by - ay*bx;
    if(ud) {
	let ua = abx*by - aby*bx;
	if(0 > ud) {
	    ud = -ud;
	    ua = -ua;
	}
	if(0 > ua) {
	    // dist2 between p and (a.x0,a.y0)
	    return abx*abx + aby*aby;
	}
	else if(ud < ua) {
	    // dist2 between p and (a.x1,a.y1)
	    const a1px = a.x1 - p.x;
	    const a1py = a.y1 - p.y;
	    return a1px*a1px + a1py*a1py;
	}
	else {
	    const ub = abx*ay - aby*ax;
	    return (ub*ub) / (ax*ax + ay*ay);
	}
    }
    return null;
}

//-----------------------------------------------------------------------------------------------------------------------
// edge path stuff
//-----------------------------------------------------------------------------------------------------------------------

function boundR2FromP2V(pV) {
    let x0 = pV[0].x;
    let y0 = pV[0].y;
    let x1 = pV[0].x;
    let y1 = pV[0].y;
    for(let i = 1; i < pV.length; ++i) {
	if(pV[i].x < x0) x0 = pV[i].x;
	if(pV[i].x > x1) x1 = pV[i].x;
	if(pV[i].y < y0) y0 = pV[i].y;
	if(pV[i].y > y1) y1 = pV[i].y;
    }
    return new R2(x0, y0, x1, y1);
}

function l2VFromP2V(pV) {
    const l2V = [];
    for(let i = 1; i < pV.length; ++i)
	l2V.push(pV[i-1].l2P(pV[i]));
    return l2V;
}
    
function edgePathVCwClose(edgeV) {
    const pathV = edgeV.map(a => { return new P2(a.x0, a.y0); });
    const edge9 = edgeV[edgeV.length-1];
    pathV.push(new P2(edge9.x1, edge9.y1));

    let in0 = edgeV[0].xfrmParallel(-EdgeWidth);
    let in1 = edge9.xfrmParallel(-EdgeWidth);
    let p0 = interLineLine(in0, in1);
    pathV.push(p0);
    for(let i = edgeV.length - 2; i > 0; --i) {
	let in2 = edgeV[i].xfrmParallel(-EdgeWidth);
	pathV.push(interLineLine(in1, in2));
	in1 = in2;
    }
    pathV.push(interLineLine(in1, in0));
    pathV.push(p0);
    return pathV;
}

function edgePathVCwOpen(edgeV) {
    const pathV = edgeV.map(a => new P2(a.x0, a.y0));
    const edge9 = edgeV[edgeV.length-1];
    pathV.push(new P2(edge9.x1, edge9.y1));

    let in0 = edge9.xfrmParallel(-EdgeWidth);
    pathV.push(new P2(in0.x1, in0.y1));
    for(let i = edgeV.length-1; i > 0; --i) {
	let in1 = edgeV[i-1].xfrmParallel(-EdgeWidth);
	pathV.push(interLineLine(in0, in1));
	in0 = in1;
    }
    pathV.push(new P2(in0.x0, in0.y0));
    return pathV;
}

