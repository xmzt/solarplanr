//-----------------------------------------------------------------------------------------------------------------------
// DrawrNop: dummy no-op class that draws nothing

class DrawrNop {
    sizeSetR(r) {}
    clear() {}
    clearRail() {}
}
 
//-----------------------------------------------------------------------------------------------------------------------
// CanvasDrawr

class CanvasDrawr {
    constructor(container) {
	this.stack = container.appendChild(eleNuClas('div', 'drawrStack'));
	this.canvas0 = this.stack.appendChild(eleNu('canvas'));
	this.canvas1 = this.stack.appendChild(eleNu('canvas'));
    }

    sizeSetR(r) {
	const w = RoofCanvasMargin*2 + r.x1 - r.x0;
	const h = RoofCanvasMargin*2 + r.y1 - r.y0;
	this.xywh = [ r.x0, r.y0, w, h ];
	this.canvas1.width = this.canvas0.width = w * RoofCanvasScale;
	this.canvas1.height = this.canvas0.height = h * RoofCanvasScale;
	this.ctx0 = this.canvas0.getContext('2d');
	this.ctx1 = this.canvas1.getContext('2d');
	const transX = RoofCanvasScale * RoofCanvasMargin;
	const transY = RoofCanvasScale * (RoofCanvasMargin + r.y1);
	this.ctx0.setTransform(RoofCanvasScale, 0, 0, -RoofCanvasScale, transX, transY);
	this.ctx1.setTransform(RoofCanvasScale, 0, 0, -RoofCanvasScale, transX, transY);
    }
    
    clear_1() {
	this.ctx1.clearRect(...this.xywh);
    }
    
    addChimney(r) { drawRectFillStyle(this.ctx0, r, ChimneyFillStyle); }
    
    addEdgePathV(pV) {
	const ctx = this.ctx0;
	ctx.save();
	ctx.fillStyle = EdgeFillStyle;
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
	ctx.strokeStyle = ClampFillStyle;
	ctx.lineWidth = ClampLineWidth;
	ctx.beginPath();
	ctx.moveTo(p.x - ClampRadius, p.y - ClampRadius);
	ctx.lineTo(p.x + ClampRadius, p.y + ClampRadius);
	ctx.stroke();
	ctx.restore();
    }

    addFire(r) { drawRectFillStyle(this.ctx0, r, FireWalkFillStyle); }

    addFoot(p) {
	const ctx = this.ctx0;
	ctx.save();
	ctx.fillStyle = FootFillStyle;
	ctx.beginPath();
	ctx.arc(p.x, p.y, FootRadius, 0, Math.PI * 2.0, false);
	ctx.fill();
	if(p.edgeP) {
	    ctx.beginPath();
	    ctx.strokeStyle = FootEdgeStrokeStyle;
	    ctx.arc(p.x, p.y, FootEdgeRadius, 0, Math.PI * 2.0, false);
	    ctx.stroke();
	}
	ctx.restore();
    }

    addMid(p) {
	const ctx = this.ctx0;
	ctx.save();
	ctx.strokeStyle = ClampFillStyle;
	ctx.lineWidth = ClampLineWidth;
	ctx.beginPath();
	ctx.moveTo(p.x - ClampRadius, p.y - ClampRadius);
	ctx.lineTo(p.x + ClampRadius, p.y + ClampRadius);
	ctx.moveTo(p.x - ClampRadius, p.y + ClampRadius);
	ctx.lineTo(p.x + ClampRadius, p.y - ClampRadius);
	ctx.stroke();
	ctx.restore();
    }
    
    addPanel(r) {
	const ctx = this.ctx0;
	drawRectStrokeStyle(ctx, r, PanelStrokeStyle);
	drawRectFillStyle(ctx, r, PanelFillStyle);
	drawRectFillStyle(ctx, new R2(r.x0, r.y0 + r.orient.clamp0, r.x1, r.y0 + r.orient.clamp1), RailRegFillStyle);
	drawRectFillStyle(ctx, new R2(r.x0, r.y1 - r.orient.clamp1, r.x1, r.y1 - r.orient.clamp0), RailRegFillStyle);
    }

    addPathV(pV) {
	const ctx = this.ctx0;
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

    addPipe(c) {
	const ctx = this.ctx0;
	ctx.save();
	ctx.fillStyle = PipeFillStyle;
	ctx.beginPath();
	ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2.0, false);
	ctx.fill();
	ctx.beginPath();
	ctx.strokeStyle = PipeStrokeStyle;
	ctx.arc(c.x, c.y, c.r + PipeStrokeRadius, 0, Math.PI * 2.0, false);
	ctx.stroke();
	ctx.restore();
    }

    addRafter(l) {
	const ctx = this.ctx0;
	ctx.save();
	ctx.setLineDash(RafterLineDash);
	ctx.strokeStyle = RafterStrokeStyle;
	drawLine(ctx, l);
	ctx.restore();
    }

    addRail(l) {
	const ctx = this.ctx0;
	ctx.save();
	ctx.strokeStyle = RailStrokeStyle;
	drawLine(ctx, l);
	ctx.restore();
    }

    addSkirt(r) { drawRectFillStyle(this.ctx0, r, SkirtFillStyle); }

    addSplice_1(p) {
	const ctx = this.ctx1;
	ctx.save();
	ctx.fillStyle = SpliceFillStyle;
	ctx.beginPath();
	ctx.fillRect(p.x - SpliceRadiusX, p.y - SpliceRadiusY, 2*SpliceRadiusX, 2*SpliceRadiusY);
	ctx.restore();
    }

    addVent(r) { drawRectFillStyle(this.ctx0, r, VentFillStyle); }

}

//-----------------------------------------------------------------------------------------------------------------------
// draw helpers
//-----------------------------------------------------------------------------------------------------------------------

function drawLine(ctx, l) {
    ctx.beginPath();
    ctx.moveTo(l.x0, l.y0);
    ctx.lineTo(l.x1, l.y1);
    ctx.stroke();
}	

function drawLineDbg(ctx, l) {
    ctx.save();
    ctx.strokeStyle = '#487';
    ctx.lineWidth = 6;
    drawLine(ctx, l);
    ctx.restore();
}
    
function drawPointDbg(ctx, p) {
    ctx.save();
    ctx.fillStyle = '#487';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 12, 0, Math.PI * 2.0, false);
    ctx.fill();
    ctx.restore();
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

