//-----------------------------------------------------------------------------------------------------------------------
// svg helper

function svgClas(ele, clas) { ele.classList.add(clas); return ele; }
function svgNu(tag) { return document.createElementNS('http://www.w3.org/2000/svg', tag); }
function svgNuClas(tag, clas) { return svgClas(svgNu(tag), clas); }

function svgAddNu(dst, tag) { return dst.appendChild(svgNu(tag)); }
function svgAddNuClas(dst, tag, clas) { return dst.appendChild(svgNuClas(tag, clas)); }
function svgAddNuClasText(dst, clas, text) {
    const ele = svgAddNuClas(dst, 'text', clas);
    ele.appendChild(document.createTextNode(text));
    return ele;
}
function svgAddUseXYHref(dst, x, y, href) { return svgSetXYHref(svgAddNu(dst, 'use'), x, y, href); }

function svgAddText(dst, clas, text) {
    const ele = svgAddNu(dst, 'text');
    ele.classList.add(clas);
    ele.appendChild(document.createTextNode(text));
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
// Xyxy

class Xyxy {
    constructor(x0, y0, x1, y1) {
	this.x0 = x0;
	this.y0 = y0;
	this.x1 = x1;
	this.y1 = y1;
    }

    svgNuClas(clas) {
	return svgSetXYWH(svgNuClas('rect', clas), this.x0, this.y0, this.x1 - this.x0, this.y1 - this.y0);
    }

    svgNuClasLow(clas) {
	const dx = this.x1 - this.x0;
	const dx2 = 0.5*dx;
	const dx4 = 0.25*dx;
	return svgSetD(svgNuClas('path', clas)
		       , `M${this.x0},${this.y0} V${this.y1} H${this.x1} V${this.y0}`
		       + ` m0,${dx4} q${-dx4},${dx2},${-dx2},0 t${-dx2},0`);
    }
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
    svgNuClas(clas) {
	return svgSetD(svgNuClas('path', clas)
		       , `M${this.x0},${this.y0} L${this.x1},${this.y1}`
		       + ` L${this.x2},${this.y2} L${this.x3},${this.y3} z`);
    }
}
