//include solarDraw.js
//include solarParts.js
//include solarBase.js

//-----------------------------------------------------------------------------------------------------------------------
// roofs
//-----------------------------------------------------------------------------------------------------------------------

class RoofTop extends Roof {
    constructor() {
	super();
	this.le = new P2(10,10);
	this.lr = this.le.addY(637);
	this.rr = this.lr.addX(1168);
	this.re = this.rr.addY(-639);
	this.vle = this.le.addX(503);
	this.vre = this.re.addX(-132);
	this.vt = new P2(this.rr.x - 393, this.rr.y - 425);
	
	this.edges = [
	    new L2(this.le.x, this.le.y, this.vle.x, this.vle.y),
	    new L2(this.vre.x, this.vre.y, this.re.x, this.re.y),
	    new L2(this.lr.x, this.lr.y, this.rr.x, this.rr.y),
	    new L2(this.le.x, this.le.y, this.lr.x, this.lr.y),
	    new L2(this.re.x, this.re.y, this.rr.x, this.rr.y),
	];
	
	this.ventUps = [
	    new R2(this.lr.x + 147, this.le.y + 579, this.lr.x + 175, this.le.y + 606),
	    new R2(this.lr.x + 332, this.le.y + 577, this.lr.x + 360, this.le.y + 604),
	    new R2(this.rr.x - 667, this.rr.y - 61, this.rr.x - 639 , this.rr.y - 33),
	    new R2(this.rr.x - 501, this.rr.y - 62, this.rr.x - 474 , this.rr.y - 34),
	    new R2(this.rr.x - 346, this.rr.y - 63, this.rr.x - 318 , this.rr.y - 36),
	    new R2(this.rr.x - 176, this.rr.y - 66, this.rr.x - 149 , this.rr.y - 38),
	];
	
	this.ventLos = [
	    new R2(this.le.x + 297, this.le.y + 213, this.le.x + 325, this.le.y + 240),
	    new R2(this.rr.x - 333, this.rr.y - 426, this.rr.x - 305, this.rr.y - 398),
	    new R2(this.le.x + 535, this.rr.y - 551, this.le.x + 549, this.rr.y - 529),
	];
	
	this.pipes = [
	    new C2(this.le.x + 416, this.le.y + 82, 5/2.0),
	    new C2(this.le.x + 466, this.le.y + 82, 6/2.0),
	    new C2(this.re.x - 577, this.rr.y - 428, 11/2.0),
	    new C2(this.rr.x - 74, this.re.y + 455, 5/2.0),
	];
	
	this.chimney = new R2(this.rr.x - 116, this.rr.y - 160, this.rr.x - 72 , this.rr.y - 110);

	this.rafters = [];
	this.rafterL = new L2(this.le.x + 64, this.le.y, this.le.x + 64, this.lr.y);
	this.rafterR = new L2(this.re.x - 65, this.re.y, this.re.x - 65, this.rr.y);
	for(let rafter = this.rafterL; ; rafter = rafter.addX(2.54*24)) {
	    if(rafter.x0 > this.vt.x) break;
	    this.rafters.push(rafter);
	    
	}
	for(let rafter = this.rafterR; ; rafter = rafter.addX(-2.54*24)) {
	    if(rafter.x0 <= this.vt.x) break;
	    this.rafters.push(rafter);
	}
    }
    
    draw(ctx) {
	drawPath(ctx, this.le, this.lr, this.rr, this.re, this.vre, this.vt, this.vle, this.le);
	for(const x of this.ventUps) x.drawVent(ctx);
	for(const x of this.ventLos) x.drawVent(ctx);
	for(const x of this.pipes) x.drawPipe(ctx);
	this.chimney.drawChimney(ctx);
	for(const x of this.rafters) x.drawRafter(ctx);
	return this;
    }
}

class RoofBot extends Roof {
    constructor() {
	super();
	this.le = new P2(10,10);
	this.lr = this.le.addY(339);
	this.re = this.le.addX(1276);
	const r1 = this.le.addXY(1022,282);
	this.rr = new P2(interpX(this.re, r1, this.re.y + 337), this.re.y + 337); // todo intersect
	
	this.edges = [
	    new L2(this.le.x, this.le.y, this.re.x, this.re.y),
	    new L2(this.lr.x, this.lr.y, this.rr.x, this.rr.y),
	    new L2(this.le.x, this.le.y, this.lr.x, this.lr.y),
	];
	
	this.ventUps = [
	    new R2(this.le.x + 114, this.le.y + 282, this.le.x + 142, this.le.y + 309),
	    new R2(this.le.x + 219, this.le.y + 282, this.le.x + 247, this.le.y + 309),
	    new R2(this.le.x + 331, this.le.y + 282, this.le.x + 359, this.le.y + 309),
	    new R2(this.le.x + 439, this.le.y + 282, this.le.x + 466, this.le.y + 309),
	    new R2(this.le.x + 549, this.le.y + 282, this.le.x + 577, this.le.y + 309),
	    new R2(this.le.x + 652, this.le.y + 281, this.le.x + 679, this.le.y + 308),
	    new R2(this.le.x + 765, this.le.y + 282, this.le.x + 792, this.le.y + 309),
	];

	this.rafterL = new L2(this.le.x + 35, this.le.y, this.le.x + 35, this.lr.y);
	this.rafters = [];
	for(let rafter = this.rafterL; ; rafter = rafter.addX(2.54*24)) {
	    if(rafter.x0 >= this.re.x) break;
	    this.rafters.push(rafter);
	}
    }

    draw(ctx) {
	drawPath(ctx, this.le, this.lr, this.rr, this.re, this.le);
	for(const x of this.ventUps) x.drawVent(ctx);
	for(const x of this.rafters) x.drawRafter(ctx);
	return this;
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// rack layouts
//-----------------------------------------------------------------------------------------------------------------------
	
function silfab360PortraitTop(rack, roof) {
    const pP = new PanelShape(PanelSil360, 0, PanelFillStyle);
    const b0 = rack.panelBlockLeftDown(roof, pP, roof.le.x + 5, roof.ventUps[4].y0, 8, 1);
    let b = rack.panelBlockLeftDown(roof, pP, b0.x0, b0.y0 - rack.panelGapY, 2, 1);
    b = rack.panelBlockLeftDown(roof, pP, b.x1 + 1.5*pP.sizeX + rack.panelGapX, b.y1, 2, 1);
    b = rack.panelBlockRightDown(roof, pP, b0.x1, b.y1, 2, 1);
    b = rack.panelBlockLeftDown(roof, pP, b0.x0, b.y0 - rack.panelGapY, 4, 1);
    b = rack.panelBlockRightDown(roof, pP, roof.re.x - 5, roof.pipes[3].y - 10, 2, 2);
}

function silfab360PortraitTopTight(rack, roof) {
    const pP = new PanelShape(PanelSil360, 0, PanelFillStyle);
    const b0 = rack.panelBlockRightDown(roof, pP, roof.ventLos[1].x0, roof.ventUps[4].y0, 8, 1);
    let b = rack.panelBlockRightDown(roof, pP, b0.x1, b0.y0 - rack.panelGapY, 5, 1);
    b = rack.panelBlockLeftDown(roof, pP, b0.x0, b.y1, 2, 1);
    b = rack.panelBlockLeftDown(roof, pP, roof.le.x + 5, b.y0 - rack.panelGapY, 5, 1);
    b = rack.panelBlockRightDown(roof, pP, roof.re.x - 5, roof.pipes[3].y - 10, 2, 2);
}

function silfab360PortraitBotLo(rack, roof) {
    const pP = new PanelShape(PanelSil360, 0, PanelFillStyle);
    //const pL = new PanelShape(pP.part, 1, PanelFillStyle);
    let b = rack.panelBlockLeftUp(roof, pP, roof.le.x + 10, roof.le.y + 10, 10, 1);
    // b = rack.panelBlockLeftUp(roof, pL, b.x0, b.y1 + rack.panelGapY, 5, 1);
}

function silfab360PortraitBotUp(rack, roof) {
    const pP = new PanelShape(PanelSil360, 0, PanelFillStyle);
    let b = rack.panelBlockLeftDown(roof, pP, roof.le.x + 10, roof.ventUps[5].y0 - 10, 10, 1);
}

function silfab360LandscapeTop(rack, roof) { 
    //const rack = new RackUniracSfm();
    const pL = new PanelShape(PanelSil360, 1, PanelFillStyle);
    let b = rack.panelBlockLeftUp(roof, pL, roof.rafterL.x0 - 2.54*20, roof.le.y + 10, 2, 2);
    b = rack.panelBlockLeftUp(roof, pL, b.x0, roof.ventLos[0].y1 + 20, 4, 3);
    b = rack.panelBlockRightDown(roof, pL, roof.rafterR.x0 + 2.54*20, roof.pipes[3].y - 10, 1, 3);
}

function silfab360LandscapeBot(rack, roof) { 
    //const rack = new RackUniracSfm();
    const pL = new PanelShape(PanelSil360, 1, PanelFillStyle);
    let b = rack.panelBlockLeftUp(roof, pL, roof.le.x + 10, roof.le.y + 10, 6, 1);
    b = rack.panelBlockLeftUp(roof, pL, b.x0, b.y1 + rack.panelGapY, 5, 1);
    //b = rack.panelBlockLeftUp(roof, pL, roof.le.x + 5, roof.le.y + 10, 5, 2);
}

function silfab490PortraitTop(rack, roof) { 
    //const rack = new RackUniracSfm();
    const pL = new PanelShape(PanelSil490, 1, PanelFillStyle);
    let b = rack.panelBlockLeftUp(roof, pL, roof.le.x + 5, roof.le.y + 10, 2, 2);
    b = rack.panelBlockLeftDown(roof, pL, b.x0, roof.ventUps[0].y0 - 10, 2, 3);
    b = rack.panelBlockLeftDown(roof, pL, b.x1 + 2.54*36, b.y1, 2, 3);
    b = rack.panelBlockLeftDown(roof, pL, b.x1 - 0.5*pL.part.dimL, b.y0 - rack.panelGapY, 1, 1);
}
    
function silfab490PortraitBot(rack, roof) { 
    //const rack = new RackUniracSfm();
    const pL = new PanelShape(PanelSil490, 1, PanelFillStyle);
    let b = rack.panelBlockLeftUp(roof, pL, roof.le.x + 10, roof.le.y + 10, 5, 1);
    b = rack.panelBlockLeftUp(roof, pL, b.x0, b.y1 + rack.panelGapY, 4, 1);
}

function q395PortraitTop(rack, roof) { 
    //const rack = new RackIronRidgeXR10Camo(); 
    const pP = new PanelShape(PanelQ395, 0, PanelFillStyle);
    const b0 = rack.panelBlockLeftUp(roof, pP, roof.le.x + 5, roof.le.y + 10, 4, 1);
    let b = rack.panelBlockLeftUp(roof, pP, b0.x0, b0.y1 + rack.panelGapY, 2, 1);
    b = rack.panelBlockLeftUp(roof, pP, roof.ventLos[0].x1 + 5, b.y0, 2, 1);
    b = rack.panelBlockLeftUp(roof, pP, roof.pipes[2].x + 10, b.y0, 1, 1);
    b = rack.panelBlockLeftUp(roof, pP, b0.x0, b.y1 + rack.panelGapY, 7, 1);

    b = rack.panelBlockLeftDown(roof, pP, b.x1 + 2.54*36, b.y1, 1, 1);
    b = rack.panelBlockLeftDown(roof, pP, b.x0, b.y0 - rack.panelGapY, 3, 1);
    b = rack.panelBlockRightDown(roof, pP, roof.re.x - 30, b.y0 - rack.panelGapY, 1, 1);
}    

function q395PortraitBot(rack, roof) { 
    //const rack = new RackIronRidgeXR10Camo(); 
    const pP = new PanelShape(PanelQ395, 0, PanelFillStyle);
    let b = rack.panelBlockLeftUp(roof, pP, roof.le.x + 10, roof.le.y + 10, 10, 1);
}

function ja535MixedTop(rack, roof) { 
    //const rack = new RackIronRidgeXR10Camo(); 
    const pP = new PanelShape(PanelJa535, 0, PanelFillStyle);
    const pL = new PanelShape(pP.part, 1, PanelFillStyle);
    let b = rack.panelBlockLeftUp(roof, pP, roof.le.x + 10, roof.le.y + 10, 4, 1);
    b = rack.panelBlockLeftUp(roof, pP, b.x0, b.y1 + rack.panelGapY, 8, 1);
    b = rack.panelBlockLeftUp(roof, pL, b.x0, b.y1 + rack.panelGapY, 4, 1);
    b = rack.panelBlockLeftDown(roof, pP, b.x1 + 2.54*36, roof.pipes[3].y - 10, 1, 1);
}

function ja535MixedBot(rack, roof) { 
    //const rack = new RackIronRidgeXR10Camo();
    const pP = new PanelShape(rack.part0(PanelJa535), 0, PanelFillStyle);
    let b = rack.panelBlockLeftUp(roof, pP, roof.le.x + 10, roof.le.y + 10, 9, 1);
}

//-----------------------------------------------------------------------------------------------------------------------
// syssAll
//-----------------------------------------------------------------------------------------------------------------------

function syssAll(container) {
    const roofTop = new RoofTop();
    const roofBot = new RoofBot();

    // todo start here postMessage class
    function wrapXR10(note, popuTop, popuBot) {
	const railGroup = new RailGroupIronRidgeXR10();
	const layg = new LayGroup(note);
	layg.layAdd(new Lay('top', roofTop, new RackIronRidgeXRCamo(), railGroup, popuTop));
	layg.layAdd(new Lay('bot', roofBot, new RackIronRidgeXRCamo(), railGroup, popuBot));
	layg.go();
    }
    
    wrapXR10('Silfab 360 Portrait 2-rail A', silfab360PortraitTopTight, silfab360PortraitBotUp);
    wrapXR10('Silfab 360 Portrait 2-rail B', silfab360PortraitTop, silfab360PortraitBotUp);
    //topbotWrap('Silfab 360 Portrait 2-rail C', silfab360PortraitTop, silfab360PortraitBotLo);
    //topbotWrap('Silfab 360 Landcsape 0-rail', silfab360LandscapeTop, silfab360LandscapeBot);
    //topbotWrap('Silfab 490 Landscape 0-rail', silfab490PortraitTop, silfab490PortraitBot);
    //topbotWrap('Q 395 Portrait', q395PortraitTop, q395PortraitBot);
    //topbotWrap('JA 535 Mixed', ja535MixedTop, ja535MixedBot);
}

//-----------------------------------------------------------------------------------------------------------------------
// bodyOnload
//-----------------------------------------------------------------------------------------------------------------------

function bodyOnload() {
    railrHandlerInit();
    document.getElementById('titl').textContent = 'SiteA Solar V.2.0';
    syssAll();
}
