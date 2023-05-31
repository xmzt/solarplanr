//include sys.js

function siteLayoutFun(site, layoutId) { return (env) => new site(env, site.LayoutById[layoutId]); }

function siteNop(partTab, railGroupMgr, drawr) {
}

//-----------------------------------------------------------------------------------------------------------------------
// object tables

var UiSiteByDes = {
    '--Select site/layout--': siteNop,
    'SiteB Q475/400': siteLayoutFun(SiteB, 'Q475/Q400'),
};

//-----------------------------------------------------------------------------------------------------------------------
// helpers

function uiOptionEle(idHtml) {
    const option = eleNu('option');
    option.value = idHtml;
    option.innerHTML = idHtml;
    return option;
}

function uiSelectValue(ele) {
    return ele.item(ele.selectedIndex).value;
}

//-----------------------------------------------------------------------------------------------------------------------
// UiRailGroup

class UiRailGroupDiag extends RailGroupDiag {
    constructor(root) {
	super();
	this.statusEle = root.querySelector('._status');
	this.logEle = root.querySelector('._log');
	root.querySelector('._logShow').addEventListener('click', (ev) => this.logShowClick(ev));
    }

    log(msg) { this.logEle.innerHTML += msg; }
	
    logShowClick() { this.logEle.classList.toggle('displayNone'); }

    status(msg) { this.statusEle.innerHTML = msg; }
}

class UiRailGroupMgr extends RailGroupMgr {
    constructor(diagVEle) {
	super();
	this.diagVEle = diagVEle;
    }

    diagNu() { return new UiRailGroupDiag(this.diagVEle.appendChild(temClone('railGroupDiag_tem'))); }
}

//-----------------------------------------------------------------------------------------------------------------------
// UiSysEnv

class UiSysEnv {
    constructor(root) {
	this.drawrVEle = eleNuClas('div', 'drawrV');
	const partTabEle = temClone('partTab_tem');
	const railGroupDiagVEle = eleNu('div');
	root.replaceChildren(this.drawrVEle, partTabEle, railGroupDiagVEle);
	this.partTab = new UiPartTab(partTabEle);
	this.railGroupMgr = new UiRailGroupMgr(railGroupDiagVEle);
    }

    drawrNu() {
	return new CanvasDrawr(this.drawrVEle);
    }

    terminate() {
	this.railGroupMgr.terminate();
    }
}

class UiSysEnvNop {
    terminate() {}
}

//-----------------------------------------------------------------------------------------------------------------------
// Ui

class Ui {
    static Config0 = '';
    
    constructor(sysSelEle, sysEnvEle, stor, storItem) {
	this.sysSelEle = sysSelEle;
	this.sysEnvEle = sysEnvEle;
	this.sysEnv = new UiSysEnvNop(sysEnvEle);
	this.stor = stor;
	this.storItem = storItem;
	//this.site

	const config = this.configLoad();
	
	let siteFunSel = null;
        for(const [des,siteFun] of Object.entries(UiSiteByDes)) {
	    const option = sysSelEle.appendChild(uiOptionEle(des));
	    if(option.selected = des == config)
		siteFunSel = siteFun;
	}
	sysSelEle.addEventListener('change', (ev) => this.sysSelChange());
	if(null !== siteFunSel)
	    this.sysSelGo(siteFunSel);
    }
    configLoad() {
	const srcS = this.stor.getItem(this.storItem);
	return (null !== srcS) ? JSON.parse(srcS) : this.constructor.Config0;
    }
    
    configReset() {
	this.stor.removeItem(this.storItem);
    }

    configStore() {
	this.stor.setItem(this.storItem, JSON.stringify(uiSelectValue(this.sysSelEle)));
    }

    sysSelChange() {
	this.sysSelGo(UiSiteByDes[uiSelectValue(this.sysSelEle)]);
    }

    sysSelGo(siteFun) {
	// stop old uiSysEnv
	this.sysEnv.terminate();

	// add new uiSysEnv
	this.configStore();
	this.sysEnv = new UiSysEnv(this.sysEnvEle);
	siteFun(this.sysEnv);
    }
    
    goStore() {
	this.ui.configStore();
	this.go();
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// uiBodyOnload

function uiBodyOnload() {
    new Ui(document.getElementById('sysSel'), document.getElementById('sys'), window.localStorage, 'uiConfig');
}
