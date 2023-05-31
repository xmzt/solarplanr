//include rack.js
//include rail.js
//include partCat.js

//-----------------------------------------------------------------------------------------------------------------------
// RailGroup

class IronRidgeXR10RailGroup extends RailGroup {
    static ClasId = ++RailGroupClasId;
    static RailPartV = [ IronRidgeXR10Rail132, IronRidgeXR10Rail168, IronRidgeXR10Rail204 ];
    static SplicePart = IronRidgeXR10Splice;
}

class IronRidgeXR100RailGroup extends RailGroup {
    static ClasId = ++RailGroupClasId;
    static RailPartV = [ IronRidgeXR100Rail168, IronRidgeXR100Rail204 ];
    static SplicePart = IronRidgeXR100Splice;
}

//-----------------------------------------------------------------------------------------------------------------------
// Rack

const IronRidgeEndTypStopper = 0;
const IronRidgeEndTypCamo = 1;

class IronRidgeXRRack extends RackTworail {
    constructor(partTabSub, roof, endTyp) {
	super(partTabSub, roof);
	this.endTyp = endTyp;
    }
    
    gapX() { return 2.54*0.5; }
    gapY() { return 2.54*0.5; }

    mlpePart() { return IronRidgeMlpe; }

    layoutFin(railGroup) {
	super.layoutFin(railGroup);
	this.partTabSub.partAdd(IronRidgeFoot, this.footV.length);
	this.partTabSub.partAdd(IronRidgeBolt, this.footV.length);
	this.partTabSub.partAdd(IronRidgeUfo, this.midV.length);
	this.partTabSub.partAdd(IronRidgeGroundLug, this.groundLugN);
	switch(this.endTyp) {
	case IronRidgeEndTypStopper:
	    this.partTabSub.partAdd(IronRidgeUfo, this.endV.length);
	    // todo panel-height dependent
	    this.partTabSub.partAdd(IronRidgeStopper38, this.endV.length);
	    break;
	case IronRidgeEndTypCamo:
	    this.partTabSub.partAdd(IronRidgeCamo, this.endV.length);
	    break;
	}
    }
}
