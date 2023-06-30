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
// RailGroupDiagNop

var RailGroupDiagNopSingleton = {
    log: (msg) => {},
    status: (msg) => {},
};

//-----------------------------------------------------------------------------------------------------------------------
// RailGroup

class RailGroup {
    //static ClasId = ++RailGroupClasId;
    //static RailPartV
    //static SplicePart

    constructor(env, partSub) {
	this.env = env;
	this.partSub = partSub;
	this.diag = env.railGroupDiagNu();
	this.rackFinN = 0;
	this.railV = [];
	this.bestComV = null;
    }

    rackAdd(rack) { ++this.rackFinN; }

    rackFin(rack) {
	if(0 ==  --this.rackFinN) {
	    this.partSub.pendInc();
	    // todo rails are currently horizontal-only
	    this.env.wkrReq(
		this,
		this.railV.map((r,i) => { return { id:i, len:(r.x1 - r.x0) }; }),
		this.constructor.RailPartV.map((p,i) => { return { id:i, dimL:p.dimL, cost:p.sourceV[0].cost1 }; }),
		this.constructor.SplicePart.sourceV[0].cost1,
	    );
	}
    }

    railAdd(rail) { this.railV.push(rail); }

    // railRsp* are rpc from worker thread (railWkr.js)
    
    railrRspBest(comV) {
	// undo previous best
	if(null !== this.bestComV) {
	    for(const drawr of this.bestDrawrSet)
		drawr.clear_1();
	    for(const com of this.bestComV) {
		this.partSub.partAdd(this.constructor.SplicePart, 1 - com.segN);
		for(const partId of com.partIdV) {
		    const part = this.constructor.RailPartV[partId];
		    this.partSub.partAdd(part, -1);
		}
	    }
	}
	
	this.bestComV = comV;
	this.bestDrawrSet = new Set();
	this.diag.log(`best\n`);
	for(const com of comV) {
	    const rail = this.railV[com.railId];
	    this.diag.log(`    rail=${com.railId}[${rail.x1 - rail.x0}] need=${com.need} partV=[${com.partIdV.map(x => this.constructor.RailPartV[x].dimL).join(' ')}]\n`);
	    this.partSub.partAdd(this.constructor.SplicePart, com.segN - 1);
	    let x = 0;
	    for(const partId of com.partIdV) {
		const part = this.constructor.RailPartV[partId];
		this.partSub.partAdd(part, 1);
		if(x) {
		    rail.rack.roof.drawr.addSplice_1(new P2(rail.x0 + x, rail.y0));
		    this.bestDrawrSet.add(rail.rack.roof.drawr);
		}
		x += part.dimL;
	    }
	    if(x && 0 < com.need) {
		rail.rack.roof.drawr.addSplice_1(new P2(rail.x0 + x, rail.y0));
		this.bestDrawrSet.add(rail.rack.roof.drawr);
	    }

	}
    }

    railrRspLog(msg) {
	this.diag.log(`${msg}\n`);
    }

    railrRspStatus(s) {
	this.diag.status(`${s.iterI}/${s.iterN} -> ${s.accOkN} -> ${s.okN} -> ${s.bestN}, ${s.tsB - s.tsA} ms`);
    }

    railrRspFin() {
	this.diag.log(`fin\n`);
	this.partSub.pendDec();
    }
}
