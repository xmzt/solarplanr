//include base.js
//include part.js
//include partCat.js

//-----------------------------------------------------------------------------------------------------------------------
// Acq (acquisition - parts actually bought and maybe even used)
//-----------------------------------------------------------------------------------------------------------------------

class Acq {
    constructor(cost, qty, qtyUsed, kws, buyr, fro, part, rec) {
	this.cost = cost;
	this.qty = qty;
	this.qtyUsed = qtyUsed;
	this.kws = kws;
	this.buyr = buyr;
	this.fro = fro;
	this.part = part;
	this.rec = rec;
    }
}

function acqTabTr(acq) {
    const tr = temRootClone('acqTabTr_tem');
    tr.querySelector('._cost').textContent = acq.cost.toFixed(2);
    tr.querySelector('._qty').textContent = acq.qty;
    tr.querySelector('._qtyUsed').textContent = acq.qtyUsed;
    tr.querySelector('._costQty').textContent = (acq.cost / acq.qty).toFixed(2);
    tr.querySelector('._kws').textContent = acq.kws.join(' ');
    tr.querySelector('._buyr').textContent = acq.buyr;
    tr.querySelector('._fro').textContent = acq.fro;
    acq.part.descFill(tr.querySelector('._part'));
    tr.querySelector('._rec').textContent = acq.rec;
    return tr;
}
function acqTabTrSum(cost, k, v) {
    const tr = temRootClone('acqTabTr_tem');
    tr.querySelector('._cost').textContent = cost.toFixed(2);
    tr.querySelector(k).textContent = v;
    return tr;
}

function acqTabFill(acqV) {
    const tbody = document.getElementById('acqTab').querySelector('TBODY');
    let cost = 0.0;
    const costByKw = {};
    const costByBuyr = {};
    const costByFro = {};
    for(const acq of acqV) {
	tbody.appendChild(acqTabTr(acq));
	cost += acq.cost;
	for(const kw of acq.kws) {
	    costByKw[kw] = (costByKw[kw] ?? 0.0) + acq.cost;
	}
	costByBuyr[acq.buyr] = (costByBuyr[acq.buyr] ?? 0.0) + acq.cost;
	costByFro[acq.fro] = (costByFro[acq.fro] ?? 0.0) + acq.cost;
    }
    for(const [kw,cost] of Object.entries(costByKw))
	tbody.appendChild(acqTabTrSum(cost, '._kws', kw));
    for(const [buyr,cost] of Object.entries(costByBuyr))
	tbody.appendChild(acqTabTrSum(cost, '._buyr', buyr));
    for(const [fro,cost] of Object.entries(costByFro))
	tbody.appendChild(acqTabTrSum(cost, '._fro', fro));
    tbody.appendChild(acqTabTrSum(cost, '._part', 'total'));
}

//-----------------------------------------------------------------------------------------------------------------------
// AcqV bill of materials
//-----------------------------------------------------------------------------------------------------------------------

var AcqV = [
    new Acq(7833.8848,  32,  32, ['panel'], 's', 'platt', PanelSil360, null),

    new Acq( 182.094,   31,  24, ['rack'], 's', 'platt', IronRidgeCamo, null),
    new Acq(  23.40,   100, 100, ['rack'], 'm', 'amazon', Part.nu('Heyco Wire Clip Double'), null),
    new Acq(  15.29,   100, 100, ['rack'], 'm', 'amazon', Part.nu('Qjaine Wire Clip Double'), null),
    new Acq(   0.00,    30,  30, ['rack'], 'm', 'm', Part.nu('Wire Clip Single'), null),
    new Acq( 943.0080,  76,  69, ['rack'], 's', 'platt', IronRidgeFoot, null),
    new Acq(  57.12,     8,   7, ['rack'], 's', 'platt', IronRidgeGroundLug, null),
    new Acq(  57.78,    36,  32, ['rack'], 's', 'platt', IronRidgeBolt, null),
    new Acq( 486.3375,  11,  11, ['rack'], 's', 'platt', IronRidgeXR10Rail168, null),
    new Acq(  44.2125,   1,   1, ['rack'], 's', 'platt', IronRidgeXR10Rail168, null),
    new Acq( 214.4700,   4,   4, ['rack'], 's', 'platt', IronRidgeXR10Rail204, null),
    new Acq(  44.505,    6,   6, ['rack'], 's', 'platt', IronRidgeXR10Splice, null),
    new Acq( 128.1360,  76,  70, ['rack'], 's', 'platt', IronRidgeBolt, null),
    new Acq( 139.9680,  48,  48, ['rack'], 's', 'platt', IronRidgeUfo, null),
    new Acq(  29.1600,   8,   6, ['rack'], 's', 'platt', IronRidgeUfo, null),
    new Acq(   2.58,     4,   4, ['rack'], 's', 'platt', IronRidgeStopper38, null),
    new Acq( 158.10,     8,   5, ['rack'], 's', 'platt', IronRidgeConduitFoot, null),
    new Acq(  23.2600,   2,   2, ['rack'], 's', 'platt', PenetrationFlashing, null),
    new Acq(  48.00,     6,   5, ['rack'], 'm', 'abc', Part.nu('Geocel 2300 Construction Tripolymer Sealant'), null),
    
    new Acq(3589.1900,   1,   1, ['inverter'], 's', 'platt', SolarEdgeSe11400h_ussnbbl14, null),
    new Acq(  83.2324,   2,   2, ['inverter'], 's', 'platt', SolarEdgeCt225, null),
    new Acq(   0.00,    32,  32, ['inverter'], 'm', 'm', SolarEdgeP400, null),
    new Acq(   3.96,     6,   6, ['inverter'], 'm', 'beaumont', Part.nu('Screw #12 x 2" SS'), null),
    new Acq(   1.98,     6,   6, ['inverter'], 'm', 'beaumont', Part.nu('Washer 1/4" SS'), null),
    
    new Acq(  66.03,     1,   1, ['elec'], 's', 's', DisconnectGnf222ra, null),
    new Acq(  29.85,     1,   1, ['elec'], 'm', 'hd', BreakerQ22020CTU, null),
    new Acq(  27.79,     1,   1, ['elec'], 'm', 'ebay', BreakerQ260, null),
    new Acq(   5.00,     1,   1, ['elec'], 'm', 'm', Part.nu('Conduit Body C 1"'), null),
    new Acq(  10.48,     1,   1, ['elec'], 'm', 'lowes', Part.nu('Conduit Body LB 1"'), null),
    new Acq(   7.28,     1,   1, ['elec'], 'm', 'lowes', Part.nu('Conduit Body LB 3/4"'), null),
    new Acq(   7.00,     1,   1, ['elec'], 'm', 'm', Part.nu('Conduit Body LL 3/4"'), null),
    new Acq(   8.90,     1,   1, ['elec'], 'm', 'ebay', Part.nu('Conduit Body LR 1"'), null),
    new Acq(  10.74,     1,   1, ['elec'], 'm', 'ebay', Part.nu('Conduit Body T 1"'), null),
    new Acq(   1.50,     1,   1, ['elec'], 'm', 'm', Part.nu('C-Tap Crimp Blue'), null),
    new Acq(   4.00,     2,   2, ['elec'], 'm', 'm', Part.nu('C-Tap Crimp Gray'), null),
    new Acq(  19.90,     1,   1, ['elec'], 'm', 'aboy', Part.nu('EMT 1" x 10ft'), null),
    new Acq(  21.00,     1,   1, ['elec'], 'm', 'hd', Emt1_10, null),
    new Acq( 156.4785, 100,  70, ['elec'], 's', 'platt', Emt34_10, null),
    new Acq(  26.9598,   6,   6, ['elec'], 's', 'platt', EmtConnector1, null),
    new Acq(  23.62,    25,  14, ['elec'], 'm', 'hd', EmtConnector34, null),
    new Acq(   1.00,     2,   2, ['elec'], 'm', 'm', EmtCoupling34, null),
    new Acq(  12.00,     2,   2, ['elec'], 'm', 'm', Part.nu('Ground Bushing 1"'), null),
    new Acq(  16.00,     4,   4, ['elec'], 'm', 'm', Part.nu('Ground Bushing 3/4"'), null),
    new Acq(   2.00,     4,   4, ['elec'], 'm', 'm', Part.nu('Ground Lug Al (not exposed)'), null),
    new Acq(  10.00,     2,   2, ['elec'], 'm', 'm', Part.nu('Ground Lug Cu/Sn (exposed)'), null),
    new Acq(  11.6025,   1,   1, ['elec'], 's', 'platt', GroundLugCuSn, null),
    new Acq(  20.84,     1,   1, ['elec'], 'm', 'ebay', Part.nu('ECHA075 Siemens Hub for Disconnect'), null),
    new Acq(   0.00,     2,   2, ['elec'], 'm', 'm', Part.nu('Locknut 1"'), null),
    new Acq(   0.00,     2,   2, ['elec'], 'm', 'm', Part.nu('Locknut 3/4"'), null),
    new Acq(   4.00,     4,   4, ['elec'], 'm', 'm', Part.nu('PV-KBT4/6II-UR MC-4 Connector Male'), null),
    new Acq(   4.00,     4,   4, ['elec'], 'm', 'm', Part.nu('PV-KST4/6I-UR MC-4 Connector Female'), null),
    new Acq(   2.00,     1,   1, ['elec'], 'm', 'm', Part.nu('Rigid Nipple 1" x 3"'), null),
    new Acq(   2.42,     1,   1, ['elec'], 'm', 'hd', RigidCoupling34, null),
    new Acq(   2.97,     1,   1, ['elec'], 'm', 'hd', RigidNipple34_6, null),
    new Acq(   4.74,     3,   3, ['elec'], 'm', 'hd', RigidReducingBushing1_34, null),
    new Acq(   3.143,   10,   1, ['elec'], 's', 'platt', ReducingWasher1_34, null),
    new Acq( 192.0800, 500,  62, ['elec'], 's', 'platt', Wire10StrGrn, null),
    new Acq( 494.9440, 500, 320, ['elec'], 's', 'platt', Wire10Pv, null),
    new Acq( 199.00,   315,  25, ['elec'], 'm', 'ebay', Part.nu('6 AWG Bare Solid 315FT'), null),
    new Acq(   8.88,     6,   6, ['elec'], 'm', 'hd', Wire6StrBlk, null),
    new Acq(   3.00,     3,   3, ['elec'], 'm', 'm', Wire6StrBlk, null),
    new Acq(   9.00,     9,   9, ['elec'], 'm', 'm', Wire6StrRed, null),
    new Acq(   9.00,     9,   9, ['elec'], 'm', 'm', Wire6StrWht, null),
    new Acq(   8.48,     1,   1, ['elec'], 'm', 'lowes', Part.nu('Paint Matte Black Spray'), null),
    new Acq(  10.50,     1,   1, ['elec'], 'm', 'beaumont', Part.nu('Paint Galvanizing Spray'), null),
];

//-----------------------------------------------------------------------------------------------------------------------
// leftover
//-----------------------------------------------------------------------------------------------------------------------

function leftoverTabTr(acq) {
    acq.leftQty = acq.qty - acq.qtyUsed;
    acq.leftCost = acq.cost * acq.leftQty / acq.qty;

    const tr = temRootClone('leftoverTabTr_tem');
    tr.querySelector('._cost').textContent = acq.cost.toFixed(2);
    tr.querySelector('._qty').textContent = acq.qty;
    tr.querySelector('._leftQty').textContent = acq.leftQty;
    tr.querySelector('._leftCost').textContent = acq.leftCost.toFixed(2);
    acq.part.descFill(tr.querySelector('._part'));
    return tr;
}

function leftoverTabTrSum(leftCost, k, v) {
    const tr = temRootClone('leftoverTabTr_tem');
    tr.querySelector('._leftCost').textContent = leftCost.toFixed(2);
    tr.querySelector(k).textContent = v;
    return tr;
}

function leftoverTabFill(acqV) {
    const tbody = document.getElementById('leftoverTab').querySelector('TBODY');
    let leftCost = 0.0;
    for(const acq of acqV) {
	if(acq.qtyUsed < acq.qty
	   && 's' == acq.buyr
	   && acq.kws.includes('elec')) {
	    tbody.appendChild(leftoverTabTr(acq));
	    leftCost += acq.leftCost;
	}
    }
    tbody.appendChild(leftoverTabTrSum(leftCost, '._part', 'total'));
}

//-----------------------------------------------------------------------------------------------------------------------
// main
//-----------------------------------------------------------------------------------------------------------------------

function bodyOnload() {
    acqTabFill(AcqV);
    leftoverTabFill(AcqV);
}
