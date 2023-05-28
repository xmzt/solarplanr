//-----------------------------------------------------------------------------------------------------------------------
// globals
//-----------------------------------------------------------------------------------------------------------------------

var PartV = [];
var menuOpen;

//-----------------------------------------------------------------------------------------------------------------------
// extract id from url
//-----------------------------------------------------------------------------------------------------------------------

var UrlIdD = {
    amazon:'amzn',
    homedepot:'hd',
    abcsupply:'abc',
    lowes:'lowz',
    beaumonthardware:'beau',
};

function urlId(url) {
    const u = new URL(url);
    const m = /([^.]+)\.[^.]+$/.exec(u.hostname);
    return UrlIdD[m[1]] ?? m[1];
}

//-----------------------------------------------------------------------------------------------------------------------
// Note
//-----------------------------------------------------------------------------------------------------------------------

class Note {
    constructor(desc) {
	this.desc = desc;
    }
    menuFill(dst) { eleNuClasAdd('div', 'note', dst).innerHTML = this.desc; }
}

class NoteWar {
    constructor(desc) {
	this.desc = desc;
    }
    menuFill(dst) { eleNuClasAdd('div', 'note', dst).innerHTML = `Warranty: ${this.desc}`; }
}

class NoteUrl {
    constructor(desc, url) {
	this.desc = desc;
	this.url = url;
    }
    menuFill(dst) {
	const a = eleNuClasAdd('a', 'noteA', dst);
	a.setAttribute('target', '_blank');
	a.href = this.url;
	a.innerHTML = this.desc;
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// Source
//-----------------------------------------------------------------------------------------------------------------------

class SourceId {
    constructor(str) {
	this.str = str;
	//this.num
    }
}

class Source1 {
    constructor(cost1, avail, id, url) {
	this.cost1 = cost1;
	this.avail = avail;
	this.id = id;
	this.url = url;
    }
    menuFill(dst) {
	if(null !== this.url) {
	    const a = eleNuClasAdd('a', 'noteA', dst);
	    a.setAttribute('target', '_blank');
	    a.href = this.url;
	    this.menuFillInner(a);
	} else {
	    this.menuFillInner(eleNuClasAdd('div', 'note', dst));
	}
    }
    availHtml() { return null !== this.avail ? `<span class="avail">[${this.avail}]</span> ` : ''; }

    menuFillInner(dst) {
	dst.innerHTML = `[${this.id}] ${this.availHtml()}${toFixedMinMax(this.cost1, 2, 4)}`;
    }
    partCatFill(dst) {
	dst.innerHTML = `${this.availHtml()}${toFixedMinMax(this.cost1, 2, 4)}`;
    }
}

class SourceN extends Source1 {
    constructor(costA, costB, avail, id, url) {
	super(costA / costB, avail, id, url);
	this.costA = costA;
	this.costB = costB;
    }
    menuFillInner(dst) {
	dst.innerHTML = `[${this.id}] ${this.availHtml()}${toFixedMinMax(this.cost1, 2, 4)} * ${this.costB} = ${toFixedMinMax(this.costA, 2, 4)}`;
    }
    partCatFill(dst) {
	dst.innerHTML = `${this.availHtml()}${toFixedMinMax(this.cost1, 2, 4)} * ${this.costB}`;
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// Part
//-----------------------------------------------------------------------------------------------------------------------

//todo rename id to nid

function menuClose(menu) {
    document.body.removeChild(menu);
}

class PartBase {
    constructor() {
	this.noteV = [];
	this.sourceV = [];
	this.id = PartV.length; 
	PartV.push(this);
    }

    nUrl(desc, url) { this.noteV.push(new NoteUrl(desc, url)); return this; }
    nWar(desc) { this.noteV.push(new Note(`Warranty: ${desc}`)); return this; }
    nCat(url) { this.noteV.push(new NoteUrl('Catalog', url)); return this; }
    nDs(url) { this.noteV.push(new NoteUrl('Datasheet', url)); return this; }
    nI(url) { this.noteV.push(new NoteUrl('Install', url)); return this; }
    nTb(url) { this.noteV.push(new NoteUrl('Tech brief', url)); return this; }
    nU(url) { this.noteV.push(new NoteUrl('User', url)); return this; }
    
    s1(cost1, id) { this.sourceV.push(new Source1(cost1, null, id, null)); return this; }
    s1U(cost1, url) { this.sourceV.push(new Source1(cost1, null, urlId(url), url)); return this; }
    s1A(cost1, avail, id) { this.sourceV.push(new Source1(cost1, avail, id, null)); return this; }
    s1AU(cost1, avail, url) { this.sourceV.push(new Source1(cost1, avail, urlId(url), url)); return this; }
    sN(costA, costB, id) { this.sourceV.push(new SourceN(costA, costB, null, id, null)); return this; }
    sNU(costA, costB, url) { this.sourceV.push(new SourceN(costA, costB, null, urlId(url), url)); return this; }
    
    menuAClick(anchor) {
	const menu = eleNuClasAdd('div', 'menu', document.body);
	const headA = eleNuClasAdd('a', 'menuHeadA', menu);
	headA.href = 'javascript:void(0)';
	headA.addEventListener('click', (ev) => menuClose(menu));
	this.descFill(headA);
	
	for(const note of this.noteV)
	    note.menuFill(menu);
	for(const source of this.sourceV)
	    source.menuFill(menu);

	// adjust positioning
	const descR = headA.getBoundingClientRect();
	const anchorR = anchor.getBoundingClientRect();
	menu.style.left = `${anchorR.left - descR.left}px`;
	menu.style.top = `${anchorR.top - descR.top}px`;
	menu.style.visibility = 'visible';
    }

    //descFill(dst)
    
    menuAFill(dst) {
	const a = eleNuClasAdd('a', 'menuA', dst);
	a.href = 'javascript:void(0)';
	a.addEventListener('click', (ev) => this.menuAClick(a));
	this.descFill(a);
    }

    panelPartP() { return false; }
}

//-----------------------------------------------------------------------------------------------------------------------
// Part
//-----------------------------------------------------------------------------------------------------------------------

class Part extends PartBase {
    constructor(desc) {
	super();
	this.desc = desc;
    }

    descFill(dst) { dst.innerHTML = this.desc; }
}

//-----------------------------------------------------------------------------------------------------------------------
// ModelPart: add make, model descriptions to part
//-----------------------------------------------------------------------------------------------------------------------

class ModelPart extends PartBase {
    constructor(nick, make, model, more) {
	super();
	this.nick = nick;
	this.make = make;
	this.model = model;
	this.more = more;
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// Part derived
//-----------------------------------------------------------------------------------------------------------------------

//todo voc,isc
class PanelPart extends ModelPart {
    constructor(nick, make, model, more, watts, voc, isc, dimL, dimS, dimH, clampL0, clampL1, clampS0, clampS1) {
	super(nick, make, model, more);
	this.watts = watts;
	this.voc = voc;
	this.isc = isc;
	this.dimL = dimL;
	this.dimS = dimS;
	this.dimH = dimH;
	this.clampL0 = clampL0;
	this.clampL1 = clampL1;
	this.clampS0 = clampS0;
	this.clampS1 = clampS1;
    }
    
    descFill(dst) { dst.innerHTML = `${this.make} ${this.model} ${this.more} [Panel]`; }

    panelPartP() { return true; }

    landscape() { return new PanelOrient(this, this.dimL, this.dimS, this.clampS0, this.clampS1); }
    portrait() { return new PanelOrient(this, this.dimS, this.dimL, this.clampL0, this.clampL1); }
}

class PanelOrient {
    constructor(part, sizeX, sizeY, clamp0, clamp1) {
	this.part = part;
	this.sizeX = sizeX;
	this.sizeY = sizeY;
	this.clamp0 = clamp0;
	this.clamp1 = clamp1;
    }
}

class BreakerPart extends ModelPart {
    constructor(nick, make, model, more) {
	super(nick, make, model, more);
    }

    descFill(dst) { dst.innerHTML = `${this.make} ${this.model} ${this.more} [Breaker]`; }
}

class CtPart extends ModelPart {
    constructor(nick, make, model, more, boxDesc) {
	super(nick, make, model, more);
	this.boxDesc = boxDesc;
    }
    
    descFill(dst) { dst.innerHTML = `${this.make} ${this.model} ${this.more} [CT]`; }
}

class DisconnectPart extends ModelPart {
    constructor(nick, make, model, more, boxDesc) {
	super(nick, make, model, more);
	this.boxDesc = boxDesc;
    }

    descFill(dst) { dst.innerHTML = `${this.make} ${this.model} ${this.more} [Disconnect]`; }
}

class InverterPart extends ModelPart {
    constructor(nick, make, model, more, acWatts, dcWatts) {
	super(nick, make, model, more);
	this.dcWatts = dcWatts;
	this.acWatts = acWatts;
    }

    descFill(dst) { dst.innerHTML = `${this.make} ${this.model} ${this.more} [Inverter]`; }
}

class LoadCenterPart extends ModelPart {
    constructor(nick, make, model, more, boxDesc, busA, accept) {
	super(nick, make, model, more);
	this.boxDesc = boxDesc;
	this.busA = busA;
	this.accept = accept;
    }

    descFill(dst) { dst.innerHTML = `${this.make} ${this.model} ${this.more} [Load center]`; }
}

class OptimizerPart extends ModelPart {
    constructor(nick, make, model, more, watts, vin, iin, vout, iout) {
	super(nick, make, model, more);
	this.watts = watts;
	this.vin = vin;
	this.iin = iin;
	this.vout = vout;
	this.iout = iout;
    }

    descFill(dst) { dst.innerHTML = `${this.make} ${this.model} ${this.more} [Optimizer]`; }
}

class RailPart extends Part {
    constructor(desc, dimL, footL, cantiL) {
	super(desc);
	this.dimL = dimL;
	this.footL = footL;
	this.cantiL = cantiL;
    }
}

class TrimPart extends Part {
    constructor(desc, dimL) {
	super(desc);
	this.dimL = dimL;
    }
}
