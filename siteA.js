//include sys.js

class A_RoofA extends Roof {
    static IdHtml = 'SiteA_RoofA';
    
    constructor(sys, id, descHtml) {
	super(sys, id, descHtml);
	this.le = new P2(0,0);
	this.lr = this.le.addY(637);
	this.rr = this.lr.addX(1168);
	this.re = this.rr.addY(-639);
	this.vre = this.re.addX(-132);
	this.vt = new P2(this.rr.x - 393, this.rr.y - 425);
	this.vle = this.le.addX(503);

	this.bpVSet([ this.vt, this.vle, this.le, this.lr, this.rr, this.re, this.vre, this.vt ]);
	this.edgeV = l2VFromP2V(this.bpV.slice(1,-1));
	this.edgePathV = edgePathVCwOpen(this.edgeV);

	for(let x = this.le.x + 64; x <= this.vt.x; x += 2.54 * 24)
	    this.rafterV.push(new L2(x, this.le.y, x, this.lr.y));
	this.rafterL = this.rafterV[0];
	const i = this.rafterV.length;
	for(let x = this.re.x - 65; x > this.vt.x; x -= 2.54 * 24)
	    this.rafterV.push(new L2(x, this.re.y, x, this.rr.y));
	this.rafterR = this.rafterV[i];
	
	this.chimneyV = [
	    new R2(this.rr.x - 116, this.rr.y - 160, this.rr.x - 72 , this.rr.y - 110),
	];

	this.pipeV = [
	    new C2(this.le.x + 416, this.le.y + 82, 5/2.0),
	    new C2(this.le.x + 466, this.le.y + 82, 6/2.0),
	    this.pipe4 = new C2(this.re.x - 577, this.rr.y - 428, 11/2.0),
	    this.pipeChim = new C2(this.rr.x - 74, this.re.y + 455, 5/2.0),
	];
	
	this.ventV = [
	    new R2(this.lr.x + 147, this.le.y + 579, this.lr.x + 175, this.le.y + 606),
	    new R2(this.lr.x + 332, this.le.y + 577, this.lr.x + 360, this.le.y + 604),
	    new R2(this.rr.x - 667, this.rr.y - 61, this.rr.x - 639 , this.rr.y - 33),
	    new R2(this.rr.x - 501, this.rr.y - 62, this.rr.x - 474 , this.rr.y - 34),
	    this.ventUp = new R2(this.rr.x - 346, this.rr.y - 63, this.rr.x - 318 , this.rr.y - 36),
	    new R2(this.rr.x - 176, this.rr.y - 66, this.rr.x - 149 , this.rr.y - 38),
	    this.ventLo0 = new R2(this.le.x + 297, this.le.y + 213, this.le.x + 325, this.le.y + 240),
	    this.ventLo1 = new R2(this.rr.x - 333, this.rr.y - 426, this.rr.x - 305, this.rr.y - 398),
	    new R2(this.le.x + 535, this.rr.y - 551, this.le.x + 549, this.rr.y - 529),
	];
    }

    static LayoutV = [
 	new Layout('LayoutA (Sil360 portrait)', function(rack, roof) {
	    const orient = PanelSil360.portrait();
	    const b0 = rack.panelBlockRightDn(orient, roof.ventLo1.x0, roof.ventUp.y0, 8, 1);
	    let b = rack.panelBlockLeftDn(orient, b0.x0, b0.y0 - rack.panelGapY, 8, 1);
	    b = rack.panelBlockLeftDn(orient, roof.le.x + 5, b.y0 - rack.panelGapY, 5, 1);
	    b = rack.panelBlockRightDn(orient, roof.re.x - 5, roof.pipeChim.y - 10, 2, 2);
	}),
	new Layout('LayoutB (Sil360 portrait)', function(rack, roof) {
	    const orient = PanelSil360.portrait();
	    const b0 = rack.panelBlockLeftDn(orient, roof.le.x + 5, roof.ventUp.y0, 8, 1);
	    let b = rack.panelBlockLeftDn(orient, b0.x0, b0.y0 - rack.panelGapY, 2, 1);
	    b = rack.panelBlockLeftDn(orient, b.x1 + 1.5*orient.sizeX + rack.panelGapX, b.y1, 2, 1);
	    b = rack.panelBlockRightDn(orient, b0.x1, b.y1, 2, 1);
	    b = rack.panelBlockLeftDn(orient, b0.x0, b.y0 - rack.panelGapY, 4, 1);
	    b = rack.panelBlockRightDn(orient, roof.re.x - 5, roof.pipeChim.y - 10, 2, 2);
	}),
	new Layout('LayoutC (Sil360 landscape)', function(rack, roof) {
	    const orient = PanelSil360.landscape();
	    let b = rack.panelBlockLeftUp(orient, roof.rafterL.x0 - 2.54*20, roof.le.y + 10, 2, 2);
	    b = rack.panelBlockLeftUp(orient, b.x0, roof.ventLo0.y1 + 20, 4, 3);
	    b = rack.panelBlockRightDn(orient, roof.rafterR.x0 + 2.54*20, roof.pipeChim.y - 10, 1, 3);
	}),
	new Layout('LayoutD (Sil490 landscape)', function(rack, roof) {
	    const orient = PanelSil490.landscape();
	    let b = rack.panelBlockLeftUp(orient, roof.le.x + 5, roof.le.y + 10, 2, 2);
	    b = rack.panelBlockLeftDn(orient, b.x0, roof.ventUp.y0, 2, 3);
	    b = rack.panelBlockLeftDn(orient, b.x1 + 2.54*36, b.y1, 2, 3);
	    b = rack.panelBlockLeftDn(orient, b.x1 - 0.5*orient.sizeX, b.y0 - rack.panelGapY, 1, 1);
	}),
	new Layout('LayoutE (Q395 portrait)', function(rack, roof) {
	    const orient = PanelQ395.portrait();
	    const b0 = rack.panelBlockLeftUp(orient, roof.le.x + 5, roof.le.y + 10, 4, 1);
	    let b = rack.panelBlockLeftUp(orient, b0.x0, b0.y1 + rack.panelGapY, 2, 1);
	    b = rack.panelBlockLeftUp(orient, roof.ventLo0.x1 + 5, b.y0, 2, 1);
	    b = rack.panelBlockLeftUp(orient, roof.pipe4.x + 10, b.y0, 1, 1);
	    b = rack.panelBlockLeftUp(orient, b0.x0, b.y1 + rack.panelGapY, 7, 1);

	    b = rack.panelBlockLeftDn(orient, b.x1 + 2.54*36, b.y1, 1, 1);
	    b = rack.panelBlockLeftDn(orient, b.x0, b.y0 - rack.panelGapY, 3, 1);
	    b = rack.panelBlockRightDn(orient, roof.re.x - 30, b.y0 - rack.panelGapY, 1, 1);
	}),
	new Layout('LayoutF (Ja535 portrait/landscape)', function(rack, roof) {
	    const orientP = PanelJa535.portrait();
	    const orientL = PanelJa535.landscape();
	    let b = rack.panelBlockLeftUp(orientP, roof.le.x + 10, roof.le.y + 10, 4, 1);
	    b = rack.panelBlockLeftUp(orientP, b.x0, b.y1 + rack.panelGapY, 8, 1);
	    b = rack.panelBlockLeftUp(orientL, b.x0, b.y1 + rack.panelGapY, 4, 1);
	    b = rack.panelBlockRightDn(orientP, roof.rr.x - 10, roof.pipeChim.y, 1, 2);
	}),
    ];
}

class A_RoofB extends Roof {
    static IdHtml = 'SiteA_RoofB';
    
    constructor(sys, id, descHtml) {
	super(sys, id, descHtml);
	this.le = new P2(0,0);
	this.lr = this.le.addY(339);
	this.re = this.le.addX(1276);
	this.rr = new P2(interpX(this.re, this.le.addXY(1022,282), this.re.y + 337), this.re.y + 337);
	this.bpVSet([ this.re, this.le, this.lr, this.rr, this.re ]);
	this.edgeV = l2VFromP2V(this.bpV.slice(0,-1));
	this.edgePathV = edgePathVCwOpen(this.edgeV);
	
	for(let x = this.le.x + 35; x <= this.re.x; x += 2.54 * 24)
	    this.rafterV.push(new L2(x, this.le.y, x, this.lr.y));

	this.ventV = [
	    new R2(this.le.x + 114, this.le.y + 282, this.le.x + 142, this.le.y + 309),
	    new R2(this.le.x + 219, this.le.y + 282, this.le.x + 247, this.le.y + 309),
	    new R2(this.le.x + 331, this.le.y + 282, this.le.x + 359, this.le.y + 309),
	    new R2(this.le.x + 439, this.le.y + 282, this.le.x + 466, this.le.y + 309),
	    new R2(this.le.x + 549, this.le.y + 282, this.le.x + 577, this.le.y + 309),
	    this.ventUp = new R2(this.le.x + 652, this.le.y + 281, this.le.x + 679, this.le.y + 308),
	    new R2(this.le.x + 765, this.le.y + 282, this.le.x + 792, this.le.y + 309),
	];
    }

    static LayoutV = [
	new Layout('LayoutA high (Sil360 portrait)', function(rack, roof) {
	    const orient = PanelSil360.portrait();
	    let b = rack.panelBlockLeftDn(orient, roof.le.x + 10, roof.ventUp.y0, 10, 1);
	}),
	new Layout('LayoutB low (Sil360 portrait)', function(rack, roof) {
	    const orient = PanelSil360.portrait();
	    let b = rack.panelBlockLeftUp(orient, roof.le.x + 10, roof.le.y + 10, 10, 1);
	}),
	new Layout('LayoutC (Sil360 landscape)', function(rack, roof) {
	    const orient = PanelSil360.landscape();
	    let b = rack.panelBlockLeftUp(orient, roof.le.x + 10, roof.le.y + 10, 6, 1);
	    b = rack.panelBlockLeftUp(orient, b.x0, b.y1 + rack.panelGapY, 5, 1);
	    //b = rack.panelBlockLeftUp(orient, roof.le.x + 5, roof.le.y + 10, 5, 2);
	}),
	new Layout('LayoutD (Sil490 landscape)', function(rack, roof) {
	    const orient = PanelSil490.landscape();
	    let b = rack.panelBlockLeftUp(orient, roof.le.x + 10, roof.le.y + 10, 5, 1);
	    b = rack.panelBlockLeftUp(orient, b.x0, b.y1 + rack.panelGapY, 4, 1);
	}),
	new Layout('LayoutE (Q395 portrait)', function(rack, roof) {
	    const orient = PanelQ395.portrait();
	    let b = rack.panelBlockLeftUp(orient, roof.le.x + 10, roof.le.y + 10, 10, 1);
	}),
	new Layout('LayoutF (Ja535 portrait)', function(rack, roof) {
	    const orient = PanelJa535.portrait();
	    let b = rack.panelBlockLeftUp(orient, roof.le.x + 10, roof.le.y + 10, 9, 1);
	}),
    ];
}

RoofClasV.push(A_RoofA);
RoofClasV.push(A_RoofB);
