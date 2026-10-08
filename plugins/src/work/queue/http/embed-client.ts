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
var resize=shadow.getElementById("resize");
var open=false;
function saved(){try{var n=Number(localStorage.getItem("buildautomaton-sidebar-width"));if(n>=320)return n;}catch(e){}return 420;}
function remember(n){try{localStorage.setItem("buildautomaton-sidebar-width",String(Math.round(n)));}catch(e){}}
function layout(px){
var width=Math.max(320,Math.min(px,Math.round(window.innerWidth*0.92)));
frame.style.width=width+"px";
resize.style.right=width+"px";
tab.style.right=(open?width:0)+"px";
return width;
}
function setOpen(next){
open=next;
frame.hidden=!open;
resize.hidden=!open;
tab.setAttribute("aria-expanded",open?"true":"false");
if(open&&!frame.src)frame.src=origin+"/buildautomaton?page="+encodeURIComponent(location.href);
layout(saved());
}
tab.addEventListener("click",function(){setOpen(!open)});
resize.addEventListener("pointerdown",function(event){
if(!open)return;
event.preventDefault();
var startX=event.clientX;
var startW=frame.getBoundingClientRect().width;
function move(e){layout(startW+(startX-e.clientX));}
function up(){
remember(frame.getBoundingClientRect().width);
window.removeEventListener("pointermove",move);
window.removeEventListener("pointerup",up);
}
window.addEventListener("pointermove",move);
window.addEventListener("pointerup",up);
});
window.addEventListener("message",function(event){
if(event.origin!==origin)return;
var data=event.data;
if(!data||data.source!=="buildautomaton"||data.type!=="close")return;
setOpen(false);
});
layout(saved());
})();`;
}
