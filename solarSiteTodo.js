//-----------------------------------------------------------------------------------------------------------------------
// RackNorail

class RackNorail extends Rack {
    skirtAdd(ctx, x0, y, x1, n) {
	new R2(x0, y, x1, y - SkirtDimS).drawSkirt(ctx);
	col.add(this.skirtPart, 1);
    }

    skirtFootAdd(ctx, foot) {
	foot.drawFoot(ctx);
	col.add(this.skirtFootPart, 1);
    }

    skirtSpliceAdd(ctx, x, y) {
	new P2(x, y).drawSplice(ctx);
	col.add(this.skirtSplicePart, 1);
    }
    
    skirtRow(ctx, roof, row) {
	const pA = row[0]
	const pE = row[row.length-1]
	const foots = roof.footsGet(new L2(pA.x0, pA.y0, pE.x1, pE.y0));
	for(const foot of foots) this.skirtFootAdd(ctx, foot);
	for(let x = pA.x0; ;) {
	    if(x > pA.x0) this.skirtSpliceAdd(ctx, x, pA.y0);
	    const w = pE.x1 - x;
	    const dimL = this.skirtPart.dimL;
	    if(w >= dimL) {
		this.skirtAdd(ctx, x, pA.y0, x + dimL, 1);
		x += dimL;
	    }
	    else {
		if(w > 0) this.skirtAdd(ctx, x, pA.y0, x + w, w / dimL);
		break;
	    }
	}
    }

    linkAdd(ctx, x, y) {
	new P2(x, y).drawLink(ctx);
	col.add(this.linkPart, 1);
    }

    panelBlock() {
	this.groundLugAdd();
    }

    panelRow(ctx, roof, shape, row, iY) {
	const pA = row[0]
	const pE = row[row.length-1]
	const horiz = new L2(pA.x0, pA.y1, pE.x1, pE.y1);
	const foots = roof.footsGet(horiz);
	for(const foot of foots) this.footAdd(ctx, foot);
	for(const p of row) {
	    if(row[0] !== p) this.linkAdd(ctx, p.x0, p.y1);
	}
	if(0 == iY) this.skirtRow(ctx, roof, row);
    }
}

class RackUniracSfm extends RackNorail {
    constructor(partAddCb) {
	super(partAddCb);
	this.panelGapX = 2.0;
	this.panelGapY = 2.54*1;

	this.skirtPart = this.part0(UniracSfmTrim);
	this.skirtSplicePart = this.part0(UniracSfmTrimSplice);
	this.skirtFootPart = this.part0(UniracSfmTrimFoot);
	this.skirtClipPart = this.part0(UniracSfmTrimClip);
	this.skirtCapPart = this.part0(UniracSfmTrimCap);
	this.skirtBondPart = this.part0(UniracSfmTrimBond);
	this.microrailPart = this.part0(UniracSfmMicrorail);
	this.microrailSplicePart = this.part0(UniracSfmAttSplice);
	this.linkPart = this.part0(UniracSfmSplice);
	this.footPart = this.part0(UniracSfmFoot);
	this.nsBondPart = this.part0(UniracSfmNsbond);
	this.groundLugPart = this.part0(UniracSmGroundLug);
	this.mlpePart = this.part0(UniracSmMlpe);
    }
    
    footAdd(ctx, foot) {
	foot.drawFoot(ctx);
	col.add(this.microrailPart, 1);
	col.add(this.footPart, 1);
    }

    skirtRow(ctx, roof, row) {
	super.skirtRow(ctx, roof, row);
	col.add(this.skirtClipPart, 2*row.length);
	col.add(this.skirtCapPart, 2);
	col.add(this.skirtBondPart, 1);
    }

    panelRow(ctx, roof, shape, row, iY) {
	super.panelRow(roof, shape, row, iY);
	if(0 < iY) col.add(this.nsBondPart, 1);
    }
}

class RackSnapnrackRlu extends RackNorail {
    constructor(partAddCb) {
	super(partAddCb);
	this.panelGapX = 2.0;
	this.panelGapY = 2.54*1;

	this.flashingPart = this.part0(SnapnrackRluCompFlash);
	this.flashTrackPart = this.part0(SnapnrackRluCompTrack);
	this.umbrellaLagPart = this.part0(SnapnrackRluUmbrellaLag);
	this.speedTrackPart = this.part0(SnapnrackRluSpeedsealTrack);
	this.speedLagPart = this.part0(SnapnrackRluSpeedsealLag);
	this.mountPart = this.part0(SnapnrackRluMount);
	this.linkPart = this.part0(SnapnrackRluLink);
	this.skirtPart = this.part0(SnapnrackRluSkirt);
	this.skirtSpacerPart = this.part0(SnapnrackRluSkirtSpacer40); // todo panel-height dependent
	this.groundLugPart = this.part0(SnapnrackRluGroundLug);
	this.mlpePart = this.part0(SnapnrackRluMlpe);
    }

    skirtFootAdd(ctx, foot) {
	this.footAdd(ctx, foot);
	col.add(this.skirtSpacerPart, 1);
    }

    skirtSpliceAdd(ctx, x, y) {
	this.linkAdd(ctx, x, y);
	col.add(this.skirtSpacerPart, 2);
    }
}

class RackSnapnrackRluFlashtrack extends RackSnapnrackRlu {
    footAdd(ctx, foot) {
	foot.drawFoot(ctx);
	col.add(this.flashingPart, 1);
	col.add(this.flashTrackPart, 1);
	col.add(this.umbrellaLagPart, 1);
	col.add(this.mountPart, 1);
    }
}

class RackSnapnrackRluSpeedtrack extends RackSnapnrackRlu {
    footAdd(ctx, foot) {
	foot.drawFoot(ctx);
	col.add(this.speedTrackPart, 1);
	col.add(this.speedLagPart, 1);
	col.add(this.mountPart, 1);
    }
}

