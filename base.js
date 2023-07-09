//todo breaker calculations can use breakerPlex 
//todo allow for multiple options to meet a part requirement (breakers?)
//todo part.js desBox make/model hardcoded should not be
//todo LoadcenterPart auto-determines main breaker downsize
//todo foot within EdgeFootDist requires next one within 24"
//todo wire diameter/area and conduit fill
//todo parts instantiable, loadcenter, panel
//todo site config connects parts with wires, one-line lays them out with minimal help
//todo convert to svg
//todo convert base unit to mm
//todo choose units to display in
//todo svgNu and eleNu make consistent argument ordering etc

//-----------------------------------------------------------------------------------------------------------------------
// constants
//-----------------------------------------------------------------------------------------------------------------------

const CantiMax = 2.54*24;
const EdgeFootDist = 2.54*36;
const EdgeFootDist2 = EdgeFootDist*EdgeFootDist;
const EdgeWidth = 2.54 * 36;
const FireWalkWidth = 2.54 * 36;
const FootSpanMax = 2.54*48.0 + 4.0;
const FootSpanMaxEdge = 2.54*24.0 + 4.0;

//-----------------------------------------------------------------------------------------------------------------------
// javascript helpers
//-----------------------------------------------------------------------------------------------------------------------

function pushItem(array, item) {
    array.push(item);
    return item;
}

//-----------------------------------------------------------------------------------------------------------------------
// dom element helpers
//-----------------------------------------------------------------------------------------------------------------------

function eleClas(ele, clas) { ele.classList.add(clas); return ele; }

function eleNu(tag) { return document.createElement(tag); }
function eleNuAdd(tag, dst) { return dst.appendChild(document.createElement(tag)); }
function eleNuClas(tag, clas) {
    const ele = document.createElement(tag);
    ele.classList.add(clas);
    return ele;
}
function eleNuClasAdd(tag, clas, dst) {
    const ele = dst.appendChild(document.createElement(tag));
    ele.classList.add(clas);
    return ele;
}

//-----------------------------------------------------------------------------------------------------------------------
// template helpers
//-----------------------------------------------------------------------------------------------------------------------

function temRoot(id) { return document.getElementById(id).content.firstElementChild; }
function temClone(id) { return temRoot(id).cloneNode(/*deep=*/true); }

//-----------------------------------------------------------------------------------------------------------------------
// toString helpers
//-----------------------------------------------------------------------------------------------------------------------

function toFixedMax(x, prec) {
    const a = x.toString();
    const b = x.toFixed(prec);
    return a.length <= b.length ? a : b;
}    

function toFixedMinMax(x, precMin, precMax) {
    const a = x.toString();
    const b = x.toFixed(precMin);
    const c = x.toFixed(precMax);
    return c.length < a.length ? c
	: b.length > a.length ? b
	: a;
}

//-----------------------------------------------------------------------------------------------------------------------
// EnvBase
//-----------------------------------------------------------------------------------------------------------------------

class EnvBase {
    constructor() {
	//this.partTab
	this.mark = 0;
    }

    drawrNu() {	return DrawrNopSingleton; }

    log(msg) {}

    markAlloc() { return ++this.mark; }
    
    oneObjReg(obj) {}
    
    railGroupDiagNu() { return RailGroupDiagNopSingleton; }
    
    terminate() {}

    wkrReq(...argV) {}
}

//-----------------------------------------------------------------------------------------------------------------------
// SiteBase
//-----------------------------------------------------------------------------------------------------------------------

class SiteBase {
    constructor(env) {
	this.env = env;
    }

    layoutFin() {
	this.rack.layoutFin();
    }
}

