//include base.js
//include geom.js 
//include partCat.js
//worker railWkr.js

//-----------------------------------------------------------------------------------------------------------------------
// globals

var RailGroupClasId = 0;

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
// RailWkrCtrl

class RailWkrCtrl {
    constructor() {
	this.reqI = 0;
	this.reqHandByI = {};
	this.wkr = new Worker('railWkr.js');
	this.wkr.onmessage = (ev) => {
	    const hand = this.reqHandByI[ev.data[0]];
	    hand[ev.data[1]].apply(hand, ev.data.slice(2)); // todo remove slice?
	};
    }

    req(...argV) {
	const i = this.reqI++;
	this.reqHandByI[i] = argV[0];
	argV[0] = i;
	this.wkr.postMessage(argV);
    }

    terminate() {
	this.wkr.terminate();
    }
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
	this.bestComV = null;
    }

    logShowClick() {
	this.logDiv.classList.toggle('displaynone');
    }	
    
    railAdd(rail) {
	this.railV.push(rail);
    }
    
    railWkrReq() {
	// todo rails are currently horizontal-only
	this.sys.railWkrCtrl.req(
	    this,
	    this.railV.map((r,i) => { return { id:i, len:(r.x1 - r.x0) }; }),
	    this.constructor.RailPartV.map((p,i) => { return { id:i, dimL:p.dimL, cost:p.price() }; }),
	    this.constructor.SplicePart.price(),
	);
    }

    // railRsp* are rpc from worker thread (railWkr.js)
    
    railrRspBest(comV) {
	// undo previous best
	if(null !== this.bestComV) {
	    this.sys.ctxRailClear();
	    for(const com of this.bestComV) {
		this.sys.partTab.partAddTot(this.constructor.SplicePart, -(com.segN - 1));
		for(const partId of com.partIdV) {
		    const part = this.constructor.RailPartV[partId];
		    this.sys.partTab.partAddTot(part, -1);
		}
	    }
	}
	
	this.bestComV = comV;
	this.logDiv.innerHTML += `best\n`;
	for(const com of comV) {
	    const rail = this.railV[com.railId];
	    this.logDiv.innerHTML +=
		`    rail=${com.railId}[${rail.x1 - rail.x0}] need=${com.need} partV=[${com.partIdV.map(x => this.constructor.RailPartV[x].dimL).join(' ')}]\n`;
	    this.sys.partTab.partAddTot(this.constructor.SplicePart, com.segN - 1);
	    let x = 0;
	    for(const partId of com.partIdV) {
		const part = this.constructor.RailPartV[partId];
		this.sys.partTab.partAddTot(part, 1);
		if(x)
		    new P2(rail.x0 + x, rail.y0).drawSplice(rail.rack.roof.ctxRail);
		x += part.dimL;
	    }
	    if(x && 0 < com.need)
		new P2(rail.x0 + x, rail.y0).drawSplice(rail.rack.roof.ctxRail);
	}
    }

    railrRspLog(msg) {
	this.logDiv.innerHTML += `${msg}\n`;
    }

    railrRspStatus(s) {
	this.statusSpan.textContent =
	    `${s.iterI}/${s.iterN} -> ${s.accOkN} -> ${s.okN} -> ${s.bestN}, ${s.tsB - s.tsA} ms`;
    }

    railrRspFin() {
	this.logDiv.innerHTML += `railrRspFin\n`;
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
