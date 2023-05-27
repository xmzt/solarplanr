//include base.js
//include geom.js 
//include partCat.js

//-----------------------------------------------------------------------------------------------------------------------
// Invsys: abstract base class. represents an inverter system

class Invsys {
    //static IdHtml

    constructor(sys) {
	this.sys = sys;
    }

    panelAdd(part, roof) {}

    sysFin() {}
}

class InvsysNone extends Invsys {
    static IdHtml = '--Inverter system--';
}

class InvsysSolarEdge extends Invsys {
    static IdHtml = 'SolarEdge (optimizers)';
    
    sysFin() {
	this.sys.partTab.partAdd(SolarEdgeSe11400h_us000bni4, 1, -1);
	this.sys.partTab.partAdd(SolarEdgeCt225, 2, -1);
	this.sys.partTab.partAdd(ScrewSs, 6, -1);
	this.sys.partTab.partAdd(WasherSs, 6, -1);
	
	let panelN = 0;
	for(const [id,panelV] of Object.entries(this.sys.solarEdgeStringById)) {
	    for(const panel of panelV) {
		this.sys.partTab.partAdd(panel.optPart, 1, -1);
		panel.rack.partAddMlpe(1);
		++panelN;
	    }
	}
	if(panelN != this.sys.partTab.totPanelN)
	    this.sys.partTab.statusErr(`invsys.panelN=${panelN} != sys.panelN=${this.sys.partTab.totPanelN}`);
    }
}

class InvsysEnphase extends Invsys {
    static IdHtml = 'Enphase (microinverters)';
}

class InvsysSunnyBoy extends Invsys {
    static IdHtml = 'SunnyBoy string inverter';
}

