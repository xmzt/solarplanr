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
    static LayoutByIdHtml = { [LayoutNone.idHtml]: LayoutNone };
    
    constructor(sys, id, canElem, canRailElem) {
	super(sys, id, canElem, canRailElem);
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

    sysFin() {
	super.sysFin();
	const f = (a,b) => this.sys.partTab.partAddTot(a,b);

	f(Breaker_HOM260CP, 1);
	f(ConduitBody_1_LB, /*dc*/1 + /*ac*/1);
	f(ConduitBody_1_LL, /*dc*/1 + /*ac*/3);
	f(ConduitBody_1_LR, /*dc*/1);
	f(ConduitNipple_1_2p5, /*dc*/2 + /*ac*/2);
	f(ConduitNipple_1_6, /*ac*/1);
	f(Ctap_Gray, /*dc*/1);
	f(DisconnectGnf222ra, 1);
	f(Emt_1, /*dc*/5);
	f(EmtConnector_1, /*dc*/4 + /*ac*/6);
	f(EmtCoupling_1, /*dc*/1 + /*ac*/1);
	f(Geocel2300, 6);
	f(GroundBushing_1, /*dc*/2 + /*ac*/2);
	f(GroundLug_Al, /*dc*/1 + /*ac*/2);
	f(GroundLug_CuSn, /*dc*/1);
	f(IronRidgeConduitFoot, 2);
	f(Locknut_1, /*dc*/4 + /*ac*/6);
	f(Mc4_F, 6);
	f(Mc4_M, 6);
	f(PaintSprayMatteBlack, 1);
	f(PaintSprayGalvanizing, 1);
	f(Wire_10_pv, 240);
	f(Wire_10_thhn_grn, 30);
	f(Wire_6_bare, 20);
	f(Wire_6_thhn_blk, 20);
	f(Wire_6_thhn_red, 20);
	f(Wire_6_thhn_wht, 20);
	f(Wire_8_thhn_grn, 20);
	f(WireClip, 200);
    }
}

// q.peak 400/270=1.481
// sil360 360/220=1.636 qty 35
// mse380 380/250=1.52
// mse420 420/235=1.787 qty 12
// q.peak 475/275.50=1.724 qty 45
// lg450  450/call qty 65
// sil380 380/254.90=1.49 qty 55
// q480   480/293.00=1.64 qty 37



B_Roof.layoutAdd('Q400', function(rack, roof) {
    const port = PanelQ400.portrait();
    let b = rack.panelBlockRightDn(port, roof.dd.x - 36*2.54, roof.ac.y - 31, 11, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.y0 - rack.panelGapY, 11, 1);
    b = rack.panelBlockLeftDn(port, b.x0, b.y0 - rack.panelGapY, 6, 1);
});
B_Roof.layoutAdd('Sil360', function(rack, roof) {
    const port = PanelSil360.portrait();
    let b0 = rack.panelBlockRightDn(port, roof.dd.x - 36*2.54- 10, roof.ac.y - 31, 12, 1);
    let b = rack.panelBlockRightDn(port, b0.x1, b0.y0 - rack.panelGapY, 11, 1);
    b = rack.panelBlockLeftDn(port, b0.x0, b.y0 - rack.panelGapY, 7, 1);
});
B_Roof.layoutAdd('Q475/Q400', function(rack, roof) {
    let port = PanelQ475.portrait();
    let b0 = rack.panelBlockRightDn(port, roof.dd.x - 36*2.54, roof.dd.y - 31, 5, 1);
    b = rack.panelBlockRightDn(port, b0.x1, b0.y0 - rack.panelGapY, 5, 1);
    
    port = PanelQ400.portrait();
    b = rack.panelBlockRightDn(port, b0.x0 - rack.panelGapX, roof.ac.y - 31, 6, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.y0 - rack.panelGapY, 6, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.y0 - rack.panelGapY, 6, 1);
});
B_Roof.layoutAdd('Q475/Q400 going for it', function(rack, roof) {
    let port = PanelQ475.portrait();
    let b0 = rack.panelBlockRightDn(port, roof.dd.x - 36*2.54, roof.dd.y - 31, 7, 1);
    let b1 = rack.panelBlockRightDn(port, b0.x1, b0.y0 - rack.panelGapY, 7, 1);
    
    port = PanelQ400.portrait();
    b0 = rack.panelBlockRightUp(port, b1.x0 - rack.panelGapX, b1.y0, 4, 1);
    b = rack.panelBlockLeftUp(port, b0.x0, b0.y1 + rack.panelGapY, 4, 1);
    b = rack.panelBlockLeftDn(port, b0.x0, b0.y0 - rack.panelGapY, 6, 1);
});
B_Roof.layoutAdd('Mse380', function(rack, roof) {
    const port = PanelMse380.portrait();
    let b = rack.panelBlockRightDn(port, roof.dd.x - 36*2.54, roof.ac.y - 31, 11, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.y0 - rack.panelGapY, 11, 1);
    b = rack.panelBlockLeftDn(port, b.x0, b.y0 - rack.panelGapY, 6, 1);
});
B_Roof.layoutAdd('Mse380/Mse420', function(rack, roof) {
    let port = PanelMse420.portrait();
    let b0 = rack.panelBlockRightDn(port, roof.dd.x - 36*2.54, roof.dd.y - 31, 5, 1);
    b = rack.panelBlockRightDn(port, b0.x1, b0.y0 - rack.panelGapY, 5, 1);
    
    port = PanelMse380.portrait();
    b = rack.panelBlockRightDn(port, b0.x0 - rack.panelGapX, roof.ac.y - 31, 6, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.y0 - rack.panelGapY, 6, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.y0 - rack.panelGapY, 6, 1);
});
B_Roof.layoutAdd('Boviet370 specified clamp', function(rack, roof) {
    const port = PanelBoviet370.portrait();
    let b = rack.panelBlockRightDn(port, roof.dd.x - 36*2.54, roof.ac.y - 37, 11, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.y0 - rack.panelGapY, 11, 1);
    b = rack.panelBlockLeftDn(port, b.x0, b.y0 - rack.panelGapY, 6, 1);
});
B_Roof.layoutAdd('Boviet370 liberal clamp zone', function(rack, roof) {
    const port = PanelBoviet370_libclamp.portrait();
    let b = rack.panelBlockRightDn(port, roof.dd.x - 36*2.54, roof.ac.y - 37, 11, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.y0 - rack.panelGapY, 11, 1);
    b = rack.panelBlockLeftDn(port, b.x0, b.y0 - rack.panelGapY, 6, 1);
});
B_Roof.layoutAdd('Rec370', function(rack, roof) {
    const port = PanelRec370.portrait();
    let b = rack.panelBlockRightDn(port, roof.dd.x - 36*2.54, roof.ac.y - 31, 11, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.y0 - rack.panelGapY, 11, 1);
    b = rack.panelBlockLeftDn(port, b.x0, b.y0 - rack.panelGapY, 6, 1);
});
B_Roof.layoutAdd('Seg400/Ureco400', function(rack, roof) {
    const port = PanelSeg400.portrait();
    let b = rack.panelBlockRightDn(port, roof.dd.x - 36*2.54, roof.ac.y - 37, 10, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.y0 - rack.panelGapY, 10, 1);
    b = rack.panelBlockLeftDn(port, roof.aa.x + 20, b.y0 - rack.panelGapY, 6, 1);
});
B_Roof.layoutAdd('Seg400/Ureco400 landscape,stagger', function(rack, roof) {
    const port = PanelSeg400.portrait();
    const land = PanelSeg400.landscape();

    let b = rack.panelBlockLeftDn(land, roof.ac.x + 5, roof.ac.y - 32, 4, 2);
    b = rack.panelBlockRightDn(land, b.x1, b.y0 - rack.panelGapY, 3, 1);
    b = rack.panelBlockRightDn(land, b.x1, b.y0 - rack.panelGapY, 4, 2);
    
    b = rack.panelBlockLeftDn(land, b.x1 + rack.panelGapX, roof.bd.y - 32, 1, 4);
    b = rack.panelBlockLeftDn(land, b.x1 + rack.panelGapX, b.y1, 1, 3);
    b = rack.panelBlockLeftDn(land, b.x1 + rack.panelGapX, b.y1, 1, 4);
});
B_Roof.layoutAdd('Rec405AA Portrait', function(rack, roof) {
    const port = PanelRec405AA.portrait();
    const b0 = rack.panelBlockLeftDn(port, roof.vent0.x1 + 5, roof.ac.y - 32, 11, 1);
    let b = rack.panelBlockLeftDn(port, b0.x0, b0.y0 - rack.panelGapY, 11, 1);
    b = rack.panelBlockLeftDn(port, b.x0, b.y0 - rack.panelGapY, 6, 1);
});
B_Roof.layoutAdd('Rec405AA Portrait 2', function(rack, roof) {
    const port = PanelRec405AA.portrait();
    const b0 = rack.panelBlockLeftDn(port, roof.ac.x + 0, roof.ac.y - 32, 12, 1);
    let b = rack.panelBlockLeftDn(port, rack.panelV[1].x0, b0.y0 - rack.panelGapY, 11, 1);
    b = rack.panelBlockLeftDn(port, b0.x0, b.y0 - rack.panelGapY, 7, 1);
});
