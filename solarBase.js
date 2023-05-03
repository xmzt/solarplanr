//-----------------------------------------------------------------------------------------------------------------------
// constants
//-----------------------------------------------------------------------------------------------------------------------

const EdgeFootDist = 2.54*36;
const EdgeFootDist2 = EdgeFootDist*EdgeFootDist;
const CantiMax = 2.54*24;
const FootSpan = 2.54*48.0 + 1.0;
const FootSpanEdge = 2.54*24.0 + 1.0;

const ChimneyFillStyle = '#4408';
const ClampFillStyle = '#0888';
const ClampLineWidth = 4;
const ClampRadius = 6;
const EdgeFillStyle = '#eca9';
const EdgeWidth = 2.54 * 36;
const FireWalkWidth = 2.54 * 36;
const FireWalkFillStyle = '#fcf8';
const FootFillStyle = '#f008';
const FootRadius = 6;
const LinkFillStyle = '#0c08';
const LinkLineWidth = 4;
const LinkRadius = 6;
const PathStrokeStyle = '#000';
const PathLineWidth = 3;
const PipeFillStyle = '#4408';
const PanelFillStyle = '#ccc8';
const RafterLineDash = [4,8];
const RafterStrokeStyle = '#6668';
const RailRegFillStyle = '#ace6';
const RailStrokeStyle = '#00f8';
const RoofCanvasMargin = 10;
const RoofCanvasScale = 0.75;
const SkirtFillStyle = '#84c8';
const SkirtDimS = 6;
const SpliceFillStyle = '#0c08';
const SpliceRadiusX = 2;
const SpliceRadiusY = 10;
const VentFillStyle = '#4408';

//-----------------------------------------------------------------------------------------------------------------------
// globals
//-----------------------------------------------------------------------------------------------------------------------

var Parts = [];
var menuOpen;

//-----------------------------------------------------------------------------------------------------------------------
// real basic helpers
//-----------------------------------------------------------------------------------------------------------------------

function temRoot(id) { return document.getElementById(id).content.querySelector('._root'); }
function temRootClone(id) { return temRoot(id).cloneNode(/*deep=*/true); }

function toFixedMax(x, prec) {
    const a = x.toString();
    const b = x.toFixed(prec);
    return a.length <= b.length ? a : b;
}    

function toFixedMinMax(x, precMin, precMax) {
    const a = x.toString();
    const b = x.toFixed(precMin);
    const c = x.toFixed(precMax);
    return c.length < a.length ? c
	: b.length > a.length ? b
	: a;
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
    price() { return null; }
}

class NoteUrl extends Note {
    constructor(url) {
	super();
	this.url = url;
    }
    
    descFun() { return noteIdFromUrl(this.url); }
    
    menuFill(dst) {
	const a = document.createElement('a');
	a.href = this.url;
	a.target = '_blank';
	a.classList.add('menuItem');
	a.appendChild(document.createTextNode(this.descFun()));
	dst.appendChild(a);
    }
}

class NoteCat extends NoteUrl { descFun() { return 'Catalog'; } }
class NoteDs extends NoteUrl { descFun() { return 'Datasheet'; } }
class NoteI extends NoteUrl { descFun() { return 'Install'; } }
class NoteTb extends NoteUrl { descFun() { return 'Tech brief'; } }
class NoteU extends NoteUrl { descFun() { return 'User'; } }

class Price1 extends NoteUrl {
    constructor(unitCost, url) {
	super(url);
	this.unitCost = unitCost;
    }

    descFun() { return `${toFixedMinMax(this.unitCost, 2, 4)} [${super.descFun()}]`; }
    
    price() { return this.unitCost; }
}

class Price1Id extends Note {
    constructor(unitCost, id) {
	super();
	this.unitCost = unitCost;
	this.id = id;
    }
    
    descFun() { return `${toFixedMinMax(this.unitCost, 2, 4)} [${this.id}]`; }
    
    menuFill(dst) {
	dst.appendChild(document.createTextNode(this.descFun()));
    }
}

class PriceN extends NoteUrl {
    constructor(unitCost, unitQty, url) {
	super(url);
	this.unitCost = unitCost;
	this.unitQty = unitQty;
    }

    descFun() { return `${toFixedMinMax(this.price(), 2, 4)} = ${this.unitCost}/${this.unitQty} [${super.descFun()}]`; }
    
    price() { return this.unitCost / this.unitQty; }
}

//-----------------------------------------------------------------------------------------------------------------------
// Part
//-----------------------------------------------------------------------------------------------------------------------

function menuClose(menu) {
    document.body.removeChild(menu);
}

class Part {
    constructor(desc, notes) { // additional arguments: notes
	this.desc = desc;
	this.notes = notes;
	this.id = Parts.length; 
	Parts.push(this);
	// assert: Parts[this.id] === this
    }

    static nu(desc, ...notes) { return new Part(desc, notes); }

    descClick(anchor) {
	const menu = temRootClone('partMenu_tem');
	const desc = menu.querySelector('._desc');
	desc.innerHTML = this.desc;
	desc.addEventListener('click', (ev) => menuClose(menu));
	for(const note of this.notes) {
	    const item = document.createElement('div');
	    note.menuFill(item);
	    menu.appendChild(item);
	}
	document.body.appendChild(menu);

	const descR = desc.getBoundingClientRect();
	const anchorR = anchor.getBoundingClientRect();
	menu.style.left = `${anchorR.left-descR.left}px`;
	menu.style.top = `${anchorR.top-descR.top}px`;
	menu.style.visibility = 'visible';
    }

    descFill(dst) {
	const a = document.createElement('a');
	a.appendChild(document.createTextNode(this.desc));
	a.href = 'javascript:void(0)';
	a.addEventListener('click', (ev) => this.descClick(a));
	dst.appendChild(a);
    }

    price() {
	for(const note of this.notes) {
	    const p = note.price();
	    if(null !== p) return p;
	}
	return null;
    }

    priceFill(dst) {
	for(const note of this.notes) {
	    const p = note.price();
	    if(null !== p) {
		dst.appendChild(document.createTextNode(toFixedMinMax(p, 2, 4)));
		return p;
	    }
	}
	return null;
    }
    
    todopriceFill(dst) {
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
	part.todopriceFill(tr.querySelector('._price'));
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

