//include base.js
//include geom.js 
//include partCat.js
//include rail.js
//include rack.js
//include roof.js

//-----------------------------------------------------------------------------------------------------------------------
// PartTabRow

class PartTabRow {
    constructor(tr, part) {
	this.tr = tr;
	this.part = part;
	this.subV = [];
	this.totN = 0;
	this.sourceCostV = [];
	this.totCost = 0.0;
    }
}

class PartTabSource {
    constructor(id, pos, tot) {
	this.id = id;
	this.pos = pos;
	this.tot = tot;
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// PartTab

class PartTab {
    constructor(root) {
	this.root = root;
	// head row
	this.headTr = this.root.tHead.rows[0];
	this.headTr.insertCell(-1).textContent = 'Total N';
	this.headTr.insertCell(-1).textContent = 'Total $';
	// total row
	this.totTr = this.root.tFoot.rows[0];
	this.totTr.insertCell(-1); // Total N
	this.totTr.insertCell(-1); // Total $
	this.totRow = new PartTabRow(this.totTr, PartCatTerm);
	this.rowV = [ this.totRow ];
	this.rowByPartId = { [this.totRow.part.id]:this.totRow };
	// subs and sources
	this.subN = 0;
	this.sourceV = [];
	this.sourceById = {};
    }

    subAdd(id) {
	this.headTr.insertCell(1 + this.subN).textContent = `${id} N`;
	for(const row of this.rowV) {
	    row.subV.push(0);
	    row.tr.insertCell(1 + this.subN);
	}
	return this.subN++;
    }

    partAdd(part, n, subI) {
	const row = this.rowGetOrNu(part);
	if(-1 != subI) {
	    row.subV[subI] += n;
	    row.tr.cells[1 + subI].textContent = row.subV[subI];
	}
	row.totN += n;
	row.tr.cells[1 + this.subN].textContent = row.totN;
	// source
	let totCost = 0.0;
	let sn = row.totN;
	for(const partSource of part.sourceV) {
	    if(! sn)
		break;
	    const x = null === partSource.avail ? sn : Math.min(partSource.avail, sn);
	    if(x) {
		const cost = x * partSource.cost1;
		const source = this.sourceById[partSource.id] ??= this.sourceNu(partSource.id);
		// subtract previous values
		source.tot -= row.sourceCostV[source.pos];
		this.totRow.sourceCostV[source.pos] -= row.sourceCostV[source.pos]; 
		// add new values
		row.sourceCostV[source.pos] = cost;
		totCost += cost;
		source.tot += cost;
		this.totRow.sourceCostV[source.pos] += cost;
		// update html
		row.tr.cells[2 + this.subN + source.pos].textContent = `${partSource.cost1.toFixed(2)} * ${x}`;
		this.totRow.tr.cells[2 + this.subN + source.pos].textContent = source.tot.toFixed(2);
		
		sn -= x;
	    }
	}
	this.totRow.totCost -= row.totCost;
	this.totRow.totCost += totCost;
	row.totCost = totCost;
	row.tr.cells[2 + this.subN + this.sourceV.length].textContent = totCost.toFixed(2);
	this.totRow.tr.cells[2 + this.subN + this.sourceV.length].textContent = this.totRow.totCost.toFixed(2);
    }
    
    rowGetOrNu(part) {
	return this.rowByPartId[part.id] ??= this.rowNu(part);
    }

    rowNu(part) {
	// insert row
	const rowI = this.rowV.findIndex(r => r.part.id > part.id);
	const tr = this.root.tBodies[0].insertRow(rowI);
	const row = new PartTabRow(tr, part);
	this.rowV.splice(rowI, 0, row);
	// fill row
	part.menuAFill(tr.insertCell(-1));
	for(let i = 0; i < this.subN; ++i) {
	    row.subV.push(0);
	    tr.insertCell(-1);
	}
	tr.insertCell(-1); // Total N
	for(const source of this.sourceV) {
	    row.sourceCostV.push(0);
	    tr.insertCell(-1);
	}
	tr.insertCell(-1); // Total $
	return row;
    }

    sourceNu(id) {
	let i = this.sourceV.findIndex(source => 0 < source.id.localeCompare(id));
	if(-1 == i)
	    i = this.sourceV.length;
	const source = this.sourceById[id] = new PartTabSource(id, i, 0);
	this.sourceV.splice(i, 0, source);
	this.headTr.insertCell(2 + this.subN + i).textContent = id;
	for(const row of this.rowV) {
	    row.sourceCostV.splice(i, 0, 0);
	    row.tr.insertCell(2 + this.subN + i);
	}
	for(++i; i < this.sourceV.length; ++i)
	    this.sourceV[i].pos = i;
	return source;
    }
}
