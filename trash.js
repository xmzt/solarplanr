class SvgText {
    constructor(dst, clas, text) {
	this.ele = svgAddText(dst, 'label', lab);
	this.eleB = this.ele.getBBox();
	this.pad = this.eleB.height + this.eleB.y;
    }
    
    posUR(x, y) {
	svgSetXY(this.ele, x, y - this.pad);
	this.bbox = [ x, y - this.eleB.height, this.eleB.width, this.eleB.height ];
	return this;
    }
    
    posDR(x, y) {
	svgSetXY(this.ele, x, y - this.eleB.y);
	this.bbox = [ x, y, this.eleB.width, this.eleB.height ];
	return this;
    }
}

    
class DesBox {
    constructor(dst0, lab) {
	const dst = this.dst = svgAddNu(dst0, 'svg');
	this.border = svgAddNu(dst, 'rect');
	const t = SvgText(dst, 'label', lab);
	t.posDR(t.pad, t.pad);
	this.y = t.bbox[1] + t.bbox[3];
    }

    line(text) {
	const t = SvgText(dst, 'label', text);
	
	
	labObj.posDR(labObj.pad, labObj.pad);
	
	
	const t = svgAddText(dst, 'label', lab);
	const tr = t.getBBox();
	const tpad = tr.height + tr.y;

	svgSetXY(t, bx + tpad, by + tr.height, 'label');
	
    let bx = r.x - pad;
    const by = r.y - pad - tpad - tr.height;
    const bh = r.y + r.height + pad - by;
    let bw = r.width + pad + pad;
    const bw1 = tr.width + tpad + tpad;
    if(bw1 >= bw) {
	bx -= 0.5*(bw1 - bw);
	bw = bw1;
    }
    svgSetRectClas(b, bx, by, bw, bh, 'group');
}

	
//-----------------------------------------------------------------------------------------------------------------------
// derivative

function comLabelR(dst, refB, id, ...noteV) {
    let bbox = comTextBoxed(dst, refB.x + refB.width + 2, refB.y, 'label', 'strok', id).getBBox();
    let y = bbox.y;
    for(const note of noteV) {
	y += bbox.height;
	bbox = svgTextBelow(dst, bbox.x, y, 'label', note).getBBox();
    }
}

function comIdBoxT(dst, refB, id) {
    const idText = dst.appendChild(svgTextHidden(id));
    const idB = idText.getBBox();
    const pad = idB.height + idB.y;
    const textY = refB
    svgTextUnhide(idText, refB.x + pad, refB.y - 2 - pad, 'label');
    const boxH = idB.height + pad;
    dst.appendChild(svgRect(refB.x, refB.y - 2 - boxH, idB.width + pad + pad, boxH, 'strok'));
}

function comLabelB(dst, refB, id, ...noteV) {
    let bbox = comTextBoxed(dst, refB.x, refB.y + refB.height + 2, 'label', 'strok', id).getBBox();
    console.log('comLabelB', refB, bbox);
    let y = bbox.y;
    for(const note of noteV) {
	y += bbox.height;
	bbox = svgTextBelow(dst, bbox.x, y, 'label', note).getBBox();
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// bounds accumulator

function bounNu() {
    return new R2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY,
		  Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
}

function bounBbox(boun, bbox) {
    if(bbox.x < boun.x0) boun.x0 = bbox.x;
    if(bbox.x > boun.x1) boun.x1 = bbox.x;
    if(bbox.y < boun.y0) boun.y0 = bbox.y;
    if(bbox.y > boun.y1) boun.y1 = bbox.y;
    const x1 = bbox.x + bbox.width;
    const y1 = bbox.y + bbox.height;
    if(x1 < boun.x0) boun.x0 = x1;
    if(x1 > boun.x1) boun.x1 = x1;
    if(y1 < boun.y0) boun.y0 = y1;
    if(y1 > boun.y1) boun.y1 = y1;
    return bbox;
}
       
function svgSymbolNu(id) {
    const ele = document.createElementNS('http://www.w3.org/2000/svg','symbol');
    ele.id = id;
    ele.setAttribute('overflow', 'visible');
    return ele;
}

	{
	    const cont = this.dst.appendChild(svgSymbolNu('bliza'));
	    svgText(cont, 4, 4, 'label', 'Label 4,4');
	    svgText(cont, 0, 20, 'label', 'Label 0,20');
	    console.log(cont);
	    //console.log('test0', cont.getBBox(), cont.getCTM(), cont.getScreenCTM());
	    const inst = this.dst.appendChild(svgUse(this.dst, 500, 200, '#bliza'));
	    console.log('test1', inst.getBBox(), inst.getCTM(), inst.getScreenCTM());
	    svgText(inst, 40, 20, 'label', 'Label 40,20');
	    console.log('test2', inst.getBBox(), inst.getCTM(), inst.getScreenCTM());
	}
	{
    	    const cont = this.dst.appendChild(svgSvgNu('bliza'));
	    svgText(cont, 4, 4, 'label', 'Label 4,4');
	    svgText(cont, 0, 20, 'label', 'Label 0,20');
	    console.log('test0', cont.getBBox(), cont.getCTM(), cont.getScreenCTM());
	    svgText(cont, 40, 20, 'label', 'Label 40,20');
	    console.log('test1', cont.getBBox(), cont.getCTM(), cont.getScreenCTM());
	    svgSetXY(cont, 500, 100);
	    console.log('test2', parseInt(cont.getAttribute('x')) + 69, cont.firstElementChild.getBBox());
	}



//-----------------------------------------------------------------------------------------------------------------------
// Rack
//-----------------------------------------------------------------------------------------------------------------------

class Rack {
    constructor() {
	this.panelV = [];
    }

    panelAdd(panel) {
	this.panelV.push(panel);
    }
    
    partAdd(col) {
	for(const panel of this.panelV)
	    col.partAdd(panel.shape.part, 1);
    }
    
    wattsGet() {
	return this.panelV.reduce((p,x) => p + x.shape.part.watts, 0);
    }

    draw(ctx) {
	for(const panel of this.panelV)
	    panel.draw(ctx);
    }

    dump(pre0, pre1) {
	console.log(pre0, `panelV`);
	for(const p of this.panelV)
	    console.log(pre1, `(${p.x0},${p.y0}) (${p.x1},${p.y1}) ${p.shape.part.desc}`);
    }
    
    finalize(roof) {}
}

//-----------------------------------------------------------------------------------------------------------------------
// PartTab
//-----------------------------------------------------------------------------------------------------------------------

class PartTab {
    constructor(elemTbody) {
	this.elemTbody = elemTbody;
	this.colV = [];
	this.rowV = [];
	this.rowById = {};
	this.totalRow = new PartTabRow(elemTbody.querySelector('._totalTr'));
	this.totalRow.idCost = 0.00;
    }

    rowGetNew(part) { return this.rowById[part.id] ??= this.rowNew(part); }
    
    rowNew(part) {
	const row = new PartTabRow(temClone('partsTr_tem'));
	for(const col of this.colV) {
	    row[col.idN] = 0;
	    row[col.idCost] = 0;
	}
	part.descFill(row.tr.querySelector('._desc'));
	row.price = part.priceFill(row.tr.querySelector('._price'));
	this.elemTbody.insertBefore(row.tr, this.totalRow.tr);
	this.rowV.push(row);
	return row;
    }

    rowAdd(row, col, n) {
	const costInc = n * row.price;
	row[col.idN] += n;
	row[col.idCost] += costInc;
	this.totalRow[col.idCost] += costInc;
	row.tr.querySelector(col.selN).textContent = toFixedMax(row[col.idN], 2);
	row.tr.querySelector(col.selCost).textContent = row[col.idCost].toFixed(2);
	this.totalRow.tr.querySelector(col.selCost).textContent = this.totalRow[col.idCost].toFixed(2);
	if(null !== col.up)
	    this.rowAdd(row, col.up, n);
s    }
}

class PartGroup {
    constructor(tab, up, idN, idCost, selN, selCost) {
	this.tab = tab;
	this.up = up;
	this.idN = idN;
	this.idCost = idCost;
	this.selN = selN;
	this.selCost = selCost;
	tab.colV.push(this);
	for(const row of tab.rowV) {
	    row[this.idN] = 0;
	    row[this.idCost] = 0;
	}
    }

    partAdd(part, n) { this.tab.rowAdd(this.tab.rowGetNew(part), this, n); }
}
    
class PartTabRow {
    constructor(tr) {
	this.tr = tr
    }
}

    go() {
	...
	this.col0 = new PartTabCol(this.tab, null, 'n', 'cost', '._n', '._cost');
	for(const lay of this.layV)
	    lay.col = new PartTabCol(this.tab, this.col0,
				     `${lay.id}N`, `${lay.id}Cost`, `._${lay.id}N`, `._${lay.id}Cost`);
	this.col0.partAdd(OtherParts, 1);
	this.logDiv = this.root.querySelector('._log');
	this.root.querySelector('._logShow').addEventListener('click', (ev) => this.logShowClick(ev));
	this.totalWatts = 0;
	this.railGroupSet = new Set();
	for(const lay of this.layV) {
	    lay.ctx = ctxFromCan(this.root.querySelector(`._${lay.id}Can`));
	    lay.roof.draw(lay.ctx);
	    lay.popu(lay.rack, lay.roof);
	    lay.rack.finalize(lay.roof);

	    lay.rack.draw(lay.ctx);
	    lay.rack.partAdd(lay.col);
	    this.railGroupSet.add(lay.railGroup);
	    for(const rail of lay.rack.railV)
		lay.railGroup.railAdd(rail, lay);
	    this.totalWatts += lay.rack.wattsGet();
	}
	this.tab.totalRow.tr.classList.add('pend');
	this.pendN = 1;
	for(const railGroup of this.railGroupSet.keys()) {
	    this.pendN++;
	    railGroup.railrPost(this);
	}
	this.pendNDec();
    }

    drawEdgePath(ctx) {
	
	const x = this.x1 - this.x0;
	const y = this.y1 - this.y0;
	const xy = Math.sqrt(x*x + y*y);
	ctx.save();
	ctx.transform(x/xy, y/xy, -y/xy, x/xy, this.x0, this.y0);
	ctx.fillStyle = EdgeFillStyle;
	ctx.beginPath();
	ctx.fillRect(0, 0, xy, -EdgeWidth);
	ctx.restore();
	return this;
    }

panelRow(roof, shape, panelV, iY) {
	this.panelV.push(...panelV);
	const pA = panelV[0]
	const pE = panelV[panelV.length-1]
	
	const sizeY = pA.y1 - pA.y0;
	const ys = [pA.y0 + shape.part.railOffL, pA.y1 - shape.part.railOffL];
	for(const y of ys) {
	    const rail = new L2(pA.x0, y, pE.x1, y);
	    this.railV.push(rail);
	    this.footV.push(...roof.footsGet(rail));
	    this.endV.push(new P2(pA.x0, y), new P2(pE.x1, y));
	}
	for(const p of panelV)
	    if(pA !== p)
		for(const y of ys)
		    this.midV.push(new P2(p.x0, y));
	this.groundLugN++;
    }

