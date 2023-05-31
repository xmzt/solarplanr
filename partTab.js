//include base.js
//include geom.js 
//include partCat.js
//include rail.js
//include rack.js
//include roof.js

//-----------------------------------------------------------------------------------------------------------------------
// PartTabBase

class PartTabBase {
    constructor() {
	this.rowV = [];
	this.rowByPartId = {}; // todo partcatterm
	this.subN = 0;
	this.sourceV = [];
	this.sourceById = {};
	//this.totRow
	this.totPanelQty = 0;
	this.totWatts = 0;
    }

    partAdd(part, qty, subI) {
	const row = this.rowGetOrNu(part);
	row.inc(qty, subI);
	let n = row.totQty;
	let totCost = 0;
	for(const partSource of part.sourceV) {
	    if(! n)
		break;
	    if((qty = null === partSource.avail ? n : Math.min(partSource.avail, n))) {
		n -= qty;
		const cost = qty * partSource.cost1;
		const source = this.sourceById[partSource.id] ??= this.sourceNu(partSource.id);
		this.totRow.sourceCostInc(source.pos, cost - row.sourceQtyCostV[source.pos][1]);
		row.sourceQtyCostSet(source.pos, partSource, qty, cost);
		totCost += cost;
	    }
	}
	this.totRow.totCostInc(totCost - row.totCost);
	row.totCostSet(totCost);
    }

    partAddPanel(part, qty, subI) {
	this.totPanelQty += qty;
	this.totWatts += qty * part.watts;
	this.partAdd(part, qty, subI);
    }

    rowGetOrNu(part) {
	return this.rowByPartId[part.id] ??= this.rowNuInit(part);
    }

    rowNuInit(part) {
	let rowI = this.rowV.findIndex(r => r.part.id > part.id);
	if(-1 == rowI)
	    rowI = this.rowV.length;
	const row = this.rowNu(part, rowI);
	this.rowV.splice(rowI, 0, row);
	for(let pos = 0; pos < this.subN; pos++)
	    row.subAdd(pos);
	for(let pos = 0; pos < this.sourceV.length; pos++)
	    row.sourceAdd(pos);
	return row;
    }

    sourceNu(id) {
	let pos = this.sourceV.findIndex(source => 0 < source.id.localeCompare(id));
	if(-1 == pos)
	    pos = this.sourceV.length;
	const source = this.sourceById[id] = new PartTabSource(id, pos);
	this.sourceV.splice(pos, 0, source);
	for(const row of this.rowV)
	    row.sourceAdd(pos);
	this.totRow.sourceAdd(pos);
	//shift source.pos for following sources
	for(++pos; pos < this.sourceV.length; ++pos)
	    this.sourceV[pos].pos = pos;
	return source;
    }

    subNu(headText) {
	for(const row of this.rowV)
	    row.subAdd(this.subN);
	this.totRow.subAdd(this.subN);
	return new PartTabSub(this, this.subN++);
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// PartTabRow PartTabTotRow PartTabSource PartTabSub PartTab

class PartTabRow {
    constructor(part) {
	this.part = part;
	this.subQtyV = [];
	this.totQty = 0;
	this.sourceQtyCostV = [];
	this.totCost = 0;
    }

    inc(qty, subI) {
	this.subQtyV[subI] += qty;
	this.totQty += qty;
    }

    sourceAdd(pos) { this.sourceQtyCostV.splice(pos, 0, [0,0]); }

    sourceQtyCostSet(pos, partSource, qty, cost) { this.sourceQtyCostV[pos] = [qty, cost]; }

    subAdd(pos) { this.subQtyV.splice(pos, 0, 0); }

    totCostSet(cost) { this.totCost = cost; }
}

class PartTabTotRow {
    constructor() {
	this.sourceCostV = [];
	this.totCost = 0;
    }

    sourceAdd(pos) { this.sourceCostV.splice(pos, 0, 0); }

    sourceCostInc(pos, costInc) { this.sourceCostV[pos] += costInc; }
	
    subAdd(pos) {}

    totCostInc(costInc) { this.totCost += costInc; }
}

class PartTabSource {
    constructor(id, pos) {
	this.id = id;
	this.pos = pos;
    }
}

class PartTabSub {
    constructor(tab, pos) {
	this.tab = tab;
	this.pos = pos;
    }

    partAdd(part, qty) { this.tab.partAdd(part, qty, this.pos); }
    partAddPanel(part, qty) { this.tab.partAddPanel(part, qty, this.pos); }
    pendInc() { this.tab.pendInc(); }
    pendDec() { this.tab.pendDec(); }
}

class PartTab extends PartTabBase {
    constructor() {
	super();
	this.totRow = PartTabTotRow();
    }

    rowNu(part, rowI) { return new PartTabRow(part); }
}

//-----------------------------------------------------------------------------------------------------------------------
// UiPartTabRow UiPartTabTotRow UiPartTab

class UiPartTabRow extends PartTabRow {
    constructor(part, tr) {
	super(part);
	this.tr = tr;
	part.menuAFill(tr.insertCell(-1));
	eleClas(tr.insertCell(-1), '_anchorCol'); // Total N
	eleClas(tr.insertCell(-1), '_anchorCol'); // Total $
    }

    inc(qty, subI) {
	super.inc(qty, subI);
	this.tr.cells[1 + subI].textContent = this.subQtyV[subI];
	this.tr.cells[1 + this.subQtyV.length].textContent = this.totQty;
    }

    sourceAdd(pos) {
	super.sourceAdd(pos);
	this.tr.insertCell(2 + this.subQtyV.length + pos);
    }
    
    sourceQtyCostSet(pos, partSource, qty, cost) {
	super.sourceQtyCostSet(pos, partSource, qty, cost);
	this.tr.cells[2 + this.subQtyV.length + pos].textContent = `${partSource.cost1.toFixed(2)} * ${qty}`;
    }
	
    subAdd(pos) {
	super.subAdd(pos);
	this.tr.insertCell(1 + pos);
    }

    totCostSet(cost) {
	super.totCostSet(cost);
	this.tr.cells[2 + this.subQtyV.length + this.sourceQtyCostV.length].textContent = this.totCost.toFixed(2);
    }
}

class UiPartTabTotRow extends PartTabTotRow {
    constructor(tr) {
	super();
	this.tr = tr;
	this.subN = 0;
	eleClas(tr.insertCell(-1), '_anchorCol'); // Total N
	eleClas(tr.insertCell(-1), '_anchorCol'); // Total $
    }

    sourceAdd(pos) {
	super.sourceAdd(pos);
	this.tr.insertCell(2 + this.subN + pos);
    }

    sourceCostInc(pos, costInc) {
	super.sourceCostInc(pos, costInc);
	this.tr.cells[2 + this.subN + pos].textContent = this.sourceCostV[pos].toFixed(2);
    }

    subAdd(pos) {
	if(pos >= this.subN)
	    this.subN = pos + 1;
	this.tr.insertCell(1 + pos);
    }

    totCostInc(costInc) {
	super.totCostInc(costInc);
	this.tr.cells[2 + this.subN + this.sourceCostV.length].textContent = this.totCost.toFixed(2);
    }
}

class UiPartTab extends PartTabBase {
    constructor(root) {
	super();
	this.headTr = root.createTHead().insertRow(-1);
	this.headTr.insertCell(-1).textContent = 'Description';
	this.headTr.insertCell(-1).textContent = 'Total N';
	this.headTr.insertCell(-1).textContent = 'Total $';
	this.body = root.createTBody();
	// total row
	const totTr = root.tFoot.rows[0];
	this.totRow = new UiPartTabTotRow(totTr);
	// other totals
	this.totWattsElem = totTr.querySelector('._totWatts');
	this.totDpwElem = totTr.querySelector('._totDpw');
	this.totStatusElem = totTr.querySelector('._totStatus');
	this.pendN = 0;
    }

    dpwUpdate() {
	if(this.totWatts) {
	    this.totWattsElem.textContent = this.totWatts;
	    this.totDpwElem.textContent = (this.totRow.totCost / this.totWatts).toFixed(3);
	}
    }
    
    partAdd(part, qty, subI) {
	super.partAdd(part, qty, subI);
	this.dpwUpdate();
    }

    pendInc() {
	if(0 == this.pendN++)
	    this.totRow.tr.classList.add('pend');
    }
    
    pendDec() {
	if(0 == --this.pendN)
	    this.totRow.tr.classList.remove('pend');
    }

    rowNu(part, rowI) { return new UiPartTabRow(part, this.body.insertRow(rowI)); }

    sourceNu(id) {
	const source = super.sourceNu(id);
	this.headTr.insertCell(2 + this.subN).textContent = source.id;
	return source;
    }

    subNu(headText) {
	this.headTr.insertCell(1 + this.subN).textContent = headText;
	return super.subNu(headText);
    }

    statusErr(msgHtml) {
	eleNuClasAdd('div', 'err', this.totStatusElem).innerHTML = msgHtml;
    }
}
