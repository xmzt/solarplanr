//include sys.js

function siteLayoutFun(site, layoutId) { return (env) => new site(env, site.LayoutById[layoutId]); }

function siteNop(env) {}

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
// UiRailGroupDiag

class UiRailGroupDiag {
    constructor(dst) {
	const root = eleNu('div');
	const head = eleNuAdd('div', root);
	const logShow = eleNuAdd('button', head);
	logShow.textContent = 'Log Show/Hide';
	this.statusEle = eleNuClasAdd('span', 'railGroupStatus', head);
	this.logEle = eleClas(eleNuClasAdd('div', 'railGroupLog', root), 'displayNone');
	logShow.addEventListener('click', (ev) => this.logShowClick(ev));
	dst.appendChild(root);
    }

    log(msg) { this.logEle.innerHTML += msg; }
    
    logShowClick() { this.logEle.classList.toggle('displayNone'); }

    status(msg) { this.statusEle.innerHTML = msg; }
}

//-----------------------------------------------------------------------------------------------------------------------
// UiEnv

class UiEnv {
    constructor(root) {
	this.drawrVEle = eleNuClas('div', 'drawrV');
	const partTabEle = temClone('partTab_tem');
	this.logEle = eleNuClas('div', 'log');
	this.railGroupDiagVEle = eleNu('div');
	root.replaceChildren(this.drawrVEle, partTabEle, this.logEle, this.railGroupDiagVEle);
	this.partTab = new UiPartTab(partTabEle);

	this.wkrReqI = 0;
	this.wkrReqHandByI = {};
	this.wkr = new Worker('railWkr.js'); // todo? wkr thread more generalized than railWkr.js
	this.wkr.onmessage = (ev) => {
	    const hand = this.wkrReqHandByI[ev.data[0]];
	    hand[ev.data[1]].apply(hand, ev.data.slice(2)); // todo remove slice?
	};
	
    }

    drawrNu() { return new CanvasDrawr(this.drawrVEle); }

    log(msg) { this.logEle.appendChild(eleNu('div')).textContent = msg; }

    oneObjReg(obj) {}
    
    railGroupDiagNu() { return new UiRailGroupDiag(this.railGroupDiagVEle); }

    terminate() { this.wkr.terminate(); }

    wkrReq(...argV) {
	const i = this.wkrReqI++;
	this.wkrReqHandByI[i] = argV[0];
	argV[0] = i;
	this.wkr.postMessage(argV);
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// Ui

class Ui {
    static Config0 = '';
    
    constructor(sysSelEle, envEle, stor, storItem, siteByDes) {
	this.sysSelEle = sysSelEle;
	this.envEle = envEle;
	this.env = new EnvBase();
	this.stor = stor;
	this.storItem = storItem;
	this.siteByDes = siteByDes;
	//this.site

	const config = this.configLoad();
	
	let siteFunSel = null;
        for(const [des,siteFun] of Object.entries(this.siteByDes)) {
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
	this.sysSelGo(this.siteByDes[uiSelectValue(this.sysSelEle)]);
    }

    sysSelGo(siteFun) {
	// stop old uiEnv
	this.env.terminate();

	// add new uiEnv
	this.configStore();
	this.env = new UiEnv(this.envEle);
	new siteFun(this.env);
    }
    
    goStore() {
	this.ui.configStore();
	this.go();
    }
}

//-----------------------------------------------------------------------------------------------------------------------
// uiBodyOnload

function uiBodyOnload() {
    const siteByDes = { '--Select site/layout--': siteNop };
    SiteB.popuSiteByDes(siteByDes);
    new Ui(document.getElementById('sysSel'),
	   document.getElementById('sys'),
	   window.localStorage,
	   'uiConfig',
	   siteByDes);
}
