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

class Note {
    price() { return null; }
}

class NoteUrl extends Note {
    constructor(url) {
	super();
	try {
	    const u = new URL(url);
	    const m = /([^.]+)\.[^.]+$/.exec(u.hostname)
	    this.href = url;
	    this.descHtml = m[1];
	}
	catch(e) {
	    this.href = null;
	    this.descHtml = url;
	}
    }
    
    menuFill1(dst, descHtml) {
	if(null !== this.href) {
	    const a = document.createElement('a');
	    a.href = this.href;
	    a.target = '_blank';
	    a.classList.add('menuItem');
	    a.innerHTML = descHtml;
	    dst.appendChild(a);
	}
	else {
	    const span = document.createElement('span');
	    span.innerHTML = descHtml;
	    dst.appendChild(span);
	}
    }

    menuFill(dst) { return this.menuFill1(dst, this.descHtml); }
}

class NoteCat extends NoteUrl { menuFill(dst) { this.menuFill1(dst, 'Catalog'); } }
class NoteDs extends NoteUrl { menuFill(dst) { this.menuFill1(dst, 'Datasheet'); } }
class NoteI extends NoteUrl { menuFill(dst) { this.menuFill1(dst, 'Install'); } }
class NoteTb extends NoteUrl { menuFill(dst) { this.menuFill1(dst, 'Tech Brief'); } }
class NoteU extends NoteUrl { menuFill(dst) { this.menuFill1(dst, 'User'); } }

class Price1 extends NoteUrl {
    constructor(unitCost, url) {
	super(url);
	this.unitCost = unitCost;
    }

    menuFill(dst) { return this.menuFill1(dst, `${toFixedMinMax(this.unitCost, 2, 4)} [${this.descHtml}]`); }
    
    price() { return this.unitCost; }
}

class Price1Id extends Note {
    constructor(unitCost, id) {
	super();
	this.unitCost = unitCost;
	this.id = id;
    }
    
    menuFill(dst) { return this.menuFill1(dst, `${toFixedMinMax(this.unitCost, 2, 4)} [${this.id}]`); }
}

class PriceN extends NoteUrl {
    constructor(unitCost, unitQty, url) {
	super(url);
	this.unitCost = unitCost;
	this.unitQty = unitQty;
    }

    menuFill(dst) { return this.menuFill1(dst, `${toFixedMinMax(this.price(), 2, 4)} = ${this.unitCost}/${this.unitQty} [${this.descHtml}]`); }
    
    price() { return this.unitCost / this.unitQty; }
}

//-----------------------------------------------------------------------------------------------------------------------
// Part
//-----------------------------------------------------------------------------------------------------------------------

function menuClose(menu) {
    document.body.removeChild(menu);
}

class Part {
    constructor(descHtml, notes) { // additional arguments: notes
	this.descHtml = descHtml;
	this.notes = notes;
	this.id = PartV.length; 
	PartV.push(this);
    }

    static nu(descHtml, ...notes) { return new Part(descHtml, notes); }

    descClick(anchor) {
	let menu,aDiv,div,a;
	
	document.body.appendChild(menu = document.createElement('div'));
	menu.classList.add('menu');
	
	menu.appendChild(aDiv = document.createElement('div'));
	aDiv.appendChild(a = document.createElement('a'));
	a.href = 'javascript:void(0)';
	a.innerHTML = this.descHtml;
	a.addEventListener('click', (ev) => menuClose(menu));
	
	for(const note of this.notes) {
	    menu.appendChild(div = document.createElement('div'));
	    note.menuFill(div);
	}

	const descR = aDiv.getBoundingClientRect();
	const anchorR = anchor.getBoundingClientRect();
	menu.style.left = `${anchorR.left-descR.left}px`;
	menu.style.top = `${anchorR.top-descR.top}px`;
	menu.style.visibility = 'visible';
    }

    descFill(dst) {
	const a = document.createElement('a');
	a.innerHTML = this.descHtml;
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
		dst.textContent = toFixedMinMax(p, 2, 4);
		return p;
	    }
	}
	return null;
    }
}

