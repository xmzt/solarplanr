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
    constructor(des) {
	this.des = des;
    }
    menuFill(dst) { eleNuClasAdd('div', 'note', dst).innerHTML = this.des; }
}

class NoteUrl {
    constructor(des, url) {
	this.des = des;
	this.url = url;
    }
    menuFill(dst) {
	const a = eleNuClasAdd('a', 'noteA', dst);
	a.setAttribute('target', '_blank');
	a.href = this.url;
	a.innerHTML = this.des;
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

//todo rename id to uid

function menuClose(menu) {
    document.body.removeChild(menu);
}

class Part {
    constructor() {
	this.noteV = [];
	this.sourceV = [];
	this.id = PartV.length; 
	PartV.push(this);
    }

    cDesGeneric(desGeneric) {
	this.desGeneric = desGeneric;
	this.desFill = Part.prototype.desFillGeneric;
	return this;
    }
    
    cDesMakeModelMore(make, model, more) { return this.cDesNickMakeModelMore(model, make, model, more); }

    cDesNickMakeModelMore(nick, make, model, more) {
	this.nick = nick;
	this.make = make;
	this.model = model;
	this.more = more;
	this.desFill = Part.prototype.desFillModel;
	return this;
    }

    cSpec1(spec1) {
	this.spec1 = spec1;
	return this;
    }

    cElecLc(ibus) {
	this.ibus = ibus;
	return this;
    }
    
    //todo: list in menu
    cWarranty(warranty) {
	this.warranty = warranty;
	return this;
    }

    nUrl(des, url) { this.noteV.push(new NoteUrl(des, url)); return this; }
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

    desFillGeneric(dst) { dst.innerHTML = this.desGeneric; }
    desFillModel(dst) { dst.innerHTML = `${this.make} ${this.model} ${this.more}`; }
    
    menuAClick(anchor) {
	const menu = eleNuClasAdd('div', 'menu', document.body);
	const headA = eleNuClasAdd('a', 'menuHeadA', menu);
	headA.href = 'javascript:void(0)';
	headA.addEventListener('click', (ev) => menuClose(menu));
	this.desFill(headA);
	
	for(const note of this.noteV)
	    note.menuFill(menu);
	for(const source of this.sourceV)
	    source.menuFill(menu);

	// adjust positioning
	const desR = headA.getBoundingClientRect();
	const anchorR = anchor.getBoundingClientRect();
	menu.style.left = `${anchorR.left - desR.left}px`;
	menu.style.top = `${anchorR.top - desR.top}px`;
	menu.style.visibility = 'visible';
    }

    //desFill(dst)
    
    menuAFill(dst) {
	const a = eleNuClasAdd('a', 'menuA', dst);
	a.href = 'javascript:void(0)';
	a.addEventListener('click', (ev) => this.menuAClick(a));
	this.desFill(a);
    }

    panelPartP() { return false; }
}

//-----------------------------------------------------------------------------------------------------------------------
// Part derived
//-----------------------------------------------------------------------------------------------------------------------

class ConduitPart extends Part {
    cConduit(typ, size, od, id) {
	this.typ = typ;
	this.size = size;
	this.od = od;
	this.id = id;
	return this;
    }

    desBoxHeadFill(dst) { dst.innerHTML = `${this.typ} ${this.size}`; }
}

class InvPart extends Part {
    cElecInvSe(acW, acV, acIMax, dcW, dcVMax, dcVNom, dcIMax) {
	this.acW = acW;
	this.acV = acV;
	this.acIMax = acIMax;
	this.dcW = dcW;
	this.dcVMax = dcVMax;
	this.dcVNom = dcVNom;
	this.dcIMax = dcIMax;
	return this;
    }

    desBox(id, n) {
	return desBox(
	    id, 'Inverter',
	    `Make: ${this.make}`,
	    `Model: ${this.model}`,
	    `AC Output: ${this.acW}W(max), ${this.acIMax}A(max) @ ${this.acV}V`,
	    `DC Input: ${this.dcW}W(max), ${this.dcVMax}V(max), ${this.dcVNom}V(nominal), ${this.dcIMax}A(max)`,
	    `Quantity: ${n}`,
	);
    }
}

class OptimizerPart extends Part {
    cElecOptSe(inoutW, inVMax, inIMax, outVMax, outIMax) {
	this.inoutW = inoutW;
	this.inVMax = inVMax;
	this.inIMax = inIMax;
	this.outVMax = outVMax;
	this.outIMax = outIMax;
	return this;
    }

    desBox(id, n) {
	return desBox(
	    id, 'Optimizer',
	    `Make: ${this.make}`,
	    `Model: ${this.model}`,
	    `Input: ${this.inoutW}W, ${this.inVMax}V(max), ${this.inIMax}A(max)`,
	    `Output: ${this.inoutW}W, ${this.outVMax}V(max), ${this.outIMax}A(max)`,
	    `Quantity: ${n}`,
	);
    }
}

class PanelPart extends Part {
    panelPartP() { return true; }

    cClamp(clampL0, clampL1, clampS0, clampS1) {
	this.clampL0 = clampL0;
	this.clampL1 = clampL1;
	this.clampS0 = clampS0;
	this.clampS1 = clampS1;
	return this;
    }

    cDimPanel(dimL, dimS, dimH) {
	this.dimL = dimL;
	this.dimS = dimS;
	this.dimH = dimH;
	return this;
    }

    // todo: watts -> wattsStc
    cElecPanel(watts, voc, isc) {
	this.watts = watts;
	this.voc = voc;
	this.isc = isc;
	return this;
    }

    landscape() { return new PanelOrient(this, this.dimL, this.dimS, this.clampS0, this.clampS1); }
    portrait() { return new PanelOrient(this, this.dimS, this.dimL, this.clampL0, this.clampL1); }

    desBox(id, n) {
	return desBox(
	    id, 'PV Module',
	    `Make: ${this.make}`,
	    `Model: ${this.model}`,
	    `Output: ${this.watts}W(max), Voc=${this.voc}V, Isc=${this.isc}A`,
	    `Quantity: ${n}`,
	);
    }
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

class RailPart extends Part {
    cDimRail(dimL, dimF, dimC) {
	this.dimL = dimL;
	this.dimF = dimF;
	this.dimC = dimC;
	return this;
    }	
}

class Spec1Part extends Part {
    desBox(id, n) {
	return desBox(
	    id, 'AC Disconnect',
	    `Make: ${this.make}`,
	    `Model: ${this.model}`,
	    this.spec1,
	    `Quantity: ${n}`,
	);
    }
}

class TrimPart extends Part {
    cDimTrim(dimL) {
	this.dimL = dimL;
	return this;
    }
}

class WirePart extends Part {
    cWire(awg, typ, color) {
	this.awg = awg;
	this.typ = typ;
	this.color = color;
	return this;
    }
}
