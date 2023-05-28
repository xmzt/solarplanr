//include sys.js

//-----------------------------------------------------------------------------------------------------------------------
// object tables

var RoofClasByIdHtml;
var RackClasByIdHtml;
var InvsysClasByIdHtml;

//-----------------------------------------------------------------------------------------------------------------------
// helpers

function uiOptionElem(idHtml) {
    const option = eleNu('option');
    option.value = idHtml;
    option.innerHTML = idHtml;
    return option;
}

function uiSelectValue(elem) {
    return elem.item(elem.selectedIndex).value;
}

//-----------------------------------------------------------------------------------------------------------------------
// UiRoof

class UiRoof {
    static Config0 = { roof:null, layout:null, rack:null, invsys:null };

    constructor(uiSys, root, config, id, onlyroof) {
	this.uiSys = uiSys;
	this.root = root;
	this.id = id;
	root.querySelector('._idSpan').textContent = id;
	this.roofAddBut = root.querySelector('._roofAddBut');
	this.roofAddBut.addEventListener('click', (ev) => this.uiSys.uiRoofAdd(UiRoof.Config0));
	this.roofRemBut = root.querySelector('._roofRemBut');
	this.roofRemBut.addEventListener('click', (ev) => this.uiSys.uiRoofRem(this));
	if(onlyroof) this.roofRemBut.classList.add('displayNone');

	this.roofSel = root.querySelector('._roofSel');
	let roofClasSelected = RoofNone;
	let option;
        for(const k in RoofClasByIdHtml) {
	    this.roofSel.appendChild(option = uiOptionElem(k));
	    if(option.selected = k == config.roof)
		roofClasSelected = RoofClasByIdHtml[k];
	}
	this.roofSel.addEventListener('change', (ev) => this.roofSelChange());

	this.layoutSel = root.querySelector('._layoutSel');
	for(const k in roofClasSelected.LayoutFunByIdHtml) {
	    this.layoutSel.appendChild(option = uiOptionElem(k));
	    option.selected = k == config.layout;
	}

	this.rackSel = root.querySelector('._rackSel');
	for(const k in RackClasByIdHtml) {
	    this.rackSel.appendChild(option = uiOptionElem(k));
	    option.selected = k == config.rack;
	}
	
	this.invsysSel = root.querySelector('._invsysSel');
	for(const k in InvsysClasByIdHtml) {
	    this.invsysSel.appendChild(option = uiOptionElem(k));
	    option.selected = k == config.invsys;
	}

	this.jboxSel = root.querySelector('._jboxSel');
	for(const option of this.jboxSel.options)
	    option.selected = option.value == config.jbox;
	
	root.querySelector('._goBut').addEventListener('click', (ev) => this.uiSys.goStore());
	root.querySelector('._resetBut').addEventListener('click', (ev) => this.reset());
	this.canElem = root.querySelector('._can');
	this.canRailElem = root.querySelector('._canRail');
    }

    configGet() {
	return {
	    roof:uiSelectValue(this.roofSel),
	    layout:uiSelectValue(this.layoutSel),
	    rack:uiSelectValue(this.rackSel),
	    invsys:uiSelectValue(this.invsysSel),
	    jbox:uiSelectValue(this.jboxSel),
	};
    }

    onlyroofSet(x) {
	if(x) this.roofRemBut.classList.add('displayNone');
	else this.roofRemBut.classList.remove('displayNone');
    }

    reset() {
	this.uiSys.ui.configReset();
    }
    
    roofSelChange() {
	this.layoutSel.replaceChildren();
	for(const k in RoofClasByIdHtml[uiSelectValue(this.roofSel)].LayoutFunByIdHtml)
	    this.layoutSel.appendChild(uiOptionElem(k));
    }

    sysPopu(sys) {
	sys.jboxSet(parseInt(uiSelectValue(this.jboxSel)));
	
	const invsysClas = InvsysClasByIdHtml[uiSelectValue(this.invsysSel)];
	const invsys = sys.invsysGetOrNew(invsysClas);

	const roofClas = RoofClasByIdHtml[uiSelectValue(this.roofSel)];
	const roof = new roofClas(sys, this.id, this.canElem, this.canRailElem);
	sys.roofAdd(roof);

	const rackClas = RackClasByIdHtml[uiSelectValue(this.rackSel)];
	const rack =  new rackClas(roof);
	sys.rackAdd(rack);
	    
	const layoutFun = roofClas.LayoutFunByIdHtml[uiSelectValue(this.layoutSel)];
	layoutFun(rack, roof);
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// UiSys

class UiSys {
    static Config0 = [ UiRoof.Config0 ];

    constructor(ui, root, config) {
	this.ui = ui;
	this.root = root;
	this.roofIdAlloc = 0;
	this.uiRoofV = [];
	this.roofVElem = root.querySelector('._roofV');
	this.partTabParentElem = root.querySelector('._partTabParent');
	this.railGroupDiagVElem = root.querySelector('._railGroupDiagV');

	for(const x of config)
	    this.uiRoofAdd(x);

	this.sys = new SysPlaceholder();
    }

    configGet() {
	return this.uiRoofV.map((x) => x.configGet());
    }
	
    uiRoofAdd(config) {
	if(1 == this.uiRoofV.length)
	    this.uiRoofV[0].onlyroofSet(0);
	const id = this.roofIdAlloc++;
	const uiRoof = new UiRoof(this, temClone('roof_tem'), config, `Roof.${id}`, (0 == this.uiRoofV.length));
	this.uiRoofV.push(uiRoof);
	this.roofVElem.appendChild(uiRoof.root);
    }

    uiRoofRem(uiRoof) {
	this.roofVElem.removeChild(uiRoof.root);
	this.uiRoofV.splice(this.uiRoofV.findIndex((x) => x === uiRoof), 1);
	if(1 == this.uiRoofV.length)
	    this.uiRoofV[0].onlyroofSet(1);
    }

    go() {
	// stop old uiSys. add uiSys to document before uiSysFin so that canvas ctx is valid
	this.sys.terminate();
	this.railGroupDiagVElem.replaceChildren();
	
	this.sys = new Sys(new SysPartTab(temClone('partTab_tem')), this.railGroupDiagVElem);
	this.partTabParentElem.replaceChildren(this.sys.partTab.root);
	for(const uiRoof of this.uiRoofV)
	    uiRoof.sysPopu(this.sys);
	this.sys.sysFin()
    }

    goStore() {
	this.ui.configStore();
	this.go();
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// Ui

class Ui {
    static Config0 = [ UiSys.Config0 ];

    constructor(uiSysVElem, stor, storItem) {
	this.uiSysVElem = uiSysVElem;
	this.stor = stor;
	this.storItem = storItem;
	this.uiSysV = [];
	
	// load config or new
	const srcS = stor.getItem(storItem);
	const config = (null !== srcS) ? JSON.parse(srcS) : this.constructor.Config0;
	for(const x of config)
	    this.uiSysAdd(x);
    }	
    
    uiSysAdd(config) {
	const uiSys = new UiSys(this, temClone('sys_tem'), config);
	this.uiSysV.push(uiSys);
	this.uiSysVElem.appendChild(uiSys.root);
	uiSys.go();
    }

    configReset() {
	this.stor.removeItem(this.storItem);
    }

    configStore() {
	const dst = JSON.stringify(this.uiSysV.map((x) => x.configGet()));
	this.stor.setItem(this.storItem, dst);
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// uiBodyOnload

function uiBodyOnload() {
    RoofClasByIdHtml = byIdHtml(
	RoofNone,
	SiteB_Roof,
	SiteA_RoofA,
	SiteA_RoofB,
    );
    RackClasByIdHtml = byIdHtml(
	RackNone,
	RackIronRidgeXR10Camo,
	RackIronRidgeXR10Stopper,
	RackIronRidgeXR100Camo,
	RackIronRidgeXR100Stopper,
    );
    InvsysClasByIdHtml = byIdHtml(
	InvsysNone,
	InvsysSolarEdge,
	InvsysEnphase,
	InvsysSunnyBoy,
    );
    new Ui(document.getElementById('uiSysV'), window.localStorage, 'uiConfig');
}
