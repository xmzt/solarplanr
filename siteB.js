//include sys.js

class B_Roof extends Roof {
    static IdHtml = 'SiteB_Roof';
    
    constructor(sys, id, descHtml) {
	super(sys, id, descHtml);
	this.bpVSet([
	    this.aa = new P2(0,0),
	    this.ac = this.aa.addY(242 * 2.54), // n side, eave to ridge, 242"
	    this.bc = this.ac.addX(161 * 2.54), // ridge, drop to n side, 161" 
	    this.bd = this.bc.addY(20 * 2.54), // drop, 20"
	    this.dd = this.bd.addX(360 * 2.54), // ridge, s side to drop, 360"
	    this.db = this.dd.addY(-201 * 2.54), // s side, eave to ridge, 201"
	    this.cb = this.db.addX(-236 * 2.54), // eave, s side to hike, 236"
	    this.ca = this.cb.addY(-62 * 2.54), // hike, 62"
	    this.aa1 = this.ca.addX(-282.5 * 2.54), // eave, hike to n side, 282.5"
	]);
	this.edgeV = l2VFromP2V(this.bpV);
	this.edgePathV = edgePathVCwClose(this.edgeV);

	this.rafterV = [];
	for(let x = this.aa.x + 6; x <= this.cb.x; x += 16 * 2.54) {
	    this.rafterV.push(new L2(x, this.aa.y, x, this.dd.y));
	}
	for(let x = this.dd.x - 6; x > this.cb.x; x -= 16 * 2.54) {
	    this.rafterV.push(new L2(x, this.aa.y, x, this.dd.y));
	}

	this.fireWalkV = [
	    new R2(this.db.x - FireWalkWidth, this.db.y, this.dd.x, this.dd.y),
	];
	
	this.pipeV = [ new C2((this.cb.x + this.db.x)/2, this.db.y + 30, 5/2.0) ];

	let x = this.aa.x + 30;
	let y = (this.aa.y + this.ac.y)/2;
	this.vent0 = new R2(x, y, x + 31, y + 31);
	x = this.vent0.x1 + 39 * 30.48;
 	this.ventV = [ this.vent0, new R2(x, y, x + 31, y + 31) ];
    }

    //------------------------------------------------------------------------------------------------------------------
    // Layouts
    //-------------------------------------------------------------------------------------------------------------------

    static LayoutV = [
	new Layout('Rec405AA Portrait', function(rack, roof) {
	    const orient = PanelRec405AA.portrait();
	    const b0 = rack.panelBlockLeftDn(orient, roof.vent0.x1 + 5, roof.ac.y - 32, 11, 1);
	    let b = rack.panelBlockLeftDn(orient, b0.x0, b0.y0 - rack.panelGapY, 11, 1);
	    b = rack.panelBlockLeftDn(orient, b.x0, b.y0 - rack.panelGapY, 6, 1);
	}),
	new Layout('Rec405AA Portrait 2', function(rack, roof) {
	    const orient = PanelRec405AA.portrait();
	    const b0 = rack.panelBlockLeftDn(orient, roof.ac.x + 0, roof.ac.y - 32, 12, 1);
	    let b = rack.panelBlockLeftDn(orient, rack.panelV[1].x0, b0.y0 - rack.panelGapY, 11, 1);
	    b = rack.panelBlockLeftDn(orient, b0.x0, b.y0 - rack.panelGapY, 7, 1);
	}),
	new Layout('Silfab360 portrait', function(rack, roof) {
	    const orient = PanelSil360.portrait();
	    const b0 = rack.panelBlockLeftDn(orient, roof.ac.x + 10, roof.ac.y - 32, 7, 1);
	    let b = rack.panelBlockLeftDn(orient, rack.panelV[1].x0, b0.y0 - rack.panelGapY, 6, 1);
	    b = rack.panelBlockLeftDn(orient, b0.x0, b.y0 - rack.panelGapY, 7, 1);
	    b = rack.panelBlockLeftDn(orient, b.x1 + rack.panelGapX, roof.bd.y - 50, 5, 1);
	    b = rack.panelBlockLeftDn(orient, b.x0, b.y0 - rack.panelGapY, 5, 1);
	}),
	new Layout('Silfab360 pack-em-in', function(rack, roof) {
	    const port = PanelSil360.portrait();
	    const land = PanelSil360.landscape();
	    let b0 = rack.panelBlockLeftDn(port, roof.ac.x + 5, roof.ac.y - 32, 7, 1);
	    let b = rack.panelBlockLeftDn(port, rack.panelV[1].x0, b0.y0 - rack.panelGapY, 6, 1);
	    b = rack.panelBlockLeftDn(port, b0.x0, b.y0 - rack.panelGapY, 7, 1);
	    
	    b = rack.panelBlockLeftDn(port, b.x1 + rack.panelGapX, roof.bd.y - 32, 5, 1);
	    b0 = rack.panelBlockLeftDn(port, b.x0, b.y0 - rack.panelGapY, 5, 1);
	    b = rack.panelBlockLeftDn(land, b0.x0, b0.y0 - rack.panelGapY, 1, 1);
	    b = rack.panelBlockRightDn(land, b0.x1, b0.y0 - rack.panelGapY, 1, 1);
	}),
    ];
}

RoofClasV.push(B_Roof);
