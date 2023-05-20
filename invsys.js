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

    panelAdd(panelR, roof) {}

    sysFin() {}
}

class InvsysNone extends Invsys {
    static IdHtml = '--Select inverter system--';
}

class InvsysSolarEdge extends Invsys {
    static IdHtml = 'SolarEdge (optimizers)';
    
    panelAdd(panelR, rack) {
	rack.roof.partAdd(SolarEdgeP485, 1);
	rack.partAddMlpe(1);
    }

    sysFin() {
	this.sys.partTab.partAddTot(SolarEdgeSe11400h_us000bni4, 1);
	this.sys.partTab.partAddTot(ScrewSs, 6);
	this.sys.partTab.partAddTot(WasherSs, 6);
	this.sys.partTab.partAddTot(SolarEdgeCt225, 2);
    }
}

class InvsysEnphase extends Invsys {
    static IdHtml = 'Enphase (microinverters)';
}

class InvsysSunnyBoy extends Invsys {
    static IdHtml = 'SunnyBoy string inverter';
}

