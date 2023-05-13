//include sys.js

//-----------------------------------------------------------------------------------------------------------------------
// globals

var UiSysV = [];
var UiSysDiv;

//-----------------------------------------------------------------------------------------------------------------------
// helpers

function uiOptionElem(idHtml) {
    const option = document.createElement('option');
    option.value = idHtml;
    option.innerHTML = idHtml;
    return option;
}

function uiSelectValue(elem) {
    return elem.item(elem.selectedIndex).value;
}

//-----------------------------------------------------------------------------------------------------------------------
// UiSysForm

class UiSysForm {
    static Config0 = { roof:null, layout:null, rack:null };

    constructor(sys, config) {
	this.sys = sys;
	const root = this.root = temRootClone('uiSysForm_tem');
	this.brElem = root.querySelector('._br');
	this.roofElem = root.querySelector('._roof');
	this.layoutElem = root.querySelector('._layout');
	this.rackElem = root.querySelector('._rack');
	this.removeElem = root.querySelector('._remove');
	this.removeElem.addEventListener('click', (ev) => this.sys.formRemove(this));
	
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
		    const roof = new roofClas(sys, roofId, desc);
		    sys.roofAdd(roof);
		    roof.rackAdd(rack = new rackClas(roof));
		    layout.rackPopu(rack, roof);
		    this.sys.statusElem.textContent = null;
		    return 0;
		    
		} else this.sys.statusElem.textContent = 'rack not selected';
	    } else this.sys.statusElem.textContent = 'layout not selected';
	} else this.sys.statusElem.textContent = 'roof plan not selected';
	return -1;
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// UiSys

class UiSys {
    static Config0 = [ UiSysForm.Config0 ];

    constructor(config) {
	const root = this.root = temRootClone('uiSys_tem');
	this.formV = [];
	this.formAddElem = root.querySelector('._formAdd');
	this.formAddElem.addEventListener('click', (ev) => this.formAdd(new UiSysForm(this, UiSysForm.Config0)));
	root.querySelector('._go').addEventListener('click', (ev) => this.goStore());
	root.querySelector('._configClear').addEventListener('click', (ev) => configClear());
	this.statusElem = root.querySelector('._status');
	this.sys = new SysPlaceholder(root.querySelector('._sys'));
	
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
	// stop old sys. add sys to document before sysFin so that canvas ctx is valid
	this.sys.terminate();
	this.root.replaceChild(sys.root, this.sys.root);
	this.sys = sys;
	sys.sysFin();
    }

    goStore() {
	uiConfigStore();
	this.go();
    }
    
}

//-----------------------------------------------------------------------------------------------------------------------
// ui

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

//-----------------------------------------------------------------------------------------------------------------------
// bodyOnload

function bodyOnload() {
    UiSysDiv = document.getElementById('uiSysDiv');
    uiConfigLoadOrNew();
}
