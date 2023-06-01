const MarginTrbl = [ 250, 300, 100, 300 ];
const Scale = 0.75;

function labelCtx(ctx) {
    ctx.fillStyle = ctx.strokeStyle = '#e40';
    ctx.lineWidth = 2;
    ctx.font = 'bold 12px sans-serif';
}
function rafterCtx(ctx) {
    ctx.setLineDash([4,8]);
    ctx.strokeStyle = '#6668';
}

//-----------------------------------------------------------------------------------------------------------------------
// DrawrNop: dummy no-op class that draws nothing

class DrawrNop {
    sizeSetR(r) {}
    clear_1() {}
    addChimney(r) {}
    addEdgePathV(pV) {}
    addEnd(p) {}
    addFire(r) {}
    addFoot(p) {}
    addLabelPoint(a, b, id) {}
    addMeasure(ax,ay, bx,by, dy, tdy, tdx, text) {}
    addMid(p) {}
    addPanel(r) {}
    addPathV(pV) {}
    addPathVClose(pV) {}
    addPipe(c) {}
    addRafter(l, label) {}
    addRail(l) {}
    addSkirt(r) {}
    addSplice_1(p) {}
    addVent(r) {}
}

var DrawrNopSingleton = new DrawrNop();

//-----------------------------------------------------------------------------------------------------------------------
// CanvasDrawr

class CanvasDrawr {
    constructor(container) {
	this.stack = container.appendChild(eleNuClas('div', 'drawrStack'));
	this.canvas0 = this.stack.appendChild(eleNu('canvas'));
	this.canvas1 = this.stack.appendChild(eleNu('canvas'));
    }

    sizeSetR(r) {
	const w = MarginTrbl[3] + r.x1 - r.x0 + MarginTrbl[1];
	const h = MarginTrbl[0] + r.y1 - r.y0 + MarginTrbl[2];
	this.xywh = [ r.x0, r.y0, w, h ];
	this.canvas1.width = this.canvas0.width = w * Scale;
	this.canvas1.height = this.canvas0.height = h * Scale;
	this.ctx0 = this.canvas0.getContext('2d');
	this.ctx1 = this.canvas1.getContext('2d');
	const mat = [ Scale, 0, 0, -Scale, Scale * MarginTrbl[3], Scale * (MarginTrbl[0] + r.y1) ];
	this.ctx0.setTransform(...mat);
	this.ctx1.setTransform(...mat);
    }
    
    clear_1() {
	this.ctx1.clearRect(...this.xywh);
    }
    
    addChimney(r) { drawRectFillStyle(this.ctx0, r, '#4408'); }
    
    addEdgePathV(pV) {
	const ctx = this.ctx0;
	ctx.save();
	ctx.fillStyle = '#eca9';
	ctx.beginPath();
	ctx.moveTo(pV[0].x, pV[0].y);
	for(let i = 0; i < pV.length; i++)
	    ctx.lineTo(pV[i].x, pV[i].y);
	ctx.fill();
	ctx.restore();
    }

    addEnd(p) {
	const ctx = this.ctx0;
	ctx.save();
	ctx.strokeStyle = '#0888';
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.moveTo(p.x - 6, p.y - 6);
	ctx.lineTo(p.x + 6, p.y + 6);
	ctx.stroke();
	ctx.restore();
    }

    addFire(r) { drawRectFillStyle(this.ctx0, r, '#fcf8'); }
    
    addFoot(p) {
	const ctx = this.ctx0;
	ctx.save();
	ctx.fillStyle = '#f008';
	ctx.beginPath();
	ctx.arc(p.x, p.y, 6, 0, Math.PI * 2.0, false);
	ctx.fill();
	if(p.edgeP) {
	    ctx.beginPath();
	    ctx.strokeStyle = '#f008';
	    ctx.arc(p.x, p.y, 12, 0, Math.PI * 2.0, false);
	    ctx.stroke();
	}
	ctx.restore();
    }

    addLabelPoint(a, b, text) {
	const ctx = this.ctx0;
	ctx.save();
	labelCtx(ctx);
	ctx.beginPath();
	drawLine(ctx, a.x, a.y, b.x, b.y);
	ctx.stroke();
	drawTextAb(ctx, a.x,a.y, b.x,b.y, text);
	ctx.restore();
    }	    
    
    // measure from point a to b, with extenders perpedicular to a by y
    addMeasure(ax,ay, bx,by, ldy, pdy, pdx, text) {
	const ctx = this.ctx0;
	const abx = bx-ax;
	const aby = by-ay;
	const mag = Math.sqrt(abx*abx + aby*aby);
	const rmag = 1/mag;
	const ux = abx*rmag;
	const uy = aby*rmag;
	const matA = ctx.getTransform().multiplySelf(new DOMMatrix([ux, uy, -uy, ux, ax, ay]));
	const matB = ctx.getTransform().multiplySelf(new DOMMatrix([ux, uy, -uy, ux, bx, by]));

	const py = (0 > ldy) ? (ldy + pdy) : (ldy - pdy);
	
	ctx.save();
	labelCtx(ctx);
	ctx.beginPath();
	ctx.setTransform(matA);
	drawLine(ctx, 0,0, 0,ldy);
	drawArrowL(ctx, 0,py, pdx);
	ctx.setTransform(matB);
	drawLine(ctx, 0,0, 0,ldy);
	drawArrowR(ctx, 0,py, pdx);
	ctx.stroke();
	drawTextAb(ctx, 0,0, pdx,py, `${mag.toFixed(2)} ${text}`);
	ctx.restore();
    }

    addMid(p) {
	const ctx = this.ctx0;
	ctx.save();
	ctx.strokeStyle = '#0888';
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.moveTo(p.x - 6, p.y - 6);
	ctx.lineTo(p.x + 6, p.y + 6);
	ctx.moveTo(p.x - 6, p.y + 6);
	ctx.lineTo(p.x + 6, p.y - 6);
	ctx.stroke();
	ctx.restore();
    }
    
    addPanel(r) {
	const ctx = this.ctx0;
	drawRectStrokeStyle(ctx, r, '#000');
	drawRectFillStyle(ctx, r, '#ccc8');
	drawRectFillStyle(ctx, r.clamp0R, '#ace6');
	drawRectFillStyle(ctx, r.clamp1R, '#ace6');
    }

    addPathV(pV) {
	const ctx = this.ctx0;
	ctx.save();
	ctx.strokeStyle = '#000';
	ctx.lineWidth = 3;
	ctx.beginPath();
	drawPath(ctx, pV);
	ctx.stroke();
	ctx.restore();
    }

    addPathVClose(pV) {
	const ctx = this.ctx0;
	ctx.save();
	ctx.strokeStyle = '#000';
	ctx.lineWidth = 3;
	ctx.beginPath();
	drawPathClose(ctx, pV);
	ctx.stroke();
	ctx.restore();
    }

    addPipe(c) {
	const ctx = this.ctx0;
	ctx.save();
	ctx.fillStyle = '#4408';
	ctx.beginPath();
	ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2.0, false);
	ctx.fill();
	ctx.beginPath();
	ctx.setLineDash([4,4]);
	ctx.strokeStyle = '#4408';
	ctx.arc(c.x, c.y, c.r + 12, 0, Math.PI * 2.0, false);
	ctx.stroke();
	ctx.restore();
    }

    addRafter(l, label) {
	const ctx = this.ctx0;
	ctx.save();
	rafterCtx(ctx);
	ctx.beginPath();
	drawLine(ctx, l.x0,l.y0, l.x1,l.y1);
	ctx.stroke();
	labelCtx(ctx);
	drawTextAbVerMid(ctx, l.x0,l.y0, l.x1,l.y1, label);
	ctx.restore();
    }

    addRail(l) {
	const ctx = this.ctx0;
	ctx.save();
	ctx.strokeStyle = '#00f8';
	ctx.beginPath();
	drawLine(ctx, l.x0, l.y0, l.x1, l.y1);
	ctx.stroke();
	ctx.restore();
    }

    addSkirt(r) { drawRectFillStyle(this.ctx0, r, '#84c8'); }

    addSplice_1(p) {
	const ctx = this.ctx1;
	ctx.save();
	ctx.fillStyle = '#0c08';
	ctx.beginPath();
	ctx.fillRect(p.x - 2, p.y - 10, 4, 20);
	ctx.restore();
    }

    addVent(r) { drawRectFillStyle(this.ctx0, r, '#4408'); }
}

//-----------------------------------------------------------------------------------------------------------------------
// draw helpers
//-----------------------------------------------------------------------------------------------------------------------

function matApply(mat, x, y) {
    return [mat.a*x + mat.b*y + mat.e, mat.c*x + mat.d*y + mat.f];
}    

function drawArrowL(ctx, x, y, len) {
    ctx.moveTo(x, y);
    ctx.lineTo(x - len, y);
    ctx.moveTo(x - 10, y + 5);
    ctx.lineTo(x, y);
    ctx.lineTo(x - 10, y - 5);
}

function drawArrowR(ctx, x, y, len) {
    ctx.moveTo(x, y);
    ctx.lineTo(x + len, y);
    ctx.moveTo(x + 10, y + 5);
    ctx.lineTo(x, y);
    ctx.lineTo(x + 10, y - 5);
}

function drawLine(ctx, x0, y0, x1, y1) {
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
}	

function drawPath(ctx, pV) {
    ctx.moveTo(pV[0].x, pV[0].y);
    for(let i = 1; i < pV.length; i++)
	ctx.lineTo(pV[i].x, pV[i].y);
}

function drawPathClose(ctx, pV) {
    drawPath(ctx, pV);
    ctx.lineTo(pV[0].x, pV[0].y);
}

function drawRectFillStyle(ctx, r, fillStyle) {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.fillRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
    ctx.restore();
}

function drawRectStrokeStyle(ctx, r, strokeStyle) {
    ctx.save();
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.strokeRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
    ctx.restore();
}

function drawTextAb(ctx, ax,ay, bx,by, text) {
    const [tax,tay] = matApply(ctx.getTransform(), ax, ay);
    const [tbx,tby] = matApply(ctx.getTransform(), bx, by);
    drawTextTranLrtb(ctx, tbx,tby, /*l0r1*/tbx > tax, /*t0b1*/tby > tay, text);
}    

function drawTextAbVerMid(ctx, ax,ay, bx,by, text) {
    const [tax,tay] = matApply(ctx.getTransform(), ax, ay);
    const [tbx,tby] = matApply(ctx.getTransform(), bx, by);
    drawTextTranVerTbmid(ctx, tbx,tby, /*t0b1*/tby > tay, text);
}

function drawTextTranLrtb(ctx, tx,ty, l0r1, t0b1, text) {
    const tm = ctx.measureText(text);
    tx += l0r1 ? 2 : -2-tm.width;
    ty += t0b1 ? (2 + tm.actualBoundingBoxAscent + tm.actualBoundingBoxDescent) : (-2 - tm.actualBoundingBoxDescent);
    drawTextTran(ctx, tx, ty, text);
}

function drawTextTranLrmid(ctx, tx,ty, l0r1, text) {
    const tm = ctx.measureText(text);
    tx += l0r1 ? 2 : -2-tm.width;
    ty += 0.5 * (tm.actualBoundingBoxAscent + tm.actualBoundingBoxDescent);
    drawTextTran(ctx, tx, ty, text);
}

function drawTextTranVerTbmid(ctx, tx,ty, t0b1, text) {
    const tm = ctx.measureText(text);
    const tdx = t0b1 ? -2-tm.width : 2;
    const tdy = 0.5 * (tm.actualBoundingBoxAscent + tm.actualBoundingBoxDescent);
    ctx.save();
    ctx.setTransform(0, -1, 1, 0, tx, ty); // ccw axes rotation
    ctx.fillText(text, tdx, tdy);
    ctx.restore();
}

function drawTextTran(ctx, tx,ty, text) {
    ctx.save();
    ctx.resetTransform();
    ctx.fillText(text, tx, ty);
    ctx.restore();
}
