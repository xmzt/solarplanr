//include base.js (for constants)

//-----------------------------------------------------------------------------------------------------------------------
// C2: circle 2d
//-----------------------------------------------------------------------------------------------------------------------

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

//-----------------------------------------------------------------------------------------------------------------------
// L2: line 2d
//-----------------------------------------------------------------------------------------------------------------------

class L2 {
    constructor(x0,y0,x1,y1) { this.x0 = x0; this.y0 = y0; this.x1 = x1; this.y1 = y1; }
    addX(x) { return new L2(this.x0 + x, this.y0, this.x1 + x, this.y1); }
    addY(y) { return new L2(this.x0, this.y0 + y, this.x1, this.y1 + y); }
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

//-----------------------------------------------------------------------------------------------------------------------
// R2: rectangle 2d
//-----------------------------------------------------------------------------------------------------------------------

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
    drawFireWalk(ctx) { return this.drawFillStyle(ctx, FireWalkFillStyle); }
    drawSkirt(ctx) { return this.drawFillStyle(ctx, SkirtFillStyle); }
    drawVent(ctx) { return this.drawFillStyle(ctx, VentFillStyle); }
}

class PanelOrientR2 extends R2 {
    constructor(x0, y0, x1, y1, orient) {
	super(x0,y0,x1,y1);
	this.orient = orient;
    }

    drawPanel(ctx) {
	this.drawFillStyle(ctx, PanelFillStyle);
	new R2(this.x0, this.y0 + this.orient.clamp0, this.x1, this.y0 + this.orient.clamp1)
	    .drawFillStyle(ctx, RailRegFillStyle);
	new R2(this.x0, this.y1 - this.orient.clamp1, this.x1, this.y1 - this.orient.clamp0)
	    .drawFillStyle(ctx, RailRegFillStyle);
	return this;
    }
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
    const bx = p.x - ay;
    const by = p.y + ax;

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

function drawPathV(ctx, pV) {
    ctx.save();
    ctx.strokeStyle = PathStrokeStyle;
    ctx.lineWidth = PathLineWidth;
    ctx.beginPath();
    ctx.moveTo(pV[0].x, pV[0].y);
    for(let i = 0; i < pV.length; i++)
	ctx.lineTo(pV[i].x, pV[i].y);
    ctx.stroke();
    ctx.restore();
}

function drawEdgePathV(ctx, pV) {
    ctx.save();
    ctx.fillStyle = EdgeFillStyle;
    ctx.beginPath();
    ctx.moveTo(pV[0].x, pV[0].y);
    for(let i = 0; i < pV.length; i++)
	ctx.lineTo(pV[i].x, pV[i].y);
    ctx.fill();
    ctx.restore();
}
