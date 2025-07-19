(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function e(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(a){if(a.ep)return;a.ep=!0;const n=e(a);fetch(a.href,n)}})();class l extends HTMLElement{constructor(){super(),this._initialized=!1,this._observers=[]}connectedCallback(){this._initialized||(this.init(),this.render(),this.bindEvents(),this._initialized=!0)}disconnectedCallback(){this.cleanup(),this._observers.forEach(t=>t.disconnect()),this._observers=[]}init(){}render(){}bindEvents(){}cleanup(){}applyClasses(t,e){typeof e=="string"?t.className=e:Array.isArray(e)&&(t.className=e.join(" "))}createElement(t,e="",i={}){const a=document.createElement(t);return e&&this.applyClasses(a,e),Object.entries(i).forEach(([n,s])=>{n.startsWith("data-")||n==="id"||n==="role"||n==="aria-label"?a.setAttribute(n,s):a[n]=s}),a}emit(t,e={}){const i=new CustomEvent(t,{detail:e,bubbles:!0,cancelable:!0});this.dispatchEvent(i)}observeAttribute(t,e){const i=new MutationObserver(a=>{a.forEach(n=>{n.type==="attributes"&&n.attributeName===t&&e(this.getAttribute(t),n.oldValue)})});return i.observe(this,{attributes:!0,attributeOldValue:!0,attributeFilter:[t]}),this._observers.push(i),i}bindToState(){var i;const t=this.getAttribute("field-id");if(!t||!((i=window.AppState)!=null&&i.fields))return;const e=window.AppState.fields[t];e&&Object.entries(e).forEach(([a,n])=>{a==="value"&&this.setValue?this.setValue(n):a==="options"&&this.setOptions?this.setOptions(n):typeof n=="boolean"?this.setBooleanAttribute(a,n):n!=null&&this.setAttribute(a,n)})}syncFromState(){this.bindToState(),this.updateComponent?this.updateComponent():this.render&&this.render()}getBooleanAttribute(t){return this.hasAttribute(t)&&this.getAttribute(t)!=="false"}setBooleanAttribute(t,e){e?this.setAttribute(t,""):this.removeAttribute(t)}getJSONAttribute(t,e=null){try{const i=this.getAttribute(t);return i?JSON.parse(i):e}catch(i){return console.warn(`Invalid JSON in attribute ${t}:`,i),e}}setJSONAttribute(t,e){this.setAttribute(t,JSON.stringify(e))}}class b extends l{static get observedAttributes(){return["gap","align","justify"]}init(){this.className="grid",this.style.display="grid",this.updateStyles()}render(){this.updateStyles()}attributeChangedCallback(t,e,i){this._initialized&&e!==i&&this.updateStyles()}updateStyles(){const t=this.getAttribute("gap");t&&(this.style.gap=t);const e=this.getAttribute("align");e&&(this.style.alignItems=e);const i=this.getAttribute("justify");i&&(this.style.justifyContent=i)}}class g extends l{static get observedAttributes(){return["cols","offset","order"]}init(){this.updateClasses()}attributeChangedCallback(t,e,i){this._initialized&&e!==i&&this.updateClasses()}updateClasses(){let t=[];const e=this.getAttribute("cols");e&&t.push(...e.split(/\s+/));const i=this.getAttribute("offset");i&&t.push(...i.split(/\s+/).map(n=>`offset-${n}`));const a=this.getAttribute("order");a&&(this.style.order=a),this.className=t.join(" ")}}customElements.define("ui-grid",b);customElements.define("ui-grid-item",g);class f extends l{static get observedAttributes(){return["position","align","margin","padding","responsive","fill"]}init(){this.updateClasses()}attributeChangedCallback(t,e,i){this._initialized&&e!==i&&this.updateClasses()}updateClasses(){let t=[];const e=this.getAttribute("position");e&&t.push(e);const i=this.getAttribute("align");i&&t.push(...i.split(/\s+/));const a=this.getAttribute("margin");a&&(a==="none"?t.push("no-margin"):t.push(`${a}-margin`));const n=this.getAttribute("padding");n&&(n==="none"?t.push("no-padding"):t.push(`${n}-padding`)),this.getBooleanAttribute("responsive")&&t.push("responsive"),this.getBooleanAttribute("fill")&&t.push("fill"),this.applyClasses(this,t.join(" "))}}class v extends l{static get observedAttributes(){return["direction","wrap","justify","align","gap"]}init(){this.style.display="flex",this.updateStyles()}attributeChangedCallback(t,e,i){this._initialized&&e!==i&&this.updateStyles()}updateStyles(){const t=this.getAttribute("direction");t&&(this.style.flexDirection=t);const e=this.getAttribute("wrap");e&&(this.style.flexWrap=e);const i=this.getAttribute("justify");i&&(this.style.justifyContent=i);const a=this.getAttribute("align");a&&(this.style.alignItems=a);const n=this.getAttribute("gap");n&&(this.style.gap=n)}}class y extends l{static get observedAttributes(){return["grow","shrink","basis","align"]}init(){this.updateStyles()}attributeChangedCallback(t,e,i){this._initialized&&e!==i&&this.updateStyles()}updateStyles(){const t=this.getAttribute("grow");t!==null&&(this.style.flexGrow=t||"1");const e=this.getAttribute("shrink");e!==null&&(this.style.flexShrink=e||"1");const i=this.getAttribute("basis");i&&(this.style.flexBasis=i);const a=this.getAttribute("align");a&&(this.style.alignSelf=a)}}customElements.define("ui-layout",f);customElements.define("ui-flex",v);customElements.define("ui-flex-item",y);class x extends l{static get observedAttributes(){return["variant","icon","icon-position","disabled","loading","size","round"]}init(){this.originalContent=this.innerHTML||this.textContent,this.button=this.createElement("button"),this.innerHTML="",this.appendChild(this.button),this.updateButton()}attributeChangedCallback(t,e,i){this._initialized&&e!==i&&this.updateButton()}bindEvents(){this.button.addEventListener("click",t=>{!this.getBooleanAttribute("disabled")&&!this.getBooleanAttribute("loading")&&this.emit("click",{originalEvent:t})}),this.button.addEventListener("focus",t=>{this.emit("focus",{originalEvent:t})}),this.button.addEventListener("blur",t=>{this.emit("blur",{originalEvent:t})})}getButtonText(){return this.originalContent?this.originalContent.replace(/<[^>]*>/g,"").trim():""}updateButton(){let t=[];const e=this.getAttribute("variant")||"filled";e!=="text"&&t.push(e);const i=this.getAttribute("size");i&&i!=="medium"&&t.push(i),this.getBooleanAttribute("round")&&t.push("round"),this.applyClasses(this.button,t.join(" ")),this.button.disabled=this.getBooleanAttribute("disabled"),this.getBooleanAttribute("loading")&&(this.button.disabled=!0),this.renderButtonContent()}renderButtonContent(){const t=this.getAttribute("icon"),e=this.getAttribute("icon-position")||"left",i=this.getBooleanAttribute("loading"),a=this.getButtonText();if(this.button.innerHTML="",i){const n=this.createElement("i","material-icons",{style:"animation: spin 1s linear infinite;"});if(n.textContent="refresh",this.button.appendChild(n),a){const s=this.createElement("span");s.textContent=a,this.button.appendChild(s)}}else{if(t&&e==="left"){const n=this.createElement("i","material-icons");n.textContent=t,this.button.appendChild(n)}if(a){const n=this.createElement("span");n.textContent=a,this.button.appendChild(n)}if(t&&e==="right"){const n=this.createElement("i","material-icons");n.textContent=t,this.button.appendChild(n)}if(t&&!a){const n=this.createElement("i","material-icons");n.textContent=t,this.button.appendChild(n),this.button.classList.add("circle")}}}focus(){this.button.focus()}blur(){this.button.blur()}click(){!this.getBooleanAttribute("disabled")&&!this.getBooleanAttribute("loading")&&this.button.click()}}customElements.define("ui-button",x);class E extends l{static get observedAttributes(){return["label","type","placeholder","value","required","disabled","readonly","min","max","step","pattern","maxlength","minlength","helper","error","icon","icon-position","autocomplete"]}init(){this.fieldContainer=this.createElement("div","field"),this.inputElement=this.createElement("input"),this.labelElement=this.createElement("label"),this.helperElement=this.createElement("div","helper"),this.appendChild(this.fieldContainer),this.fieldContainer.appendChild(this.inputElement),this.fieldContainer.appendChild(this.labelElement),this.fieldContainer.appendChild(this.helperElement),this.bindToState(),this.updateInput()}attributeChangedCallback(t,e,i){this._initialized&&e!==i&&this.updateInput()}bindEvents(){this.inputElement.addEventListener("input",t=>{this.emit("input",{value:t.target.value,originalEvent:t}),this.validate()}),this.inputElement.addEventListener("change",t=>{this.emit("change",{value:t.target.value,originalEvent:t})}),this.inputElement.addEventListener("focus",t=>{this.fieldContainer.classList.add("focused"),this.emit("focus",{originalEvent:t})}),this.inputElement.addEventListener("blur",t=>{this.fieldContainer.classList.remove("focused"),this.emit("blur",{originalEvent:t}),this.validate()}),this.inputElement.addEventListener("keydown",t=>{this.emit("keydown",{key:t.key,value:t.target.value,originalEvent:t})})}updateInput(){const t=this.getAttribute("type")||"text";this.inputElement.type=t;const e=this.getAttribute("placeholder");e&&(this.inputElement.placeholder=e);const i=this.getAttribute("value");i!==null&&(this.inputElement.value=i),this.inputElement.required=this.getBooleanAttribute("required"),this.inputElement.disabled=this.getBooleanAttribute("disabled"),this.inputElement.readOnly=this.getBooleanAttribute("readonly"),["min","max","step","maxlength","minlength"].forEach(o=>{const d=this.getAttribute(o);d!==null&&this.inputElement.setAttribute(o,d)});const a=this.getAttribute("pattern");a&&(this.inputElement.pattern=a);const n=this.getAttribute("autocomplete");n&&(this.inputElement.autocomplete=n);const s=this.getAttribute("label");s&&(this.labelElement.textContent=s),this.updateHelper(),this.updateIcon()}updateHelper(){const t=this.getAttribute("helper"),e=this.getAttribute("error");e?(this.helperElement.textContent=e,this.helperElement.className="helper error",this.fieldContainer.classList.add("invalid")):t?(this.helperElement.textContent=t,this.helperElement.className="helper",this.fieldContainer.classList.remove("invalid")):(this.helperElement.textContent="",this.fieldContainer.classList.remove("invalid"))}updateIcon(){const t=this.fieldContainer.querySelector(".input-icon");t&&t.remove();const e=this.getAttribute("icon"),i=this.getAttribute("icon-position")||"left";if(e){const a=this.createElement("i","material-icons input-icon");a.textContent=e,i==="right"?(a.classList.add("right"),this.fieldContainer.appendChild(a)):(a.classList.add("left"),this.fieldContainer.insertBefore(a,this.inputElement))}}validate(){if(this.inputElement.checkValidity())return this.removeAttribute("error"),!0;{const t=this.getValidationMessage();return this.setAttribute("error",t),!1}}getValidationMessage(){return this.inputElement.validity.valueMissing?`${this.getAttribute("label")||"This field"} is required`:this.inputElement.validity.typeMismatch?"Please enter a valid value":this.inputElement.validity.patternMismatch?"Please match the required format":this.inputElement.validity.tooShort?`Minimum length is ${this.getAttribute("minlength")} characters`:this.inputElement.validity.tooLong?`Maximum length is ${this.getAttribute("maxlength")} characters`:this.inputElement.validity.rangeUnderflow?`Minimum value is ${this.getAttribute("min")}`:this.inputElement.validity.rangeOverflow?`Maximum value is ${this.getAttribute("max")}`:this.inputElement.validationMessage}get value(){return this.inputElement.value}set value(t){this.inputElement.value=t,this.setAttribute("value",t)}focus(){this.inputElement.focus()}blur(){this.inputElement.blur()}select(){this.inputElement.select()}checkValidity(){return this.validate()}setValue(t){this.value=t}}customElements.define("ui-input",E);class A extends l{static get observedAttributes(){return["label","value","required","disabled","multiple","helper","error"]}init(){this.originalOptions=Array.from(this.children),this.fieldContainer=this.createElement("div","field"),this.selectElement=this.createElement("select"),this.labelElement=this.createElement("label"),this.helperElement=this.createElement("div","helper"),this.appendChild(this.fieldContainer),this.fieldContainer.appendChild(this.selectElement),this.fieldContainer.appendChild(this.labelElement),this.fieldContainer.appendChild(this.helperElement),this.originalOptions.forEach(t=>{this.selectElement.appendChild(t.cloneNode(!0))}),this.bindToState(),this.updateSelect()}attributeChangedCallback(t,e,i){this._initialized&&e!==i&&this.updateSelect()}bindEvents(){this.selectElement.addEventListener("change",t=>{const e=this.multiple?Array.from(t.target.selectedOptions).map(i=>i.value):t.target.value;this.emit("change",{value:e,selectedOptions:Array.from(t.target.selectedOptions),originalEvent:t}),this.validate()}),this.selectElement.addEventListener("focus",t=>{this.fieldContainer.classList.add("focused"),this.emit("focus",{originalEvent:t})}),this.selectElement.addEventListener("blur",t=>{this.fieldContainer.classList.remove("focused"),this.emit("blur",{originalEvent:t}),this.validate()})}updateSelect(){this.selectElement.required=this.getBooleanAttribute("required"),this.selectElement.disabled=this.getBooleanAttribute("disabled"),this.selectElement.multiple=this.getBooleanAttribute("multiple");const t=this.getAttribute("value");if(t!==null)if(this.multiple){const i=t.split(",");Array.from(this.selectElement.options).forEach(a=>{a.selected=i.includes(a.value)})}else this.selectElement.value=t;const e=this.getAttribute("label");e&&(this.labelElement.textContent=e),this.updateHelper()}updateHelper(){const t=this.getAttribute("helper"),e=this.getAttribute("error");e?(this.helperElement.textContent=e,this.helperElement.className="helper error",this.fieldContainer.classList.add("invalid")):t?(this.helperElement.textContent=t,this.helperElement.className="helper",this.fieldContainer.classList.remove("invalid")):(this.helperElement.textContent="",this.fieldContainer.classList.remove("invalid"))}validate(){if(this.selectElement.checkValidity())return this.removeAttribute("error"),!0;{const t=this.getValidationMessage();return this.setAttribute("error",t),!1}}getValidationMessage(){return this.selectElement.validity.valueMissing?`${this.getAttribute("label")||"Selection"} is required`:this.selectElement.validationMessage}addOption(t,e,i=!1){const a=this.createElement("option","",{value:t});a.textContent=e,a.selected=i,this.selectElement.appendChild(a)}removeOption(t){const e=this.selectElement.querySelector(`option[value="${t}"]`);e&&e.remove()}clearOptions(){this.selectElement.innerHTML=""}get value(){return this.multiple?Array.from(this.selectElement.selectedOptions).map(t=>t.value):this.selectElement.value}set value(t){this.multiple&&Array.isArray(t)?(Array.from(this.selectElement.options).forEach(e=>{e.selected=t.includes(e.value)}),this.setAttribute("value",t.join(","))):(this.selectElement.value=t,this.setAttribute("value",t))}get multiple(){return this.getBooleanAttribute("multiple")}focus(){this.selectElement.focus()}blur(){this.selectElement.blur()}checkValidity(){return this.validate()}setOptions(t){this.clearOptions(),t.forEach(e=>{this.addOption(e.value,e.label)})}setValue(t){this.value=t}}customElements.define("ui-select",A);class C extends l{static get observedAttributes(){return["active","variant"]}init(){this.tabs=[],this.tabButtons=[],this.tabHeader=this.createElement("nav","tabs"),this.appendChild(this.tabHeader),this.tabContent=this.createElement("div","tab-content"),this.appendChild(this.tabContent),this.processTabs(),this.updateTabs()}attributeChangedCallback(t,e,i){this._initialized&&e!==i&&t==="active"&&this.setActiveTab(parseInt(i)||0)}bindEvents(){this.tabButtons.forEach((t,e)=>{t.addEventListener("click",()=>{this.tabs[e].disabled||this.setActiveTab(e)})})}processTabs(){Array.from(this.children).filter(e=>e.tagName.toLowerCase()==="ui-tab").forEach((e,i)=>{const a=this.createElement("button","");a.textContent=e.getAttribute("label")||`Tab ${i+1}`,e.hasAttribute("disabled")&&(a.disabled=!0,a.classList.add("disabled")),this.tabHeader.appendChild(a),this.tabButtons.push(a);const n=this.createElement("div","tab-panel");n.innerHTML=e.innerHTML,n.setAttribute("role","tabpanel"),n.setAttribute("aria-labelledby",`tab-${i}`),n.style.display="none",this.tabContent.appendChild(n),this.tabs.push({element:e,button:a,content:n,disabled:e.hasAttribute("disabled")}),e.remove()})}updateTabs(){const t=parseInt(this.getAttribute("active"))||0;this.setActiveTab(t)}setActiveTab(t){t<0||t>=this.tabs.length||this.tabs[t].disabled||(this.tabs.forEach((e,i)=>{const a=i===t;e.button.classList.toggle("active",a),e.button.setAttribute("aria-selected",a),e.content.style.display=a?"block":"none",e.content.setAttribute("aria-hidden",!a)}),this.setAttribute("active",t),this.emit("tab-change",{activeIndex:t,activeTab:this.tabs[t]}))}getActiveTab(){const t=parseInt(this.getAttribute("active"))||0;return this.tabs[t]}addTab(t,e,i=!1){const a=this.tabs.length,n=this.createElement("button","");n.textContent=t,i&&(n.disabled=!0,n.classList.add("disabled")),this.tabHeader.appendChild(n);const s=this.createElement("div","tab-panel");return s.innerHTML=e,s.setAttribute("role","tabpanel"),s.setAttribute("aria-labelledby",`tab-${a}`),this.tabContent.appendChild(s),this.tabs.push({button:n,content:s,disabled:i}),n.addEventListener("click",()=>{i||this.setActiveTab(a)}),a}removeTab(t){if(t<0||t>=this.tabs.length)return;const e=this.tabs[t];e.button.remove(),e.content.remove(),this.tabs.splice(t,1);const i=parseInt(this.getAttribute("active"))||0;i>=t&&i>0?this.setActiveTab(i-1):this.tabs.length>0&&this.setActiveTab(0)}}class w extends l{static get observedAttributes(){return["label","disabled"]}}customElements.define("ui-tabs",C);customElements.define("ui-tab",w);class S extends l{static get observedAttributes(){return["multiple","variant"]}init(){this.items=[],this.processItems()}processItems(){Array.from(this.children).filter(e=>e.tagName.toLowerCase()==="ui-accordion-item").forEach((e,i)=>{this.items.push(e),e.accordion=this,e.index=i})}toggleItem(t){!this.getBooleanAttribute("multiple")&&!t.getBooleanAttribute("open")&&this.items.forEach(i=>{i!==t&&i.close()}),t.toggle()}openAll(){this.items.forEach(t=>t.open())}closeAll(){this.items.forEach(t=>t.close())}getOpenItems(){return this.items.filter(t=>t.getBooleanAttribute("open"))}}class k extends l{static get observedAttributes(){return["title","open","disabled"]}init(){this.originalContent=this.innerHTML,this.header=this.createElement("div","accordion-header"),this.content=this.createElement("div","accordion-content"),this.innerHTML="",this.appendChild(this.header),this.appendChild(this.content),this.updateItem()}attributeChangedCallback(t,e,i){this._initialized&&e!==i&&this.updateItem()}bindEvents(){this.header.addEventListener("click",()=>{this.getBooleanAttribute("disabled")||(this.accordion?this.accordion.toggleItem(this):this.toggle())}),this.header.addEventListener("keydown",t=>{(t.key==="Enter"||t.key===" ")&&!this.getBooleanAttribute("disabled")&&(t.preventDefault(),this.accordion?this.accordion.toggleItem(this):this.toggle())})}updateItem(){const t=this.getAttribute("title")||"Accordion Item",e=this.getBooleanAttribute("disabled"),i=this.getBooleanAttribute("open");this.header.innerHTML=`
      <span class="accordion-title">${t}</span>
      <i class="material-icons accordion-icon">${i?"expand_less":"expand_more"}</i>
    `,this.header.setAttribute("role","button"),this.header.setAttribute("tabindex",e?"-1":"0"),this.header.setAttribute("aria-expanded",i),this.header.setAttribute("aria-disabled",e),e?this.header.classList.add("disabled"):this.header.classList.remove("disabled"),this.content.innerHTML=this.originalContent,this.content.setAttribute("role","region"),this.content.setAttribute("aria-hidden",!i),i?(this.content.style.display="block",this.classList.add("open")):(this.content.style.display="none",this.classList.remove("open"))}toggle(){this.getBooleanAttribute("open")?this.close():this.open()}open(){this.setBooleanAttribute("open",!0),this.updateItem(),this.emit("accordion-open",{item:this})}close(){this.setBooleanAttribute("open",!1),this.updateItem(),this.emit("accordion-close",{item:this})}get isOpen(){return this.getBooleanAttribute("open")}get title(){return this.getAttribute("title")}set title(t){this.setAttribute("title",t)}}customElements.define("ui-accordion",S);customElements.define("ui-accordion-item",k);class T extends l{static get observedAttributes(){return["variant","clickable","loading"]}init(){this.updateCard()}attributeChangedCallback(t,e,i){this._initialized&&e!==i&&this.updateCard()}bindEvents(){this.getBooleanAttribute("clickable")&&(this.addEventListener("click",t=>{this.emit("card-click",{originalEvent:t})}),this.addEventListener("keydown",t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),this.emit("card-click",{originalEvent:t}))}))}updateCard(){let t=["card"];const e=this.getAttribute("variant");e&&e!=="elevated"&&t.push(e),this.getBooleanAttribute("clickable")?(t.push("clickable"),this.setAttribute("tabindex","0"),this.setAttribute("role","button")):(this.removeAttribute("tabindex"),this.removeAttribute("role")),this.getBooleanAttribute("loading")&&t.push("loading"),this.applyClasses(this,t.join(" "))}}class L extends l{static get observedAttributes(){return["title","subtitle","avatar","action"]}init(){this.applyClasses(this,"card-header"),this.updateHeader()}attributeChangedCallback(t,e,i){this._initialized&&e!==i&&this.updateHeader()}updateHeader(){const t=this.getAttribute("title"),e=this.getAttribute("subtitle"),i=this.getAttribute("avatar"),a=this.getAttribute("action");let n="";i&&(n+=`<img src="${i}" alt="Avatar" class="circle small">`),(t||e)&&(n+='<div class="header-content">',t&&(n+=`<h6 class="card-title">${t}</h6>`),e&&(n+=`<p class="card-subtitle">${e}</p>`),n+="</div>"),a&&(n+=`<button class="circle transparent small">${a}</button>`),!(!t&&!e&&!i&&!a&&this.innerHTML.trim())&&(this.innerHTML=n)}}class I extends l{init(){this.applyClasses(this,"card-content")}}class M extends l{static get observedAttributes(){return["align"]}init(){this.updateActions()}attributeChangedCallback(t,e,i){this._initialized&&e!==i&&this.updateActions()}updateActions(){let t=["card-actions"];const e=this.getAttribute("align");e&&t.push(`${e}-align`),this.applyClasses(this,t.join(" "))}}class B extends l{static get observedAttributes(){return["src","alt","aspect-ratio"]}init(){this.applyClasses(this,"card-media"),this.updateMedia()}attributeChangedCallback(t,e,i){this._initialized&&e!==i&&this.updateMedia()}updateMedia(){const t=this.getAttribute("src"),e=this.getAttribute("alt")||"",i=this.getAttribute("aspect-ratio");if(t){const a=this.createElement("img","responsive",{src:t,alt:e});i&&(a.style.aspectRatio=i,a.style.objectFit="cover"),this.innerHTML="",this.appendChild(a)}}}customElements.define("ui-card",T);customElements.define("ui-card-header",L);customElements.define("ui-card-content",I);customElements.define("ui-card-actions",M);customElements.define("ui-card-media",B);class D extends l{static get observedAttributes(){return["field-id","columns","data-source","rows-per-page","current-page","searchable","sortable","selectable","loading"]}init(){this.data=[],this.filteredData=[],this.currentSort={column:null,direction:"asc"},this.selectedRows=new Set,this.fieldId=this.getAttribute("field-id"),this.createStructure(),this.bindToState(),this.updateTable()}bindToState(){var e;if(!this.fieldId||!window.AppState)return;const t=(e=window.AppState.fields)==null?void 0:e[this.fieldId];t&&(t.data&&this.setData(t.data),t.columns&&this.setAttribute("columns",JSON.stringify(t.columns)),t.rowsPerPage&&this.setAttribute("rows-per-page",t.rowsPerPage),t.searchable!==void 0&&this.setAttribute("searchable",t.searchable),t.loading!==void 0&&this.setAttribute("loading",t.loading))}syncFromState(){this.bindToState(),this.updateTable()}updateComponent(){this.updateTable()}createStructure(){this.innerHTML="",this.getBooleanAttribute("searchable")&&(this.searchContainer=this.createElement("div","table-search"),this.searchInput=this.createElement("input","",{type:"text",placeholder:"Search...","aria-label":"Search table"}),this.searchContainer.appendChild(this.searchInput),this.appendChild(this.searchContainer)),this.tableContainer=this.createElement("div","table-container"),this.table=this.createElement("table","table"),this.thead=this.createElement("thead"),this.tbody=this.createElement("tbody"),this.table.appendChild(this.thead),this.table.appendChild(this.tbody),this.tableContainer.appendChild(this.table),this.appendChild(this.tableContainer),this.paginationContainer=this.createElement("div","table-pagination"),this.appendChild(this.paginationContainer),this.loadingOverlay=this.createElement("div","table-loading"),this.loadingOverlay.innerHTML='<div class="loading-spinner"><i class="material-icons">refresh</i> Loading...</div>',this.appendChild(this.loadingOverlay)}bindEvents(){this.searchInput&&this.searchInput.addEventListener("input",t=>{this.handleSearch(t.target.value)}),this.thead.addEventListener("click",t=>{const e=t.target.closest("th");e&&e.dataset.sortable==="true"&&this.handleSort(e.dataset.column)}),this.getBooleanAttribute("selectable")&&(this.tbody.addEventListener("change",t=>{t.target.type==="checkbox"&&t.target.classList.contains("row-select")&&this.handleRowSelection(t.target)}),this.thead.addEventListener("change",t=>{t.target.type==="checkbox"&&t.target.classList.contains("select-all")&&this.handleSelectAll(t.target.checked)}))}updateTable(){if(this.getBooleanAttribute("loading")){this.loadingOverlay.style.display="flex";return}else this.loadingOverlay.style.display="none";this.renderHeader(),this.renderBody(),this.renderPagination()}renderHeader(){const t=this.getJSONAttribute("columns",[]),e=this.getBooleanAttribute("selectable");let i="<tr>";e&&(i+=`
        <th>
          <input type="checkbox" class="select-all" aria-label="Select all rows">
        </th>
      `),t.forEach(a=>{const n=a.sortable!==!1&&this.getBooleanAttribute("sortable"),s=this.currentSort.column===a.key,o=s?this.currentSort.direction==="asc"?"arrow_upward":"arrow_downward":"unfold_more";i+=`
        <th 
          data-column="${a.key}" 
          data-sortable="${n}"
          class="${n?"sortable":""} ${s?"sorted":""}"
          role="${n?"button":""}"
          tabindex="${n?"0":""}"
        >
          <span class="header-content">
            ${a.label||a.key}
            ${n?`<i class="material-icons sort-icon">${o}</i>`:""}
          </span>
        </th>
      `}),i+="</tr>",this.thead.innerHTML=i}renderBody(){const t=this.getJSONAttribute("columns",[]),e=this.getBooleanAttribute("selectable"),i=this.getPaginatedData();if(i.length===0){this.tbody.innerHTML=`
        <tr class="empty-row">
          <td colspan="${t.length+(e?1:0)}" class="center-align">
            No data available
          </td>
        </tr>
      `;return}let a="";i.forEach((n,s)=>{const o=n.id||s,d=this.selectedRows.has(o);a+=`<tr data-row-id="${o}" class="${d?"selected":""}">`,e&&(a+=`
          <td>
            <input 
              type="checkbox" 
              class="row-select" 
              data-row-id="${o}"
              ${d?"checked":""}
              aria-label="Select row"
            >
          </td>
        `),t.forEach(c=>{const h=this.getNestedValue(n,c.key),u=this.formatValue(h,c);a+=`
          <td data-column="${c.key}" class="${c.type||"text"}">
            ${u}
          </td>
        `}),a+="</tr>"}),this.tbody.innerHTML=a}renderPagination(){const t=parseInt(this.getAttribute("rows-per-page"))||10,e=parseInt(this.getAttribute("current-page"))||1,i=this.filteredData.length,a=Math.ceil(i/t);if(a<=1){this.paginationContainer.innerHTML="";return}const n=(e-1)*t+1,s=Math.min(e*t,i);let o=`
      <div class="pagination-info">
        Showing ${n}-${s} of ${i} rows
      </div>
      <div class="pagination-controls">
        <button 
          class="pagination-btn" 
          ${e===1?"disabled":""}
          onclick="this.closest('ui-smart-table').previousPage()"
        >
          <i class="material-icons">chevron_left</i>
        </button>
    `;const d=5;let c=Math.max(1,e-Math.floor(d/2)),h=Math.min(a,c+d-1);h-c+1<d&&(c=Math.max(1,h-d+1));for(let u=c;u<=h;u++)o+=`
        <button 
          class="pagination-btn ${u===e?"active":""}"
          onclick="this.closest('ui-smart-table').goToPage(${u})"
        >
          ${u}
        </button>
      `;o+=`
        <button 
          class="pagination-btn" 
          ${e===a?"disabled":""}
          onclick="this.closest('ui-smart-table').nextPage()"
        >
          <i class="material-icons">chevron_right</i>
        </button>
      </div>
      <div class="rows-per-page">
        <label>
          Rows per page:
          <select onchange="this.closest('ui-smart-table').setRowsPerPage(this.value)">
            <option value="5" ${t===5?"selected":""}>5</option>
            <option value="10" ${t===10?"selected":""}>10</option>
            <option value="25" ${t===25?"selected":""}>25</option>
            <option value="50" ${t===50?"selected":""}>50</option>
          </select>
        </label>
      </div>
    `,this.paginationContainer.innerHTML=o}setData(t){this.data=Array.isArray(t)?t:[],this.filteredData=[...this.data],this.selectedRows.clear(),this.setAttribute("current-page","1"),this.updateTable(),this.emit("data-changed",{data:this.data})}getData(){return this.data}getFilteredData(){return this.filteredData}getPaginatedData(){const t=parseInt(this.getAttribute("rows-per-page"))||10,i=((parseInt(this.getAttribute("current-page"))||1)-1)*t,a=i+t;return this.filteredData.slice(i,a)}handleSearch(t){const e=this.getJSONAttribute("columns",[]);t.trim()?this.filteredData=this.data.filter(i=>e.some(a=>{const n=this.getNestedValue(i,a.key);return this.formatValue(n,a,!0).toLowerCase().includes(t.toLowerCase())})):this.filteredData=[...this.data],this.setAttribute("current-page","1"),this.updateTable(),this.emit("search",{query:t,results:this.filteredData.length})}handleSort(t){const i=this.getJSONAttribute("columns",[]).find(a=>a.key===t);!i||i.sortable===!1||(this.currentSort.column===t?this.currentSort.direction=this.currentSort.direction==="asc"?"desc":"asc":(this.currentSort.column=t,this.currentSort.direction="asc"),this.filteredData.sort((a,n)=>{const s=this.getNestedValue(a,t),o=this.getNestedValue(n,t);let d=this.compareValues(s,o,i.type);return this.currentSort.direction==="desc"?-d:d}),this.updateTable(),this.emit("sort",{column:t,direction:this.currentSort.direction}))}compareValues(t,e,i){if(t==null&&e==null)return 0;if(t==null)return-1;if(e==null)return 1;switch(i){case"number":case"currency":return Number(t)-Number(e);case"date":return new Date(t)-new Date(e);case"boolean":return t===e?0:t?1:-1;default:return String(t).localeCompare(String(e))}}handleRowSelection(t){const e=t.dataset.rowId;t.checked?this.selectedRows.add(e):this.selectedRows.delete(e),t.closest("tr").classList.toggle("selected",t.checked),this.updateSelectAllState(),this.emit("selection-change",{selectedRows:Array.from(this.selectedRows),selectedCount:this.selectedRows.size})}handleSelectAll(t){this.getPaginatedData().forEach(i=>{const a=i.id||i;t?this.selectedRows.add(a):this.selectedRows.delete(a)}),this.tbody.querySelectorAll(".row-select").forEach(i=>{i.checked=t,i.closest("tr").classList.toggle("selected",t)}),this.emit("selection-change",{selectedRows:Array.from(this.selectedRows),selectedCount:this.selectedRows.size})}updateSelectAllState(){const t=this.thead.querySelector(".select-all");if(!t)return;const i=this.getPaginatedData().map(n=>n.id||n),a=i.filter(n=>this.selectedRows.has(n));a.length===0?(t.checked=!1,t.indeterminate=!1):a.length===i.length?(t.checked=!0,t.indeterminate=!1):(t.checked=!1,t.indeterminate=!0)}nextPage(){const t=parseInt(this.getAttribute("current-page"))||1,e=this.getTotalPages();t<e&&this.goToPage(t+1)}previousPage(){const t=parseInt(this.getAttribute("current-page"))||1;t>1&&this.goToPage(t-1)}goToPage(t){const e=this.getTotalPages(),i=Math.max(1,Math.min(t,e));this.setAttribute("current-page",i),this.updateTable(),this.emit("page-change",{page:i})}setRowsPerPage(t){this.setAttribute("rows-per-page",t),this.setAttribute("current-page","1"),this.updateTable()}getTotalPages(){const t=parseInt(this.getAttribute("rows-per-page"))||10;return Math.ceil(this.filteredData.length/t)}getNestedValue(t,e){return e.split(".").reduce((i,a)=>i==null?void 0:i[a],t)}formatValue(t,e,i=!1){if(t==null)return"";switch(e.type){case"currency":if(i)return String(t);const a=e.currency||"USD",n=e.locale||"en-US";return new Intl.NumberFormat(n,{style:"currency",currency:a}).format(t);case"number":if(i)return String(t);const s=e.decimals||0;return Number(t).toLocaleString(void 0,{minimumFractionDigits:s,maximumFractionDigits:s});case"date":if(i)return String(t);const o=e.format||"short";return new Intl.DateTimeFormat(void 0,{dateStyle:o}).format(new Date(t));case"boolean":return i?t?"true yes":"false no":t?'<i class="material-icons text-success">check</i>':'<i class="material-icons text-error">close</i>';default:return String(t)}}getSelectedRows(){return Array.from(this.selectedRows)}clearSelection(){this.selectedRows.clear(),this.updateTable()}selectRow(t){this.selectedRows.add(t),this.updateTable()}deselectRow(t){this.selectedRows.delete(t),this.updateTable()}exportData(t="json"){const e=this.getFilteredData(),i=this.getJSONAttribute("columns",[]);switch(t.toLowerCase()){case"csv":return this.exportToCSV(e,i);case"json":return JSON.stringify(e,null,2);default:return e}}exportToCSV(t,e){const i=e.map(n=>n.label||n.key).join(","),a=t.map(n=>e.map(s=>{const o=this.getNestedValue(n,s.key),d=this.formatValue(o,s,!0);return`"${String(d).replace(/"/g,'""')}"`}).join(","));return[i,...a].join(`
`)}}customElements.define("ui-smart-table",D);const P=`
/* BeerCSS UI Components Styles */

/* Global component styles */
ui-input, ui-select {
  display: block;
  margin-bottom: 1rem;
}

.field {
  position: relative;
  display: flex;
  flex-direction: column;
}

.field input, .field select {
  padding: 1rem;
  border: 1px solid var(--outline, #79747e);
  border-radius: 4px;
  background: var(--surface, #fef7ff);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.field input:focus, .field select:focus {
  border-color: var(--primary, #6750a4);
  border-width: 2px;
}

.field label {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: var(--surface, #fef7ff);
  padding: 0 0.25rem;
  color: var(--on-surface-variant, #49454f);
  transition: all 0.2s ease;
  pointer-events: none;
  font-size: 1rem;
}

.field input:focus + label,
.field input:not(:placeholder-shown) + label,
.field select:focus + label,
.field select:not([value=""]) + label {
  top: 0;
  font-size: 0.75rem;
  color: var(--primary, #6750a4);
}

.field.focused label {
  color: var(--primary, #6750a4);
}

.field.invalid input,
.field.invalid select {
  border-color: var(--error, #ba1a1a);
}

.field.invalid label {
  color: var(--error, #ba1a1a);
}

.helper {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: var(--on-surface-variant, #49454f);
}

.helper.error {
  color: var(--error, #ba1a1a);
}

/* Button styles enhancement */
ui-button {
  display: inline-block;
  margin: 0.25rem;
}

ui-button button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.5rem;
  background: var(--primary, #bb86fc);
  color: var(--on-primary, #000000);
  text-transform: none;
  letter-spacing: 0.1px;
}

ui-button button.filled {
  background: var(--primary, #bb86fc);
  color: var(--on-primary, #000000);
}

ui-button button.outlined {
  background: transparent;
  border: 1px solid var(--outline, rgba(255, 255, 255, 0.3));
  color: var(--primary, #bb86fc);
}

ui-button button.text {
  background: transparent;
  color: var(--primary, #bb86fc);
  padding: 0.75rem 1rem;
}

ui-button button.tonal {
  background: var(--secondary-container, rgba(187, 134, 252, 0.2));
  color: var(--on-secondary-container, #bb86fc);
}

ui-button button:hover:not(:disabled) {
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transform: translateY(-1px);
}

ui-button button:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}

ui-button button:disabled {
  opacity: 0.38;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

ui-button button.circle {
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  padding: 0;
  justify-content: center;
}

ui-button button.small {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  min-height: 2rem;
}

ui-button button.large {
  padding: 1rem 2rem;
  font-size: 1rem;
  min-height: 3rem;
}

/* Smart Table Styles */
ui-smart-table {
  display: block;
  position: relative;
}

.table-search {
  margin-bottom: 1rem;
}

.table-search input {
  width: 100%;
  max-width: 300px;
  padding: 0.5rem;
  border: 1px solid var(--outline, #ccc);
  border-radius: 4px;
}

.table-container {
  overflow-x: auto;
  border: 1px solid var(--outline, #ccc);
  border-radius: 8px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--outline-variant, #e0e0e0);
}

.table th {
  background-color: var(--surface-variant, #f5f5f5);
  font-weight: 500;
}

.table th.sortable {
  cursor: pointer;
  user-select: none;
}

.table th.sortable:hover {
  background-color: var(--surface-container-high, #e8e8e8);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sort-icon {
  font-size: 1rem;
  margin-left: 0.25rem;
}

.table tr:hover {
  background-color: var(--surface-container, #f8f8f8);
}

.table tr.selected {
  background-color: var(--secondary-container, #e3f2fd);
}

.empty-row td {
  text-align: center;
  padding: 2rem;
  color: var(--on-surface-variant, #666);
}

.table-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-top: 1px solid var(--outline-variant, #e0e0e0);
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pagination-btn {
  padding: 0.5rem;
  border: 1px solid var(--outline, #ccc);
  background: var(--surface, white);
  border-radius: 4px;
  cursor: pointer;
  min-width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--surface-container, #f8f8f8);
}

.pagination-btn.active {
  background-color: var(--primary, #1976d2);
  color: var(--on-primary, white);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.rows-per-page select {
  padding: 0.25rem;
  border: 1px solid var(--outline, #ccc);
  border-radius: 4px;
  background: var(--surface, white);
}

.table-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--surface, white);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.loading-spinner i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.text-success {
  color: var(--success, #4caf50);
}

.text-error {
  color: var(--error, #f44336);
}

/* Accordion Styles */
.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--surface-variant, #f5f5f5);
  cursor: pointer;
  border-bottom: 1px solid var(--outline-variant, #e0e0e0);
}

.accordion-header:hover {
  background: var(--surface-container, #f0f0f0);
}

.accordion-header.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.accordion-content {
  padding: 1rem;
}

.accordion-icon {
  transition: transform 0.2s ease;
}

ui-accordion-item.open .accordion-icon {
  transform: rotate(180deg);
}

/* Tab Styles */
.tabs {
  display: flex;
  border-bottom: 1px solid var(--outline-variant, #e0e0e0);
  background: var(--surface, #fef7ff);
}

.tabs button {
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
}

.tabs button:hover {
  background: var(--surface-container, #f8f8f8);
}

.tabs button.active {
  border-bottom-color: var(--primary, #6750a4);
  color: var(--primary, #6750a4);
}

.tabs button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab-content {
  padding: 1rem;
}

.tab-panel {
  display: none;
}

/* Card Styles */
.card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background: var(--surface, white);
  overflow: hidden;
}

.card.outlined {
  border: 1px solid var(--outline, #ccc);
  box-shadow: none;
}

.card.clickable {
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.card.clickable:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--outline-variant, #e0e0e0);
}

.header-content {
  flex: 1;
  margin-left: 1rem;
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
}

.card-subtitle {
  margin: 0.25rem 0 0 0;
  color: var(--on-surface-variant, #666);
  font-size: 0.875rem;
}

.card-content {
  padding: 1rem;
}

.card-actions {
  padding: 0.5rem 1rem 1rem 1rem;
  display: flex;
  gap: 0.5rem;
}

.card-actions.right-align {
  justify-content: flex-end;
}

.card-actions.center-align {
  justify-content: center;
}

.card-media img {
  width: 100%;
  height: auto;
  display: block;
}

/* Grid system fixes */
ui-grid {
  display: grid !important;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

ui-grid-item {
  display: block;
}

ui-grid-item.s1 { grid-column: span 1; }
ui-grid-item.s2 { grid-column: span 2; }
ui-grid-item.s3 { grid-column: span 3; }
ui-grid-item.s4 { grid-column: span 4; }
ui-grid-item.s5 { grid-column: span 5; }
ui-grid-item.s6 { grid-column: span 6; }
ui-grid-item.s7 { grid-column: span 7; }
ui-grid-item.s8 { grid-column: span 8; }
ui-grid-item.s9 { grid-column: span 9; }
ui-grid-item.s10 { grid-column: span 10; }
ui-grid-item.s11 { grid-column: span 11; }
ui-grid-item.s12 { grid-column: span 12; }

@media (min-width: 600px) {
  ui-grid-item.m1 { grid-column: span 1; }
  ui-grid-item.m2 { grid-column: span 2; }
  ui-grid-item.m3 { grid-column: span 3; }
  ui-grid-item.m4 { grid-column: span 4; }
  ui-grid-item.m5 { grid-column: span 5; }
  ui-grid-item.m6 { grid-column: span 6; }
  ui-grid-item.m7 { grid-column: span 7; }
  ui-grid-item.m8 { grid-column: span 8; }
  ui-grid-item.m9 { grid-column: span 9; }
  ui-grid-item.m10 { grid-column: span 10; }
  ui-grid-item.m11 { grid-column: span 11; }
  ui-grid-item.m12 { grid-column: span 12; }
}

@media (min-width: 1024px) {
  ui-grid-item.l1 { grid-column: span 1; }
  ui-grid-item.l2 { grid-column: span 2; }
  ui-grid-item.l3 { grid-column: span 3; }
  ui-grid-item.l4 { grid-column: span 4; }
  ui-grid-item.l5 { grid-column: span 5; }
  ui-grid-item.l6 { grid-column: span 6; }
  ui-grid-item.l7 { grid-column: span 7; }
  ui-grid-item.l8 { grid-column: span 8; }
  ui-grid-item.l9 { grid-column: span 9; }
  ui-grid-item.l10 { grid-column: span 10; }
  ui-grid-item.l11 { grid-column: span 11; }
  ui-grid-item.l12 { grid-column: span 12; }
}
`;function p(){if(!document.getElementById("beercss-ui-components-styles")){const r=document.createElement("style");r.id="beercss-ui-components-styles",r.textContent=P,document.head.appendChild(r),console.log("BeerCSS UI Components styles injected")}}p();document.readyState==="loading"&&document.addEventListener("DOMContentLoaded",p);console.log("BeerCSS UI Components v1.0.0 loaded successfully! 🍺💛");const m=[{name:"Accordion",id:"accordion"},{name:"Button",id:"button"},{name:"Card",id:"card"},{name:"Grid",id:"grid"},{name:"Input",id:"input"},{name:"Layout",id:"layout"},{name:"Select",id:"select"},{name:"Smart Table",id:"smart-table"},{name:"Tabs",id:"tabs"}],$=[{id:1,name:"John Doe",email:"john@example.com",age:30,salary:5e4,active:!0,department:"Engineering",joinDate:"2020-01-15"},{id:2,name:"Jane Smith",email:"jane@example.com",age:28,salary:6e4,active:!0,department:"Design",joinDate:"2019-03-22"},{id:3,name:"Bob Johnson",email:"bob@example.com",age:35,salary:55e3,active:!1,department:"Marketing",joinDate:"2018-07-10"},{id:4,name:"Alice Brown",email:"alice@example.com",age:32,salary:65e3,active:!0,department:"Engineering",joinDate:"2021-02-28"},{id:5,name:"Charlie Wilson",email:"charlie@example.com",age:29,salary:58e3,active:!0,department:"Sales",joinDate:"2020-11-05"}];window.AppState={data:{user:{name:"John Doe",email:"john@example.com",country:"us",isActive:!0},currentPage:"button"},fields:{"user.name":{value:"John Doe",disabled:!1,required:!0,label:"Full Name"},"user.email":{value:"john@example.com",disabled:!1,required:!0,type:"email",label:"Email Address"},"user.country":{value:"us",disabled:!1,options:[{value:"us",label:"United States"},{value:"ca",label:"Canada"},{value:"mx",label:"Mexico"},{value:"uk",label:"United Kingdom"},{value:"de",label:"Germany"}]},userTable:{data:$,columns:[{key:"name",type:"text",label:"Name",sortable:!0},{key:"email",type:"text",label:"Email",sortable:!0},{key:"age",type:"number",label:"Age",sortable:!0},{key:"salary",type:"currency",label:"Salary",currency:"USD",sortable:!0},{key:"active",type:"boolean",label:"Active",sortable:!0},{key:"department",type:"text",label:"Department",sortable:!0},{key:"joinDate",type:"date",label:"Join Date",sortable:!0}],rowsPerPage:5,searchable:!0,selectable:!0}}};class O{constructor(){this.currentComponent=null,this.init()}init(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{this.setup()}):this.setup()}setup(){this.createNavigation(),this.bindEvents(),this.showComponent("button")}createNavigation(){const t=document.getElementById("nav-links");if(!t){console.error("Navigation container not found");return}let e="";m.forEach(i=>{e+=`
        <a href="#${i.id}" data-component="${i.id}">
          <i class="material-icons">widgets</i>
          <div>${i.name}</div>
        </a>
      `}),t.innerHTML=e}bindEvents(){document.getElementById("nav-links").addEventListener("click",t=>{const e=t.target.closest("a[data-component]");if(e){t.preventDefault();const i=e.dataset.component;this.showComponent(i),window.innerWidth<1024&&window.ui&&ui.close("nav-drawer")}}),window.addEventListener("hashchange",()=>{const t=window.location.hash.slice(1);t&&m.find(e=>e.id===t)&&this.showComponent(t)})}showComponent(t){this.currentComponent=t,window.location.hash=t,document.querySelectorAll("#nav-links a").forEach(e=>{e.classList.toggle("active",e.dataset.component===t)}),this.loadComponentExample(t)}async loadComponentExample(t){const e=document.getElementById("content");if(!e){console.error("Content container not found");return}try{e.innerHTML='<div class="center-align" style="padding: 2rem;"><p>Loading...</p></div>';const i=this.generateExampleContent(t);e.innerHTML=`<div style="padding: 2rem;">${i}</div>`,this.bindComponentEvents(t)}catch(i){console.error("Error loading component example:",i),e.innerHTML=`
        <div class="center-align" style="padding: 2rem;">
          <h3>Error Loading Component</h3>
          <p>Could not load examples for ${t}</p>
          <p><small>${i.message}</small></p>
        </div>
      `}}generateExampleContent(t){switch(t){case"button":return this.generateButtonExamples();case"input":return this.generateInputExamples();case"select":return this.generateSelectExamples();case"card":return this.generateCardExamples();case"tabs":return this.generateTabsExamples();case"accordion":return this.generateAccordionExamples();case"grid":return this.generateGridExamples();case"layout":return this.generateLayoutExamples();case"smart-table":return this.generateSmartTableExamples();default:return`<h3>${t} Examples</h3><p>Examples coming soon...</p>`}}generateButtonExamples(){return`
      <h3>Button Component Examples</h3>
      
      <div class="grid">
        <div class="s12 m6">
          <h5>Basic Buttons</h5>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
            <ui-button variant="filled">Filled Button</ui-button>
            <ui-button variant="outlined">Outlined Button</ui-button>
            <ui-button variant="text">Text Button</ui-button>
            <ui-button variant="tonal">Tonal Button</ui-button>
          </div>
          
          <h5>With Icons</h5>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
            <ui-button variant="filled" icon="add">Add Item</ui-button>
            <ui-button variant="outlined" icon="delete" icon-position="right">Delete</ui-button>
            <ui-button variant="filled" icon="favorite" round></ui-button>
          </div>
          
          <h5>States</h5>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
            <ui-button variant="filled" disabled>Disabled</ui-button>
            <ui-button variant="filled" loading>Loading</ui-button>
            <ui-button variant="outlined" size="small">Small</ui-button>
            <ui-button variant="filled" size="large">Large</ui-button>
          </div>
        </div>
        
        <div class="s12 m6">
          <h5>State-Driven Button (Phase 3 Preview)</h5>
          <p>This button is driven by centralized state:</p>
          <ui-button field-id="saveButton" variant="filled" icon="save">Save Changes</ui-button>
          
          <div style="margin-top: 1rem;">
            <ui-button onclick="demo.toggleButtonState()" variant="outlined">Toggle Button State</ui-button>
          </div>
          
          <h5>Event Handling</h5>
          <ui-button onclick="demo.showAlert('Button clicked!')" variant="filled" icon="notifications">
            Click Me
          </ui-button>
        </div>
      </div>
    `}generateInputExamples(){return`
      <h3>Input Component Examples</h3>
      
      <div class="grid">
        <div class="s12 m6">
          <h5>Basic Inputs</h5>
          <ui-input label="Name" placeholder="Enter your name" style="margin-bottom: 1rem;"></ui-input>
          <ui-input label="Email" type="email" placeholder="Enter your email" style="margin-bottom: 1rem;"></ui-input>
          <ui-input label="Password" type="password" helper="Min 8 characters" style="margin-bottom: 1rem;"></ui-input>
          
          <h5>With Icons</h5>
          <ui-input label="Search" icon="search" placeholder="Search..." style="margin-bottom: 1rem;"></ui-input>
          <ui-input label="Phone" icon="phone" icon-position="right" type="tel" style="margin-bottom: 1rem;"></ui-input>
        </div>
        
        <div class="s12 m6">
          <h5>State-Driven Inputs (Phase 3 Preview)</h5>
          <ui-input field-id="user.name" label="Full Name" style="margin-bottom: 1rem;"></ui-input>
          <ui-input field-id="user.email" label="Email Address" style="margin-bottom: 1rem;"></ui-input>
          
          <h5>Validation</h5>
          <ui-input label="Required Field" required style="margin-bottom: 1rem;"></ui-input>
          <ui-input label="Min Length" minlength="5" helper="At least 5 characters" style="margin-bottom: 1rem;"></ui-input>
          <ui-input label="Pattern" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="123-456-7890" helper="Format: XXX-XXX-XXXX" style="margin-bottom: 1rem;"></ui-input>
        </div>
      </div>
    `}generateSelectExamples(){return`
      <h3>Select Component Examples</h3>
      
      <div class="grid">
        <div class="s12 m6">
          <h5>Basic Select</h5>
          <ui-select label="Country" style="margin-bottom: 1rem;">
            <option value="">Select a country</option>
            <option value="us">United States</option>
            <option value="ca">Canada</option>
            <option value="mx">Mexico</option>
            <option value="uk">United Kingdom</option>
          </ui-select>
          
          <h5>Multiple Selection</h5>
          <ui-select label="Skills" multiple style="margin-bottom: 1rem;">
            <option value="js">JavaScript</option>
            <option value="py">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
          </ui-select>
        </div>
        
        <div class="s12 m6">
          <h5>State-Driven Select (Phase 3 Preview)</h5>
          <ui-select field-id="user.country" label="Country" style="margin-bottom: 1rem;"></ui-select>
          
          <h5>Required Selection</h5>
          <ui-select label="Department" required style="margin-bottom: 1rem;">
            <option value="">Select department</option>
            <option value="eng">Engineering</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="sales">Sales</option>
          </ui-select>
        </div>
      </div>
    `}generateCardExamples(){return`
      <h3>Card Component Examples</h3>
      
      <div class="grid">
        <div class="s12 m6 l4">
          <ui-card>
            <ui-card-header title="Simple Card" subtitle="Basic card example"></ui-card-header>
            <ui-card-content>
              This is the card content area. You can put any content here including text, images, or other components.
            </ui-card-content>
            <ui-card-actions>
              <ui-button variant="text">Action 1</ui-button>
              <ui-button variant="text">Action 2</ui-button>
            </ui-card-actions>
          </ui-card>
        </div>
        
        <div class="s12 m6 l4">
          <ui-card variant="outlined" clickable>
            <ui-card-header 
              title="Clickable Card" 
              subtitle="Click anywhere on this card"
              avatar="https://via.placeholder.com/40"
            ></ui-card-header>
            <ui-card-content>
              This card is clickable and has an outlined variant with an avatar image.
            </ui-card-content>
          </ui-card>
        </div>
        
        <div class="s12 m6 l4">
          <ui-card>
            <ui-card-media 
              src="https://via.placeholder.com/400x200" 
              alt="Placeholder image"
              aspect-ratio="2/1"
            ></ui-card-media>
            <ui-card-header title="Media Card" subtitle="With image"></ui-card-header>
            <ui-card-content>
              This card includes a media component with an image.
            </ui-card-content>
            <ui-card-actions align="right">
              <ui-button variant="text">Learn More</ui-button>
            </ui-card-actions>
          </ui-card>
        </div>
      </div>
    `}generateTabsExamples(){return`
      <h3>Tabs Component Examples</h3>
      
      <h5>Basic Tabs</h5>
      <ui-tabs active="0" style="margin-bottom: 2rem;">
        <ui-tab label="Tab 1">
          <h6>First Tab Content</h6>
          <p>This is the content for the first tab. You can put any HTML content here.</p>
        </ui-tab>
        <ui-tab label="Tab 2">
          <h6>Second Tab Content</h6>
          <p>This is the content for the second tab. Each tab can have different content.</p>
        </ui-tab>
        <ui-tab label="Tab 3">
          <h6>Third Tab Content</h6>
          <p>This is the content for the third tab. Tabs are great for organizing content.</p>
        </ui-tab>
        <ui-tab label="Disabled" disabled>
          <p>This tab is disabled.</p>
        </ui-tab>
      </ui-tabs>
      
      <h5>Tabs with Components</h5>
      <ui-tabs active="0">
        <ui-tab label="Form">
          <ui-input label="Name" style="margin-bottom: 1rem;"></ui-input>
          <ui-input label="Email" type="email" style="margin-bottom: 1rem;"></ui-input>
          <ui-button variant="filled">Submit</ui-button>
        </ui-tab>
        <ui-tab label="Settings">
          <ui-select label="Theme" style="margin-bottom: 1rem;">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </ui-select>
          <ui-button variant="filled">Save Settings</ui-button>
        </ui-tab>
      </ui-tabs>
    `}generateAccordionExamples(){return`
      <h3>Accordion Component Examples</h3>
      
      <h5>Basic Accordion</h5>
      <ui-accordion style="margin-bottom: 2rem;">
        <ui-accordion-item title="What is BeerCSS?" open>
          BeerCSS is a Material Design 3 CSS framework that helps you build beautiful interfaces quickly and easily.
        </ui-accordion-item>
        <ui-accordion-item title="How do I use these components?">
          Simply include the component library script and use the custom elements in your HTML. Each component supports various attributes for customization.
        </ui-accordion-item>
        <ui-accordion-item title="Are there any dependencies?">
          No! This is a zero-dependency component library. You only need BeerCSS for styling.
        </ui-accordion-item>
        <ui-accordion-item title="Disabled Item" disabled>
          This item is disabled and cannot be opened.
        </ui-accordion-item>
      </ui-accordion>
      
      <h5>Multiple Open Items</h5>
      <ui-accordion multiple>
        <ui-accordion-item title="First Item" open>
          This accordion allows multiple items to be open at the same time.
        </ui-accordion-item>
        <ui-accordion-item title="Second Item" open>
          Both of these items can be open simultaneously because the accordion has the 'multiple' attribute.
        </ui-accordion-item>
        <ui-accordion-item title="Third Item">
          You can open and close items independently.
        </ui-accordion-item>
      </ui-accordion>
    `}generateGridExamples(){return`
      <h3>Grid Component Examples</h3>
      
      <h5>Responsive Grid</h5>
      <ui-grid style="margin-bottom: 2rem;">
        <ui-grid-item cols="s12 m6 l3">
          <div style="background: #e3f2fd; padding: 1rem; text-align: center;">
            s12 m6 l3
          </div>
        </ui-grid-item>
        <ui-grid-item cols="s12 m6 l3">
          <div style="background: #f3e5f5; padding: 1rem; text-align: center;">
            s12 m6 l3
          </div>
        </ui-grid-item>
        <ui-grid-item cols="s12 m6 l3">
          <div style="background: #e8f5e8; padding: 1rem; text-align: center;">
            s12 m6 l3
          </div>
        </ui-grid-item>
        <ui-grid-item cols="s12 m6 l3">
          <div style="background: #fff3e0; padding: 1rem; text-align: center;">
            s12 m6 l3
          </div>
        </ui-grid-item>
      </ui-grid>
      
      <h5>Grid with Gap</h5>
      <ui-grid gap="1rem" style="margin-bottom: 2rem;">
        <ui-grid-item cols="s12 m4">
          <div style="background: #ffebee; padding: 1rem; text-align: center;">
            s12 m4
          </div>
        </ui-grid-item>
        <ui-grid-item cols="s12 m8">
          <div style="background: #e1f5fe; padding: 1rem; text-align: center;">
            s12 m8
          </div>
        </ui-grid-item>
      </ui-grid>
      
      <h5>Nested Grid</h5>
      <ui-grid>
        <ui-grid-item cols="s12 m8">
          <div style="background: #f9fbe7; padding: 1rem;">
            <h6>Main Content</h6>
            <ui-grid gap="0.5rem">
              <ui-grid-item cols="s6">
                <div style="background: #fff; padding: 0.5rem; text-align: center;">
                  Nested 1
                </div>
              </ui-grid-item>
              <ui-grid-item cols="s6">
                <div style="background: #fff; padding: 0.5rem; text-align: center;">
                  Nested 2
                </div>
              </ui-grid-item>
            </ui-grid>
          </div>
        </ui-grid-item>
        <ui-grid-item cols="s12 m4">
          <div style="background: #fce4ec; padding: 1rem; text-align: center;">
            Sidebar
          </div>
        </ui-grid-item>
      </ui-grid>
    `}generateLayoutExamples(){return`
      <h3>Layout Component Examples</h3>
      
      <h5>Layout Utilities</h5>
      <div style="margin-bottom: 2rem;">
        <ui-layout margin="medium" padding="large" style="background: #e3f2fd; border-radius: 8px;">
          <p>This layout has medium margin and large padding.</p>
        </ui-layout>
      </div>
      
      <h5>Flexbox Layout</h5>
      <ui-flex direction="row" justify="space-between" align="center" gap="1rem" style="background: #f3e5f5; padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
        <ui-flex-item>
          <div style="background: #fff; padding: 0.5rem; border-radius: 4px;">Item 1</div>
        </ui-flex-item>
        <ui-flex-item grow="2">
          <div style="background: #fff; padding: 0.5rem; border-radius: 4px;">Item 2 (grows)</div>
        </ui-flex-item>
        <ui-flex-item>
          <div style="background: #fff; padding: 0.5rem; border-radius: 4px;">Item 3</div>
        </ui-flex-item>
      </ui-flex>
      
      <h5>Column Layout</h5>
      <ui-flex direction="column" gap="1rem" style="background: #e8f5e8; padding: 1rem; border-radius: 8px;">
        <ui-flex-item>
          <div style="background: #fff; padding: 1rem; border-radius: 4px;">Header</div>
        </ui-flex-item>
        <ui-flex-item grow="1">
          <div style="background: #fff; padding: 1rem; border-radius: 4px;">Main Content (grows)</div>
        </ui-flex-item>
        <ui-flex-item>
          <div style="background: #fff; padding: 1rem; border-radius: 4px;">Footer</div>
        </ui-flex-item>
      </ui-flex>
    `}generateSmartTableExamples(){return`
      <h3>Smart Table Component Examples</h3>
      
      <h5>State-Driven Table (Phase 3 Preview)</h5>
      <p>This table is driven by centralized state with sorting, searching, and pagination:</p>
      
      <ui-smart-table 
        field-id="userTable"
        rows-per-page="5"
        searchable="true"
        sortable="true"
        selectable="true"
        style="margin-bottom: 2rem;">
      </ui-smart-table>
      
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <ui-button onclick="demo.addUser()" variant="filled" icon="add">Add User</ui-button>
        <ui-button onclick="demo.toggleTableLoading()" variant="outlined" icon="refresh">Toggle Loading</ui-button>
        <ui-button onclick="demo.exportTableData()" variant="outlined" icon="download">Export CSV</ui-button>
      </div>
      
      <h5>Features</h5>
      <ul>
        <li><strong>Metadata-driven:</strong> Columns defined in state with type information</li>
        <li><strong>Sorting:</strong> Click column headers to sort</li>
        <li><strong>Search:</strong> Global search across all columns</li>
        <li><strong>Pagination:</strong> Configurable rows per page</li>
        <li><strong>Selection:</strong> Row selection with select all</li>
        <li><strong>Formatting:</strong> Automatic formatting based on column type (currency, date, boolean)</li>
        <li><strong>Export:</strong> Export filtered data to JSON or CSV</li>
      </ul>
    `}bindComponentEvents(t){if(t==="smart-table"){const e=document.querySelector('ui-smart-table[field-id="userTable"]');e&&e.syncFromState()}}showAlert(t){alert(t)}toggleButtonState(){console.log("Button state toggled - Phase 3 feature")}addUser(){const t={id:Date.now(),name:`User ${Math.floor(Math.random()*1e3)}`,email:`user${Math.floor(Math.random()*1e3)}@example.com`,age:Math.floor(Math.random()*30)+25,salary:Math.floor(Math.random()*5e4)+4e4,active:Math.random()>.3,department:["Engineering","Design","Marketing","Sales"][Math.floor(Math.random()*4)],joinDate:new Date(Date.now()-Math.random()*365*24*60*60*1e3).toISOString().split("T")[0]};window.AppState.fields.userTable.data.push(t);const e=document.querySelector('ui-smart-table[field-id="userTable"]');e&&e.syncFromState()}toggleTableLoading(){const t=window.AppState.fields.userTable.loading||!1;window.AppState.fields.userTable.loading=!t;const e=document.querySelector('ui-smart-table[field-id="userTable"]');e&&(e.setAttribute("loading",!t),t||setTimeout(()=>{window.AppState.fields.userTable.loading=!1,e.removeAttribute("loading")},2e3))}exportTableData(){const t=document.querySelector('ui-smart-table[field-id="userTable"]');if(t){const e=t.exportData("csv"),i=new Blob([e],{type:"text/csv"}),a=URL.createObjectURL(i),n=document.createElement("a");n.href=a,n.download="users.csv",n.click(),URL.revokeObjectURL(a)}}}const H=new O;window.demo=H;
