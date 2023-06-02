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

const LowWallH = 200;

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
	this.svg.setAttribute('transform', `matrix(1,0,0,-1, 0,${-bbox.height})`);

	const y0 = 300;
	let ax = 80;
	let ay = y0 + 62.5;
	const wallA = new Xyxy(ax-Wid_x4,y0, ax,ay)
	this.svg.appendChild(wallA.svgNuClas('strok'));

	ax += 146.0;
	ay = y0 + 159.5; 
	const wallB = new Xyxy(ax,y0, ax+Wid_x4,ay);
	this.svg.appendChild(wallB.svgNuClas('strok'));

	const pitchX = wallB.x0 - wallA.x1;
	const pitchY = wallB.y1 - wallA.y1;
	const pitchYx = pitchY / pitchX;
	const pitchH = Math.sqrt(pitchY*pitchY + pitchX*pitchX);
	console.log(`pitch ${pitchY}/${pitchX} = ${pitchYx} = ${12*pitchYx}/12, pitchH=${pitchH}`);

	ax += 53.5;
	ay += 53.5 * pitchY / pitchX;
	console.log(`wallB2.y=${ay} measured=${y0+194.5}`);

	ax = wallA.x1 + 307.7;
	ay = wallA.y1 + 307.7 * pitchY / pitchX;
	const wallD = new Xyxy(ax, y0, ax + Wid_x4, ay);
	this.svg.appendChild(wallD.svgNuClas('strok'));

	ax = (wallA.x1 + 8) - /*eave2vent*/69.0 * pitchX / pitchH;
	ay = wallA.y1 + (ax - wallA.x1) * pitchY / pitchX;
	let bx = ax + 517.5 * pitchX / pitchH;
	let by = ay + 517.5 * pitchY / pitchH;
	let dy = Wid_x4 * pitchH / pitchX;
	const rafterL = new Quad(ax,ay, ax,ay+dy, bx,by+dy, bx,by);
	this.svg.appendChild(rafterL.svgNuClas('strok'));
	console.log(`x(ridge-wallA)=${bx - wallA.x0}, measured=400`);
	console.log(`x(wallA-eave)=${wallA.x0-ax}`);

	bx += Wid_x1;
	const ridgeBoard = new Xyxy(rafterL.x2,rafterL.y2-Wid_x8, bx, rafterL.y2);
	this.svg.appendChild(ridgeBoard.svgNuClas('strok'));

	ax = bx + rafterL.x3 - rafterL.x0;
	const rafterR = new Quad(ax,ay, ax,ay+dy, bx,by+dy, bx,by);
	this.svg.appendChild(rafterR.svgNuClas('strok'));

	ax = bx + rafterL.x3 - wallA.x0;
	const wallE = new Xyxy(ax-Wid_x4,wallA.y0, ax,wallA.y1);
	this.svg.appendChild(wallE.svgNuClas('strok'));
	
	const joist = new Xyxy(wallA.x0,y0-Wid_x10, wallE.x1,y0);
	ay = y0 + 232;
	ax = rafterL.x0 + (ay - rafterL.y0) * pitchX / pitchY;
	bx = rafterR.x0 - (ay - rafterR.y0) * pitchX / pitchY;
	this.svg.appendChild(joist.svgNuClas('strok'));

	const collar = new Xyxy(ax,ay, bx,ay+Wid_x4);
	this.svg.appendChild(collar.svgNuClas('strok'));

	// lower walls
	const wallLowA = new Xyxy(wallA.x0,joist.y0-LowWallH, wallA.x1,joist.y0);
	this.svg.appendChild(wallLowA.svgNuClasLow('strok'));
	const wallLowD = new Xyxy(wallD.x0,joist.y0-LowWallH, wallD.x1,joist.y0);
	this.svg.appendChild(wallLowD.svgNuClasLow('strok'));
	const wallLowE = new Xyxy(wallE.x0,joist.y0-LowWallH, wallE.x1,joist.y0);
	this.svg.appendChild(wallLowE.svgNuClasLow('strok'));


    }
}

//-----------------------------------------------------------------------------------------------------------------------
// bodyOnload

function xsecBodyOnload() {
    const xsec = new SiteBXsec(document.getElementById('xsecDiv'), document.getElementById('xsecSvg'));
    xsec.popu();
}
