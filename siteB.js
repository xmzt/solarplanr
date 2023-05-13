//include sys.js
//
// PVWatts.nrel.gov
//
// Enphase IQ8PLUS-72-M-US  290W $189.00 1.39 11.205
// Enphase IQ8M-72-M-US     325W $209.50 1.24 11.189
// Enphase IQ8A-72-M-US     349W $223.00 1.16 11.177
// Enphase IQ8H-240-72-M-US 380W $242.00

// 01 0.97284
// 07 0.992556


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
	new Layout('Seg400/Ureco400 landscape,stagger', function(rack, roof) {
	    const port = PanelSeg400.portrait();
	    const land = PanelSeg400.landscape();

	    let b = rack.panelBlockLeftDn(land, roof.ac.x + 5, roof.ac.y - 32, 4, 2);
	    b = rack.panelBlockRightDn(land, b.x1, b.y0 - rack.panelGapY, 3, 1);
	    b = rack.panelBlockRightDn(land, b.x1, b.y0 - rack.panelGapY, 4, 2);
	    
	    b = rack.panelBlockLeftDn(land, b.x1 + rack.panelGapX, roof.bd.y - 32, 1, 4);
	    b = rack.panelBlockLeftDn(land, b.x1 + rack.panelGapX, b.y1, 1, 3);
	    b = rack.panelBlockLeftDn(land, b.x1 + rack.panelGapX, b.y1, 1, 4);
	}),
	new Layout('Seg400/Ureco400', function(rack, roof) {
	    const port = PanelSeg400.portrait();
	    let b = rack.panelBlockRightDn(port, roof.dd.x - 36*2.54, roof.ac.y - 31, 10, 1);
	    b = rack.panelBlockRightDn(port, b.x1, b.y0 - rack.panelGapY, 10, 1);
	    b = rack.panelBlockLeftDn(port, roof.aa.x + 20, b.y0 - rack.panelGapY, 6, 1);
	}),
	new Layout('Rec370', function(rack, roof) {
	    const port = PanelRec370.portrait();
	    let b = rack.panelBlockRightDn(port, roof.dd.x - 36*2.54, roof.ac.y - 31, 11, 1);
	    b = rack.panelBlockRightDn(port, b.x1, b.y0 - rack.panelGapY, 11, 1);
	    b = rack.panelBlockLeftDn(port, b.x0, b.y0 - rack.panelGapY, 6, 1);
	}),
	new Layout('Boviet370', function(rack, roof) {
	    const port = PanelBoviet370.portrait();
	    let b = rack.panelBlockRightDn(port, roof.dd.x - 36*2.54, roof.ac.y - 36, 11, 1);
	    b = rack.panelBlockRightDn(port, b.x1, b.y0 - rack.panelGapY, 11, 1);
	    b = rack.panelBlockLeftDn(port, b.x0, b.y0 - rack.panelGapY, 6, 1);
	}),
	new Layout('Rec405AA Portrait', function(rack, roof) {
	    const port = PanelRec405AA.portrait();
	    const b0 = rack.panelBlockLeftDn(port, roof.vent0.x1 + 5, roof.ac.y - 32, 11, 1);
	    let b = rack.panelBlockLeftDn(port, b0.x0, b0.y0 - rack.panelGapY, 11, 1);
	    b = rack.panelBlockLeftDn(port, b.x0, b.y0 - rack.panelGapY, 6, 1);
	}),
	new Layout('Rec405AA Portrait 2', function(rack, roof) {
	    const port = PanelRec405AA.portrait();
	    const b0 = rack.panelBlockLeftDn(port, roof.ac.x + 0, roof.ac.y - 32, 12, 1);
	    let b = rack.panelBlockLeftDn(port, rack.panelV[1].x0, b0.y0 - rack.panelGapY, 11, 1);
	    b = rack.panelBlockLeftDn(port, b0.x0, b.y0 - rack.panelGapY, 7, 1);
	}),
    ];
}

RoofClasV.push(B_Roof);
