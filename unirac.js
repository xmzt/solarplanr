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
    
    optMount(partSub) { partSub.partAdd(UniracSmMlpe, 1); }
    
    layoutFin() {
	super.layoutFin();
	this.partSub.partAdd(UniracSmFoot, this.footV.length);
	this.partSub.partAdd(UniracSmEnd, this.endV.length);
	this.partSub.partAdd(UniracSmMid, this.midV.length);
	this.partSub.partAdd(UniracSmGroundLug, this.groundLugN);
    }
}
