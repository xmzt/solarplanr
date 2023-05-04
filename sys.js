//include base.js
//include geom.js 
//include partCat.js
//include rail.js
//include rack.js
//include roof.js

//-----------------------------------------------------------------------------------------------------------------------
// Sys: multiple roofs and railGroups, parts table

class Sys {
    constructor() {
	const root = this.root = temRootClone('sys_tem');
	this.roofV = [];
	this.roofDiv = root.querySelector('._roofDiv');
	this.partTab = new PartTab(root.querySelector('._partTabHeadTr'), root.querySelector('._partTabTotTr'));
	this.pendN = 0;
	this.totWatts = 0;
	this.totWattsElem = root.querySelector('._totWatts');
	this.totDpwElem = root.querySelector('._totDpw');
	this.railGroupByClasId = {};
	this.railGroupStatusDiv = root.querySelector('._railGroupStatusDiv');
	this.railGroupLogDiv = root.querySelector('._railGroupLogDiv');
    }
    
    pendDec() {
	if(0 == --this.pendN) {
	    this.partTab.totTr.classList.remove('pend');
	    this.totDpwElem.textContent = (this.partTab.totRow.totCell.cost / this.totWatts).toFixed(3);
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
	    this.railGroupByClasId[k].railrReq();
	}

	this.totWattsElem.textContent = this.totWatts;
    }
}
