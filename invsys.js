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

    constructor(partTabSub, invId) {
	this.partTabSub = partTabSub;
	this.invId = invId;
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

class SolarEdgeInvsysString extends InvsysString {
    desBox(modPartQtyD, optPartQtyD) {
	const panelQtyD = {};
	for(const panel of this.panelV) {
	    const k = `${panel.orient.part.nick},${panel.optPart.nick}`;
	    const panelQty = panelQtyD[k] ??= [ panel, 0 ];
	    ++panelQty[1];
	    const modPartQty = modPartQtyD[panel.orient.part.id] ??= { part:panel.orient.part, qty:0 };
	    ++modPartQty.qty;
	    const optPartQty = optPartQtyD[panel.optPart.id] ??= { part:panel.optPart, qty:0 };
	    ++optPartQty.qty;
	}

	const box = eleNuClas('div', 'desBox');
	eleNuAdd('div', box).innerHTML = this.id;
	const tab = eleNuClasAdd('table', 'desBoxTab', box);
	let tr = tab.createTHead().insertRow(-1);
	tr.insertCell(-1).textContent = 'Quantity';
	tr.insertCell(-1).textContent = 'Module';
	tr.insertCell(-1).textContent = 'Optimizer';
	const tbody = tab.createTBody();
	for(const [panel,qty] of Object.values(panelQtyD)) {
	    tr = tbody.insertRow(-1);
	    tr.insertCell(-1).textContent = qty;
	    tr.insertCell(-1).textContent = panel.orient.part.nick;
	    tr.insertCell(-1).textContent = panel.optPart.nick;
	}
	return box;
    }
}
    
class SolarEdgeInvsys extends Invsys {
    static IdHtml = 'SolarEdge (optimizers)';

    constructor(partTabSub, invId, attachPart) {
	super(partTabSub, invId);
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
	const string = new SolarEdgeInvsysString(id);
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

