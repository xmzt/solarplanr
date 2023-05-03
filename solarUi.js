//include solarSys.js

//=======================================================================================================================
// globals
//=======================================================================================================================

var UiSysV = [];
var UiSysDiv;

//=======================================================================================================================
// helpers
//=======================================================================================================================

function uiOptionElem(idHtml) {
    const option = document.createElement('option');
    option.value = idHtml;
    option.innerHTML = idHtml;
    return option;
}

function uiSelectValue(elem) {
    return elem.item(elem.selectedIndex).value;
}

//=======================================================================================================================
// UiSysForm
//=======================================================================================================================

class UiSysForm {
    static Config0 = { roof:null, layout:null, rack:null };

    constructor(ui, config) {
	this.ui = ui;
	this.root = temRootClone('sysForm_tem');
	this.brElem = this.root.querySelector('._br');
	this.roofElem = this.root.querySelector('._roof');
	this.layoutElem = this.root.querySelector('._layout');
	this.rackElem = this.root.querySelector('._rack');
	this.removeElem = this.root.querySelector('._remove');
	this.removeElem.addEventListener('click', (ev) => this.ui.formRemove(this));
	
	let option, roofClasSelected;
        for(const roofClas of RoofClasV) {
	    this.roofElem.appendChild(option = uiOptionElem(roofClas.IdHtml));
	    if(roofClas.IdHtml == config.roof) {
		option.selected = 1;
		roofClasSelected = roofClas;
	    }
	}
	this.roofElem.addEventListener('change', (ev) => this.roofChange());

	if(undefined !== roofClasSelected) {
	    for(const layout of roofClasSelected.LayoutV) {
		this.layoutElem.appendChild(option = uiOptionElem(layout.idHtml));
		if(layout.idHtml == config.layout)
		    option.selected = 1;
	    }
	}

        for(const rackClas of RackClasV) {
	    this.rackElem.appendChild(option = uiOptionElem(rackClas.IdHtml));
	    if(rackClas.IdHtml == config.rack)
		option.selected = 1;
	}
    }

    configGet() {
	return {
	    roof:uiSelectValue(this.roofElem),
	    layout:uiSelectValue(this.layoutElem),
	    rack:uiSelectValue(this.rackElem),
	};
    }

    roofChange() {
	// re-populate layout <select>
	while("" != this.layoutElem.lastChild.value) this.layoutElem.removeChild(this.layoutElem.lastChild);

	let v = uiSelectValue(this.roofElem);
	const roofClas = RoofClasV.find((x) => v == x.IdHtml);
	if(undefined !== roofClas)
	    for(const layout of roofClas.LayoutV)
		this.layoutElem.appendChild(uiOptionElem(layout.idHtml));
    }

    sysPopu(sys, roofId) {
	let roofClas, layout, rackClas, roof, rack;
 	let v = uiSelectValue(this.roofElem);
	if(undefined !== (roofClas = RoofClasV.find((x) => v == x.IdHtml))) {
	    v = uiSelectValue(this.layoutElem);
	    if(undefined !== (layout = roofClas.LayoutV.find((x) => v == x.idHtml))) {
		v = uiSelectValue(this.rackElem);
		if(undefined !== (rackClas = RackClasV.find((x) => v == x.IdHtml))) {
		    const desc = `${roofId}: ${roofClas.IdHtml}, ${layout.idHtml}, ${rackClas.IdHtml}`;
		    sys.roofAdd(roof = new roofClas(sys, roofId, desc));
		    roof.rackAdd(rack = new rackClas(roof));
		    layout.rackPopu(rack, roof);
		    this.ui.statusElem.textContent = null;
		    return 0;
		    
		} else this.ui.statusElem.textContent = 'rack not selected';
	    } else this.ui.statusElem.textContent = 'layout not selected';
	} else this.ui.statusElem.textContent = 'roof plan not selected';
	return -1;
    }
}

//=======================================================================================================================
// UiSys
//=======================================================================================================================

class UiSys {
    static Config0 = [ UiSysForm.Config0 ];

    constructor(config) {
	this.formV = [];

	this.root = temRootClone('uiSys_tem');
	this.formAddElem = this.root.querySelector('._formAdd');
	this.formAddElem.addEventListener('click', (ev) => this.formAdd(new UiSysForm(this, UiSysForm.Config0)));
	this.root.querySelector('._go').addEventListener('click', (ev) => this.goStore());
	this.root.querySelector('._configClear').addEventListener('click', (ev) => configClear());
	this.statusElem = this.root.querySelector('._status');
	this.sysElem = this.root.querySelector('._sys');

	for(const x of config)
	    this.formAdd(new UiSysForm(this, x));
    }

    configGet() {
	return this.formV.map((x) => x.configGet());
    }
	
    formAdd(form) {
	this.formV.push(form);
	if(1 == this.formV.length) {
	    form.brElem.classList.add('displaynone');
	    form.removeElem.classList.add('displaynone');
	} else {
	    this.formV[0].removeElem.classList.remove('displaynone');
	}
	this.formAddElem.parentNode.insertBefore(form.root, this.formAddElem);
    }

    formRemove(form) {
	form.root.parentNode.removeChild(form.root);
	this.formV.splice(this.formV.findIndex((x) => x === form), 1);
	this.formV[0].brElem.classList.add('displaynone');
	if(1 == this.formV.length) 
	    this.formV[0].removeElem.classList.add('displaynone');
    }

    go() {
	const sys = new Sys();
	for(let i = 0; i < this.formV.length; ++i) {
	    if(this.formV[i].sysPopu(sys, `roof${i}`))
		return;
	}

	this.sysElem.parentNode.replaceChild(sys.root, this.sysElem);
	this.sysElem = sys.root;
	sys.sysFin();
    }

    goStore() {
	uiConfigStore();
	this.go();
    }
    
}

//=======================================================================================================================
// ui
//=======================================================================================================================

function uiSysAdd(uiSys) {
    UiSysV.push(uiSys);
    UiSysDiv.appendChild(uiSys.root);
}

const UiConfig0 = [ UiSys.Config0 ];

function uiConfigClear() {
    window.localStorage.clear();
}

function uiConfigLoadOrNew() {
    const srcS = window.localStorage.getItem('uiConfig');
    const config = (null !== srcS) ? JSON.parse(srcS) : UiConfig0;
    for(const x of config) {
	const sys = new UiSys(x);
	uiSysAdd(sys);
	sys.go();
    }
}

function uiConfigStore() {
    const dst = JSON.stringify(UiSysV.map((x) => x.configGet()));
    window.localStorage.setItem('uiConfig', dst);
}

//=======================================================================================================================
// bodyOnload
//=======================================================================================================================

function bodyOnload() {
    railrHandlerInit(); // worker thread
    UiSysDiv = document.getElementById('uiSysDiv');
    uiConfigLoadOrNew();
}
