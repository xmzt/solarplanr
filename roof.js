//include base.js
//include geom.js 
//include partCat.js
//include rail.js
//include rack.js

//-----------------------------------------------------------------------------------------------------------------------
// Feature*

class FeatureChimneyR2 extends R2 {}
class FeatureFireR2 extends R2 {}
class FeaturePipeC2 extends C2 {}
class FeatureVentR2 extends R2 {}

//-----------------------------------------------------------------------------------------------------------------------
// Roof: roof geometry (border, obstructions), with racks (racks have panels)
//
// - subclassed for a specific roof geometry. 

class Roof {
    //static IdHtml
    //static LayoutByIdHtml
    
    constructor(drawr) {
	this.drawr = drawr;
	//this.bor
	//this.boundR
	//this.edgeV
	this.rafterV = [];
	this.featureV = [];
    }

    borSet(bor) {
	this.bor = bor;
	const pV = Object.values(bor);
	this.boundR = boundR2FromP2V(pV);
	this.edgeV = l2VFromP2V(pV);
	this.drawr.sizeSetR(this.boundR);
	this.drawr.addPathVClose(pV);
	
	// border labels
	const idPV = Object.entries(bor);
	let [aId,a] = idPV[idPV.length - 2];
	let [bId,b] = idPV[idPV.length - 1];
	for(const [cId,c] of idPV) {
	    this.drawr.addLabelPoint(b, bisectSegSeg(a, b, c, 60), `${bId}=(${b.x.toFixed(3)}, ${b.y.toFixed(3)})`);
	    a = b;
	    b = c;
	    bId = cId;
	}
    }

    rafterAddXs(...xV) {
	for(const x of xV) {
	    const rafter = new L2(x, this.boundR.y0 - 30, x, this.boundR.y1 + 100);
	    this.rafterV.push(rafter);
	    this.drawr.addRafter(rafter, `R${this.rafterV.length - 1} x=${x.toFixed(3)}`);
	}
    }

    featureAddChimney(...argV) {
	const x = new FeatureChimneyR2(...argV);
    	this.featureV.push(x);
	this.drawr.addChimney(x);
	return x;
    }

    featureAddFire(...argV) {
	const x = new FeatureFireR2(...argV);
    	this.featureV.push(x);
	this.drawr.addFire(x);
	return x;
    }

    featureAddPipe(...argV) {
	const x = new FeaturePipeC2(...argV);
    	this.featureV.push(x);
	this.drawr.addPipe(x);
	return x;
    }

    featureAddVent(...argV) {
	const x = new FeatureVentR2(...argV);
    	this.featureV.push(x);
	this.drawr.addVent(x);
	return x;
    }

    footVFromHoriz(horiz) {
	// footV = set of all intersections with rafters
	const footV = [];
	for(const rafter of this.rafterV) {
	    const foot = interSegSeg(rafter, horiz);
	    if(null !== foot) {
		footV.push(foot);
		// mark foot if close to edge
		foot.edgeP = false;
		for(const edge of this.edgeV) {
		    if(EdgeFootDist2 > dist2SegPoint(edge, foot)) {
			foot.edgeP = true;
			break;
		    }
		}
	    }
	}

	// sort footV
	footV.sort((a,b) => { return a.x - b.x; });

	// remove redundant foots due to cantilever
	while(2 < footV.length && CantiMax >= (footV[1].x - horiz.x0))
	    footV.shift();
	while(2 < footV.length && CantiMax >= (horiz.x1 - footV[footV.length - 2].x))
	    footV.pop();

	// remove redundant foots depending on edgeP
	for(let i = 2; i < footV.length; i++) {
	    const span = footV[i].x - footV[i-2].x;
	    const spanAllow = footV[i-1].edgeP ? FootSpanEdge : FootSpan;
	    if(spanAllow >= span) {
		footV.splice(i-1, 1);
		--i;
	    }
	}
	return footV;
    }

    railFromReg(reg) {
	let aRail = new L2(reg.x0, reg.y0, reg.x1, reg.y0);
	aRail.footV = this.footVFromHoriz(aRail);
	let bRail = new L2(reg.x0, reg.y1, reg.x1, reg.y1);
	bRail.footV = this.footVFromHoriz(bRail);
	if(bRail.footV.length <= aRail.footV.length)
	    aRail = bRail;
	let y = (reg.y0 + reg.y1) / 2;
	bRail = new L2(reg.x0, y, reg.x1, y);
	bRail.footV = this.footVFromHoriz(bRail);
	return (bRail.footV.length <= aRail.footV.length) ? bRail : aRail;
    }

}

//-----------------------------------------------------------------------------------------------------------------------
// RoofNone

class RoofNone extends Roof {
    static IdHtml = '--Roof plan--';
    static LayoutFunByIdHtml = {
	'--Panel layout--': function(rack, roof) {},
    };
}
