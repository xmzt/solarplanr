//include geom.js
//include svg.js

//-----------------------------------------------------------------------------------------------------------------------
// constants

const OneBlockSep = 30;

//-----------------------------------------------------------------------------------------------------------------------
// description boxes

function desRowBotColNu(row) {
    const col = eleNuClasAdd('div', 'desRowCol', row);
    eleNuClasAdd('div', 'desBoxPad', col);
    return col;
}

function desBox(head0, head1, ...lineV) {
    const box = eleNuClas('div', 'desBox');
    const head = eleNuAdd('div', box);
    eleNuAdd('span', head).innerHTML = head0;
    eleNuAdd('span', head).innerHTML = head1;
    const body = eleNuAdd('div', box);
    for(const line of lineV) 
	eleNuAdd('div', body).innerHTML = line;
    return box;
}

//-----------------------------------------------------------------------------------------------------------------------
// OneLine

class OneLine {
    constructor(div, svg) {
	this.div = div;
	this.svg = svg;
	this.conduitV = [];
    }

    conduitAdd(conduit) {
	this.conduitV.push(conduit);
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// OneEnv

class OneEnv extends EnvBase {
    constructor() {
	super();
	this.partTab = new PartTab();
	this.oneObjV = [];
    }

    oneObjReg(obj) { return pushItem(this.oneObjV, obj); }
}

//-----------------------------------------------------------------------------------------------------------------------
// SiteBOneLine

class SiteBOneLine extends OneLine {
    constructor(div, svg) {
	super(div, svg);
    }

    wireStringVInv(stringV, inv) {
	let ymin = Number.POSITIVE_INFINITY;
	let ymax = Number.NEGATIVE_INFINITY;
	let d = '';
	for(let i = 0, x = 20; i < stringV.length; ++i, x += 6) {
	    const sl = stringV[i].linkR;
	    const il = inv.linkDcV[i];
	    d += `M${sl[0]},${sl[1]} h${x} V${il[1]} H${il[0]} `;
	    if(il[1] < ymin) ymin = il[1];
	    if(il[1] > ymax) ymax = il[1];
	}
	svgNuPathDClasAdd(d, 'strok', this.svg);
	this.conduitAdd(new Conduit(this.svg, inv.linkDcV[0][0] - 30, 0.5*(ymin + ymax), 0.5*(ymax - ymin) + 6,
				    'C1', Emt_1, 19,
				    Wire_pv_10, Wire_pv_10, Wire_pv_10, Wire_pv_10, Wire_pv_10, Wire_pv_10,
				    Wire_thhn_10_grn));
    }
    
    popu() {
	const env = new OneEnv();
	const site = SiteB.NuByDes['Q475/Q400'](env);
	for(const obj of env.oneObjV)
	    obj.oneInit(this.svg);

	//todo add conduit

	//site.inv.dcPortV[0].oneBoxX0Set(env.markAlloc(), 500);
	site.inv.dcPortV[site.inv.dcPortV.length-1].mate.oneBoxX0Set(env.markAlloc(), 10);
	site.inv.dcPortV[0].mate.oneBoxY0Set(env.markAlloc(), 200);

	let row = this.div.appendChild(eleNuClas('div', 'desRowBot'));
	let col = desRowBotColNu(row);

	//todo add des blocks trash.js
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// bodyOnload

function oneBodyOnload() {
    const one = new SiteBOneLine(document.getElementById('oneDiv'), document.getElementById('oneSvg'));
    one.popu();
}
