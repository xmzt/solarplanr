// worker thread used by rail.js
// self is the WorkerGlobalScope
const Perf = self.performance;

//dump(pre) {
//console.log(pre, `rail=${this.rail.id} cost=${this.cost.toFixed(2)} partIdV=[${this.partIdV.join(' ')}] need=${this.need.toFixed(3)}[${this.needB}]`);
//}

//dump(pre0, pre1Fn) {
//console.log(pre0, `id=${this.id} len=${this.len} spliceN=${this.spliceN} comV.length=${this.comV.length}`);
//for(const [i,com] of Object.entries(this.comV))
//com.dump(pre1Fn(i));
//}

function segAEPartIdV(seg) {
    const dst = [];
    for( ; null !== seg; seg = seg.ae) dst.push(seg.part.sortid);
    return dst;
}

function segAEDimLV(seg) {
    const dst = [];
    for( ; null !== seg; seg = seg.ae) dst.push(seg.part.dimL);
    return dst;
}

function go(reqId, railV, partV, spliceCost) {
    let dimLMax = partV.reduce((p,x) => x.dimL > p ? x.dimL : p, 0);

    //-------------------------------------------------------------------------------------------------------------------
    // pass1
    // for each rail calculate possible combinations of segments.
    // only include combinations with minimum number of splices (minimum segN). may result in suboptimal solution.
    // combinations with a positive need need a cutoff from another combination
    // combinations with a negative need has excess cutoff
    //
    // railV:
    //   rail:
    //     id, len: from caller
    //     segN: number of segments
    //     comV: potential combinations
    //       com:
    //         railId: id of parent rail
    //         segN: number of segments in parent rail 
    //         cost: cost of this combination in full parts used
    //         need: how much more is needed (negative means this com has surplus to be used elsewhere)
    //         partIdV: part.sortid of each full part used 
    //
    // needMap: set of all possible values of com.need  
    
    const needMap = new Map();
    for(const rail of railV) {
	rail.segN = Math.ceil(rail.len / dimLMax);
	rail.comV = [];
	const partIdV = new Array(rail.segN);

	function comIter(segI, partI, cost, need) {
	    function comAdd(com) {
		//console.log(`-add`);
		rail.comV.push(com);
		needMap.set(com.need, com.need);
	    }
	    //console.log(`pass1 ${rail.id}:${rail.len} segI=${segI} part=${partV[partI].dimL} cost=${cost} need=${need} partIdV=[${partIdV.slice(segI).join(' ')}]`);
	    if(! segI) {
		if(0 >= need)
		    comAdd({ railId:rail.id, segN:rail.segN, cost:cost, need:need, partIdV:partIdV.slice(segI) });
	    } else {
		if(dimLMax > need)
		    comAdd({ railId:rail.id, segN:rail.segN, cost:cost, need:need, partIdV:partIdV.slice(segI) });
		segI--;
		do {
		    partIdV[segI] = partI;
		    comIter(segI, partI, cost + partV[partI].cost, need - partV[partI].dimL);
		} while(partI--);
	    }
	}

	comIter(rail.segN, partV.length - 1, 0, rail.len);
    }

    //-------------------------------------------------------------------------------------------------------------------
    // pass 2.
    // group needs into bins.
    // any negative need in a bin meets any of the positive needs in the same bin.
    //
    // example needs: +6 +4 +2 +1 0 -2 -3 -4 -5
    // bin null: +6 (need cannot be satisfied. combinations with this need thrown out).
    // bin  +-4: +4 -4 -5
    // bin  +-2: +2 +1 -2 -3
    // bin    0: 0
    //
    // result: needMap changed so that values are the binned need. i.e. multiple need keys may
    // point to same need value.
    
    const needV = Array.from(needMap.keys()).sort((a,b) => a - b);
    let needB = null;
    let negI = 0;
    let posI = needV.length - 1;
    if(negI <= posI) {
	let negNeed = needV[negI];
	let posNeed = needV[posI];
	for(;;) {
	    if(0 >= (posNeed + negNeed)) {
		// posNeed met by negNeed
		needB = 0 < posNeed ? posNeed : 0;
		needMap.set(negNeed, -needB);
		if(++negI > posI) break;
		negNeed = needV[negI];
	    } else {
		// posNeed not met by negNeed
		needMap.set(posNeed, needB);
		if(--posI < negI) break;
		posNeed = needV[posI];
	    }
	}
    }
    
    //-------------------------------------------------------------------------------------------------------------------
    // pass 3
    // for each rail:
    //     reduce items in comV with same needB to one item with minimal cost.
    //     sort comV by decreasing needB
    // sort all rails decreasing by max com.needB
    
    const status = {
	iterN:1,
	iterI:0,
	accOkN:0,
	okN:0,
	bestN:0,
    };
    let log = '';
    for(const rail of railV) {
	log += `rail id=${rail.id} len=${rail.len} segN=${rail.segN}\n`;
	const comVByNeedB = new Map();
	const nullComV = [];
	for(const com of rail.comV) {
	    com.needB = needMap.get(com.need);
	    let comV = null === com.needB ? nullComV : comVByNeedB.get(com.needB);
	    if(undefined === comV) 
		comVByNeedB.set(com.needB, comV = []);
	    comV.push(com);
	}

	function comVFin(pre, comV) {
	    comV.sort((a,b) => a.cost - b.cost);
	    const s = comV.map(com => {
		const s = com.partIdV.map(x => partV[x].dimL.toFixed(3)).join(' ');
		return `(<b>${com.cost.toFixed(2)}</b> ${com.need.toFixed(3)} [${s}])`;
	    }).join(' ');
	    log += `    ${pre}: ${s}\n`;
	    return comV[0];
	}
	rail.comV = Array.from(comVByNeedB.keys())
	    .sort((a,b) => b - a)
	    .map(needB => comVFin(`<b>${needB.toFixed(3)}</b>`, comVByNeedB.get(needB)));
	nullComV.length && comVFin('null', nullComV);
	status.iterN *= rail.comV.length;
    }
    //railV.sort((a,b) => b.comV[0].need - a.comV[0].need);
    self.postMessage([ reqId, 'railrRspLog', log]);
    
    //-------------------------------------------------------------------------------------------------------------------
    // pass 4
    // find best combination for each rail, matching positive and negative needs

    status.tsB = status.tsA = Perf.now();
    let iterINext = 50000;
    let bestNPrev = 0;
    let bestCost = Infinity;
    let bestComV = null;
    const comV = [];
    let needAcc = 0;
    for(const [i,rail] of Object.entries(railV)) {
	rail._i = i;
	rail._comI = rail.comV.length - 1;
	const com = rail.comV[rail._comI];
	comV.push(com);
	needAcc += com.needB;
    }
    
    for(;;) {
	if(0 >= needAcc) {
	    status.accOkN++;
	    // try to match up needs
	    comV.sort((a,b) => b.needB - a.needB);
	    let negNeedI = comV.length - 1;
	    for(const com of comV) {
		if(0 >= com.needB) {
		    // all positive needs have been met
		    status.okN++;
		    const cost = comV.reduce((p,x) => p + x.cost, 0);
		    if(bestCost > cost) {
			status.bestN++;
			bestComV = [...comV];
			bestCost = cost;
		    }
		    break;
		}
		else if(com.needB <= -comV[negNeedI].needB)
		    negNeedI--;
		else
		    break;
	    }
	}
	if(++status.iterI == iterINext) {
	    status.tsB = Perf.now();
	    self.postMessage([ reqId, 'railrRspStatus', status]);
	    iterINext += 50000;
	    if(status.bestN != bestNPrev) {
		self.postMessage([ reqId, 'railrRspBest', bestComV ]);
		bestNPrev = status.bestN;
	    }
	}
	    
	// next iteration
	needAcc = 0;
	let ncarry = 0;
	for(const rail of railV) {
	    if(ncarry)
		;
	    else if(! rail._comI--)
		rail._comI += rail.comV.length;
	    else
		ncarry = 1;
	    const com = rail.comV[rail._comI];
	    comV[rail._i] = com;
	    needAcc += com.needB;
	}
	if(! ncarry) break;
    }
    status.tsB = Perf.now();

    //-------------------------------------------------------------------------------------------------------------------
    // finish
    // post final status and response

    self.postMessage([ reqId, 'railrRspStatus', status]);
    if(status.bestN != bestNPrev)
	self.postMessage([ reqId, 'railrRspBest', bestComV ]);
    self.postMessage([ reqId, 'railrRspFin' ]);
}

self.onmessage = (ev) => go(...ev.data); 
