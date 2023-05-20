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
	this.totWatts = 0;
	this.totWattsElem = this.totTr.querySelector('._totWatts');
	this.totDpwElem = this.totTr.querySelector('._totDpw');
    }

    dpwUpdate() {
	if(this.totWatts) {
	    this.totWattsElem.textContent = this.totWatts;
	    this.totDpwElem.textContent = (this.totRow.totCell.cost / this.totWatts).toFixed(3);
	}
    }
    
    partAddCol(part, n, colI) {
	super.partAddCol(part, n, colI);
	this.dpwUpdate();
    }

    partAddColWatts(part, n, colI, watts) {
	super.partAddCol(part, n, colI);
	this.totWatts += watts;
	this.dpwUpdate();
    }
    partAddTot(part, n) {
	super.partAddTot(part, n);
	this.dpwUpdate();
    }
}

class Sys {
    constructor(partTab, railGroupDiagVElem) {
	this.partTab = partTab;
	this.railGroupDiagVElem = railGroupDiagVElem;
	this.invsys = null;
	this.roofV = [];
	this.pendN = 0;
	this.railGroupByClasId = {};
	this.railWkrCtrl = new RailWkrCtrl();
    }
    
    ctxRailClear() {
	for(const roof of this.roofV)
	    roof.ctxClear(roof.ctxRail);
    }

    invsysSet(invsys) {
	this.invsys = invsys;
    }
    
    pendDec() {
	if(0 == --this.pendN) {
	    this.partTab.totTr.classList.remove('pend');
	}
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
	roof.partTabColI = this.partTab.colAdd(roof.id);
    }
	    
    sysFin() {
	for(const roof of this.roofV)
	    roof.sysFin();

	for(const k in this.railGroupByClasId) {
	    if(0 == this.pendN++) this.partTab.totTr.classList.add('pend');
	    this.railGroupByClasId[k].railWkrReq();
	}

	this.invsys.sysFin();
    }

    terminate() {
	this.railWkrCtrl.terminate();
    }
}

class SysPlaceholder {
    terminate() {}
}
