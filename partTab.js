//include base.js
//include geom.js 
//include partCat.js
//include rail.js
//include rack.js
//include roof.js

function tdText(text) {
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}

//-----------------------------------------------------------------------------------------------------------------------
// PartTabCell

class PartTabCell {
    constructor(nTd, costTd) {
	this.nTd = nTd;
	this.costTd = costTd;
	this.n = 0;
	this.cost = 0;
    }

    incCost(cost) {
	this.cost += cost;
	this.costTd.textContent = this.cost.toFixed(2);
    }

    incNCost(n, cost) {
	this.n += n;
	this.cost += cost;
	this.nTd.textContent = toFixedMax(this.n, 3);
	this.costTd.textContent = this.cost.toFixed(2);
    }
}
	
//-----------------------------------------------------------------------------------------------------------------------
// PartTabRow

class PartTabRow {
    constructor(tr, totCell, price) {
	this.tr = tr;
	this.totCell = totCell;
	this.price = price;
	this.cellV = [];
    }

    colAdd() {
    	const cell = new PartTabCell(document.createElement('td'), document.createElement('td'));
	this.cellV.push(cell);
	this.tr.insertBefore(cell.nTd, this.totCell.nTd);
	this.tr.insertBefore(cell.costTd, this.totCell.nTd);
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// PartTab

class PartTab {
    constructor(root) {
	this.root = root;
	this.headTr = root.querySelector('._headTr');
	this.totTr = root.querySelector('._totTr');
	this.headColInsertTd = this.headTr.querySelector('._totN');
	const totTotCell = new PartTabCell(this.totTr.querySelector('._totN'), this.totTr.querySelector('._totCost'));
	this.totRow = new PartTabRow(this.totTr, totTotCell, /*price*/ null);

	this.colCellI = 0;
	this.rowByPartId = {}
    }

    colAdd(id) {
	this.headTr.insertBefore(tdText(`${id} N`), this.headColInsertTd);
	this.headTr.insertBefore(tdText(`${id} Cost`), this.headColInsertTd);
	for(const partId in this.rowByPartId)
	    this.rowByPartId[partId].colAdd();
	this.totRow.colAdd();
	return this.colCellI++;
    }

    partAddCol(part, n, colI) {
	const row = this.rowGetOrNu(part);
	const cost = n * row.price;
	row.cellV[colI].incNCost(n, cost);
	row.totCell.incNCost(n, cost);
	this.totRow.cellV[colI].incCost(cost);
	this.totRow.totCell.incCost(cost);
    }

    partAddTot(part, n) {
	const row = this.rowGetOrNu(part);
	const cost = n * row.price;
	row.totCell.incNCost(n, cost);
	this.totRow.totCell.incCost(cost);
    }

    rowGetOrNu(part) {
	return this.rowByPartId[part.id] ??= this.rowNu(part);
    }

    rowNu(part) {
	const tr = temRootClone('partTabTr_tem');
	const row = new PartTabRow(tr,
				   new PartTabCell(tr.querySelector('._totN'), tr.querySelector('._totCost')),
				   part.priceFill(tr.querySelector('._price')));
	part.descFill(tr.querySelector('._desc'));
	for(let i = 0; i < this.colCellI; i++)
	    row.colAdd();
	this.totRow.tr.parentNode.insertBefore(tr, this.totRow.tr);
	return row;
    }
}
