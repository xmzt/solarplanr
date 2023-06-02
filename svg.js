//-----------------------------------------------------------------------------------------------------------------------
// svg helper

function svgClas(ele, clas) { ele.classList.add(clas); return ele; }
function svgNu(tag) { return document.createElementNS('http://www.w3.org/2000/svg', tag); }
function svgNuClas(tag, clas) { return svgClas(svgNu(tag), clas); }
function svgNuSvg() { const ele = svgNu('svg'); ele.style.overflow = 'visible'; return ele; }

function svgAddNu(dst, tag) { return dst.appendChild(svgNu(tag)); }
function svgAddNuClas(dst, tag, clas) { return dst.appendChild(svgNuClas(tag, clas)); }
function svgAddNuClasText(dst, clas, text) {
    const ele = svgAddNuClas(dst, 'text', clas);
    ele.appendChild(document.createTextNode(text));
    return ele;
}
function svgAddNuSvg(dst) { return dst.appendChild(svgNuSvg()); }

function svgAddUseXYHref(dst, x, y, href) { return svgSetXYHref(svgAddNu(dst, 'use'), x, y, href); }

function svgAddText(dst, clas, text) {
    const ele = svgAddNu(dst, 'text');
    ele.classList.add(clas);
    ele.appendChild(document.createTextNode(text));
    return ele;
}

function svgSetTransformFitwFlipSFitXywhFlipy(ele, x, y, w, h) {
    const r = ele.getBBox();
    const c = Math.min(w/r.width, h/r.height);
    ele.setAttribute('transform', `matrix(${c},0,0,${-c}, ${x-c*r.x}, ${y+h+c*r.y})`);
    return ele;
}	

function svgSetCxCyR(ele, cx, cy, r) {
    ele.setAttribute('cx', cx);
    ele.setAttribute('cy', cy);
    ele.setAttribute('r', r);
    return ele;
}

function svgSetCxCyRxRy(ele, cx, cy, rx, ry) {
    ele.setAttribute('cx', cx);
    ele.setAttribute('cy', cy);
    ele.setAttribute('rx', rx);
    ele.setAttribute('ry', ry);
    return ele;
}

function svgSetD(ele, d) {
    ele.setAttribute('d', d);
    return ele;
}

function svgSetXY(ele, x, y) {
    ele.setAttribute('x', x);
    ele.setAttribute('y', y);
    return ele;
}

function svgSetXYWH(ele, x, y, w, h) {
    ele.setAttribute('x', x);
    ele.setAttribute('y', y);
    ele.setAttribute('width', w);
    ele.setAttribute('height', h);
    return ele;
}

function svgSetXYHref(ele, x, y, href) {
    ele.setAttribute('x', x);
    ele.setAttribute('y', y);
    ele.setAttribute('href', href);
    return ele;
}

//-----------------------------------------------------------------------------------------------------------------------
// geometry helpers
//-----------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------
// Xyxy

class Pitch {
    constructor(dx,dy) {
	this.xdy = dx / dy;
	this.ydx = dy / dx;
	const h = Math.sqrt(dx*dx + dy*dy);
	this.x = dx/h;
	this.y = dy/h;
    }
}
    
class Xyxy {
    constructor(x0, y0, x1, y1) {
	this.x0 = x0;
	this.y0 = y0;
	this.x1 = x1;
	this.y1 = y1;
    }

    static fromWhxy(w, h, x1, y1) { return new this(x1 - w, y1 - h, x1, y1); }
    static fromWyxy(w, y0, x1, y1) { return new this(x1 - w, y0, x1, y1); }
    static fromXhwy(x0, h, w, y1) { return new this(x0, y1 - h, x0 + w, y1); }
    static fromXhxy(x0, h, x1, y1) { return new this(x0, y1 - h, x1, y1); }
    static fromXywy(x0, y0, w, y1) { return new this(x0, y0, x0 + w, y1); }
    static fromXyxh(x0, y0, x1, h) { return new this(x0, y0, x1, y0 + h); }

    svgEle(clas) {
	return svgSetXYWH(svgNuClas('rect', clas), this.x0, this.y0, this.x1 - this.x0, this.y1 - this.y0);
    }

    svgEleLo(clas) {
	const dx = this.x1 - this.x0;
	const dx2 = 0.5*dx;
	const dx4 = 0.25*dx;
	return svgSetD(svgNuClas('path', clas)
		       , `M${this.x0},${this.y0} V${this.y1} H${this.x1} V${this.y0}`
		       + ` m0,${dx4} q${-dx4},${dx2},${-dx2},0 t${-dx2},0`);
    }

    svgAdd(dst, clas) {	dst.appendChild(this.svgEle(clas)); return this; }
    svgAddLo(dst, clas) { dst.appendChild(this.svgEleLo(clas)); return this; }
}

//-----------------------------------------------------------------------------------------------------------------------
// Quad

class Quad {
    constructor(x0,y0, x1,y1, x2,y2, x3,y3) {
	this.x0 = x0;
	this.y0 = y0;
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.x3 = x3;
	this.y3 = y3;
    }

    static from01Yoff(x0,y0, x1,y1, yoff) {
	return new this(x0,y0, x1,y1, x1,y1+yoff, x0,y0+yoff);
    }
	
    // mirror across y axis changing x1
    mirror_y_x1(x1) {
	return new this.constructor(x1+this.x1-this.x0, this.y0,
				    x1,this.y1,
				    x1+this.x1-this.x2, this.y2,
				    x1+this.x1-this.x3, this.y3);
    }
    
    svgEle(clas) {
	return svgSetD(svgNuClas('path', clas)
		       , `M${this.x0},${this.y0} L${this.x1},${this.y1}`
		       + ` L${this.x2},${this.y2} L${this.x3},${this.y3} z`);
    }
    
    svgAdd(dst, clas) {	dst.appendChild(this.svgEle(clas)); return this; }
}
