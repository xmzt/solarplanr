//include base.js
//include geom.js
//include svg.js
//include xsec.js

const Wid_x1 = 2.0;
const Wid_x2 = 4.0;
const Wid_x4 = 8.8;
const Wid_x6 = 14.0;
const Wid_x8 = 18.4;
const Wid_x10 = 23.5;

const WallHLo = 200;

//-----------------------------------------------------------------------------------------------------------------------
// functions

//-----------------------------------------------------------------------------------------------------------------------
// Xsec

class Xsec {
    constructor(div, svg) {
	this.div = div;
	this.svg = svg;
    }
}

class Figure {
    constructor(cEle) {
	this.cEle = cEle;
	this.fEle = svgNuAdd('g', cEle);
	//this.fBox set before derived constructor returns

	//xfrmSet:
    	//cdf: scale factor container / figure. multiply figure coord by this to get container coord.
	//fdc: scale factor: figure / container. multiply container coord by this to get figure coord.
	//cdfMat: transform matrix for figure coord to container coord
	//textMat: transform matrix for text 
    }

    xfrmSetCdfFlipY(c, f) {
	this.cdf = c/f;
	this.fdc = f/c;
	this.cdfMat = new DOMMatrixReadOnly([this.cdf, 0, 0, -this.cdf,
					     this.cdf * -this.fBox.x,
					     this.cdf * (this.fBox.height + this.fBox.y)]);
	svgSetMatrixDom(this.fEle, this.cdfMat);
	this.textMat = (ux, uy, x, y) => new DOMMatrixReadOnly([ux, -uy, uy, ux, x, y]);
	this.xfrmSet1();
    }	

    xfrmSetOffXFlipY(src, offX) {
	this.cdf = src.cdf;
	this.fdc = src.fdc;
	this.cdfMat = new DOMMatrixReadOnly([this.cdf, 0, 0, -this.cdf,
					     this.cdf * (offX - src.fBox.x),
					     this.cdf * (this.fBox.height + this.fBox.y)]);
	svgSetMatrixDom(this.fEle, this.cdfMat);
	this.textMat = (ux, uy, x, y) => new DOMMatrixReadOnly([ux, -uy, uy, ux, x, y]);
	this.xfrmSet1();
    }

    measIn(ax,ay, bx,by, extend, textFromD) {
	const dx = bx - ax; // delta
	const dy = by - ay;
	const d = Math.sqrt(dx*dx + dy*dy);
	const dr = 1/d;
	const ux = dx*dr;
	const uy = dy*dr;

	// calculate text dimensions
	const textEle = svgTextNuClasAdd('measText', this.cEle, textFromD(d));
	const textBox = textEle.getBBox();

	// draw arrows
	const arrowW = 0.5 * (d - ((textBox.width + 4) * this.fdc));
	const arrowMat = new DOMMatrixReadOnly([ux, uy, -uy, ux, ax, ay]);
	svgSetMatrixDom(svgNuPathDClasAdd(`M0,0 V${extend} h${arrowW}`
					  + ` M0,${extend+5} v-5 l10,5`
					  + ` M0,${extend-5} v5 l10,-5`
					  + ` M${d},0 V${extend} h${-arrowW}`
					  + ` M${d},${extend+5} v-5 l-10,5`
					  + ` M${d},${extend-5} v5 l-10,-5`
					  , 'measLine', this.fEle), arrowMat);
	
	// transform and position text
	const p = this.cdfMat.transformPoint(arrowMat.transformPoint(new DOMPoint(0.5 * d, extend)));
	svgSetXY(svgSetMatrixDom(textEle, this.textMat(ux, uy, p.x, p.y)), -0.5 * textBox.width, -0.5 * textBox.y);
    }

    measOut(ax,ay, bx,by, extend, text_a0b1, textFromD) {
	const dx = bx - ax; // delta
	const dy = by - ay;
	const d = Math.sqrt(dx*dx + dy*dy);
	const dr = 1/d;
	const ux = dx*dr;
	const uy = dy*dr;

	// calculate text dimensions
	const textEle = svgTextNuClasAdd('measText', this.cEle, textFromD(d));
	const textBox = textEle.getBBox();
	const textFigW = textBox.width * this.fdc;

	// draw arrows
	const arrowMat = new DOMMatrixReadOnly([ux, uy, -uy, ux, ax, ay]);
	svgSetMatrixDom(svgNuPathDClasAdd(`M0,0 V${extend} h${-20}`
					  + ` M0,${extend+5} v-5 l-10,5`
					  + ` M0,${extend-5} v5 l-10,-5`
					  + ` M${d},0 V${extend} h${20}`
					  + ` M${d},${extend+5} v-5 l10,5`
					  + ` M${d},${extend-5} v5 l10,-5`
					  , 'measLine', this.fEle), arrowMat);
	
	// transform and position text
	if(text_a0b1) {
	    const p = this.cdfMat.transformPoint(arrowMat.transformPoint(new DOMPoint(d + 20, extend)));
	    svgSetXY(svgSetMatrixDom(textEle, this.textMat(ux, uy, p.x, p.y)), 2, -0.5 * textBox.y);
	} else {
	    const p = this.cdfMat.transformPoint(arrowMat.transformPoint(new DOMPoint(-20, extend)));
	    svgSetXY(svgSetMatrixDom(textEle, this.textMat(ux, uy, p.x, p.y)), -2 - textBox.width, -0.5 * textBox.y);
	}
    }

    measHoriIn(ax,ay, bx,by, cy, textFromD) {
	const dx = bx - ax; // delta

	// calculate text dimensions
	const textEle = svgTextNuClasAdd('measText', this.cEle, textFromD(dx));
	const textBox = textEle.getBBox();
	const textFigW = textBox.width * this.fdc;

	// draw arrows
	const arrowW = 0.5 * (dx - textFigW) - 2;
	svgNuPathDClasAdd(`M${ax},${ay} V${cy} h${arrowW}   M${ax},${cy+5} v-5 l10,5   M${ax},${cy-5} v5 l10,-5`
			  + ` M${bx},${by} V${cy} h${-arrowW}  M${bx},${cy+5} v-5 l-10,5  M${bx},${cy-5} v5 l-10,-5`
			  , 'measLine', this.fEle);
	
	// transform and position text
	const p = this.cdfMat.transformPoint(new DOMPoint(0.5 * (ax + bx), cy));
	svgSetXY(svgSetMatrixDom(textEle, this.textMat(1, 0, p.x, p.y)), -0.5 * textBox.width, -0.5 * textBox.y);
    }
    
    pointer(ax,ay, dx,dy, more) {
	const dr = 1/Math.sqrt(dx*dx + dy*dy);
	const ux = dx*dr;
	const uy = dy*dr;

	const arrowMat = new DOMMatrixReadOnly([ux, uy, -uy, ux, ax, ay]);
	const arrow0 = arrowMat.transformPoint(new DOMPoint(10,5));
	const arrow1 = arrowMat.transformPoint(new DOMPoint(10,-5));
	let path = `M${arrow0.x},${arrow0.y} L${ax},${ay} L${arrow1.x},${arrow1.y} M${ax},${ay} l${dx},${dy} ${more}`;
	svgNuPathDClasAdd(path, 'measLine', this.fEle);
    }

    borderTitle(title, margin, x0,y0,x1,y1) {
	svgSetXYWH(svgNuClasAdd('rect', 'border', this.cEle),
		   x0 - margin, y0 - margin, x1 - x0 + 2*margin, y1 - y0 + 2*margin);
	svgTextAlign(svgTextNuClasAdd('title', this.cEle, title), 'xl', 'yt', 0, x0, y0);
    }

    place(title, margin, pageX,pageY, x0,y0, x1,y1) {
	svgSetMatrixDom(this.cEle, new DOMMatrixReadOnly([1,0,0,1, pageX + margin - x0, pageY + margin - y0]));
	svgSetXYWH(svgNuClasAdd('rect', 'border', this.cEle), x0 - margin, y0 - margin, x1-x0+2*margin, y1-y0+2*margin);
	svgTextAlign(svgTextNuClasAdd('title', this.cEle, title), 'xl', 'yt', 0, x0, y0);
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// SiteB_S

class SiteB_S extends Figure {
    constructor(cEle) {
	super(cEle);
	console.log('SiteB_S'); 
	const fEle = this.fEle;
	function strok(x) { return x.svgClasAdd('strok', fEle); }
	function strokLo(x) { return x.svgClasAddLo('strok', fEle); }
	//function strok2(x) { return x.svgClasAdd('strok2', fEle); }
	function strok2(x) { return x; }
	
	let a,b,c;

	const wallB = strok(r2Xywy(0, 0, Wid_x4, 62.5));
	const wallD = strok(r2Xywy(wallB.x1 + 146.0, 0, Wid_x4, 159));

	const pitch = new Pitch(wallD.x0 - wallB.x1, wallD.y1 - wallB.y1);
	console.log(`    pitch x=${pitch.x} y=${pitch.y} y/x=${pitch.ydx} y/x=${12*pitch.ydx}/12`);

	// c = actual rafter length, a,b = rafter eave, using pipe as common reference above and below
	c = 517.5;
	a = wallB.x1 + 8 - /*eave2vent*/69.0 * pitch.x;
	b = wallB.y1 + (a - wallB.x1) * pitch.ydx;
	const rafterL = strok(Quad.from01Yoff(a,b, a+c*pitch.x,b+c*pitch.y, Wid_x4/pitch.x));
	const ridgeBoard = strok(r2Xhwy(rafterL.x2, Wid_x8, Wid_x1, rafterL.y2));
	a = ridgeBoard.x1 + rafterL.x1 - rafterL.x0;
	const rafterR = strok(new Quad(a,rafterL.y0, ridgeBoard.x1,rafterL.y1,
						      ridgeBoard.x1,rafterL.y2, a,rafterL.y3));
	console.log(`    x(ridge-wallB)=${rafterL.x1-wallB.x0}, measured=400`);
	console.log(`    x(wallB-eave)=${wallB.x0-rafterL.x0}`);

	a = wallD.x0 + 53.5;
	b = rafterL.y0 + (a - rafterL.x0) * pitch.ydx;
	const wallE = strok2(r2Xywy(a, 0, Wid_x4, b));
	console.log(`    wallE.y1=${wallE.y1} measured=194.5`);

	a = wallB.x1 + 307.7;
	b = rafterL.y0 + (a - rafterL.x0) * pitch.ydx;
	const wallH = strok2(r2Xywy(a, 0, Wid_x4, b));

	a = wallH.x1 + 41*2.54 + 4 + Wid_x4;
	b = rafterR.y0 - (a - rafterR.x0) * pitch.ydx;
	const wallI = strok2(r2Wyxy(Wid_x4, 0, a, b));
	console.log(`    x(wallI-wallE)=${wallI.x0 - wallE.x1}, measured = ${2.54*84 + 4}`);
	
	a = wallD.x1 + 2.54*184 + 4 + Wid_x4;
	b = rafterR.y0 - (a - rafterR.x0) * pitch.ydx;
	const wallW = strok(r2Wyxy(Wid_x4, 0, a, b));

	const wallY = strok(r2Wyxy(Wid_x4, wallB.y0, rafterR.x1+rafterL.x1-wallB.x0, wallB.y1));
	
	const joist = strok(r2Xhxy(wallB.x0, Wid_x10, wallY.x1, 0));

	// a,b = collar+rafterL c=x(collar+rafterR)
	b = 232; // collar height
	a = rafterL.x0 + (b - rafterL.y0) * pitch.xdy;
	c = rafterR.x0 - (b - rafterR.y0) * pitch.xdy;
	const collar = strok(r2Xyxh(a, b, c, Wid_x4));

	// lower walls
	const wallBLo = strokLo(r2Xhwy(joist.x0, WallHLo, Wid_x4, joist.y0));
	const wallHLo = strokLo(r2Xhwy(wallH.x0, WallHLo, Wid_x4, joist.y0));
	const wallYLo = strokLo(r2Whxy(Wid_x4, WallHLo, joist.x1, joist.y0));

	// panels todo
	
	// calculate scale from raw frame dimensions
	this.fBox = fEle.getBBox();
	this.xfrmSet1 = () => {
	    let a,b,p;

	    // measure: rafter span
	    a = 0.5*(wallD.x0 + wallD.x1);
	    this.measHoriIn(wallB.x1,wallB.y1, a,wallD.y1, 200, unitIn);
	    b = 0.5*(ridgeBoard.x0 + ridgeBoard.x1);
	    this.measHoriIn(a,wallD.y1, b,ridgeBoard.y1, 350, unitIn);
	    a = 0.5*(wallW.x0 + wallW.x1);
	    this.measHoriIn(b,ridgeBoard.y1, a,wallW.y1, 350, unitIn);
	    this.measHoriIn(a,wallW.y1, wallY.x0,wallY.y1, 200, unitIn);

	    // measure: rafter
	    this.measIn(rafterL.x3,rafterL.y3, rafterL.x2,rafterL.y2, 200,
			(x) => `${unitIn(x)}, pitch=${(pitch.ydx*12).toFixed(1)}/12`);
	    a = 0.1*rafterL.x3 + 0.9*rafterL.x2;
	    b = 0.1*rafterL.y3 + 0.9*rafterL.y2;
	    this.pointer(a, b, 20,120, 'H500');
	    p = this.cdfMat.transformPoint(new DOMPoint(500, b + 120));
	    svgTextAlign(svgTextNuClasAdd('measText', this.cEle, '2x4 @ 16" o.c., species-unspecified'),
			 'xl', 'yc', 2, p.x, p.y);

	    // measure: intermediate wall, collar
	    this.measOut(wallB.x1,wallB.y0, wallB.x1,wallB.y1, 170, 0, unitIn);
	    this.measIn(wallD.x1,wallD.y0, wallD.x1,wallD.y1, -30, unitIn);
	    this.measIn(wallW.x1,wallW.y0, wallW.x1,wallW.y1, 30, unitIn);
	    this.measOut(wallY.x1,wallY.y0, wallY.x1,wallY.y1, -70, 0, unitIn);
	    a = 0.5*(collar.x0 + collar.x1);
	    this.measIn(a,joist.y1, a,collar.y0, 0, unitIn);

	    // measure: bearing wall
	    this.measHoriIn(wallBLo.x1,wallBLo.y0, wallHLo.x0,wallHLo.y0, wallHLo.y0, unitIn);
	    this.measHoriIn(wallHLo.x1,wallHLo.y0, wallYLo.x0,wallYLo.y0, wallYLo.y0, unitIn);
	    this.measHoriIn(wallBLo.x1,wallBLo.y0, wallYLo.x0,wallYLo.y0, wallYLo.y0 - 50, unitIn);

	    // measure: joist
	    this.pointer(0.2*joist.x0+0.8*joist.x1,joist.y0, 200,-100, 'H900');
	    p = this.cdfMat.transformPoint(new DOMPoint(900, joist.y0 - 100));
	    svgTextAlign(svgTextNuClasAdd('measText', this.cEle, '2x10, species-unspecified'), 'xl', 'yc', 2, p.x, p.y);

	    this.cBox = this.cEle.getBBox();
	};
	this.refX = wallD.x0;
	this.pitch = pitch;
    }
}

class SiteB_N extends Figure {
    constructor(cEle, pitch) {
	super(cEle);
	console.log('SiteB_N'); 
	const fEle = this.fEle;
	function strok(x) { return x.svgClasAdd('strok', fEle); }
	function strokLo(x) { return x.svgClasAddLo('strok', fEle); }
	
	let a,b,c,d,e;

	// interior widths (in):
	// D-A=127.5, Z-V=153, V-D=85.5
	// Z-A=378.5=249.5+129
	// Z-A=377.5=159+218.5
	// 159+85.5 = 244.5, should be 249.5
	// 129+85.5 = 214.5, sholud be 218.5
	
	const wallALo = strokLo(r2Xhwy(0, WallHLo, Wid_x4, -Wid_x10));
	a = ufroIn(123 + 254.5);
	b = ufroIn(156 + 222);
	c = ufroIn(123 + 98.5 + 156);
	console.log(`    intX(e-w)=${a}, ${b}, ${c}`);
	const wallZLo = strokLo(r2Xhwy(wallALo.x1 + 4 + (a+b+c)/3, WallHLo, Wid_x4, -Wid_x10));
	const wallDLo = strokLo(r2Xhwy(wallALo.x1 + 4 + ufroIn(128), WallHLo, Wid_x4, -Wid_x10));
	const wallVLo = strokLo(r2Xhwy(wallZLo.x1 - 4 - ufroIn(153), WallHLo, Wid_x4, -Wid_x10));

	const joist = strok(r2Xhxy(wallALo.x0, Wid_x10, wallZLo.x1, 0));

	//const pitch = new Pitch(0./*92+144*/236, /*wallD height*/154);
	//console.log(`    pitch x=${pitch.x} y=${pitch.y} y/x=${pitch.ydx} y/x=${12*pitch.ydx}/12`);
	//const wallD = strok(r2Xywy(wallALo.x1 + 263, 0, Wid_x4, /*measured 154*/154));
	//e = actual rafter length, a,b = rafter eave, c,d = rafter ridge
	//e = 627;
	//c = 0.5*(joist.x0 + joist.x1 - Wid_x1);
	//d = wallD.y1 + (c - wallD.x0) * pitch.ydx;
	//a = c - e * pitch.x;
	//b = d - e * pitch.y;
	//const rafterL = Quad.from01Yoff(a,b, c,d, Wid_x4/pitch.x).svgClasAdd(fEle, 'strok');
	//const ridgeBoard = r2Xhwy(rafterL.x2, Wid_x8, Wid_x1, rafterL.y2).svgClasAdd(fEle, 'strok');
	//a = ridgeBoard.x1 + rafterL.x1 - rafterL.x0;
	//const rafterR = new Quad(a,rafterL.y0, ridgeBoard.x1,rafterL.y1, ridgeBoard.x1,rafterL.y2, a,rafterL.y3)
	//     .svgClasAdd(fEle, 'strok');
	//console.log(`    x(eave)=${rafterL.x0}`);
	//a = ridgeBoard.x1 + rafterL.x1 - wallALo.x0;

	e = 627;
	a = 0.5*(joist.x0 + joist.x1) - Wid_x1/2;
	b = wallALo.y1 + pitch.ydx * (a - wallALo.x0);
	c = a - e * pitch.x;
	d = b - e * pitch.y;
	const rafterL = strok(Quad.from01Yoff(c,d, a,b, Wid_x4/pitch.x));
	const ridgeBoard = strok(r2Xhwy(rafterL.x2, Wid_x8, Wid_x1, rafterL.y2));
	a += Wid_x1;
	c = a + e * pitch.x;
	const rafterR = strok(Quad.from01Yoff(a,b, c,d, Wid_x4/pitch.x));

	b = joist.y1 + /*measured height top joist to bottom rafter = 154*/ 154;
	a = rafterL.x0 + (b - rafterL.y0) * pitch.xdy;
	const wallD = strok(r2Xywy(a, joist.y1, Wid_x4, b));
	
	a = wallD.x1 + 4 + ufroIn(159) + Wid_x4;
	b = rafterR.y0 - (a - rafterR.x0) * pitch.ydx;
	const wallV = strok(r2Wyxy(Wid_x4, joist.y1, a, b));
	
	// a,b = collar+rafterL c=x(collar+rafterR)
	b = 232; // collar height
	a = rafterL.x0 + (b - rafterL.y0) * pitch.xdy;
	c = rafterR.x0 - (b - rafterR.y0) * pitch.xdy;
	const collar = strok(r2Xyxh(a, b, c, Wid_x4));
	this.fBox = fEle.getBBox();
	this.xfrmSet1 = () => {
	    let a,b,p;
	    
	    // measure: rafter span
	    a = 0.5*(wallD.x0 + wallD.x1);
	    this.measHoriIn(wallALo.x1,wallALo.y1, a,wallD.y1, 200, unitIn);
	    b = 0.5*(ridgeBoard.x0 + ridgeBoard.x1);
	    this.measHoriIn(a,wallD.y1, b,ridgeBoard.y1, 350, unitIn);
	    a = 0.5*(wallV.x0 + wallV.x1);
	    this.measHoriIn(b,ridgeBoard.y1, a,wallV.y1, 350, unitIn);
	    this.measHoriIn(a,wallV.y1, wallZLo.x0,wallZLo.y1, 200, unitIn);

	    // measure: rafter
	    this.measIn(rafterL.x3,rafterL.y3, rafterL.x2,rafterL.y2, 200,
			(x) => `${unitIn(x)}, pitch=${(pitch.ydx*12).toFixed(1)}/12`);
	    a = 0.1*rafterL.x3 + 0.9*rafterL.x2;
	    b = 0.1*rafterL.y3 + 0.9*rafterL.y2;
	    this.pointer(a, b, 20,120, 'H500');
	    p = this.cdfMat.transformPoint(new DOMPoint(500, b + 120));
	    svgTextAlign(svgTextNuClasAdd('measText', this.cEle, '2x4 @ 16" o.c., species-unspecified'),
			 'xl', 'yc', 2, p.x, p.y);

	    // measure: intermediate wall, collar
	    this.measIn(wallD.x1,wallD.y0, wallD.x1,wallD.y1, -30, unitIn);
	    this.measIn(wallV.x1,wallV.y0, wallV.x1,wallV.y1, 30, unitIn);
	    a = 0.5*(collar.x0 + collar.x1);
	    this.measIn(a,joist.y1, a,collar.y0, 0, unitIn);

	    // measure: bearing wall
	    this.measHoriIn(wallALo.x1,wallALo.y0, wallDLo.x0,wallDLo.y0, wallDLo.y0, unitIn);
	    this.measHoriIn(wallDLo.x1,wallDLo.y0, wallVLo.x0,wallVLo.y0, wallVLo.y0, unitIn);
	    this.measHoriIn(wallVLo.x1,wallVLo.y0, wallZLo.x0,wallZLo.y0, wallZLo.y0, unitIn);
	    this.measHoriIn(wallALo.x1,wallALo.y0, wallZLo.x0,wallZLo.y0, wallZLo.y0 - 50, unitIn); 

	    // measure: joist
	    this.pointer(0.2*joist.x0+0.8*joist.x1,joist.y0, 200,-100, 'H1050');
	    p = this.cdfMat.transformPoint(new DOMPoint(1050, joist.y0 - 100));
	    svgTextAlign(svgTextNuClasAdd('measText', this.cEle, '2x10, species-unspecified'), 'xl', 'yc', 2, p.x, p.y);

	    this.cBox = this.cEle.getBBox();
	};
	this.refX = wallD.x0;
    }

    todo() {
	// title: last so that border box includes stuff added above
	this.borderTitle('NORTH HALF', 10);
    }

}

class SiteBXsec extends Xsec {
    popu() {
	const bbox = this.svg.getBBox();

	const figS = new SiteB_S(svgNuAdd('g', this.svg));
	const figN = new SiteB_N(svgNuAdd('g', this.svg), figS.pitch);
	figS.xfrmSetCdfFlipY(400, figS.fBox.width);
	figN.xfrmSetOffXFlipY(figS, figS.refX - figN.refX);

	const margin = 10;
	const x0 = Math.min(figS.cBox.x, figN.cBox.x);
	const x1 = Math.max(figS.cBox.x + figS.cBox.width, figN.cBox.x + figN.cBox.width);
	//const x0 = 3 + margin - Math.min(figS.cBox.x, figN.cBox.x);
	//const x1 = Math.max(figS.cBox.width, figN.cBox.width);

	let y = 3;
	figN.place('NORTH HALF', 10, 3,y, x0, figN.cBox.y, x1, figN.cBox.y + figN.cBox.height);
	y += figN.cBox.height + 2*margin;
	figS.place('SOUTH HALF', 10, 3,y, x0, figS.cBox.y, x1, figS.cBox.y + figS.cBox.height);
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// bodyOnload

function ta(x) {
    this.x = x;
}

ta.prototype.b = function(y) {
    return { __proto__:this, y:y };
}

ta.prototype.c = 7;

function xsecBodyOnload() {
    const xsec = new SiteBXsec(document.getElementById('xsecDiv'), document.getElementById('xsecSvg'));
    xsec.popu();
}

//-----------------------------------------------------------------------------------------------------------------------
// SiteB_Lo

class SiteB_Lo extends Figure {
    constructor(cEle) {
	super(cEle);
	console.log('SiteB_Lo'); 
	const fEle = this.fEle;
	function strok(x) { return x.svgClasAdd('strok', fEle); }
	
	let a,b,c,d,e;
	
	const wA = strok(r2Xywy(0, 0, Wid_x4, ufroIn(156 + /*todo*/24)));
	const wB = strok(r2Xywy(wA.x1 + 4 + ufroIn(/*A*/128), 0, Wid_x4, ufroIn(/*todo*/106)));
	const wB1 = strok(r2Xywh(wB.x0 - ufroIn(5), wB.y1, Wid_x4, ufroIn(/*todo*/10)));
	a = ufroIn(123 + 254.5);
	b = ufroIn(156 + 222);
	c = ufroIn(123 + 98.5 + 156);
	console.log(`    intX(e-w)=${a}, ${b}, ${c}`);
	const wD = strok(r2Xywy(wA.x1 + 4 + (a+b+c)/3, 0, Wid_x4, ufroIn(150 + /*todo*/24 + 212 + 120)));
	const wC = strok(r2Wyxy(Wid_x4, 0, wD.x0 - 4 - ufroIn(/*C*/153), wB.y1));

	const wZ = strok(r2Xhxy(wA.x0, Wid_x4, wD.x1, 0));
	const wY = strok(r2Xywh(wB1.x0, wB1.y0, ufroIn(/*todo*/30), Wid_x4));
	const wX = strok(r2Wyxh(ufroIn(/*todo*/30), wY.y0, wC.x1, Wid_x4));
	const wW = strok(r2Xyxh(wA.x0, ufroIn(156), wB1.x1, Wid_x4));
	
	this.fBox = fEle.getBBox();
	this.xfrmSet1 = () => {
	    // measurements
	    this.measIn(wA.x1,wA.y0, wD.x0,wD.y0, 30, unitIn);
	    this.measIn(wC.x1,wC.y0, wD.x0,wD.y0, 30, unitIn);
	    this.measIn(wB.x1,wB.y0, wC.x0,wC.y0, 30, unitIn);
	    this.measIn(wA.x1,wA.y0, wB.x0,wB.y0, 30, unitIn);
	};
    }
}
