//include base.js
//include geom.js 
//include partCat.js
//include rail.js
//include rack.js
//include roof.js

//-----------------------------------------------------------------------------------------------------------------------
// Sys: multiple roofs and railGroups, parts table

class SysPartTab extends PartTab {
    constructor(root) {
	super(root);
	this.pendN = 0;
	this.totPanelN = 0;
	this.totWatts = 0;
	this.totWattsElem = this.totTr.querySelector('._totWatts');
	this.totDpwElem = this.totTr.querySelector('._totDpw');
	this.totStatusElem = this.totTr.querySelector('._totStatus');
    }

    dpwUpdate() {
	if(this.totWatts) {
	    this.totWattsElem.textContent = this.totWatts;
	    this.totDpwElem.textContent = (this.totRow.totCost / this.totWatts).toFixed(3);
	}
    }
    
    partAdd(part, n, subI) {
	super.partAdd(part, n, subI);
	this.dpwUpdate();
    }

    partAddPanel(part, n, subI) {
	this.totPanelN += n;
	this.totWatts += n * part.watts;
	super.partAdd(part, n, subI);
    }

    pendInc() {
	if(0 == this.pendN++)
	    this.totTr.classList.add('pend');
    }
    
    pendDec() {
	if(0 == --this.pendN)
	    this.totTr.classList.remove('pend');
    }

    statusErr(msgHtml) {
	eleNuClasAdd('div', 'err', this.totStatusElem).innerHTML = msgHtml;
    }
}

class Sys {
    constructor(partTab, railGroupDiagVElem) {
	this.partTab = partTab;
	this.railGroupDiagVElem = railGroupDiagVElem;
	this.invsysByClasId = {};
	this.roofV = [];
	this.rackV = [];
	this.jboxP = 0;
	this.railGroupByClasId = {};
	this.railWkrCtrl = new RailWkrCtrl();
	this.panelN = 0;
	this.solarEdgeStringById = {};
    }
    
    ctxRailClear() {
	for(const roof of this.roofV)
	    roof.ctxClear(roof.ctxRail);
    }

    invsysGetOrNew(clas) {
	return this.invsysByClasId[clas.ClasId] ??= new clas(this);
    }

    jboxSet(x) {
	this.jboxP = x;
    }

    rackAdd(rack) {
	this.rackV.push(rack);
    }

    railGroupGetOrNew(clas) {
	return this.railGroupByClasId[clas.ClasId] ??= this.railGroupAdd(new clas(this));
    }

    railGroupAdd(railGroup) {
	this.railGroupDiagVElem.appendChild(railGroup.diagElem);
	return railGroup;
    }

    roofAdd(roof) {
	this.roofV.push(roof);
	roof.partTabSubI = this.partTab.subAdd(roof.id);
    }

    solarEdgeStringGetOrNu(id) {
	return this.solarEdgeStringById[id] ??= [];
    }

    sysFin() {
	for(const roof of this.roofV)
	    roof.sysFin();
	for(const rack of this.rackV)
	    rack.sysFin();
	for(const k in this.railGroupByClasId) {
	    this.partTab.pendInc();
	    this.railGroupByClasId[k].railWkrReq();
	}
	for(const k in this.invsysByClasId)
	    this.invsysByClasId[k].sysFin();
    }

    terminate() {
	this.railWkrCtrl.terminate();
	for(const roof of this.roofV)
	    roof.ctxClearAll();
    }
}

class SysPlaceholder {
    terminate() {}
}
