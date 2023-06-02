//todo roof cross section
//todo wire diameter/area and conduit fill
//todo one inverter take out ac switch
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
const FootSpan = 2.54*48.0 + 4.0;
const FootSpanEdge = 2.54*24.0 + 4.0;

//-----------------------------------------------------------------------------------------------------------------------
// helpers
//-----------------------------------------------------------------------------------------------------------------------

function byIdHtml(...args) { var d = {}; for(const arg of args) d[arg.IdHtml] = arg; return d; }

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

function temRoot(id) { return document.getElementById(id).content.firstElementChild; }
function temClone(id) { return temRoot(id).cloneNode(/*deep=*/true); }

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
