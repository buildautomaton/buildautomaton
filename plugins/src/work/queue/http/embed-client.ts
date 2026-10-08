import { BUILDAUTOMATON_CHROME } from './embed-chrome.js';

export function buildautomatonClient(allowSource: string): string {
  return `(function(){
var script=document.currentScript;
if(!script||window.__buildautomatonMounted)return;
var allow=${allowSource};
if(!allow(location.hostname,script.getAttribute("data-dev")))return;
window.__buildautomatonMounted=true;
var origin=script.src?new URL(script.src).origin:(script.getAttribute("data-origin")||"http://127.0.0.1:3333");
var root=document.createElement("div");
root.id="buildautomaton-root";
var shadow=root.attachShadow({mode:"open"});
shadow.innerHTML=${JSON.stringify(BUILDAUTOMATON_CHROME)};
document.documentElement.appendChild(root);
var frame=shadow.getElementById("frame");
var tab=shadow.getElementById("tab");
var open=false;
function setOpen(next){
open=next;
frame.hidden=!open;
tab.textContent=open?"×":"+";
tab.setAttribute("aria-expanded",open?"true":"false");
tab.setAttribute("aria-label",open?"Close BuildAutomaton":"BuildAutomaton");
if(open&&!frame.src)frame.src=origin+"/buildautomaton?page="+encodeURIComponent(location.href);
}
tab.addEventListener("click",function(){setOpen(!open)});
document.addEventListener("pointerdown",function(event){
if(!open)return;
var path=event.composedPath?event.composedPath():[];
if(path.indexOf(root)>=0||path.indexOf(tab)>=0||path.indexOf(frame)>=0)return;
setOpen(false);
});
window.addEventListener("message",function(event){
if(event.origin!==origin)return;
var data=event.data;
if(!data||data.source!=="buildautomaton"||data.type!=="close")return;
setOpen(false);
});
})();`;
}
