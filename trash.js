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
	const row = new PartTabRow(temRootClone('partsTr_tem'));
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

