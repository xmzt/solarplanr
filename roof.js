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
    constructor(env) {
	this.env = env;
	this.drawr = env.drawrNu();
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
   
    footVFromRail(rail) {
	// set of all intersections with rafters
	const footV = [];
	for(const rafter of this.rafterV) {
	    const foot = interSegSeg(rafter, rail);
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
	return footV;
    }
}
