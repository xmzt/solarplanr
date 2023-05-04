//-----------------------------------------------------------------------------------------------------------------------
// globals
//-----------------------------------------------------------------------------------------------------------------------

var PartV = [];
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
	this.id = PartV.length; 
	PartV.push(this);
    }

    static nu(desc, ...notes) { return new Part(desc, notes); }

    descClick(anchor) {
	let menu,desc,div,a;
	
	document.body.appendChild(menu = document.createElement('div'));
	menu.classList.add('menu');
	
	menu.appendChild(desc = document.createElement('div'));
	desc.appendChild(a = document.createElement('a'));
	a.href = 'javascript:void(0)';
	a.innerHTML = this.desc;
	a.addEventListener('click', (ev) => menuClose(menu));
	
	for(const note of this.notes) {
	    menu.appendChild(div = document.createElement('div'));
	    note.menuFill(div);
	}

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
}

