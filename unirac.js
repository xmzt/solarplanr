//-----------------------------------------------------------------------------------------------------------------------
// RailGroup

class UniracSmRailGroup extends RailGroup {
    static ClasId = ++RailGroupClasId;
    static RailPartV = [ UniracSmRail168, UniracSmRail208, UniracSmRail246 ];
    static SplicePart = UniracSmSplice;
}

//-----------------------------------------------------------------------------------------------------------------------
// Rack

class UniracSmRack extends RackTworail {
    static IdHtml = 'Unirac SM';

    gapX() { return 2.54*0.5; }
    gapY() { return 2.54*0.5; }
    
    mlpePart() { return UniracSmMlpe; }
    
    layoutFin() {
	super.layoutFin();
	this.partTabSub.partAdd(UniracSmFoot, this.footV.length);
	this.partTabSub.partAdd(UniracSmEnd, this.endV.length);
	this.partTabSub.partAdd(UniracSmMid, this.midV.length);
	this.partTabSub.partAdd(UniracSmGroundLug, this.groundLugN);
    }
}
