//include partCat.js

class PartCatTabSource {
    constructor(id, pos, tot) {
	this.id = id;
	this.pos = pos;
	this.tot = tot;
    }
}

class PartCatTab {
    constructor(root) {
	this.headTr = root.createTHead().insertRow(-1);
	this.headTr.insertCell(-1).textContent = 'Description';
	this.body = root.createTBody();
	this.sourceV = [];
	this.sourceById = {};
	this.panelPartV = [];
    }

    fill(partV) {
	for(const part of partV) {
	    const tr = this.rowNu(part);
	    for(const partSource of part.sourceV) {
	    	const source = this.sourceById[partSource.id] ??= this.sourceNu(partSource.id);
		partSource.partCatFill(tr.cells[1 + source.pos]);
	    }
	}
    }
    
    rowNu(part) {
	const tr = this.body.insertRow(-1);
	part.menuAFill(tr.insertCell(-1));
	for(const source of this.sourceV)
	    tr.insertCell(-1);
	return tr;
    }

    sourceNu(id) {
	let i = this.sourceV.findIndex(source => 0 < source.id.localeCompare(id));
	if(-1 == i)
	    i = this.sourceV.length;
	const source = new PartCatTabSource(id, i, 0);
	this.sourceV.splice(i, 0, source);
	this.headTr.insertCell(1 + i).textContent = id;
	for(const tr of this.body.rows) 
	    tr.insertCell(1 + i);
	for(++i; i < this.sourceV.length; ++i)
	    this.sourceV[i].pos = i;
	return source;
    }
}

function panelTabFill(root) {
    const body = root.createTBody();
    for(const part of PartV.filter(x => x.panelPartP())) {
	const tr = body.insertRow(-1);
	part.menuAFill(tr.insertCell(-1));
	tr.insertCell(-1).textContent = part.watts;
	const source = part.sourceV.reduce((acc, x) => x.cost1 < acc.cost1 ? x : acc);
	source.partCatFill(tr.insertCell(-1));
	tr.insertCell(-1).textContent = `${part.dimL.toFixed(1)} * ${part.dimS.toFixed(1)} * ${part.dimH.toFixed(1)}`;
	const area = part.dimL * part.dimS;
	tr.insertCell(-1).textContent = area.toFixed(4);
	tr.insertCell(-1).textContent = (part.watts / source.cost1).toFixed(4);
	tr.insertCell(-1).textContent = (part.watts / area).toFixed(4);
	tr.insertCell(-1).textContent = part.voc.toFixed(2);
	tr.insertCell(-1).textContent = part.isc.toFixed(2);
    }
}

function bodyOnload() {
    new PartCatTab(document.getElementById('partTab')).fill(PartV);
    panelTabFill(document.getElementById('panelTab'));
}
