//include base.js
//include geom.js 
//include partCat.js
//include rail.js
//include rack.js
//include roof.js

//-----------------------------------------------------------------------------------------------------------------------
// Sys: multiple roofs and railGroups, parts table

class SysPlaceholder {
    constructor(root) {
	this.root = root;
    }
    
    terminate() {}
}

class SysPartTab extends PartTab {
    constructor(headTr, totTr, sys) {
	super(headTr, totTr);
	this.sys = sys;
    }

    dpwUpdate() {
	if(this.sys.totWatts)
	    this.sys.totDpwElem.textContent = (this.totRow.totCell.cost / this.sys.totWatts).toFixed(3);
    }
    
    partAddCol(part, n, colI) {
	super.partAddCol(part, n, colI);
	this.dpwUpdate();
    }

    partAddColWatts(part, n, colI, watts) {
	super.partAddCol(part, n, colI);
	this.sys.totWatts += watts;
	this.dpwUpdate();
    }
    partAddTot(part, n) {
	super.partAddTot(part, n);
	this.dpwUpdate();
    }
}

class Sys {
    constructor() {
	const root = this.root = temRootClone('sys_tem');
	this.roofV = [];
	this.roofDiv = root.querySelector('._roofDiv');
	this.partTab = new SysPartTab(root.querySelector('._partTabHeadTr'), root.querySelector('._partTabTotTr'), this);
	this.pendN = 0;
	this.totWatts = 0;
	this.totWattsElem = root.querySelector('._totWatts');
	this.totDpwElem = root.querySelector('._totDpw');
	this.railGroupByClasId = {};
	this.railGroupStatusDiv = root.querySelector('._railGroupStatusDiv');
	this.railGroupLogDiv = root.querySelector('._railGroupLogDiv');
	this.railWkrCtrl = new RailWkrCtrl();
    }
    
    ctxRailClear() {
	for(const roof of this.roofV)
	    roof.ctxRailClear();
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
	this.railGroupStatusDiv.appendChild(railGroup.statusDiv);
	this.railGroupLogDiv.appendChild(railGroup.logDiv);
	return railGroup;
    }

    roofAdd(roof) {
	this.roofV.push(roof);
	roof.partTabColI = this.partTab.colAdd(roof.id);
    }
	    
    sysFin() {
	for(const roof of this.roofV)
	    roof.roofFin();

	for(const k in this.railGroupByClasId) {
	    if(0 == this.pendN++) this.partTab.totTr.classList.add('pend');
	    this.railGroupByClasId[k].railWkrReq();
	}

	this.totWattsElem.textContent = this.totWatts;
    }

    terminate() {
	this.railWkrCtrl.terminate();
    }
}
