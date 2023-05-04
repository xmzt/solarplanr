//include partCat.js

function partTabFill() {
    const tbody = document.getElementById('partTab').querySelector('TBODY');
    for(const part of PartV) {
	const tr = temRootClone('partTabTr_tem');
	part.descFill(tr.querySelector('._desc'));
	part.priceFill(tr.querySelector('._price'));
	tbody.appendChild(tr);
    }
}

function panelTabFill() {
    const tbody = document.getElementById('panelTab').querySelector('TBODY');
    for(const part of PanelPartV) {
	const tr = temRootClone('panelTabTr_tem');
	part.descFill(tr.querySelector('._desc'));
	const price = part.priceFill(tr.querySelector('._price'));
	tr.querySelector('._watts').textContent = part.watts;
	tr.querySelector('._dim').textContent =
	    part.dimL.toFixed(1)
	    +'*'+ part.dimS.toFixed(1)
	    +'*'+ part.dimH.toFixed(1);
	const area = part.dimL * part.dimS;
	tr.querySelector('._wattsDollar').textContent = (part.watts / price).toFixed(4);
	tr.querySelector('._wattsCm2').textContent = (part.watts / (part.dimL * part.dimS)).toFixed(4);
	tbody.appendChild(tr);
    }
}

function bodyOnload() {
    partTabFill();
    panelTabFill();
}
