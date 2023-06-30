//include sys.js

class SiteB {
    static Des = 'SiteB';

    constructor(env, layout) {
	const partSub = {};
	for(const sub of ['panel', 'rack', 'se', 'wiring', 'other', 'extra'])
	    partSub[sub] = env.partTab.subNu(sub);

	this.roof = new this.constructor.Roof(env);
	const railGroup = new IronRidgeXR10RailGroup(env, partSub.rack);
	this.rack = new IronRidgeXRRack(env, partSub.rack, partSub.panel, this.roof, railGroup, IronRidgeEndTypCamo);
	this.inv = new SolarEdgeInv(env, 'INVERTER', partSub.se, SolarEdgeSe11400h_us000bni4);
	this.disco = new Disco(env, 'DISCO', partSub.wiring, DiscoLnf222ra);
	this.mep = new Loadcenter(env, 'MEP', partSub.wiring, LoadcenterSquaredQO130M200, Breaker_QOM2200VH);
	this.meter = new Meter(env, 'METER');
	this.utility = new Utility(env, 'UTILITY');
	new Conduit(env, 'C2',
		    new Portcon(env, this.inv.acPort, this.disco.loadPort),
		    //todonew Portcon(env, this.inv.ctPort, this.mep.ctPort),
		   );
	new Conduit(env, 'C3',
		    new Portcon(env, this.disco.linePort, this.mep.farPortNu()),
		    //todo ctCon
		   );
	new Portcon(env, this.mep.mainPort, this.meter.loadPort);
	new Portcon(env, this.meter.linePort, this.utility.linePort);

	layout.call(this, this.roof, this.rack, this.inv);
	this.rack.layoutFin();
	this.inv.stringFin();
	new Conduit(env, 'C1', ...this.inv.dcConV());

	this.wiringParts(partSub.wiring, /*jbox*/0);
	this.otherParts(partSub.other);
	this.extraParts(partSub.extra);

    	env.log(`roof area: ${unitSqall(this.roof.area)}`);
	env.log(`panel area: ${unitSqall(this.rack.panelArea())}`);
    }

    static Roof = class extends Roof {
	constructor(env) {
	    super(env);
	
	    // fireX = 1268.5 = 1357.94 + 2 - 2.54*36
	    // rakeR = 1373.2 = 1268.5 + 104.7
	    this.borSet({
		A: new P2(0,0),
		B: new P2(0, 627.0), // nick: 614.68
		C: new P2(408.94, 627.0), // todo remeasure, using nick
		D: new P2(408.94, 674.5), // +47.5, nick=+50.8
		E: new P2(1373.2, 674.5), // nick=1323.34,665.48
		F: new P2(1373.2, 157.0), // nick=1323.34,157.48
		G: new P2(717.55, 157.0), // todo remeasure, using nick
		H: new P2(717.55, 0),
	    });
	    this.drawr.addEdgePathV(edgePathVCwClose(this.edgeV));
	    this.area = (this.bor.C.x - this.bor.A.x) * (this.bor.C.y - this.bor.A.y)
		+ (this.bor.H.x - this.bor.D.x) * (this.bor.D.y - this.bor.H.y)
		+ (this.bor.E.x - this.bor.G.x) * (this.bor.E.y - this.bor.G.y);
	    
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
	    y = this.bor.F.y + 181.3;
	    this.featureAddVent(x, y - 31.0, x + 31, y);
	    x = this.rafterV[33].x0 + 2.0;
	    this.fireR = this.featureAddFire(x - 2.54*36, this.bor.F.y, x, this.bor.E.y);
	    this.fireTL = this.featureAddFire(this.bor.D.x, this.bor.D.y - 2.54*12, this.fireR.x0, this.fireR.y1);
	    this.fireTR = this.featureAddFire(this.bor.B.x, this.bor.B.y - 2.54*12, this.bor.C.x, this.bor.C.y);
	    this.featureAddPipe(this.bor.F.x - 465.0, this.bor.F.y + 69.0, 5/2.0);
	}
    };
    
    static NuByDes = {
	'Q475/Q400': (env) => new SiteB(env, function(roof, rack, inv) {
	    //total $ = 14825.11
	    const q475 = PanelQ475.portrait();
	    const q400 = PanelQ400.portrait();
	    const a = rack.panelBlockLtDn(q475, roof.fireR.x0, roof.bor.E.y - EdgeFootDist + q475.clampY1, 8, 1);
	    const b = rack.panelBlockLtDn(q475, a.x1, a.gapD(), 8, 1);
	    const c = rack.panelBlockLtUp(q400, b.gapL(), b.y0, 3, 1);
	    const d = rack.panelBlockLtUp(q400, c.x1, c.gapU(), 3, 1);
	    const e = rack.panelBlockRtDn(q400, d.x0 - (q475.dimS + rack.gapX())/2, c.gapD(), 6, 1);
	    
	    const string1 = inv.stringNu('STRING1');
	    const string2 = inv.stringNu('STRING2');
	    const string3 = inv.stringNu('STRING3');
	    let i = 0;
	    for( ; i < 8; i++) string1.panelAdd(rack.panelV[i], SolarEdgeS500);
	    for( ; i < 17; i++) string2.panelAdd(rack.panelV[i], SolarEdgeS500);
	    for( ; i < 19; i++) string3.panelAdd(rack.panelV[i], SolarEdgeP400);
	    for( ; i < 20; i++) string1.panelAdd(rack.panelV[i], SolarEdgeS500);
	    for( ; i < rack.panelV.length; i++) string3.panelAdd(rack.panelV[i], SolarEdgeP400);
	    
	    // measurements
	    roof.drawr.addMeasure(roof.fireR.x0,roof.fireR.y0, roof.fireR.x1,roof.fireR.y0, -100, 10, 30, 'Fire access');
	    roof.drawr.addMeasure(roof.fireTL.x1,roof.fireTL.y1, roof.fireTL.x1,roof.fireTL.y0, 200, 10, 30, 'Fire access');
	    let clampR = rack.panelV[5].clampR1();
	    roof.drawr.addMeasure(clampR.x0, clampR.y0, clampR.x0, roof.bor.D.y, -20, 10, 30, 'Foot to ridge');
	    clampR = rack.panelV[9].clampR0();
	    roof.drawr.addMeasure(clampR.x0, clampR.y1, clampR.x0, roof.bor.F.y, 20, 10, 30, 'Foot to eave');
	    let panelR = rack.panelV[8];
	    clampR = panelR.clampR1();
	    roof.drawr.addMeasure(clampR.x1, clampR.y0, clampR.x1, panelR.y1, -160, 10, 30, 'Q.475 Clamping zone');
	    panelR = rack.panelV[18];
	    clampR = panelR.clampR1();
	    roof.drawr.addMeasure(clampR.x0, clampR.y0, clampR.x0, panelR.y1, 160, 10, 30, 'Q.400 Clamping zone');
	}),
	'Q400': (env) => new SiteB(env, function(roof, rack, inv) {
	    const port = PanelQ400.portrait();
	    let b = rack.panelBlockLtDn(port, roof.fireR.x0, roof.bor.E.y - 31, 6, 1);
	    b = rack.panelBlockLtDn(port, b.x1, b.gapD(), 6, 1);
	    b = rack.panelBlockLtDn(port, b.gapL(), roof.bor.B.y - 32, 6, 1);
	    b = rack.panelBlockLtDn(port, b.x1, b.gapD(), 5, 1);
	    b = rack.panelBlockLtDn(port, b.x1, b.gapD(), 6, 1);
	}),
	'Sil360': (env) => new SiteB(env, function(roof, rack, inv) {
	    const port = PanelSil360.portrait();
	    let b = rack.panelBlockRtDn(port, 5, roof.bor.B.y - 31, 7, 1);
	    b = rack.panelBlockLtDn(port, b.x1, b.gapD(), 6, 1);
	    b = rack.panelBlockLtDn(port, b.x1, b.gapD(), 7, 1);
	    b = rack.panelBlockRtDn(port, b.gapR(), roof.bor.E.y - 31, 5, 1);
	    b = rack.panelBlockRtDn(port, b.x0, b.gapD(), 5, 1);
	}),
	'Mse380': (env) => new SiteB(env, function(roof, rack, inv) {
	    const port = PanelMse380.portrait();
	    let b = rack.panelBlockLtDn(port, roof.fireR.x0, roof.bor.B.y - 31, 11, 1);
	    b = rack.panelBlockLtDn(port, b.x1, b.gapD(), 11, 1);
	    b = rack.panelBlockRtDn(port, b.x0, b.gapD(), 6, 1);
	}),
	'Mse380/Mse420': (env) => new SiteB(env, function(roof, rack, inv) {
	    let port = PanelMse420.portrait();
	    let b0 = rack.panelBlockLtDn(port, roof.fireR.x0, roof.bor.E.y - 31, 5, 1);
	    let b = rack.panelBlockLtDn(port, b0.x1, b0.gapD(), 5, 1);
	    
	    port = PanelMse380.portrait();
	    b = rack.panelBlockLtDn(port, b0.gapL(), roof.bor.B.y - 31, 6, 1);
	    b = rack.panelBlockLtDn(port, b.x1, b.gapD(), 6, 1);
	    b = rack.panelBlockLtDn(port, b.x1, b.gapD(), 6, 1);
	}),
	'Boviet370 specified clamp': (env) => new SiteB(env, function(roof, rack, inv) {
	    const port = PanelBoviet370.portrait();
	    let b = rack.panelBlockLtDn(port, roof.fireR.x0, roof.bor.B.y - 37, 11, 1);
	    b = rack.panelBlockLtDn(port, b.x1, b.gapD(), 11, 1);
	    b = rack.panelBlockRtDn(port, 40, b.gapD(), 6, 1);
	}),
	'Boviet370 liberal clamp zone': (env) => new SiteB(env, function(roof, rack, inv) {
	    const port = PanelBoviet370_libclamp.portrait();
	    let b = rack.panelBlockLtDn(port, roof.fireR.x0, roof.bor.B.y - 37, 11, 1);
	    b = rack.panelBlockLtDn(port, b.x1, b.gapD(), 11, 1);
	    b = rack.panelBlockRtDn(port, 40, b.gapD(), 6, 1);
	}),
	'Rec370': (env) => new SiteB(env, function(roof, rack, inv) {
	    const port = PanelRec370.portrait();
	    let b0 = rack.panelBlockLtDn(port, roof.fireR.x0, roof.bor.B.y - 31, 12, 1);
	    let b = rack.panelBlockLtDn(port, b0.x1, b0.gapD(), 11, 1);
	    b = rack.panelBlockRtDn(port, b0.x0, b.gapD(), 6, 1);
	}),
	'Seg400/Ureco400': (env) => new SiteB(env, function(roof, rack, inv) {
	    const port = PanelSeg400.portrait();
	    let b0 = rack.panelBlockLtDn(port, roof.fireR.x0, roof.bor.B.y - 37, 11, 1);
	    let b = rack.panelBlockLtDn(port, b0.x1, b0.gapD(), 10, 1);
	    b = rack.panelBlockRtDn(port, b0.x0, b.gapD(), 6, 1);
	}),
	'Seg400/Ureco400 landscape,stagger': (env) => new SiteB(env, function(roof, rack, inv) {
	    const port = PanelSeg400.portrait();
	    const land = PanelSeg400.landscape();
	    
	    let b = rack.panelBlockRtDn(land, roof.bor.B.x + 5, roof.bor.B.y - 32, 4, 2);
	    b = rack.panelBlockLtDn(land, b.x1, b.gapD(), 3, 1);
	    b = rack.panelBlockLtDn(land, b.x1, b.gapD(), 4, 2);
	    
	    b = rack.panelBlockRtDn(land, b.gapR(), roof.bor.D.y - 32, 1, 4);
	    b = rack.panelBlockRtDn(land, b.gapR(), b.y1, 1, 3);
	    b = rack.panelBlockRtDn(land, b.gapR(), b.y1, 1, 4);
	}),
	'Rec405AA Portrait': (env) => new SiteB(env, function(roof, rack, inv) {
	    const port = PanelRec405AA.portrait();
	    let b = rack.panelBlockRtDn(port, 0, roof.bor.B.y - 32, 7, 1);
	    b = rack.panelBlockLtDn(port, b.x1, b.gapD(), 6, 1);
	    b = rack.panelBlockLtDn(port, b.x1, b.gapD(), 7, 1);
	    b = rack.panelBlockRtDn(port, b.gapR(), roof.bor.E.y - 32, 5, 1);
	    b = rack.panelBlockRtDn(port, b.x0, b.gapD(), 5, 1);
	}),
    };

    wiringParts(partSub, jbox) {
	const f = (a,b) => partSub.partAdd(a, b);
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
	f(Wire_thhn_6_blk, 17);
	f(Wire_thhn_6_red, 17);
	f(Wire_thhn_6_wht, 17);
	f(Wire_thhn_6_grn, 17);
	
	// main panel to ground
	f(GroundClamp, 1);
	f(GroundRod, 1);
    }

    otherParts(partSub) {
	const f = (a,b) => partSub.partAdd(a, b);
	f(Geocel2300, 6);
	f(PaintSprayMatteBlack, 1);
	f(PaintSprayGalvanizing, 1);
    }

    extraParts(partSub) {
	const f = (a,b) => partSub.partAdd(a, b);
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
    
