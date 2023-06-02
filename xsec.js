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
// Xsec

class Xsec {
    constructor(div, svg) {
	this.div = div;
	this.svg = svg;
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// SiteBXsec

class SiteBXsec extends Xsec {
    popu() {
	const bbox = this.svg.getBBox();

	const eleS = this.popuS(svgAddNu(this.svg, 'g'));
    	const eleN = this.popuN(svgAddNu(this.svg, 'g'));

	// resize, same scaling factor
	const boxS = eleS.getBBox();
	const boxN = eleN.getBBox();
	const c = 600 / (boxS.height + boxN.height);
	const tx = 10 - c * Math.min(boxS.x, boxN.x);
	const tyN = 10 + c * (boxN.height + boxN.y);
	//const tyS = 30 + c * (boxS.height + boxS.y);
	const tyS = 10 + c * boxN.height + 10 + c * (boxS.height + boxS.y);
	eleN.setAttribute('transform', `matrix(${c},0,0,${-c}, ${tx}, ${tyN})`);
	eleS.setAttribute('transform', `matrix(${c},0,0,${-c}, ${tx}, ${tyS})`);
    }
    
    popuS(dst) {
	// origin: x=(outside of wallA), y=(top of joist)
	console.log('popuS');
	let a,b,c;

	const wallA = Xyxy.fromXywy(0, 0, Wid_x4, 62.5).svgAdd(dst, 'strok');
	const wallB = Xyxy.fromXywy(wallA.x1 + 146.0, 0, Wid_x4, 159).svgAdd(dst, 'strok');
	
	const pitch = new Pitch(wallB.x0 - wallA.x1, wallB.y1 - wallA.y1);
	console.log(`    pitch x=${pitch.x} y=${pitch.y} y/x=${pitch.ydx} y/x=${12*pitch.ydx}/12`);

	// c = actual rafter length, a,b = rafter eave, using pipe as common reference above and below
	c = 517.5;
	a = wallA.x1 + 8 - /*eave2vent*/69.0 * pitch.x;
	b = wallA.y1 + (a - wallA.x1) * pitch.ydx;
	const rafterL = Quad.from01Yoff(a,b, a+c*pitch.x,b+c*pitch.y, Wid_x4/pitch.x).svgAdd(dst, 'strok');
	const ridgeBoard = Xyxy.fromXhwy(rafterL.x2, Wid_x8, Wid_x1, rafterL.y2).svgAdd(dst, 'strok');
	a = ridgeBoard.x1 + rafterL.x1 - rafterL.x0;
	const rafterR = new Quad(a,rafterL.y0, ridgeBoard.x1,rafterL.y1, ridgeBoard.x1,rafterL.y2, a,rafterL.y3)
	      .svgAdd(dst, 'strok');
	console.log(`    x(ridge-wallA)=${rafterL.x1-wallA.x0}, measured=400`);
	console.log(`    x(wallA-eave)=${wallA.x0-rafterL.x0}`);

	a = wallB.x0 + 53.5;
	b = rafterL.y0 + (a - rafterL.x0) * pitch.ydx;
	const wallB2 = Xyxy.fromXywy(a, 0, Wid_x4, b).svgAdd(dst, 'strok2');
	console.log(`    wallB2.y1=${wallB2.y1} measured=194.5`);

	a = wallA.x1 + 307.7;
	b = rafterL.y0 + (a - rafterL.x0) * pitch.ydx;
	const wallD = Xyxy.fromXywy(a, 0, Wid_x4, b).svgAdd(dst, 'strok');

	const wallE = Xyxy.fromWyxy(Wid_x4, wallA.y0, rafterR.x1+rafterL.x1-wallA.x0, wallA.y1).svgAdd(dst, 'strok');
	
	const joist = Xyxy.fromXhxy(wallA.x0, Wid_x10, wallE.x1, 0).svgAdd(dst, 'strok');

	// a,b = collar+rafterL c=x(collar+rafterR)
	b = 232; // collar height
	a = rafterL.x0 + (b - rafterL.y0) * pitch.xdy;
	c = rafterR.x0 - (b - rafterR.y0) * pitch.xdy;
	const collar = Xyxy.fromXyxh(a, b, c, Wid_x4).svgAdd(dst, 'strok');

	// lower walls
	const wallALo = Xyxy.fromXhwy(joist.x0, WallHLo, Wid_x4, joist.y0).svgAddLo(dst, 'strok');
	const wallDLo = Xyxy.fromXhwy(wallD.x0, WallHLo, Wid_x4, joist.y0).svgAddLo(dst, 'strok');
	const wallELo = Xyxy.fromWhxy(Wid_x4, WallHLo, joist.x1, joist.y0).svgAddLo(dst, 'strok');
	return dst;
    }

    popuN(dst) {
	// origin: x=(outside of wallA), y=(top of joist)
	console.log('popuN');
	
	let a,b,c,d,e;

	const wallA = Xyxy.fromXywy(0, 0, Wid_x4, 62.5); // do not add yet
	const wallB = Xyxy.fromXywy(wallA.x1 + 144, 0, Wid_x4, /*measured 154*/154).svgAdd(dst, 'strok');
	
	const pitch = new Pitch(wallB.x0 + 92, wallB.y1);
	console.log(`    pitch x=${pitch.x} y=${pitch.y} y/x=${pitch.ydx} y/x=${12*pitch.ydx}/12`);

	// correct wallA
	wallA.y1 = wallB.y1 + (wallA.x1 - wallB.x0) * pitch.ydx;
	wallA.svgAdd(dst, 'strok2');
	console.log(`    wallA.y1=${wallA.y1}, expected 62.5`);

	const wallCLo = Xyxy.fromWhxy(Wid_x4, WallHLo, wallA.x0 - 118.5, -Wid_x10).svgAddLo(dst, 'strok');
	
	// e = actual rafter length, a,b = rafter eave, c,d = rafter ridge
	e = 627;
	c = wallCLo.x0 + 490;
	d = wallB.y1 + (c - wallB.x0) * pitch.ydx;
	a = c - e * pitch.x;
	b = d - e * pitch.y;
	const rafterL = Quad.from01Yoff(a,b, c,d, Wid_x4/pitch.x).svgAdd(dst, 'strok');
	const ridgeBoard = Xyxy.fromXhwy(rafterL.x2, Wid_x8, Wid_x1, rafterL.y2).svgAdd(dst, 'strok');
	a = ridgeBoard.x1 + rafterL.x1 - rafterL.x0;
	const rafterR = new Quad(a,rafterL.y0, ridgeBoard.x1,rafterL.y1, ridgeBoard.x1,rafterL.y2, a,rafterL.y3)
	      .svgAdd(dst, 'strok');
	console.log(`    x(eave)=${rafterL.x0}`);

	a = ridgeBoard.x1 + rafterL.x1 - wallCLo.x0;
	const joist = Xyxy.fromXhxy(wallCLo.x0, Wid_x10, a, 0).svgAdd(dst, 'strok');
	
	// lower walls
	const wallBLo = Xyxy.fromXhwy(wallB.x0, WallHLo, Wid_x4, joist.y0).svgAddLo(dst, 'strok');
	const wallDlo = Xyxy.fromXhwy(wallA.x1 + 307.7, WallHLo, Wid_x4, joist.y0).svgAddLo(dst, 'strok');
	const wallELo = Xyxy.fromWhxy(Wid_x4, WallHLo, joist.x1, joist.y0).svgAddLo(dst, 'strok');
	return dst;
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// bodyOnload

function xsecBodyOnload() {
    const xsec = new SiteBXsec(document.getElementById('xsecDiv'), document.getElementById('xsecSvg'));
    xsec.popu();
}
