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


class SiteB_Roof extends Roof {
    static IdHtml = 'SiteB_Roof';
    static LayoutFunByIdHtml = {
	'--Panel layout--': function(rack, roof) {},
	'Q475/Q400': function(rack, roof) {
	    const q475 = PanelQ475.portrait();
	    const q400 = PanelQ400.portrait();
	    const a = rack.panelBlockRightDn(q475, roof.fireWalk.x0, roof.dd.y - 36.5, 8, 1);
	    const b = rack.panelBlockRightDn(q475, a.x1, a.gapD(), 8, 1);
	    const c = rack.panelBlockRightUp(q400, b.gapL(), b.y0, 3, 1);
	    const d = rack.panelBlockRightUp(q400, c.x1, c.gapU(), 3, 1);
	    const e = rack.panelBlockLeftDn(q400, d.x0 - (q475.part.dimS + rack.constructor.GapX)/2, c.gapD(), 6, 1);
	    
	    {
		const string1 = roof.sys.solarEdgeStringGetOrNu('1');
		const string2 = roof.sys.solarEdgeStringGetOrNu('2');
		const string3 = roof.sys.solarEdgeStringGetOrNu('3');
		let i = 0;
		for( ; i < 8; i++) string1.push(rack.panelV[i].optSet(SolarEdgeS500));
		for( ; i < 16; i++) string2.push(rack.panelV[i].optSet(SolarEdgeS500));
		for( ; i < 17; i++) string2.push(rack.panelV[i].optSet(SolarEdgeS500));
		for( ; i < 19; i++) string3.push(rack.panelV[i].optSet(SolarEdgeP400));
		for( ; i < 20; i++) string1.push(rack.panelV[i].optSet(SolarEdgeS500));
		for( ; i < rack.panelV.length; i++) string3.push(rack.panelV[i].optSet(SolarEdgeP400));
	    }
	},
	'Q400': function(rack, roof) {
	    const port = PanelQ400.portrait();
	    let b = rack.panelBlockRightDn(port, roof.fireWalk.x0, roof.dd.y - 31, 6, 1);
	    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 6, 1);
	    b = rack.panelBlockRightDn(port, b.gapL(), roof.ac.y - 32, 6, 1);
	    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 5, 1);
	    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 6, 1);
	},
	'Sil360': function(rack, roof) {
	    const port = PanelSil360.portrait();
	    let b = rack.panelBlockLeftDn(port, 5, roof.ac.y - 31, 7, 1);
	    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 6, 1);
	    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 7, 1);
	    b = rack.panelBlockLeftDn(port, b.gapR(), roof.dd.y - 31, 5, 1);
	    b = rack.panelBlockLeftDn(port, b.x0, b.gapD(), 5, 1);
	},
	'Mse380': function(rack, roof) {
	    const port = PanelMse380.portrait();
	    let b = rack.panelBlockRightDn(port, roof.fireWalk.x0, roof.ac.y - 31, 11, 1);
	    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 11, 1);
	    b = rack.panelBlockLeftDn(port, b.x0, b.gapD(), 6, 1);
	},
	'Mse380/Mse420': function(rack, roof) {
	    let port = PanelMse420.portrait();
	    let b0 = rack.panelBlockRightDn(port, roof.fireWalk.x0, roof.dd.y - 31, 5, 1);
	    let b = rack.panelBlockRightDn(port, b0.x1, b0.gapD(), 5, 1);
	    
	    port = PanelMse380.portrait();
	    b = rack.panelBlockRightDn(port, b0.gapL(), roof.ac.y - 31, 6, 1);
	    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 6, 1);
	    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 6, 1);
	},
	'Boviet370 specified clamp': function(rack, roof) {
	    const port = PanelBoviet370.portrait();
	    let b = rack.panelBlockRightDn(port, roof.fireWalk.x0, roof.ac.y - 37, 11, 1);
	    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 11, 1);
	    b = rack.panelBlockLeftDn(port, 40, b.gapD(), 6, 1);
	},
	'Boviet370 liberal clamp zone': function(rack, roof) {
	    const port = PanelBoviet370_libclamp.portrait();
	    let b = rack.panelBlockRightDn(port, roof.fireWalk.x0, roof.ac.y - 37, 11, 1);
	    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 11, 1);
	    b = rack.panelBlockLeftDn(port, 40, b.gapD(), 6, 1);
	},
	'Rec370': function(rack, roof) {
	    const port = PanelRec370.portrait();
	    let b0 = rack.panelBlockRightDn(port, roof.fireWalk.x0, roof.ac.y - 31, 12, 1);
	    let b = rack.panelBlockRightDn(port, b0.x1, b0.gapD(), 11, 1);
	    b = rack.panelBlockLeftDn(port, b0.x0, b.gapD(), 6, 1);
	},
	'Seg400/Ureco400': function(rack, roof) {
	    const port = PanelSeg400.portrait();
	    let b0 = rack.panelBlockRightDn(port, roof.fireWalk.x0, roof.ac.y - 37, 11, 1);
	    let b = rack.panelBlockRightDn(port, b0.x1, b0.gapD(), 10, 1);
	    b = rack.panelBlockLeftDn(port, b0.x0, b.gapD(), 6, 1);
	},
	'Seg400/Ureco400 landscape,stagger': function(rack, roof) {
	    const port = PanelSeg400.portrait();
	    const land = PanelSeg400.landscape();
	    
	    let b = rack.panelBlockLeftDn(land, roof.ac.x + 5, roof.ac.y - 32, 4, 2);
	    b = rack.panelBlockRightDn(land, b.x1, b.gapD(), 3, 1);
	    b = rack.panelBlockRightDn(land, b.x1, b.gapD(), 4, 2);
	    
	    b = rack.panelBlockLeftDn(land, b.gapR(), roof.bd.y - 32, 1, 4);
	    b = rack.panelBlockLeftDn(land, b.gapR(), b.y1, 1, 3);
	    b = rack.panelBlockLeftDn(land, b.gapR(), b.y1, 1, 4);
	},
	'Rec405AA Portrait': function(rack, roof) {
	    const port = PanelRec405AA.portrait();
	    let b = rack.panelBlockLeftDn(port, 0, roof.ac.y - 32, 7, 1);
	    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 6, 1);
	    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 7, 1);
	    b = rack.panelBlockLeftDn(port, b.gapR(), roof.dd.y - 32, 5, 1);
	    b = rack.panelBlockLeftDn(port, b.x0, b.gapD(), 5, 1);
	},
    };
    
    constructor(sys, id, canElem, canRailElem) {
	super(sys, id, canElem, canRailElem);
	// fireWalkX = 1268.5 = 1357.94 + 2 - 2.54*36
	// rakeR = 1373.2 = 1268.5 + 104.7
	this.bpVSet([
	    this.aa = new P2(0,0),
	    this.ac = new P2(0, 627.0), // nick: 614.68
	    this.bc = new P2(408.94, 627.0), // todo remeasure, using nick
	    this.bd = new P2(408.94, 674.5), // +47.5, nick=+50.8
	    this.dd = new P2(1373.2, 674.5), // nick=1323.34,665.48
	    this.db = new P2(1373.2, 157.0), // nick=1323.34,157.48
	    this.cb = new P2(717.55, 157.0), // todo remeasure, using nick
	    this.ca = new P2(717.55, 0),
	    this.aa,
	]);
	this.edgeV = l2VFromP2V(this.bpV);
	this.edgePathV = edgePathVCwClose(this.edgeV);

	// rafters: measured from left side of each rafter
	// 0 43.2 84.8 125.8 166.2 206.7 247.7 288.7 331.7 373.2 417.0 449.5 490.5 530.3 571.7
	// 41.2 82.3 119.7 166.7 207.0 247.5 288.8 329.0 369.4 410.5 450.4 491.2
	// 41.2 81.0 121.7 162.5 203.5 243.5 281.1
	// offset from rake to center to rafter0: 13.94 = (1378.0 - 109.5) - (1344.0 + 4 - 2.54*36) + 2
	this.rafterV = [ 13.9400,   57.14,   98.74,  139.74,  180.14,  220.64,  261.64,  302.64,
			 345.640,  387.14,  430.94,  463.44,  504.44,  544.24,  585.64,  626.84,
			 667.940,  705.34,  752.34,  792.64,  833.14,  874.44,  914.64,  955.04,
			 996.140, 1036.04, 1076.84, 1118.04, 1157.84, 1198.54, 1239.34, 1280.34,
			 1320.34, 1357.94 ].map(x => new L2(x, this.aa.y, x, this.dd.y));

	let x = (this.rafterV[1].x0 + this.rafterV[2].x0 + 0.5 - 31.0)/2;
	this.vent0 = new R2(x, 309.0, x + 31.0, 340.0);
	x = (this.rafterV[31].x0 + this.rafterV[32].x0 - 0.5 - 31.0)/2;
	let y = this.db.y + 181.3;
	this.vent1 = new R2(x, y - 31.0, x + 31, y);
	this.ventV = [ this.vent0, this.vent1 ];

	x = this.rafterV[33].x0 + 2.0;
	this.fireWalkV = [ this.fireWalk = new R2(x - 2.54*36, this.db.y, x, this.dd.y) ];
	
	this.pipeV = [ new C2(this.db.x - 465.0, this.db.y + 69.0, 5/2.0) ];
    }

    old() {
	this.bpVSet([
	    this.aa = new P2(0,0),
	    this.ac = this.aa.addY(242 * 2.54), // n side, eave to ridge, 242"
	    xthis.bc = this.ac.addX(161 * 2.54), // ridge, drop to n side, 161" 
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
	const f = (a,b) => this.sys.partTab.partAdd(a, b, -1);

	// array to jbox/conduit
	f(WireClip, 200);
	f(Wire_pv_10, 2*30 + 2*10 + 2*5);
	f(Wire_bare_6, 10);
	f(Mc4_F, 6);
	f(Mc4_M, 6);

	// array to inverter
	if(this.sys.jboxP) {
	    f(Jbox_IronRidge, 1);
	    f(IronRidgeMlpe, 2);
	    f(JboxDinRail, 1);
	    f(JboxMasthead, 1);
	    f(JboxTerminal_10_feed, 6);
	    f(JboxTerminal_10_gnd, 1);
	    f(JboxTerminalEnd, 1);
	    f(Ctap_Gray, 1);
	    f(GroundLug_Al, 1);
	    f(GroundBushing_34, 1);
	    f(EmtConnector_34, 1);
	    f(Emt_34, 5);
	    f(ConduitFoot_IronRidge, 2);
	    f(EmtConnector_34, 1);
	    f(ConduitBody_34_LB, 1);
	    f(EmtConnector_34, 1);
	    f(Emt_34, 15);
	    f(EmtCoupling_34, 1);
	    f(ConduitStrap_34, 3);
	    f(EmtConnector_34, 1);
	    f(ConduitBody_34_LR, 1);
	    f(Locknut_34, 1);
	    f(ConduitNipple_34_2, 1);
	    f(Locknut_34, 1);
	    f(ConduitBody_34_LL, 1);
	    f(Locknut_34, 1);
	    f(ConduitNipple_34_2, 1);
	    f(Locknut_34, 1);
	    f(GroundBushing_34, 1);
	    f(GroundLug_Al, 1);
	    f(Wire_thhn_10_blk, 3*24);
	    f(Wire_thhn_10_red, 3*24);
	    f(Wire_thhn_10_grn, 24);
	    f(Wire_bare_6, 2);
	}
	else {
	    f(GroundLug_CuSn, 1);
	    f(GroundBushing_1, 1);
	    f(EmtConnector_1, 1);
	    f(Emt_1, 5);
	    f(ConduitFoot_IronRidge, 2);
	    f(EmtConnector_1, 1);
	    f(ConduitBody_1_LB, 1);
	    f(Ctap_Gray, 1);
	    f(EmtConnector_1, 1);
	    f(Emt_1, 15);
	    f(EmtCoupling_1, 1);
	    f(ConduitStrap_1, 3);
	    f(EmtConnector_1, 1);
	    f(ConduitBody_1_LR, 1);
	    f(Locknut_1, 1);
	    f(ConduitNipple_1_2p5, 1);
	    f(Locknut_1, 1);
	    f(ConduitBody_1_LL, 1);
	    f(Locknut_1, 1);
	    f(ConduitNipple_1_2p5, 1);
	    f(Locknut_1, 1);
	    f(GroundBushing_1, 1);
	    f(GroundLug_Al, 1);
	    f(Wire_pv_10, 6*24);
	    f(Wire_thhn_10_grn, 20);
	    f(Wire_bare_6, 6);
	}
	
	// inverter to disco
	f(GroundLug_Al, 1);
	f(GroundBushing_1, 1);
	f(EmtConnector_1, 1);
	f(Emt_1, 2);
	f(EmtConnector_1, 1);
	f(ConduitBody_1_LL, 1);
	f(Locknut_1, 1);
	f(ConduitNipple_1_2p5, 1);
	f(Locknut_1, 2);
	f(DisconnectLnf222ra, 1);
	f(Wire_thhn_6_blk, 5);
	f(Wire_thhn_6_red, 5);
	f(Wire_thhn_6_wht, 4);
	f(Wire_thhn_6_grn, 5);
	
	// disco to main panel
	f(GroundLug_Al, 1);
	f(GroundBushing_1, 1);
	f(EmtConnector_1, 1);
	f(Emt_1, 5);
	f(EmtCoupling_1, 1);
	f(ConduitStrap_1, 2);
	f(EmtConnector_1, 1);
	f(ConduitBody_1_LB, 1);
	f(Locknut_1, 1);
	f(ConduitElbow_1_90, 1);
	f(ConduitCouplingRigid_1, 1);
	f(EmtConnector_1, 1);
	f(Emt_1, 2);
	f(EmtConnector_1, 1);
	f(ConduitBody_1_LR, 1);
	f(Locknut_1, 1);
	f(ConduitNipple_1_2p5, 1);
	f(Locknut_1, 2);
	f(Breaker_QO260CP, 1);
	f(Wire_thhn_6_blk, 17);
	f(Wire_thhn_6_red, 17);
	f(Wire_thhn_6_wht, 17);
	f(Wire_thhn_6_grn, 17);

	// main panel to ground
	f(GroundClamp, 1);
	f(GroundRod, 1);
	
	// misc
	f(Geocel2300, 6);
	f(PaintSprayMatteBlack, 1);
	f(PaintSprayGalvanizing, 1);
	
	// extra
	f(IronRidgeUfo, 2);
	f(IronRidgeCamo, 2);
	f(IronRidgeGroundLug, 1);
	f(IronRidgeFoot, 2);
	f(IronRidgeBolt, 2);
	f(IronRidgeMlpe, 2);
	f(IronRidgeXR10Rail204, 1);
	f(IronRidgeXR10Rail132, -1);
	f(IronRidgeXR10Splice, 1);
	
    }
}

