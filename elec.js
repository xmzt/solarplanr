const OneBoxLabelPad = 10;

//-----------------------------------------------------------------------------------------------------------------------
// Port
//-----------------------------------------------------------------------------------------------------------------------

class Port2 {
    constructor(up) {
	this.up = up;
	//this.mate todo nop mate if left unconnected
	//this.con todo
    }
    
    isourceIsinkTx(isource, isink) {
	this.mate.isourceIsinkRx(isource, isink);
    }

    isourceIsinkRx(isource, isink) {}
    
    oneBoxX0Get() { return this.up.oneBox.x0Get(); }

    oneBoxX0Set(mark, x) {
	if(this.up.oneBox.x0Set(mark, x)) {
	    this.up.oneUpdate();
	}
    }

    oneBoxX1Get() { return this.up.oneBox.x1Get(); }

    oneBoxX1Set(mark, x) {
	if(this.up.oneBox.x1Set(mark, x)) {
	    this.up.oneUpdate();
	}
    }
	    
    oneBoxY0Get() { return this.up.oneBox.y0Get(); }

    oneBoxY0Set(mark, y) {
	if(this.up.oneBox.y0Set(mark, y)) {
	    this.up.oneUpdate();
	}
    }

    oneConPGet() { return this.up.oneBox.ready() ? new P2(this.oneXGet(), this.oneYGet()) : null; }

    oneXGet() { return this.up.oneBox.x0 - this.up.oneBox.ele.getBBox().x; }
    
    oneYGet() { return this.up.oneBox.y0 - this.up.oneBox.ele.getBBox().y; }

    oneYSet(mark, y) {
	if(this.up.oneBox.y0Set(mark, y + this.up.oneBox.ele.getBBox().y)) {
	    this.up.oneUpdate();
	}
    }
}

class Port2Bi extends Port2 {
    static nuPair(aUp, bUp) {
	const a = new this(aUp);
	const b = new this(bUp);
	a.biMate = b;
	b.biMate = a;
	return [a,b];
    }

    isourceIsinkRx(isource, isink) {
	this.biMate.isourceIsinkTx(isource, isink);
    }

    oneBoxX0Set(mark, x) {
	if(this.up.oneBox.x0Set(mark, x)) {
	    this.biMate.mate.oneBoxX0Set(mark, this.up.oneBox.x1Get() + 10);
	}
    }

    oneBoxX1Set(mark, x) {
	if(this.up.oneBox.x1Set(mark, x)) {
	    this.biMate.mate.oneBoxX1Set(mark, this.up.oneBox.x0Get() - 10);
	}
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// Portcon
//-----------------------------------------------------------------------------------------------------------------------

class Portcon {
    constructor(env, a, b) {
	//todo error if already connected
	this.env = env;
	this.a = a;
	this.b = b;
	a.mate = b;
	b.mate = a;
	b.con = a.con = this;
	env.oneObjReg(this);
    }

    oneInit(dst) {
	this.oneEle = svgNuClasAdd('path', 'strok', dst);
    }

    oneDraw(aP, bP) {
	this.oneEle.setAttribute('d', `M${aP.x},${aP.y} L${bP.x},${bP.y}`);
    }

    oneUpdate() {
	const aP = this.a.oneConPGet();
	const bP = this.b.oneConPGet();
	if(null !== aP && null !== bP) {
	    this.oneDraw(aP, bP);
	}
    }

    oneUpdateU(yFun) {
	this.oneDraw = (aP, bP) => { this.oneEle.setAttribute('d', `M${aP.x},${aP.y} V${yFun()} H${bP.x} V${bP.y}`); };
	this.oneUpdate();
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// OneBox
//-----------------------------------------------------------------------------------------------------------------------

class OneBox {
    constructor(up, ele) {
	//todo this.up = up;
	this.ele = ele;
	this.x0 = null;
	this.xMark = null;
	this.y0 = null;
	this.yMark = null;
	
	// outline box and label
	const r = ele.getBBox();
	const b = svgNuClasAdd('rect', 'group', ele);
	const t = svgTextNuClasAdd('label', ele, up.id);
	const tr = t.getBBox();
	const tpad = tr.height + tr.y;
	let bx = r.x - OneBoxLabelPad;
	const by = r.y - OneBoxLabelPad - tpad - tr.height;
	const bh = r.y + r.height + OneBoxLabelPad - by;
	let bw = r.width + OneBoxLabelPad + OneBoxLabelPad;
	const bw1 = tr.width + tpad + tpad;
	if(bw1 >= bw) {
	    bx -= 0.5*(bw1 - bw);
	    bw = bw1;
	}
	svgSetXYWH(b, bx, by, bw, bh);
	svgSetXY(t, bx + tpad, by + tr.height);
    }

    ready() { return null !== this.x0 && null !== this.y0; }
    
    update() {
	if(this.ready()) {
	    const r = this.ele.getBBox();
	    const mat =  new DOMMatrix([1,0,0,1, this.x0 - r.x, this.y0 - r.y]);
	    this.ele.setAttribute('transform', mat.toString());
	}
    }

    x0Get() { return this.x0; }
    
    x0Set(mark, x) {
	if(mark != this.xMark) {
	    this.xMark = mark;
	    if(x != this.x0) {
		this.x0 = x;
		return true;
	    }
	}
	return false;
    }

    x1Get() { return this.x0 + this.ele.getBBox().width; }
    
    x1Set(mark, x) { return this.x0Set(mark, x - this.ele.getBBox().width); }

    y0Get() { return this.y0; }
    
    y0Set(mark, y) {
	if(mark != this.yMark) {
	    this.yMark = mark;
	    if(y != this.y0) {
		this.y0 = y;
		return true;
	    }
	}
	return false;
    }
    
    y1Get() { return this.y0 + this.ele.getBBox().height; }

    y1Set(mark, y) { return this.y0Set(mark, y - this.ele.getBBox().height); }
}
    
//-----------------------------------------------------------------------------------------------------------------------
// Conduit
//-----------------------------------------------------------------------------------------------------------------------

class Conduit {
    constructor(env, id, ...conV) {
	this.env = env;
	this.id = id;
	this.conV = conV;
	env.oneObjReg(this);
    }

    oneInit(dst) {
	this.oneEle = svgNuClasAdd('ellipse', 'strok', dst);
    }
}

class TodoConduit {
    constructor(dst, x, y, ry, lab, part, len, ...wirePartV) {
	svgSetCxCyRxRy(svgNuClasAdd('ellipse', 'strok', dst), x, y, 0.75*ry, ry);
	y += ry;
	svgNuPathDClasAdd(`M${x},${y} v20`, 'strok', dst);
	y += 20;
	const t = svgTextNuClasAdd('label', dst, lab);
	const tr = t.getBBox();
	svgSetXY(t, x - 0.5*tr.width, y + tr.height);
	this.lab = lab;
	this.part = part;
	this.len = len;
	this.wirePartV = wirePartV;
    }
    
    desBox() {
	const wirePartQtyD = {};
	for(const part of this.wirePartV) {
	    const partQty = wirePartQtyD[-part.sortid] ??= [ part, 0 ];
	    ++partQty[1];
	}

	const box = eleNuClas('div', 'desBox');
	const head = eleNuAdd('div', box);
	eleNuAdd('span', head).innerHTML = this.lab;
	eleNuAdd('span', head).innerHTML = 'Conduit';
	this.part.desBoxHeadFill(eleNuAdd('div', box));
	const tab = eleNuClasAdd('table', 'desBoxTab', box);
	let tr = tab.createTHead().insertRow(-1);
	tr.insertCell(-1).textContent = 'Quantity';
	tr.insertCell(-1).textContent = 'Wire';
	const tbody = tab.createTBody();
	for(const [part,qty] of Object.values(wirePartQtyD)) {
	    tr = tbody.insertRow(-1);
	    tr.insertCell(-1).textContent = qty;
	    tr.insertCell(-1).textContent = `${part.awg} AWG, ${part.typ}, ${part.color}`;
	}
	return box;
    }
}
    
//-----------------------------------------------------------------------------------------------------------------------
// Ct
//-----------------------------------------------------------------------------------------------------------------------

class Ct {
    constructor(dst, x, y, lab) {
	svgUseXYHrefAdd(x, y, '#ctL_R8', dst);
	const t = svgTextNuClasAdd('label', dst, lab);
	const tr = t.getBBox();
	const tpad = tr.height + tr.y;
	svgSetXY(t, x + 2 + tpad, y - 0.5*tr.y);
	this.lab = lab;
	this.link = [ x - 2, y + 0 ];
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// Disco
//-----------------------------------------------------------------------------------------------------------------------

class Disco {
    constructor(env, id, partSub, part) {
	this.env = env;
	this.id = id;
	this.part = part;
	partSub.partAdd(part, 1);
	[this.linePort, this.loadPort] = DiscoPort.nuPair(this, this);
	env.oneObjReg(this);
    }

    desBox(id, n) {
	return desBox(
	    id, 'AC Disconnect',
	    `Make: ${this.make}`,
	    `Model: ${this.model}`,
	    `${this.phase}, ${this.pole} pole, ${this.imax}A, ${this.enclosure}`,
	    `Quantity: ${n}`,
	);
    }

    imaxSet(imax) {
	const rating = 1.25 * imax;
	this.env.log(`${this.id}: imax=${imax} rating=${rating}`);
    }

    oneInit(dst) {
	const g = svgNuAdd('g', dst);
	svgUseXYHrefAdd(0, 0, '#sw_24x0', g);
	this.oneBox = new OneBox(this, g);
	this.loadPort.oneX = this.linePort.oneX = null;
    }

    oneUpdate() {
	this.oneBox.update();
	this.linePort.con.oneUpdate();
	this.loadPort.con.oneUpdate();
    }
}

class DiscoPort extends Port2Bi {
    oneConPGet() { return this.up.oneBox.ready() ? new P2(this.oneX, this.oneYGet()) : null; }

    oneBoxX0Set(mark, x) {
	if(this.up.oneBox.x0Set(mark, x)) {
	    const a = this.oneX = this.oneXGet();
	    this.biMate.oneX = a + 24;
	    this.biMate.mate.oneBoxX0Set(mark, this.up.oneBox.x1Get() + 10);
	}
    }

    oneBoxX1Set(mark, x) {
	if(this.up.oneBox.x1Set(mark, x)) {
	    const a = this.biMate.oneX = this.oneXGet();
	    this.oneX = a + 24;
	    this.biMate.mate.oneBoxX1Set(mark, this.up.oneBox.x0Get() - 10);
	}
    }

    oneYSet(mark, y) {
	if(this.up.oneBox.y0Set(mark, y + this.up.oneBox.ele.getBBox().y)) {
	    this.biMate.mate.oneYSet(mark, y);
	    this.up.oneUpdate();
	}
    }

}

//-----------------------------------------------------------------------------------------------------------------------
// Inv
//-----------------------------------------------------------------------------------------------------------------------

class Inv {
    constructor(env, id, partSub, part) {
	this.env = env;
	this.id = id;
	this.partSub = partSub;
	this.part = part;
	this.dcPortV = [];
	this.acPort = new SolarEdgeInvAcPort(this);
	env.oneObjReg(this);
    }

    dcConV() { return this.dcPortV.map(x => x.con); }
    
    desBox(id, n) {
	return desBox(
	    id, 'Inverter',
	    `Make: ${this.make}`,
	    `Model: ${this.model}`,
	    `AC Output: ${this.acW}W(max), ${this.acIMax}A(max) @ ${this.acV}V`,
	    `DC Input: ${this.dcW}W(max), ${this.dcVMax}V(max), ${this.dcVNom}V(nominal), ${this.dcIMax}A(max)`,
	    `Quantity: ${n}`,
	);
    }

    oneInit(dst) {
	const g = svgNuAdd('g', dst);
	svgUseXYHrefAdd(0, 0, '#inverter', g);
	svgNuPathDClasAdd(`M0,0 H${-6*(this.dcPortV.length-1)}`, 'strok', g);
	this.oneBox = new OneBox(this, g);
    }

    stringNuString(string) {
	const port = pushItem(this.dcPortV, new Port2(this));
	new Portcon(this.env, port, string.port);
	return string;
    }

    stringNu(id) { return this.stringNuString(new Modstring(this.env, id)); }
}
    
class SolarEdgeInv extends Inv {
    constructor(env, id, partSub, part, ac) {
	super(env, id, partSub, part, ac);
	partSub.partAdd(part, 1);
	partSub.partAdd(ScrewSs, 6);
	partSub.partAdd(WasherSs, 6);
	partSub.partAdd(SolarEdgeCt225, 2);
    }

    oneUpdate() {
	this.oneBox.update();
	for(const port of this.dcPortV) 
	    port.con.oneUpdateU(() => this.oneBox.y1Get() + 10 + 6*port.index);
	this.acPort.con.oneUpdate();
    }

    stringFin() {
	// also todo calculate based on panels and use min of that and part.imax
	this.env.log(`${this.id}: imax=${this.part.acImax}`);
	this.acPort.isourceIsinkTx(this.part.acImax, 0);
    }

    stringNu(id) { return this.stringNuString(new ModstringOpt(this.env, id, this.partSub)); }

    stringNuString(string) {
	const port = pushItem(this.dcPortV, new SolarEdgeInvDcPort(this, this.dcPortV.length));
	new Portcon(this.env, port, string.port);
	return string;
    }
}

class SolarEdgeInvPort extends Port2 {
    oneBoxX0Set(mark, x) {
	if(this.up.oneBox.x0Set(mark, x)) {
	    this.up.dcPortV[0].mate.oneBoxX1Set(mark, this.up.oneBox.x0Get() - 10);
	    this.up.acPort.mate.oneBoxX0Set(mark, this.up.oneBox.x1Get() + 10);
	    this.up.oneUpdate();
	}
    }

    oneYSetRx(mark) {
	const mateY = this.mate.oneYGet();
	if(this.up.oneBox.y0Set(mark, mateY + this.up.oneBox.ele.getBBox().y)) {
	    for(const port of this.up.dcPortV)
		port.mate.oneYSet(mark, mateY);
	    this.up.acPort.mate.oneYSet(mark, mateY);
	    this.up.oneUpdate();
	}
    }
}

class SolarEdgeInvDcPort extends SolarEdgeInvPort {
    constructor(up, index) {
	super(up);
	this.index = index;
	//this.xOff = 10 + 6 * (this.up.dcPortV.length - 1 - index);
    }

    oneXGet() {
	return this.up.oneBox.x0 - this.up.oneBox.ele.getBBox().x - 6*(this.up.dcPortV.length - 1 - this.index);
    }
    
    oneXSetRx(mark) {
	let i = this.index + 1;
	if(this.up.dcPortV.length > i)
	    this.up.dcPortV[i].mate.oneBoxX1Set(mark, this.mate.oneBoxX0Get() - 10);

	i = this.index - 1;
	if(0 <= i)
	    this.up.dcPortV[i].mate.oneBoxX0Set(mark, this.mate.oneBoxX1Get() + 10);
	else
	    this.oneBoxX0Set(mark, this.mate.oneBoxX1Get() + 10);
    }
}

class SolarEdgeInvAcPort extends SolarEdgeInvPort {
    oneXGet() {	return this.up.oneBox.x0 - this.up.oneBox.ele.getBBox().x + 60; }
}

//-----------------------------------------------------------------------------------------------------------------------
// Loadcenter
//-----------------------------------------------------------------------------------------------------------------------

class Loadcenter {
    constructor(env, id, partSub, part, mainBreakerPart) {
	this.env = env;
	this.id = id;
	this.partSub = partSub;
	this.part = part;
	this.mainBreakerPart = mainBreakerPart;
	this.mainPort = new LoadcenterMainPort(this);
	this.farPortV = [];
	this.farPortReadyN = 0;
	this.farSourceSum = 0;
	env.oneObjReg(this);
    }

    desBox(id, n) {
	return desBox(
	    id, 'Inverter',
	    `Make: ${this.make}`,
	    `Model: ${this.model}`,
	    `${this.phase}, ${this.ibus}A, ${this.spaceN} spaces, ${this.enclosure}`,
	    //todo`Breaker, main: ${this.mainBreakerA}A ${this.mainBreakerPart.model}`,
	    //`Breaker, inverter: ${this.ocpdInvA}A ${this.ocpdInvPart.model}`,
	    `Quantity: ${n}`,
	);
    }

    farPortNu() { return pushItem(this.farPortV, new LoadcenterFarPort(this)); }

    farPortReady() {
	// NEC 705.12(D)(2)
	// todo verify phase
	const ibus = this.part.ibus;
	const ilim = 1.2 * ibus - this.farSourceSum;
	const log0 = `${this.id}: main ibus=${ibus} farSourceSum=${this.farSourceSum} ilim=${ilim}`;
	if(null !== this.mainBreakerPart) {
	    const ibreaker = this.mainBreakerPart.itrip;
	    if(ibreaker > ilim) {
		const part = this.part.mainBreakerLe(ilim);
		this.env.log(`${log0} breaker=${ibreaker} DOWNSIZE=${part.itrip}`);
		this.partSub.partAdd(part, 1);
	    }
	    else {
		this.env.log(`${log0} breaker=${ibreaker}`);
	    }
	}
	else {
	    const part = this.part.mainBreakerLe(ilim);
	    this.env.log(`${log0}, breaker=${part.itrip}`);
	    this.partSub.partAdd(part, 1);
	}
    }

    oneInit(dst) {
	const g = svgNuAdd('g', dst);
	svgUseXYHrefAdd(0, 0, '#loadcenter', g);
	this.oneBox = new OneBox(this, g);
	// todo add links for mates
    }

    oneUpdate() {
	this.oneBox.update();
	for(const port of this.farPortV)
	    port.con.oneUpdate();
	this.mainPort.con.oneUpdate();
    }
}

class LoadcenterFarPort extends Port2 {
    isourceIsinkRx(isource, isink) {
	// todo NEC reference 210.20?
	const itrip = 1.25 * Math.max(isource,isink);
	const part = this.up.part.breakerGe(itrip);
	this.up.env.log(`${this.up.id}: far isource,isink=${isource},${isink} itrip=${itrip} breaker=${part.itrip}`);
	this.up.partSub.partAdd(part, 1);
	this.up.farSourceSum += 1.25 * isource;
	if(++this.up.farPortReadyN == this.up.farPortV.length)
	    this.up.farPortReady();
    }

    oneBoxX0Set(mark, x) {
	if(this.up.oneBox.x0Set(mark, x)) {
	    this.up.mainPort.mate.oneBoxX0Set(mark, this.up.oneBox.x1Get() + 10);
	    this.up.oneUpdate();
	}
    }

    oneBoxX1Set(mark, x) {
	if(this.up.oneBox.x1Set(mark, x)) {
	    this.up.mainPort.mate.oneBoxX1Set(mark, this.up.oneBox.x0Get() - 10);
	    this.up.oneUpdate();
	}
    }

    oneXGet() { return this.up.oneBox.x0 - this.up.oneBox.ele.getBBox().x - 18; }

    oneYGet() { return this.up.oneBox.y0 - this.up.oneBox.ele.getBBox().y + 110; }

    oneYSet(mark, y) {
	if(this.up.oneBox.y0Set(mark, y + this.up.oneBox.ele.getBBox().y - 110)) {
	    this.up.mainPort.mate.oneYSet(mark, this.up.oneBox.y0 - this.up.oneBox.ele.getBBox().y + 0);
	    this.up.oneUpdate();
	}
    }
}

class LoadcenterMainPort extends Port2 {
    oneBoxX0Set(mark, x) {
	if(this.up.oneBox.x0Set(mark, x)) {
	    for(const port of this.up.farPortV)
		port.mate.oneBoxX0Set(mark, this.up.oneBox.x1Get() + 10);
	    this.up.oneUpdate();
	}
    }

    oneBoxX1Set(mark, x) {
	if(this.up.oneBox.x1Set(mark, x)) {
	    for(const port of this.up.farPortV)
		port.mate.oneBoxX1Set(mark, this.up.oneBox.x0Get() - 10);
	    this.up.oneUpdate();
	}
    }

    oneYSet(mark, y) {
	if(this.up.oneBox.y0Set(mark, y + this.up.oneBox.ele.getBBox().y)) {
	    for(const port of this.up.farPortV)
		port.mate.oneYSet(mark, y);
	    this.up.oneUpdate();
	}
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// Meter
//-----------------------------------------------------------------------------------------------------------------------

class Meter {
    constructor(env, id) {
	this.env = env;
	this.id = id;
	[this.linePort, this.loadPort] = MeterPort.nuPair(this, this);
	env.oneObjReg(this);
    }

    imaxSet(imax) {
	this.env.log(`${this.id}: imax=${imax}`);
    }

    oneInit(dst) {
	const g = svgNuAdd('g', dst);
	svgUseXYHrefAdd(0, 0, '#meter_R8', g);
	this.oneBox = new OneBox(this, g);
    }

    oneUpdate() {
	this.oneBox.update();
	this.linePort.con.oneUpdate();
	this.loadPort.con.oneUpdate();
    }
}

class MeterPort extends Port2Bi {
    oneConPGet() { return this.up.oneBox.ready() ? new P2(this.oneX, this.oneYGet()) : null; }

    oneBoxX0Set(mark, x) {
	if(this.up.oneBox.x0Set(mark, x)) {
	    const a = this.oneXGet();
	    this.oneX = a - 8;
	    this.biMate.oneX = a + 8;
	    this.biMate.mate.oneBoxX0Set(mark, this.up.oneBox.x1Get() + 10);
	}
    }

    oneBoxX1Set(mark, x) {
	if(this.up.oneBox.x1Set(mark, x)) {
	    const a = this.oneXGet();
	    this.biMate.oneX = a - 8;
	    this.oneX = a + 8;
	    this.biMate.mate.oneBoxX1Set(mark, this.up.oneBox.x0Get() - 10);
	}
    }

    oneYSet(mark, y) {
	if(this.up.oneBox.y0Set(mark, y + this.up.oneBox.ele.getBBox().y)) {
	    this.biMate.mate.oneYSet(mark, y);
	    this.up.oneUpdate();
	}
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// Modstring
//-----------------------------------------------------------------------------------------------------------------------

class Modstring {
    constructor(env, id) {
	this.env = env;
	this.id = id;
	this.panelV = [];
	env.oneObjReg(this);
    }

    panelAdd(panel) {
	panel.string = this;
	this.panelV.push(panel);
    }
}

class ModstringOpt extends Modstring {
    constructor(env, id, partSub) {
	super(env, id);
	this.partSub = partSub;
	this.port = new ModstringPort(this);
    }

    panelAdd(panel, optPart) {
	super.panelAdd(panel);
	panel.optPart = optPart;
	this.partSub.partAdd(optPart, 1);
	panel.rack.optMount(this.partSub);
    }

    oneInit(dst) {
	const g = svgNuAdd('g', dst);
	svgUseXYHrefAdd(0, 0, '#stringOpt', g);
	this.oneBox = new OneBox(this, g);
    }

    oneUpdate() {
	this.oneBox.update();
	this.port.con.oneUpdate();
    }
}

class ModstringPort extends Port2 {
    oneBoxX0Set(mark, x) {
	if(this.up.oneBox.x0Set(mark, x)) {
	    this.mate.oneXSetRx(mark);
	    this.up.oneUpdate();
	}
    }

    oneBoxX1Set(mark, x) {
	if(this.up.oneBox.x1Set(mark, x)) {
	    this.mate.oneXSetRx(mark);
	    this.up.oneUpdate();
	}
    }

    oneBoxY0Set(mark, y) {
	if(this.up.oneBox.y0Set(mark, y)) {
	    this.mate.oneYSetRx(mark);
	    this.up.oneUpdate();
	}
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// Utility
//-----------------------------------------------------------------------------------------------------------------------

class Utility {
    constructor(env, id) {
	this.env = env;
	this.id = id;
	this.linePort = new UtilityLinePort(this);
	env.oneObjReg(this);
    }

    oneInit(dst) {
	const g = svgNuAdd('g', dst);
	svgUseXYHrefAdd(0, 0, '#utility', g);
	this.oneBox = new OneBox(this, g);
    }

    oneUpdate() {
	this.oneBox.update();
	this.linePort.con.oneUpdate();
    }
}

class UtilityLinePort extends Port2 {
}

