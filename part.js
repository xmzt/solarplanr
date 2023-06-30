//-----------------------------------------------------------------------------------------------------------------------
// globals
//-----------------------------------------------------------------------------------------------------------------------

var PartV = [];
var menuOpen;

var BreakerVByTyp = {};

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

function menuClose(menu) {
    document.body.removeChild(menu);
}

class Part {
    panelPartP() { return false; }

    constructor() {
	this.noteV = [];
	this.sourceV = [];
	this.sortid = PartV.length; 
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

}

//-----------------------------------------------------------------------------------------------------------------------
// BreakerPart
//-----------------------------------------------------------------------------------------------------------------------

class BreakerPart extends Part {
    cBreaker(typ, pole, itrip) {
	this.typ = typ;
	this.pole = pole;
	this.itrip = itrip;
	(BreakerVByTyp[typ] ??= []).push(this);
	return this;
    }
}

class BreakerPlexPart extends Part {
    cBreakerPlex(typ, ...poleItripV) {
	this.typ = typ;
	this.poleItripV = poleItripV;
	return this;
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// ConduitPart
//-----------------------------------------------------------------------------------------------------------------------

class ConduitPart extends Part {
    cConduit(typ, size, odia, idia) {
	this.typ = typ;
	this.size = size;
	this.odia = odia;
	this.idia = idia;
	return this;
    }

    desBoxHeadFill(dst) { dst.innerHTML = `${this.typ} ${this.size}`; }
}

//-----------------------------------------------------------------------------------------------------------------------
// CtPart
//-----------------------------------------------------------------------------------------------------------------------

class CtPart extends Part {
    cCt(imax, enclosure) {
	this.imax = imax;
	this.enclosure = enclosure;
	return this;
    }

    desBox(id, n) {
	return desBox(
	    id, 'Current Transformer',
	    `Make: ${this.make}`,
	    `Model: ${this.model}`,
	    `${this.imax}A, ${enclosure}`,
	    `Quantity: ${n}`,
	);
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// DiscoPart
//-----------------------------------------------------------------------------------------------------------------------

class DiscoPart extends Part {
    cDisco(phase, pole, imax, enclosure) {
	this.phase = phase;
	this.pole = pole;
	this.imax = imax;
	this.enclosure = enclosure;
	return this;
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// SolarEdgeInvPart
//-----------------------------------------------------------------------------------------------------------------------

class SolarEdgeInvPart extends Part {
    cElecInvSe(acW, acV, acImax, dcW, dcVmax, dcVNom, dcImax) {
	this.acW = acW;
	this.acV = acV;
	this.acImax = acImax;
	this.dcW = dcW;
	this.dcVmax = dcVmax;
	this.dcVNom = dcVNom;
	this.dcImax = dcImax;
	return this;
    }
}
    
//-----------------------------------------------------------------------------------------------------------------------
// LoadcenterPart
//-----------------------------------------------------------------------------------------------------------------------

class LoadcenterPart extends Part {
    cElecLoadcenter(phase, ibus, spaceN, enclosure, typV, mainTypV) {
	this.phase = phase;
	this.ibus = ibus;
	this.spaceN = spaceN;
	this.enclosure = enclosure;
	this.typV = typV;
	this.mainTypV = mainTypV;
	return this;
    }

    breakerGeTypV(itrip, typV) {
	// todo what criteria to pick the best one
	let best = null;
	for(const typ of typV) {
	    for(const b of BreakerVByTyp[typ]) {
		if(b.itrip >= itrip) {
		    if(null === best || (b.itrip < best.itrip))
			best = b;
		}
	    }
	}
	return best;
    }
    breakerGe(itrip) { return this.breakerGeTypV(itrip, this.typV); } 
    
    breakerLeTypV(itrip, typV) {
	// todo what criteria to pick the best one
	let best = null;
	for(const typ of typV) {
	    for(const b of BreakerVByTyp[typ]) {
		if(b.itrip <= itrip) {
		    if(null === best || (b.itrip > best.itrip))
			best = b;
		}
	    }
	}
	return best;
    }
    breakerLe(itrip) { return this.breakerGeTypV(itrip, this.typV); } 
    
    mainBreakerGe(itrip) { return this.breakerGeTypV(itrip, this.mainTypV); } 
    mainBreakerLe(itrip) { return this.breakerLeTypV(itrip, this.mainTypV); } 
}

//-----------------------------------------------------------------------------------------------------------------------
// OptimizerPart
//-----------------------------------------------------------------------------------------------------------------------

class OptimizerPart extends Part {
    cElecOptSe(inoutW, inVmax, inImax, outVmax, outImax) {
	this.inoutW = inoutW;
	this.inVmax = inVmax;
	this.inImax = inImax;
	this.outVmax = outVmax;
	this.outImax = outImax;
	return this;
    }

    desBox(id, n) {
	return desBox(
	    id, 'Optimizer',
	    `Make: ${this.make}`,
	    `Model: ${this.model}`,
	    `Input: ${this.inoutW}W, ${this.inVmax}V(max), ${this.inImax}A(max)`,
	    `Output: ${this.inoutW}W, ${this.outVmax}V(max), ${this.outImax}A(max)`,
	    `Quantity: ${n}`,
	);
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// PanelPart
//-----------------------------------------------------------------------------------------------------------------------

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

    desBox(id, n) {
	return desBox(
	    id, 'PV Module',
	    `Make: ${this.make}`,
	    `Model: ${this.model}`,
	    `Output: ${this.watts}W(max), Voc=${this.voc}V, Isc=${this.isc}A`,
	    `Quantity: ${n}`,
	);
    }

    landscape() {
	return {
	    __proto__:this,
	    sizeX:this.dimL,
	    sizeY:this.dimS,
	    clampY0:this.clampS0,
	    clampY1:this.clampS1,
	};
    }

    portrait() {
	return {
	    __proto__:this,
	    sizeX:this.dimS,
	    sizeY:this.dimL,
	    clampY0:this.clampL0,
	    clampY1:this.clampL1,
	};
    }

    instNuLtDn(x,y, rack) {
	return {
	    __proto__:this,
	    x0:x - this.sizeX,
	    y0:y - this.sizeY,
	    x1:x,
	    y1:y,
	    rack:rack,
	};
    }

    instNuLtUp(x,y, rack) {
	return {
	    __proto__:this,
	    x0:x - this.sizeX,
	    y0:y,
	    x1:x,
	    y1:y + this.sizeY,
	    rack:rack,
	};
    }

    instNuRtDn(x,y, rack) {
	return {
	    __proto__:this,
	    x0:x,
	    y0:y - this.sizeY,
	    x1:x + this.sizeX,
	    y1:y,
	    rack:rack,
	};
    }

    instNuRtUp(x,y, rack) {
	return {
	    __proto__:this,
	    x0:x,
	    y0:y,
	    x1:x + this.sizeX,
	    y1:y + this.sizeY,
	    rack:rack,
	};
    }

    clampR0() {	return new R2(this.x0, this.y0 + this.clampY0, this.x1, this.y0 + this.clampY1); }
    clampR1() { return new R2(this.x0, this.y1 - this.clampY1, this.x1, this.y1 - this.clampY0); }
}

//-----------------------------------------------------------------------------------------------------------------------
// RailPart
//-----------------------------------------------------------------------------------------------------------------------

class RailPart extends Part {
    cDimRail(dimL, dimF, dimC) {
	this.dimL = dimL;
	this.dimF = dimF;
	this.dimC = dimC;
	return this;
    }	
}

//-----------------------------------------------------------------------------------------------------------------------
// TrimPart
//-----------------------------------------------------------------------------------------------------------------------

class TrimPart extends Part {
    cDimTrim(dimL) {
	this.dimL = dimL;
	return this;
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// WirePart
//-----------------------------------------------------------------------------------------------------------------------

class WirePart extends Part {
    cWire(awg, typ, color) {
	this.awg = awg;
	this.typ = typ;
	this.color = color;
	return this;
    }
}
