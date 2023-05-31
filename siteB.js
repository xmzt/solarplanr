//include sys.js

class SiteB {
    constructor(env, layout) {
	const roof = new SiteB_Roof(env.drawrNu());
	const rack = new IronRidgeXRRack(env.partTab.subNu('rack'), roof, IronRidgeEndTypCamo);
	const invsys = new SolarEdgeInvsys(env.partTab.subNu('SolarEdge'), rack.mlpePart())
	      .invSet(SolarEdgeSe11400h_us000bni4)
	      .partAdd(SolarEdgeCt225, 2);
	layout(roof, rack, invsys);
	SiteB.wiringParts(env.partTab.subNu('wiring'), /*jbox*/0);
	SiteB.otherParts(env.partTab.subNu('other'));
	SiteB.extraParts(env.partTab.subNu('extra'));
	const railGroup = new IronRidgeXR10RailGroup(env.railGroupMgr, rack.partTabSub);
	rack.layoutFin(railGroup);
	railGroup.layoutFin();
    }

    static LayoutById = {};
}

class SiteB_Roof extends Roof {
    constructor(drawr) {
	super(drawr);
	
	// fireX = 1268.5 = 1357.94 + 2 - 2.54*36
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
	drawr.addEdgePathV(edgePathVCwClose(this.edgeV));
	
	// rafters: measured from left side of each rafter
	// 0 43.2 84.8 125.8 166.2 206.7 247.7 288.7 331.7 373.2 417.0 449.5 490.5 530.3 571.7
	// 41.2 82.3 119.7 166.7 207.0 247.5 288.8 329.0 369.4 410.5 450.4 491.2
	// 41.2 81.0 121.7 162.5 203.5 243.5 281.1
	// offset from rake to center to rafter0: 13.94 = (1378.0 - 109.5) - (1344.0 + 4 - 2.54*36) + 2
	this.rafterAddXs(13.9400,   57.14,   98.74,  139.74,  180.14,  220.64,  261.64,  302.64,
			 345.640,  387.14,  430.94,  463.44,  504.44,  544.24,  585.64,  626.84,
			 667.940,  705.34,  752.34,  792.64,  833.14,  874.44,  914.64,  955.04,
			 996.140, 1036.04, 1076.84, 1118.04, 1157.84, 1198.54, 1239.34, 1280.34,
			 1320.34, 1357.94);

	// features
	let x, y;
	x = (this.rafterV[1].x0 + this.rafterV[2].x0 + 0.5 - 31.0)/2;
	this.featureAddVent(x, 309.0, x + 31.0, 340.0);
	x = (this.rafterV[31].x0 + this.rafterV[32].x0 - 0.5 - 31.0)/2;
	y = this.db.y + 181.3;
	this.featureAddVent(x, y - 31.0, x + 31, y);
	x = this.rafterV[33].x0 + 2.0;
	this.fire = this.featureAddFire(x - 2.54*36, this.db.y, x, this.dd.y);
	this.featureAddPipe(this.db.x - 465.0, this.db.y + 69.0, 5/2.0);
    }
}

SiteB.LayoutById['Q475/Q400'] = function(roof, rack, invsys) {
    const q475 = PanelQ475.portrait();
    const q400 = PanelQ400.portrait();
    const a = rack.panelBlockRightDn(q475, roof.fire.x0, roof.dd.y - 36.5, 8, 1);
    const b = rack.panelBlockRightDn(q475, a.x1, a.gapD(), 8, 1);
    const c = rack.panelBlockRightUp(q400, b.gapL(), b.y0, 3, 1);
    const d = rack.panelBlockRightUp(q400, c.x1, c.gapU(), 3, 1);
    const e = rack.panelBlockLeftDn(q400, d.x0 - (q475.part.dimS + rack.gapX())/2, c.gapD(), 6, 1);
    
    const string1 = invsys.stringAdd('STRING1');
    const string2 = invsys.stringAdd('STRING2');
    const string3 = invsys.stringAdd('STRING3');
    {
	let i = 0;
	for( ; i < 8; i++) invsys.panelOptAdd(string1, rack.panelV[i], SolarEdgeS500);
	for( ; i < 17; i++) invsys.panelOptAdd(string2, rack.panelV[i], SolarEdgeS500);
	for( ; i < 19; i++) invsys.panelOptAdd(string3, rack.panelV[i], SolarEdgeP400);
	for( ; i < 20; i++) invsys.panelOptAdd(string1, rack.panelV[i], SolarEdgeS500);
	for( ; i < rack.panelV.length; i++) invsys.panelOptAdd(string3, rack.panelV[i], SolarEdgeP400);
    }
}

SiteB.LayoutById['Q400'] = function(roof, rack, invsys) {
    const port = PanelQ400.portrait();
    let b = rack.panelBlockRightDn(port, roof.fire.x0, roof.dd.y - 31, 6, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 6, 1);
    b = rack.panelBlockRightDn(port, b.gapL(), roof.ac.y - 32, 6, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 5, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 6, 1);
}

SiteB.LayoutById['Sil360'] = function(roof, rack, invsys) {
    const port = PanelSil360.portrait();
    let b = rack.panelBlockLeftDn(port, 5, roof.ac.y - 31, 7, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 6, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 7, 1);
    b = rack.panelBlockLeftDn(port, b.gapR(), roof.dd.y - 31, 5, 1);
    b = rack.panelBlockLeftDn(port, b.x0, b.gapD(), 5, 1);
}

SiteB.LayoutById['Mse380'] = function(roof, rack, invsys) {
    const port = PanelMse380.portrait();
    let b = rack.panelBlockRightDn(port, roof.fire.x0, roof.ac.y - 31, 11, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 11, 1);
    b = rack.panelBlockLeftDn(port, b.x0, b.gapD(), 6, 1);
}

SiteB.LayoutById['Mse380/Mse420'] = function(roof, rack, invsys) {
    let port = PanelMse420.portrait();
    let b0 = rack.panelBlockRightDn(port, roof.fire.x0, roof.dd.y - 31, 5, 1);
    let b = rack.panelBlockRightDn(port, b0.x1, b0.gapD(), 5, 1);
    
    port = PanelMse380.portrait();
    b = rack.panelBlockRightDn(port, b0.gapL(), roof.ac.y - 31, 6, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 6, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 6, 1);
}

SiteB.LayoutById['Boviet370 specified clamp'] = function(roof, rack, invsys) {
    const port = PanelBoviet370.portrait();
    let b = rack.panelBlockRightDn(port, roof.fire.x0, roof.ac.y - 37, 11, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 11, 1);
    b = rack.panelBlockLeftDn(port, 40, b.gapD(), 6, 1);
}

SiteB.LayoutById['Boviet370 liberal clamp zone'] = function(roof, rack, invsys) {
    const port = PanelBoviet370_libclamp.portrait();
    let b = rack.panelBlockRightDn(port, roof.fire.x0, roof.ac.y - 37, 11, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 11, 1);
    b = rack.panelBlockLeftDn(port, 40, b.gapD(), 6, 1);
}

SiteB.LayoutById['Rec370'] = function(roof, rack, invsys) {
    const port = PanelRec370.portrait();
    let b0 = rack.panelBlockRightDn(port, roof.fire.x0, roof.ac.y - 31, 12, 1);
    let b = rack.panelBlockRightDn(port, b0.x1, b0.gapD(), 11, 1);
    b = rack.panelBlockLeftDn(port, b0.x0, b.gapD(), 6, 1);
}

SiteB.LayoutById['Seg400/Ureco400'] = function(roof, rack, invsys) {
    const port = PanelSeg400.portrait();
    let b0 = rack.panelBlockRightDn(port, roof.fire.x0, roof.ac.y - 37, 11, 1);
    let b = rack.panelBlockRightDn(port, b0.x1, b0.gapD(), 10, 1);
    b = rack.panelBlockLeftDn(port, b0.x0, b.gapD(), 6, 1);
}

SiteB.LayoutById['Seg400/Ureco400 landscape,stagger'] = function(roof, rack, invsys) {
    const port = PanelSeg400.portrait();
    const land = PanelSeg400.landscape();
    
    let b = rack.panelBlockLeftDn(land, roof.ac.x + 5, roof.ac.y - 32, 4, 2);
    b = rack.panelBlockRightDn(land, b.x1, b.gapD(), 3, 1);
    b = rack.panelBlockRightDn(land, b.x1, b.gapD(), 4, 2);
    
    b = rack.panelBlockLeftDn(land, b.gapR(), roof.bd.y - 32, 1, 4);
    b = rack.panelBlockLeftDn(land, b.gapR(), b.y1, 1, 3);
    b = rack.panelBlockLeftDn(land, b.gapR(), b.y1, 1, 4);
}

SiteB.LayoutById['Rec405AA Portrait'] = function(roof, rack, invsys) {
    const port = PanelRec405AA.portrait();
    let b = rack.panelBlockLeftDn(port, 0, roof.ac.y - 32, 7, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 6, 1);
    b = rack.panelBlockRightDn(port, b.x1, b.gapD(), 7, 1);
    b = rack.panelBlockLeftDn(port, b.gapR(), roof.dd.y - 32, 5, 1);
    b = rack.panelBlockLeftDn(port, b.x0, b.gapD(), 5, 1);
}

SiteB.wiringParts = function(partTabSub, jbox) {
    const f = (a,b) => partTabSub.partAdd(a, b);
    // array to jbox/conduit
    f(WireClip, 200);
    f(Wire_pv_10, 2*30 + 2*10 + 2*5);
    f(Wire_bare_6, 10);
    f(Mc4_F, 6);
    f(Mc4_M, 6);

    // array to inverter
    if(jbox) {
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
    } else {
	f(GroundLug_CuSn, 1);
	f(GroundBushing_1, 1);
	f(EmtConnector_1, 1);
	f(Emt_1, 4);
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
}

SiteB.otherParts = function(partTabSub) {
    const f = (a,b) => partTabSub.partAdd(a, b);
    f(Geocel2300, 6);
    f(PaintSprayMatteBlack, 1);
    f(PaintSprayGalvanizing, 1);
}

SiteB.extraParts = function(partTabSub) {
    const f = (a,b) => partTabSub.partAdd(a, b);
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
