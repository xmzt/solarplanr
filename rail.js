//include base.js
//include geom.js 
//include partCat.js
//worker railWkr.js

//-----------------------------------------------------------------------------------------------------------------------
// globals

var RailGroupClasId = 0;
var RailrHandlerIdAlloc;
var RailrHandlerById;
var RailrWorker;

//-----------------------------------------------------------------------------------------------------------------------
// RailRegR2

class RailRegR2 extends R2 {
    constructor(x0,y0,x1,y1) {
	super(x0,y0,x1,y1);
	this.midXV = [];
	this.bondI = 0;
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// railr, interface to worker thread

function railrHandlerInit() {
    RailrHandlerIdAlloc = 0;
    RailrHandlerById = {};
    RailrWorker = new Worker('railWkr.js');
    RailrWorker.onmessage = (ev) => {
	const handler = RailrHandlerById[ev.data[0]];
	handler[ev.data[1]].apply(handler, ev.data.slice(2));
    };
}

function railrReq(...argV) {
    const id = RailrHandlerIdAlloc++;
    RailrHandlerById[id] = argV[0];
    argV[0] = id;
    RailrWorker.postMessage(argV);
}

//-----------------------------------------------------------------------------------------------------------------------
// RailGroup

class RailGroup {
    //static ClasId = ++RailGroupClasId;
    //static RailPartV
    //static SplicePart

    constructor(sys) {
	this.sys = sys
	this.railV = [];
	this.statusDiv = temRootClone('railGroupStatus_tem');
	this.statusSpan = this.statusDiv.querySelector('._status');
	this.statusDiv.querySelector('._logShow').addEventListener('click', (ev) => this.logShowClick(ev));
	this.logDiv = temRootClone('railGroupLog_tem');
    }

    logShowClick() {
	this.logDiv.classList.toggle('displaynone');
    }	
    
    railAdd(rail) {
	this.railV.push(rail);
    }
    
    railrReq() {
	railrReq(this,
		  this.railV.map(rail => rail.x1 - rail.x0), // todo horizontal-only
		  this.constructor.RailPartV.map(x => [ x.dimL, x.price() ]));
    }

    // railRsp* are rpc from worker thread (railWkr.js)
    
    railrRspLog(msg) {
	this.logDiv.innerHTML += `${msg}\n`;
    }

    railrRspStatus(s) {
	this.statusSpan.textContent =
	    `${s.iterI}/${s.iterN} -> ${s.accOkN} -> ${s.okN} -> ${s.bestN}, ${s.tsB - s.tsA} ms`;
    }

    railrRspFin(comV) {
	this.logDiv.innerHTML += `railrRspFin\n`;
	for(const com of comV) {
	    const rail = this.railV[com.railId];
	    this.logDiv.innerHTML +=
		`    rail=${com.railId}[${rail.x1 - rail.x0}] need=${com.need} partV=[${com.partIdV.map(x => this.constructor.RailPartV[x].dimL).join(' ')}]\n`;
	    if(1 < com.segN) this.sys.partTab.partAddTot(this.constructor.SplicePart, com.segN - 1);
	    let x = 0;
	    for(const partId of com.partIdV) {
		const part = this.constructor.RailPartV[partId];
		this.sys.partTab.partAddTot(part, 1);
		if(x)
		    new P2(rail.x0 + x, rail.y0).drawSplice(rail.rack.roof.ctx);
		x += part.dimL;
	    }
	    if(x && 0 < com.need)
		new P2(rail.x0 + x, rail.y0).drawSplice(rail.rack.roof.ctx);
	}
	this.sys.pendDec();
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// RailGroupIronRidge

class RailGroupIronRidgeXR10 extends RailGroup {
    static ClasId = ++RailGroupClasId;
    static RailPartV = IronRidgeXR10RailV;
    static SplicePart = IronRidgeXR10Splice;
}

class RailGroupIronRidgeXR100 extends RailGroup {
    static ClasId = ++RailGroupClasId;
    static RailPartV = IronRidgeXR100RailV;
    static SplicePart = IronRidgeXR100Splice;
}

//-----------------------------------------------------------------------------------------------------------------------
// RailGroupUnirac

class RailGroupUniracSm extends RailGroup {
    static ClasId = ++RailGroupClasId;
    static RailPartV = UniracSmRailV;
    static SplicePart = UniracSmSplice;
}
