function temRoot(id) { return document.getElementById(id).content.querySelector('._root'); }
function temRootClone(id) { return temRoot(id).cloneNode(/*deep=*/true); }

function toFixedMax(x, prec) {
    const a = x.toString();
    const b = x.toFixed(prec);
    return a.length <= b.length ? a : b;
}    

//-----------------------------------------------------------------------------------------------------------------------
// Note, Price*
//-----------------------------------------------------------------------------------------------------------------------

function noteIdFromUrl(url) {
    const u = new URL(url);
    const m = /([^.]+)\.[^.]+$/.exec(u.hostname)
    return m[1];
}

class Note {
    constructor(id, url) {
	this.id = id;
	this.url = url;
    }

    price() { return null; }
}

class Price1 extends Note {
    constructor(unitCost, id, url) {
	super(id, url);
	this.unitCost = unitCost;
    }

    static nu(unitCost, url) { return new Price1(unitCost, noteIdFromUrl(url), url); }

    price() { return this.unitCost; }
}

class PriceN extends Note {
    constructor(unitCost, unitQty, id, url) {
	super(id, url);
	this.unitCost = unitCost;
	this.unitQty = unitQty;
    }

    static nu(unitCost, unitQty, url) { return new PriceN(unitCost, unitQty, noteIdFromUrl(url), url); }

    price() { return this.unitCost / this.unitQty; }
}

//-----------------------------------------------------------------------------------------------------------------------
// Part
//-----------------------------------------------------------------------------------------------------------------------

var Parts = [];

class Part {
    constructor(desc, notes) { // additional arguments: notes
	this.desc = desc;
	this.notes = notes;
	this.id = Parts.length; 
	Parts.push(this);
	// assert: Parts[this.id] === this
    }

    static nu(desc, ...notes) { return new Part(desc, notes); }

    descFill(dst) {
	dst.appendChild(document.createTextNode(this.desc));
	for(const note of this.notes) {
	    if(null !== note.url) {
		const a = temRootClone('noteA_tem');
		a.href = note.url;
		a.textContent = note.id.toUpperCase();
		dst.appendChild(a);
	    }
	}
    }

    panelWatts() { return null; }
    
    price() {
	for(const note of this.notes) {
	    const p = note.price();
	    if(null !== p) return p;
	}
	return null;
    }
    
    priceFill(dst) {
	let sel = null;
	const prices = [];
	for(const note of this.notes) {
	    const p = note.price();
	    if(null !== p) {
		sel ??= p;
		prices.push(null !== note.id ? `${p.toFixed(2)}[${note.id}]` : p.toFixed(2));
	    }
	}
	if(prices.length) dst.appendChild(document.createTextNode(prices.join(' ')))
	return sel;
    }
}

function partsTable(parts) {
    const tbody = document.getElementById('partsTbody');
    for(const part of parts) {
	const tr = temRootClone('partsTr_tem');
	part.descFill(tr.querySelector('._desc'));
	part.priceFill(tr.querySelector('._price'));
	tbody.appendChild(tr);
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// Acq (acquisition - parts actually bought and maybe even used)
//-----------------------------------------------------------------------------------------------------------------------

class Acq {
    constructor(cost, qty, qtyUsed, kws, buyr, fro, part, rec) {
	this.cost = cost;
	this.qty = qty;
	this.qtyUsed = qtyUsed;
	this.kws = kws;
	this.buyr = buyr;
	this.fro = fro;
	this.part = part;
	this.rec = rec;
    }
}

function acqTr(acq) {
    const tr = temRootClone('acqTr_tem');
    tr.querySelector('._cost').textContent = acq.cost.toFixed(2);
    tr.querySelector('._qty').textContent = acq.qty;
    tr.querySelector('._qtyUsed').textContent = acq.qtyUsed;
    tr.querySelector('._costQty').textContent = (acq.cost / acq.qty).toFixed(2);
    tr.querySelector('._kws').textContent = acq.kws.join(' ');
    tr.querySelector('._buyr').textContent = acq.buyr;
    tr.querySelector('._fro').textContent = acq.fro;
    acq.part.descFill(tr.querySelector('._part'));
    tr.querySelector('._rec').textContent = acq.rec;
    return tr;
}
function acqTrSum(cost, k, v) {
    const tr = temRootClone('acqTr_tem');
    tr.querySelector('._cost').textContent = cost.toFixed(2);
    tr.querySelector(k).textContent = v;
    return tr;
}

function acqTable(acqs) {
    const tbody = document.getElementById('acqTbody');
    let cost = 0.0;
    const costByKw = {};
    const costByBuyr = {};
    const costByFro = {};
    for(const acq of acqs) {
	tbody.appendChild(acqTr(acq));
	cost += acq.cost;
	for(const kw of acq.kws) {
	    costByKw[kw] = (costByKw[kw] ?? 0.0) + acq.cost;
	}
	costByBuyr[acq.buyr] = (costByBuyr[acq.buyr] ?? 0.0) + acq.cost;
	costByFro[acq.fro] = (costByFro[acq.fro] ?? 0.0) + acq.cost;
    }
    for(const [kw,cost] of Object.entries(costByKw))
	tbody.appendChild(acqTrSum(cost, '._kws', kw));
    for(const [buyr,cost] of Object.entries(costByBuyr))
	tbody.appendChild(acqTrSum(cost, '._buyr', buyr));
    for(const [fro,cost] of Object.entries(costByFro))
	tbody.appendChild(acqTrSum(cost, '._fro', fro));
    tbody.appendChild(acqTrSum(cost, '._part', 'total'));
}

