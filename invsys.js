//include base.js
//include geom.js 
//include partCat.js

//-----------------------------------------------------------------------------------------------------------------------
// Invsys: abstract base class. represents an inverter system

class InvsysString {
    constructor(id) {
	this.id = id;
	this.panelV = [];
    }
}

class Invsys {
    //static IdHtml

    constructor(partTabSub) {
	this.partTabSub = partTabSub;
	this.stringV = [];
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// InvsysNone

class InvsysNone extends Invsys {
    static IdHtml = '--Inverter system--';
}

//-----------------------------------------------------------------------------------------------------------------------
// SolarEdgeInvsys

class SolarEdgeInvsys extends Invsys {
    static IdHtml = 'SolarEdge (optimizers)';

    constructor(partTabSub, attachPart) {
	super(partTabSub);
	//this.invPart
	this.attachPart = attachPart;
	this.stringV = [];
    }

    invSet(invPart) {
	this.invPart = invPart;
	this.partTabSub.partAdd(invPart, 1);
	this.partTabSub.partAdd(ScrewSs, 6);
	this.partTabSub.partAdd(WasherSs, 6);
	return this;
    }

    partAdd(part, qty) {
	this.partTabSub.partAdd(part, qty);
	return this;
    }
    
    panelOptAdd(string, panel, optPart) {
	panel.optPart = optPart;
	string.panelV.push(panel);
	this.partTabSub.partAdd(panel.optPart, 1);
	this.partTabSub.partAdd(this.attachPart, 1);
    }

    stringAdd(id) {
	const string = new InvsysString(id);
	this.stringV.push(string);
	return string;
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// EnphaseInvsys

class EnphaseInvsys extends Invsys {
    static IdHtml = 'Enphase (microinverters)';
}

//-----------------------------------------------------------------------------------------------------------------------
// SunnyBoyInvsys

class SunnyBoyInvsys extends Invsys {
    static IdHtml = 'SunnyBoy string inverter';
}

