//-----------------------------------------------------------------------------------------------------------------------
// svg helper

function svgClas(ele, clas) { ele.classList.add(clas); return ele; }
function svgNu(tag) { return document.createElementNS('http://www.w3.org/2000/svg', tag); }
function svgNuAdd(tag, dst) { return dst.appendChild(svgNu(tag)); }
function svgNuClas(tag, clas) { return svgClas(svgNu(tag), clas); }
function svgNuClasAdd(tag, clas, dst) { return dst.appendChild(svgNuClas(tag, clas)); }

function svgNuPathDClas(d, clas) {
    const ele = svgNu('path');
    ele.setAttribute('d', d);
    ele.classList.add(clas);
    return ele;
}

function svgNuPathDClasAdd(d, clas, dst) {
    const ele = svgNu('path');
    ele.setAttribute('d', d);
    ele.classList.add(clas);
    return dst.appendChild(ele);
}

function svgUseXYHrefAdd(x, y, href, dst) { return svgSetXYHref(svgNuAdd('use', dst), x, y, href); }

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

function svgSetTransform(ele, transform) {
    ele.setAttribute('transform', transform);
    return ele;
}

function svgSetMatrix6(ele, a,b,c,d,e,f) {
    ele.setAttribute('transform', `matrix(${a},${b},${c},${d},${e},${f})`);
    return ele;
}

function svgSetMatrixa6(ele, m) {
    ele.setAttribute('transform', `matrix(${m[0]},${m[1]},${m[2]},${m[3]},${m[4]},${m[5]})`);
    return ele;
}

function svgSetMatrixDom(ele, m) {
    ele.setAttribute('transform', m.toString());
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
// align

//-----------------------------------------------------------------------------------------------------------------------
// svgText

var SvgTextAlignXD = {
    'xl': (box, margin, x) => x + margin - box.x,
    'xc': (box, margin, x) => x - 0.5*box.width,
    'xr': (box, margin, x) => x - margin - box.width,
};
var SvgTextAlignYD = {
    'yt': (box, margin, y) => y + margin - box.y,
    'yc': (box, margin, y) => y - 0.5*box.y,
    'yb': (box, margin, y) => y - margin,
};

function svgTextNuClasAdd(clas, dst, text) {
    const ele = svgNuClasAdd('text', clas, dst);
    ele.appendChild(document.createTextNode(text));
    return ele;
}

function svgTextAlign(ele, alignX, alignY, margin, x, y) {
    const box = ele.getBBox();
    ele.setAttribute('x', SvgTextAlignXD[alignX](box, margin, x));
    ele.setAttribute('y', SvgTextAlignYD[alignY](box, margin, y));
    return ele;
}

//-----------------------------------------------------------------------------------------------------------------------
// Pitch

class Pitch {
    constructor(dx,dy) {
	this.xdy = dx / dy;
	this.ydx = dy / dx;
	const h = Math.sqrt(dx*dx + dy*dy);
	this.x = dx/h;
	this.y = dy/h;
    }
}
    
//-----------------------------------------------------------------------------------------------------------------------
// Xyxy

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
	const a = dx/6;
	return svgNuPathDClas(`M${this.x1},${this.y0} V${this.y1} H${this.x0} V${this.y0}`
			      + ` h${a} l${a},${2*a} l${2*a},${-4*a} l${a},${2*a} h${a}`
			      , clas);
    }

    svgClasAdd(clas, dst) { dst.appendChild(this.svgEle(clas)); return this; }
    svgClasAddLo(clas, dst) { dst.appendChild(this.svgEleLo(clas)); return this; }
}

function r2Whxy(w, h, x1, y1) { return new Xyxy(x1 - w, y1 - h, x1, y1); }
function r2Wyxh(w, y0, x1, h) { return new Xyxy(x1 - w, y0, x1, y0 + h); }
function r2Wyxy(w, y0, x1, y1) { return new Xyxy(x1 - w, y0, x1, y1); }
function r2Xhwy(x0, h, w, y1) { return new Xyxy(x0, y1 - h, x0 + w, y1); }
function r2Xhxy(x0, h, x1, y1) { return new Xyxy(x0, y1 - h, x1, y1); }
function r2Xywh(x0, y0, w, h) { return new Xyxy(x0, y0, x0 + w, y0 + h); }
function r2Xywy(x0, y0, w, y1) { return new Xyxy(x0, y0, x0 + w, y1); }
function r2Xyxh(x0, y0, x1, h) { return new Xyxy(x0, y0, x1, y0 + h); }

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
	return svgNuPathDClas(`M${this.x0},${this.y0} L${this.x1},${this.y1}`
			      + ` L${this.x2},${this.y2} L${this.x3},${this.y3} z`
			      , clas);
    }
    
    svgClasAdd(clas, dst) { dst.appendChild(this.svgEle(clas)); return this; }
}
