//include solarBase.js

//-----------------------------------------------------------------------------------------------------------------------
// Part derived
//-----------------------------------------------------------------------------------------------------------------------

var PanelParts = [];

class PanelPart extends Part {
    constructor(watts, dimL, dimS, dimH, war, railOffL, desc, notes) {
	super(desc, notes);
	this.watts = watts;
	this.dimL = dimL;
	this.dimS = dimS;
	this.dimH = dimH;
	this.war = war;
	this.railOffL = railOffL ?? 0.25*dimL;
	PanelParts.push(this);
    }

    panelWatts() { return this.watts; }
}

function panelTable(parts) {
    const tbody = document.getElementById('panelTbody');
    for(const part of parts) {
	const tr = temRootClone('panelTr_tem');
	part.descFill(tr.querySelector('._desc'));
	const price = part.priceFill(tr.querySelector('._price'));
	tr.querySelector('._watts').textContent = part.watts;
	tr.querySelector('._dim').textContent =
	    part.dimL.toFixed(1)
	    +'*'+ part.dimS.toFixed(1)
	    +'*'+ part.dimH.toFixed(1);
	const area = part.dimL * part.dimS;
	tr.querySelector('._wattsDollar').textContent = (part.watts / price).toFixed(4);
	tr.querySelector('._wattsCm2').textContent = (part.watts / (part.dimL * part.dimS)).toFixed(4);
	tbody.appendChild(tr);
    }
}

class RailPart extends Part {
    constructor(dimL, footL, cantiL, desc, notes) {
	super(desc, notes);
	this.dimL = dimL;
	this.footL = footL;
	this.cantiL = cantiL;
    }
}

class TrimPart extends Part {
    constructor(dimL, desc, notes) {
	super(desc, notes);
	this.dimL = dimL;
    }
}

class InverterPart extends Part {
    constructor(watts, desc, notes) {
	super(desc, notes);
	this.watts = watts;
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// Panel
//-----------------------------------------------------------------------------------------------------------------------

var PanelHia360 = new PanelPart(360, 200.0,99.2,4.0, '10/25', null, 'Hyundai HIA-S360HI', [
    new Note('ds', 'https://es-media-prod.s3.amazonaws.com/media/components/panels/spec-sheets/HyundaiEnergySolutions_HiA-SXXXHI_M2_360_385W_9HICtQB.pdf'),
    new Note('i', 'https://api.renewablenavi.com/products/006653492e5d412ebd629d7d373ddeb3/resources/attachments/901b76b62e134b9ebf75bcd109aca7aa'),
    Price1.nu(180.00, 'https://cedgreentech.com/'),
]);
var PanelJa535 = new PanelPart(535, 228.5,113.4,3.5, '25/25', null, 'JA JAM72D30 535', [
    new Note('ds', 'https://www.jasolar.com/uploadfile/2022/0511/20220511055529246.pdf'),
    new Note('i', 'https://www.jasolar.com/uploadfile/2022/0218/20220218094918677.pdf'),
    Price1.nu(361.00, 'https://www.solaris-shop.com/ja-solar-jam72d30-535-mb-535w-mono-bifacial-solar-panel/'),
]);
var PanelPhono365 = new PanelPart(365, 176.4,104.0,3.5, '12/25', null, 'Phono Solar PS365M4H-20/UHB Mono 120/2', [
    new Note('ds', 'https://admin.sunhub.com/storage/documents/item/626171b64b2beyi1pene2udku8ffk8ffg0gnan5g.pdf'),
    Price1.nu(274.00, 'https://www.sunhub.com/product/1AK88/phono-solar-365w-mono-120-half-cell-solar-panel'),
]);
var PanelQ395 = new PanelPart(395, 187.9,104.5,3.2, '25/25', null, 'Q Cells Q.PEAK DUO BLK ML-G10+ 395', [
    new Note('ds', 'https://media.qcells.com/service/download/d33159afd6624daba346f36c3e31ee96'),
    new Note('i', 'https://media.qcells.com/service/download/9acee6f13ed248cab3bb69aaeebee955'),
    Price1.nu(315.00, 'https://www.solaris-shop.com/hanwha-q-cells-q-peak-duo-blk-ml-g10-395-395w-mono-solar-panel/'),
]);
var PanelQ360 = new PanelPart(360, 171.7,104.5,3.2, '25/25', null, 'Q Cells Q.PEAK DUO BLK-G10+ 360', [
    new Note('ds', 'https://media.qcells.com/service/download/bda210c30c9041b6b37d10748f1899c6'),
    Price1.nu(282.24, 'https://www.altestore.com/store/solar-panels/q-cells-solar-panels-p41041/#HAN360QDBG10360'),
]);
var PanelQ350 = new PanelPart(350, 174.0,103.0,3.2, '25/25', null, 'Q Cells Q.PEAK DUO-G6+ 350', [
    new Note('ds', 'https://media.qcells.com/service/download/09448eebeeb646dda880bc9742eaaa83'),
    Price1.nu(274.00, 'https://voltaico.com/product/q-cells-q-peak-duo-g6350-350w-solar-panel/'),
]);
var PanelSil360 = new PanelPart(360, 183.2,100.0,3.8, '25/30', 42.35, 'SIL 360 NX Mono PERC 66 Black', [
    new Note('ds', 'https://silfabsolar.com/wp-content/uploads/2021/09/Silfab-SIL-360-NX-20210722-Final.pdf'),
    new Note('i', 'https://silfabsolar.com/wp-content/uploads/2021/11/SILFAB-MAN-SFO-15-20211027-FINAL.pdf'),
    Price1.nu(244.8089, 'https://www.platt.com/p/1895650/silfab-solar/360w-module-sil-nx-series-66-cell-black-on-black/silsil360nx'),
]);
var PanelSil490 = new PanelPart(490, 226.3,103.7,3.5, '25/30', null, 'Silfab SIL-490 HN Mono PERC 156/2', [
    new Note('ds', 'https://silfabsolar.com/wp-content/uploads/2022/03/Silfab-SIL-490-HN-Data-Generic-20220218.pdf'),
    new Note('i', 'https://silfabsolar.com/wp-content/uploads/2021/11/SILFAB-MAN-SSI-02-20211027.pdf'),
    Price1.nu(369.00, 'https://www.sunhub.com/product/KDA8/silfab-490w-hn-series-mono-156-half-cell-solar-panels'),
]);
var PanelTrina330 = new PanelPart(330, 169.0,99.6,3.5, '25/25', null, 'Trina TSM-330-DD06M.05(II) Mono 120/2', [
    new Note('ds', 'https://admin.sunhub.com/storage/documents/item/62419467eecc3onpmdadvewg4yrcg5vzl90ka7bz.pdf'),
    Price1.nu(241.00, 'https://www.sunhub.com/product/MR4PPUVX/trina-330w-dd06m-series-mono-perc-solar-panels'),
]);

//-----------------------------------------------------------------------------------------------------------------------
// IronRidge parts and prices
//-----------------------------------------------------------------------------------------------------------------------

var IronRidgeNotes = [
    new Note('ds', 'https://files.ironridge.com/pitched-roof-mounting/resources/brochures/Flush_Mount_Data_Sheet.pdf'),
    new Note('i', 'https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_Flush_Mount_Installation_Manual.pdf'),
];
var IronRidgeRailNotes = [
    new Note('tb', 'https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_XR_Rail_Family_Tech_Brief.pdf'),
    IronRidgeNotes[1],
];
var IronRidgeSpliceNotes = [
    new Note('tb', 'https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_BOSS_Bonded_Splice_Tech_Brief.pdf'),
    IronRidgeNotes[1],
];
var IronRidgeUfoNotes = [
    new Note('tb', 'https://files.ironridge.com/pitched-roof-mounting/resources/brochures/UFO_Family_Tech_Brief.pdf'),
    IronRidgeNotes[1],
];

var IronRidgeUfo = new Part('IronRidge UFO-CL-01-A1 Universal Module Clamp Mill', [
    ...IronRidgeUfoNotes,
    Price1.nu(2.920, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Module-Clamps/IronRidge/UFO-CL-01-A1/product.aspx?zpid=1172501'),
    Price1.nu(4.86, 'https://www.ironridge.com/design-tools/'),
]);
var IronRidgeStopper38 = new Part('IronRidge UFO-STP-38MM-M1 Stopper Sleeve 38MM Mill', [
    ...IronRidgeUfoNotes,
    Price1.nu(0.60, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Module-Clamps/IronRidge/UFO-STP-38MM-M1/product.aspx?zpid=1172516'),
    Price1.nu(0.80, 'https://www.ironridge.com/design-tools/'),
]);
var IronRidgeCamo = new Part('IronRidge CAMO-01-M1 Hidden End Clamp', [
    new Note('tb', 'https://files.ironridge.com/camo/IronRidge_CAMO_Tech_Brief.pdf'),
    new Note('i', 'https://files.ironridge.com/camo/IronRidge_CAMO_Installation_Manual.pdf'),
    Price1.nu(7.3425, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Module-Clamps/IronRidge/CAMO-01-M1/product.aspx?zpid=1221813'),
    // todo Price1.nu(, 'https://www.ironridge.com/design-tools/'),
]);
var IronRidgeGroundLug = new Part( 'IronRidge XR-LUG-03-A1 Grounding Lug, Low Profile', [
    ...IronRidgeNotes,
    Price1.nu(7.14, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Grounding-Bonding-Hardware/IronRidge/XR-LUG-03-A1/product.aspx?zpid=1172499'),
    Price1.nu(9.52, 'https://www.ironridge.com/design-tools/'),
]);
var IronRidgeFoot = new Part('IronRidge FF2-01-M2 FlashFoot2 Mill', [
    new Note('tb', 'https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_FlashFoot2_Tech_Brief.pdf'),
    new Note('i', 'https://files.ironridge.com/pitched-roof-mounting/resources/brochures/IronRidge_FlashFoot2_Installation_Manual.pdf'),
    Price1.nu(12.41, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Flashings-Comp-Roof/IronRidge/FF2-01-M2/product.aspx?zpid=1796624'),
    Price1.nu(20.68, 'https://www.ironridge.com/design-tools/'),
]);
var IronRidgeBolt = new Part('IronRidge BHW-SQ-02-A1 Square-Bolt Bonding Hardware', [
    ...IronRidgeNotes,
    Price1.nu(1.69, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Hardware/IronRidge/BHW-SQ-02-A1/product.aspx?zpid=1172496'),
    Price1.nu(2.81, 'https://www.ironridge.com/design-tools/'),
]);
var IronRidgeMlpe = new Part('IronRidge BHW-MI-01-A1 Microinverter/MLPE Bonding Hardware, T-Bolt', [
    ...IronRidgeNotes,
    Price1.nu(1.605, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Hardware/IronRidge/BHW-MI-01-A1/product.aspx?zpid=1172500'),
    Price1.nu(2.14, 'https://www.ironridge.com/design-tools/'),
]);

var IronRidgeConduitFoot = new Part('IronRidge FM-CM-001-B Conduit Flashing 4-pack', [
    Price1.nu(79.05, 'https://www.platt.com/p/0557412/ironridge/conduit-flashing-4-pack/irnfmcm001b'),
]);

//-----------------------------------------------------------------------------------------------------------------------
// IronRidgeXR10 parts and prices

var IronRidgeXR10Rail132 = new RailPart(2.54*132, 2.54*72, 2.54*24, 'IronRidge XR-10-132A 11ft Mill', [
    ...IronRidgeRailNotes,
    Price1.nu(38.1225, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Rails/IronRidge/XR-10-132A/product.aspx?zpid=123362'),
]);
var IronRidgeXR10Rail168 = new RailPart(2.54*168, 2.54*72, 2.54*24, 'IronRidge XR-10-168A 14ft Mill', [
    ...IronRidgeRailNotes,
    Price1.nu(44.2125, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Rails/IronRidge/XR-10-168A/product.aspx?zpid=123366'),
]);
var IronRidgeXR10Rail204 = new RailPart(2.54*204, 2.54*72, 2.54*24, 'IronRidge XR-10-204A 17ft Mill', [
    ...IronRidgeRailNotes,
    Price1.nu(53.6175, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Rails/IronRidge/XR-10-204A/product.aspx?zpid=123375'),
]);

var IronRidgeXR10RailV = [ IronRidgeXR10Rail132, IronRidgeXR10Rail168, IronRidgeXR10Rail204 ];

var IronRidgeXR10Splice = new Part('IronRidge XR10-BOSS-01-M1 Bonded Splice', [
    ...IronRidgeSpliceNotes,
    Price1.nu(7.4175, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Rail-Splice-Kits/IronRidge/XR10-BOSS-01-M1/product.aspx?zpid=1876583'),
    Price1.nu(9.89, 'https://www.ironridge.com/design-tools/'),
]);

//-----------------------------------------------------------------------------------------------------------------------
// IronRidgeXR100 parts and prices

var IronRidgeXR100Rail168 = new RailPart(2.54*168, 2.54*96, 2.54*32, 'IronRidge XR-100-168A 14ft Mill', [
    ...IronRidgeRailNotes,
    Price1.nu(61.86, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Rails/IronRidge/XR-100-168A/product.aspx?zpid=123382'),
]);
var IronRidgeXR100Rail204 = new RailPart(2.54*204, 2.54*96, 2.54*32, 'IronRidge XR-100-204A 17ft Mill', [
    ...IronRidgeRailNotes,
    Price1.nu(75.105, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Rails/IronRidge/XR-100-204A/product.aspx?zpid=123388'),
]);

var IronRidgeXR100RailV = [ IronRidgeXR100Rail168, IronRidgeXR100Rail204 ];

var IronRidgeXR100Splice = new Part('IronRidge XR100-BOSS-01-M1 Bonded Splice', [
    ...IronRidgeSpliceNotes,
    Price1.nu(8.385, 'https://www.platt.com/platt-electric-supply/Racking-Mounting-Hardware-Rail-Splice-Kits/IronRidge/XR-100-BOSS-01-M1/product.aspx?zpid=1876584'),
    Price1.nu(9.89, 'https://www.ironridge.com/design-tools/'),
]);

//-----------------------------------------------------------------------------------------------------------------------
// Unirac parts and prices
//-----------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------
// UniracSm parts and prices 

var UniracSmNotes = [
    new Note('i', 'https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SM_Installation-Guide-QSG.pdf'),
];

var UniracSmRail168 = new RailPart(2.54*168, 2.54*72, 2.54*24, 'Unirac 315168M SM LIGHT RAIL 168" MILL', [
    ...UniracSmNotes,
    Price1.nu(35.25, 'https://design.unirac.com/'),
    Price1.nu(47.11, 'https://www.platt.com/p/0532097/unirac/sm-light-rail-168-mill/unr315168m'),
]);

var UniracSmRail208 = new RailPart(2.54*208, 2.54*72, 2.54*24, 'Unirac 315208M SM LIGHT RAIL 208" MILL', [
    ...UniracSmNotes,
    Price1.nu(43.64, 'https://design.unirac.com/'),
    Price1.nu(58.32, 'https://www.platt.com/p/1971393/unirac/810039363324/unr315208m'),
]);
var UniracSmRail246 = new RailPart(2.54*246, 2.54*72, 2.54*24, 'Unirac 315246M SM LIGHT RAIL 246" MILL', [
    ...UniracSmNotes,
    Price1.nu(51.61, 'https://design.unirac.com/'),
    Price1.nu(68.97, 'https://www.platt.com/p/1843281/unirac/unr-315246m-sm-light-rail-246/810039361696/unr315246m'),
]);

var UniracSmRailV = [ UniracSmRail168, UniracSmRail208, UniracSmRail246 ];

var UniracSmSplice = new Part('Unirac 303019M BND SPLICE BAR PRO SERIES MILL', [
    ...UniracSmNotes,
    Price1.nu(6.05, 'https://design.unirac.com/'),
    Price1.nu(8.10, 'https://www.platt.com/p/1443448/unirac/unr303019m'),
]);
var UniracSmMid = new Part('Unirac 302030M SM PRO SERIES MID - MILL', [
    ...UniracSmNotes,
    Price1.nu(2.69, 'https://design.unirac.com/'),
    Price1.nu(3.60, 'https://www.platt.com/p/0453757/unirac/sm-midclamp-pro-mill/unr302030m'),
]);
var UniracSmEnd = new Part('Unirac 302035M SM PRO SERIES UNIV END - MILL', [
    ...UniracSmNotes,
    Price1.nu(3.22, 'https://design.unirac.com/'),
    Price1.nu(4.31, 'https://www.platt.com/p/0453756/unirac/sm-endclamp-pro-w-cap/unr302035m'),
]);
var UniracSmFoot = new Part('Unirac 004055D FLASHKIT PRO, DRK, 10PK', [
    ...UniracSmNotes,
    Price1.nu(14.05, 'https://www.platt.com/p/1443390/unirac/flashkit-pro-drk-10pk/unr004055d'),
]);
var UniracSmLFoot = new Part('Unirac 304001C L-FOOT SERRATED W/ T-BOLT, CLR', [
    ...UniracSmNotes,
    Price1.nu(3.14, 'https://design.unirac.com/'),
    Price1.nu(4.20, 'https://www.platt.com/p/0138669/unirac/l-foot-serrated-w-t-bolt-clr/unr304001c'),
]);
var UniracSmGroundLug = new Part('Unirac 008009P Grounding Lug ILSCO LAY IN LUG (GBL4DBT)', [
    ...UniracSmNotes,
    Price1.nu(7.54, 'https://design.unirac.com/'),
    Price1.nu(10.08, 'https://www.platt.com/p/0126668/unirac/ilsco-lay-in-lug/unr008009p'),
]);
var UniracSmMlpe = new Part('Unirac 008114M MLPE MOUNT ASSY', [
    ...UniracSmNotes,
    Price1.nu(null, 'https://www.platt.com/p/1443417/unirac/unr008001m'), // todo price update
]);

//-----------------------------------------------------------------------------------------------------------------------
// UniracSfm parts and prices 

var UniracSfmNotes = [
    new Note('i', 'https://unirac.com/wp-content/uploads/bsk-pdf-manager/2022/06/SFM-Installation-Manual.pdf'),
    new Note('cat', 'https://unirac.com/wp-content/uploads/pdf/UNIRAC-PDF-Price-List-wo-pricing-JAN-2022-2.pdf'),
];

var UniracSfmTrim = new TrimPart(2.54*72, 'Unirac 256072U SFM TRIMRAIL 72 UNIV DRK', [
    ...UniracSfmNotes,
    Price1.nu(33.25, 'https://design.unirac.com/'),
    Price1.nu(44.43, 'https://www.platt.com/p/1971391/unirac/810039362167/unr256072u'),
]);
var UniracSfmTrimSplice = new Part('Unirac 250120U SFM TRIM SPLICE DRK', [
    ...UniracSfmNotes,
    Price1.nu(3.98, 'https://design.unirac.com/'),
    Price1.nu(5.33, 'https://www.platt.com/p/1843277/unirac/810039361207/unr250120u'),
]);
var UniracSfmTrimFoot = new Part('Unirac 004200D FLASHKIT SFM TRIM COMP DARK', [
    ...UniracSfmNotes,
    Price1.nu(11.93, 'https://design.unirac.com/'),
    Price1.nu(15.94, 'https://www.platt.com/p/1843250/unirac/810039360460/unr004200d'),
]);
var UniracSfmTrimClip = new Part('Unirac 250110U SFM TRIMRAIL UNIV CLIP W/HDW', [
    ...UniracSfmNotes,
    Price1.nu(2.69, 'https://design.unirac.com/'),
    Price1.nu(null, 'https://www.platt.com/p/1843276/unirac/unr250110u'), // todo price update
]);
var UniracSfmTrimCap = new Part('Unirac 250130U SFM TRIM END CAPS', [
    ...UniracSfmNotes,
    Price1.nu(1.13, 'https://design.unirac.com/'),
    Price1.nu(1.51, 'https://www.platt.com/p/1843278/unirac/810039361214/unr250130u'),
]);
var UniracSfmTrimBond = new Part('Unirac 008100U SFM TRIM BONDING CLAMP', [
    ...UniracSfmNotes,
    Price1.nu(3.92, 'https://design.unirac.com/'),
    Price1.nu(5.24, 'https://www.platt.com/p/1843270/unirac/810039361047/unr008100u'),
]);
var UniracSfmMicrorail = new Part('Unirac 250020U SFM MICRORAIL 2"', [
    ...UniracSfmNotes,
    Price1.nu(8.27, 'https://design.unirac.com/'),
    Price1.nu(11.05, 'https://www.platt.com/p/1843273/unirac/810039361177/unr250020u'),
]);
var UniracSfmAttSplice = new Part('Unirac 250030U SFM ATT SPLICE 8"', [
    ...UniracSfmNotes,
    Price1.nu(13.68, 'https://design.unirac.com/'),
    Price1.nu(18.28, 'https://www.platt.com/p/1843275/unirac/810039361184/unr250030u'),
]);
var UniracSfmSplice = new Part('Unirac 250010U SFM SPLICE 6.5"', [
    ...UniracSfmNotes,
    Price1.nu(9.58, 'https://design.unirac.com/'),
    Price1.nu(12.81, 'https://www.platt.com/p/1843272/unirac/810039361160/unr250010u'),
]);
var UniracSfmFoot = new Part('Unirac 004270D FLASHKIT SFM SLIDER COMP DARK', [
    ...UniracSfmNotes,
    Price1.nu(9.44, 'https://design.unirac.com/'),
    Price1.nu(12.63, 'https://www.platt.com/p/1843251/unirac/810039360484/unr004270d'),
]);
var UniracSfmNsbond = new Part('Unirac 008000U SFM N/S BONDING CLAMP', [
    ...UniracSfmNotes,
    Price1.nu(2.26, 'https://design.unirac.com/'),
    Price1.nu(3.03, 'https://www.platt.com/p/1843269/unirac/810039360897/unr008000u'),
]);

//-----------------------------------------------------------------------------------------------------------------------
// SnapnrackRlu (SnapNRack RL-U)
//-----------------------------------------------------------------------------------------------------------------------

var SnapnrackRluNotes = [
    new Note('cat', 'https://snapnrack.com/wp-content/uploads/2019/07/SNR_Product-Catalog_2022_Q4_v.1.2_web.pdf'),
    new Note('i', 'https://snapnrack.com/wp-content/uploads/2020/08/SnapNrack_RL-Universal_Installation-Manual_v.2.0.pdf'),
];

var SnapnrackRluCompFlash = new Part('SnapNrack 232-01375 COMP FLASHING, 9IN X 12IN, BLACK ALUM', [
    ...SnapnrackRluNotes,
    Price1.nu(5.51, 'https://snapnrack.com/configurator/'),
    Price1.nu(4.67, 'https://www.platt.com/p/1305653/snapnrack/comp-flashing/srk23201375'),
]);
var SnapnrackRluCompTrack = new Part('SnapNrack 232-01371 FLASH TRACK PRC, CONE HOLE, PLAIN ENDS, 7-1/2IN, MILL', [
    ...SnapnrackRluNotes,
    Price1.nu(5.00, 'https://snapnrack.com/configurator/'),
]);
var SnapnrackRluUmbrellaLag = new Part('SnapNrack 242-92266 UMBRELLA LAG, TYPE 3, 4IN, SS', [
    ...SnapnrackRluNotes,
    Price1.nu(1.55, 'https://snapnrack.com/configurator/'),
    Price1.nu(1.20, 'https://www.platt.com/p/1305652/snapnrack/4-umbrella-lag-mount-waterproof-stainless-steel/srk24292266'),
]);
var SnapnrackRluSpeedsealTrack = new Part('SnapNrack 232-01464 RL UNIVERSAL SPEEDSEAL TRACK', [
    ...SnapnrackRluNotes,
    Price1.nu(8.75, 'https://snapnrack.com/configurator/'),
]);
var SnapnrackRluSpeedsealLag = new Part('SnapNrack 242-02168 SEALING WASHER LAG, 4-1/2IN, SS', [
    ...SnapnrackRluNotes,
    Price1.nu(1.25, 'https://snapnrack.com/configurator/'),
    Price1.nu(0.97, 'https://www.platt.com/p/1853504/snapnrack/srk24202168'),
]);
var SnapnrackRluMount = new Part('SnapNrack 242-02155 RL UNIVERSAL, MOUNT', [
    ...SnapnrackRluNotes,
    Price1.nu(11.75, 'https://snapnrack.com/configurator/'),
]);
var SnapnrackRluLink = new Part('SnapNrack 242-02156 RL UNIVERSAL, LINK', [
    ...SnapnrackRluNotes,
    Price1.nu(11.69, 'https://snapnrack.com/configurator/'),
    Price1.nu(9.91, 'https://www.platt.com/p/1790279/snapnrack/srk24202156'),
]);
var SnapnrackRluSkirt = new TrimPart(2.54*83, 'SnapNrack 232-02493 RL UNIVERSAL, LANDSCAPE SKIRT, 83IN, BLACK', [
    ...SnapnrackRluNotes,
    Price1.nu(47.88, 'https://snapnrack.com/configurator/'),
    Price1.nu(40.56, 'https://www.platt.com/p/1790273/snapnrack/srk23202493'),
]);
var SnapnrackRluSkirtSpacer40 = new Part('SnapNrack 232-02497 RL UNIVERSAL, SKIRT SPACER, 40MM', [
    ...SnapnrackRluNotes,
    Price1.nu(0.68, 'https://snapnrack.com/configurator/'),
    Price1.nu(0.58, 'https://www.platt.com/p/1790277/snapnrack/srk23202497'),
]);
var SnapnrackRluGroundLug = new Part('SnapNrack 242-02101 GROUND LUG R, 6-12 AWG', [
    ...SnapnrackRluNotes,
    Price1.nu(5.46, 'https://snapnrack.com/configurator/'),
    Price1.nu(4.63, 'https://www.platt.com/p/0107174/snapnrack/100-ul-series-grounding-lug-assembly/srk24202101'),
]);
var SnapnrackRluMlpe = new Part('SnapNrack 242-02151 MLPE FRAME ATTACHMENT KIT', [
    ...SnapnrackRluNotes,
    Price1.nu(4.68, 'https://snapnrack.com/configurator/'),
    Price1.nu(4.63, 'https://www.platt.com/p/0107174/snapnrack/100-ul-series-grounding-lug-assembly/srk24202101'),
]);

//-----------------------------------------------------------------------------------------------------------------------
// Inverter
//-----------------------------------------------------------------------------------------------------------------------

var InverterSe11400h_ussnbbl14 = new InverterPart(11400, 'SolarEdge SE11400H-USSNBBL14 INVERTER 11.4kW', [
    new Note('ds', 'https://www.solaredge.com/sites/default/files/se-hd-wave-single-phase-inverter-with-setapp-datasheet-na.pdf'),
    new Note('u', 'https://www.solaredge.com/sites/default/files/se-single-and-three-phase-inverter-user-manual-na.pdf'),
    Price1.nu(3589.1900, 'https://www.platt.com/p/1973303/solaredge/11400w-single-hd-wave-phase-inverter/sedse11400hussnbbl'),
]);

var SolarEdgeCt225 = new Part('SolarEdge SECT-SPL-225A-T-20 Current Transformer', [
    Price1.nu(41.6162, 'https://www.platt.com/p/1950422/solaredge/slim-current-transformer-split-core/sedsectspl225at20'),
]);

var SolarEdgeP400 = new Part('400W DC Power Optimizer', [
    Price1.nu(97.46, 'https://www.platt.com/p/0178020/solaredge/400w-dc-power-optimizer-discontinued-/sedp400'),
]);

//-----------------------------------------------------------------------------------------------------------------------
// Electrical other
//-----------------------------------------------------------------------------------------------------------------------

var DisconnectGnf222ra = new Part('Siemens GNF222RA Disconnect 2P 240V 60A', [
    new Note('ds', 'https://assets.new.siemens.com/siemens/assets/api/uuid:5c71c5ec-7826-4b33-bad2-c861d7d9534e/sie-ss-switch-60a-240a-nf3r.pdf'),
    Price1.nu(81.60, 'https://www.amazon.com/SIEMENS-General-Safety-Outdoor-Non-Fusible/dp/B07PS6BXLR/'),
]);

var BreakerQ22020CTU = new Part('Siemens Q22020CTU Breaker 20 + 2x20 + 20', [
    Price1.nu(29.85, 'https://www.homedepot.com/p/Siemens-Triplex-Two-Outer-20-Amp-Single-Pole-and-One-Inner-20-Amp-Double-Pole-Circuit-Breaker-Q22020CTU/202276298'),
]);

var BreakerQ260 = new Part('Siemens Q260 Breaker 2x60', [
    Price1.nu(15.52, 'https://www.amazon.com/Q260-60-Amp-Double-Circuit-Breaker/dp/B00002N7KY/'),
]);

var Emt1_10 = new Part('EMT 1" x 10ft', [
    Price1.nu(20.62, 'https://www.homedepot.com/p/1-in-x-10-ft-Electric-Metallic-Tube-EMT-Conduit-101568/100400409'),
]);

var Emt34_10 = new Part('EMT Conduit, 3/4", Steel, 10', [
    Price1.nu(10.37, 'https://www.platt.com/p/0065970/emt-conduit-3-4-steel-10/091111020025/34e'),
]);

var EmtConnector1 = new Part('EMT Compression Connector, 1 inch, Insulated, Raintight, Steel', [
    Price1.nu(4.77, 'https://www.platt.com/p/0641063/arlington/emt-compression-connector-1-inch-insulated-raintight-steel/018997820471/arl822art'),
]);

var EmtConnector34 = new Part('EMT 3/4 in. Insulated Raintight Compression Connector', [
    PriceN.nu(23.62, 25, 'https://www.homedepot.com/p/RACO-EMT-3-4-in-Insulated-Raintight-Compression-Connector-25-Pack-2913RT/203637944'),
]);

var EmtCoupling34 = new Part('3/4 in. Electrical Metallic Tube Raintight Compression Coupling', [
    PriceN.nu(21.84, 20, 'https://www.homedepot.com/p/Halex-3-4-in-Electrical-Metallic-Tube-Raintight-Compression-Couplings-20-Pack-62602B/300183408'),
]);

var GroundLugCuSn = new Part('Lay-In Lug, Copper, 14 -4 AWG', [
    Price1.nu(12.16, 'https://www.platt.com/p/0606231/ilsco/lay-in-lug-copper-14-4-awg/783669960181/ilsgbl4dbt'),
]);

var RigidCoupling34 = new Part('3/4 in. Rigid Conduit Coupling', [
    Price1.nu(2.42, 'https://www.homedepot.com/p/Halex-3-4-in-Rigid-Conduit-Coupling-64007/100164200'),
]);

var RigidNipple34_6 = new Part('3/4 in. x 6 in. Rigid Conduit Nipple', [
    Price1.nu(2.97, 'https://www.homedepot.com/p/Halex-3-4-in-x-6-in-Rigid-Conduit-Nipple-64362/100149814'),
]);

var RigidReducingBushing1_34 = new Part('1 in. x 3/4 in. Rigid Reducing Bushing', [
    Price1.nu(1.62, 'https://www.homedepot.com/p/Halex-1-in-x-3-4-in-Rigid-Reducing-Bushing-91332/100186383'),
]);

var ReducingWasher1_34 = new Part('Reducing Washer, 1" x 3/4", Steel', [
    Price1.nu(0.34, 'https://www.platt.com/p/0676009/dottie/reducing-washer-1-x-3-4-steel/781002301097/dotrw32'),
]);

var Wire10StrGrn = new Part('10 AWG THHN/THWN Stranded Copper, Green, 500FT', [
    Price1.nu(180.00, 'https://www.platt.com/p/0062575/10-awg-thhn-thwn-stranded-copper-green-500/048243230402/10thhncstrgrex500'),
]);

var Wire10Pv = new Part('10 AWG 1000V Solar PV Wire 500FT, Black', [
    Price1.nu(295.00, 'https://www.platt.com/p/0043334/10-awg-1000v-solar-pv-wire-500-black/10pv1000vblax500'),
]);

var Wire6StrBlk = new Part('(By-the-Foot) 6 Black Stranded CU SIMpull THHN Wire', [
    Price1.nu(1.48, 'https://www.homedepot.com/p/Southwire-By-the-Foot-6-Black-Stranded-CU-SIMpull-THHN-Wire-20493399/204632784'),
]);

var Wire6StrRed = new Part('(By-the-Foot) 6 Red Stranded CU SIMpull THHN Wire', [
    Price1.nu(1.48, 'https://www.homedepot.com/p/Southwire-By-the-Foot-6-Red-Stranded-CU-SIMpull-THHN-Wire-20495899/204632880'),
]);

var Wire6StrWht = new Part('(By-the-Foot) 6 White Stranded CU SIMpull THHN Wire', [
    Price1.nu(1.48, 'https://www.homedepot.com/p/Southwire-By-the-Foot-6-White-Stranded-CU-SIMpull-THHN-Wire-20494199/204632877'),
]);

//-----------------------------------------------------------------------------------------------------------------------
// Other
//-----------------------------------------------------------------------------------------------------------------------

var PenetrationFlashing = new Part('Nichols F121 Roof Flashing 1/2" - 1", 9" x 12"</a>', [
    Price1.nu(11.63, 'https://www.platt.com/p/0093946/nichols/roof-flashing-featuring-a-26-gauge-galvanized-bass-size-9x12/78632326972%20/nicf121'),
]);

var OtherParts = new Part('Other', [
    new Price1(5136.49, null, null),
]);
