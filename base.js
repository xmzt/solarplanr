//-----------------------------------------------------------------------------------------------------------------------
// constants
//-----------------------------------------------------------------------------------------------------------------------

const EdgeFootDist = 2.54*36;
const EdgeFootDist2 = EdgeFootDist*EdgeFootDist;
const CantiMax = 2.54*24;
const FootSpan = 2.54*48.0 + 2.0;
const FootSpanEdge = 2.54*24.0 + 2.0;

const ChimneyFillStyle = '#4408';
const ClampFillStyle = '#0888';
const ClampLineWidth = 4;
const ClampRadius = 6;
const EdgeFillStyle = '#eca9';
const EdgeWidth = 2.54 * 36;
const FireWalkWidth = 2.54 * 36;
const FireWalkFillStyle = '#fcf8';
const FootFillStyle = '#f008';
const FootRadius = 6;
const FootEdgeStrokeStyle = '#f008';
const FootEdgeRadius = 12;
const LinkFillStyle = '#0c08';
const LinkLineWidth = 4;
const LinkRadius = 6;
const PathStrokeStyle = '#000';
const PathLineWidth = 3;
const PipeFillStyle = '#4408';
const PipeStrokeStyle = '#4408';
const PipeStrokeRadius = 12;
const PanelFillStyle = '#ccc8';
const PanelStrokeStyle = '#000';
const RafterLineDash = [4,8];
const RafterStrokeStyle = '#6668';
const RailRegFillStyle = '#ace6';
const RailStrokeStyle = '#00f8';
const RoofCanvasMargin = 10;
const RoofCanvasScale = 0.75;
const SkirtFillStyle = '#84c8';
const SkirtDimS = 6;
const SpliceFillStyle = '#0c08';
const SpliceRadiusX = 2;
const SpliceRadiusY = 10;
const VentFillStyle = '#4408';

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
function eleNuClasAdd(tag, clas, dst) { return dst.appendChild(eleNuClas(tag, clas)); }

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
