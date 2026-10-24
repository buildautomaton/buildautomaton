const SCRIPT = `
var view=null, records=[], pending={};
function post(message){ parent.postMessage(message, "*"); }
function request(method, params){
  var id=Math.random().toString(36).slice(2);
  post({ jsonrpc:"2.0", id:id, method:method, params:params });
  return new Promise(function(resolve){
    var timer=setTimeout(function(){ delete pending[id]; resolve({ isError:true }); }, 8000);
    pending[id]=function(value){ clearTimeout(timer); resolve(value||{}); };
  });
}
function draw(){
  var main=document.getElementById("main");
  var save=document.getElementById("save");
  var actions=document.getElementById("actions");
  if(!view){ main.textContent="Waiting for widget data"; return; }
  if(save) save.hidden=view.canSave===false;
  actions.textContent="";
  (view.actions||[]).forEach(function(name){
    var button=document.createElement("button");
    button.textContent=name;
    button.onclick=function(){ runMutation(name); };
    actions.appendChild(button);
  });
  if(view.mode==="form"){ main.innerHTML=""; fields().forEach(addInput); return; }
  main.innerHTML=records.map(function(row){ return "<p>"+Object.keys(row).filter(function(key){ return key!=="id"; }).map(function(key){ return key+": "+row[key]; }).join(", ")+"</p>"; }).join("");
}
function fields(){ return (view.fields&&view.fields.length)?view.fields:[{name:"value",type:"string"}]; }
function addInput(field){
  var input=document.createElement(field.type==="boolean"?"input":"input");
  input.dataset.name=field.name;
  if(field.type==="boolean") input.type="checkbox";
  var row=(records[0]||{});
  if(field.type==="boolean") input.checked=row[field.name]===true; else input.value=row[field.name]==null?"":String(row[field.name]);
  input.oninput=function(){ records[0]=records[0]||{id:"form"}; records[0][field.name]=field.type==="boolean"?input.checked:input.value; };
  document.getElementById("main").appendChild(input);
}
function adopt(next){
  if(!next||!next.widget) return;
  view=next;
  records=Array.isArray(next.records)?next.records.slice():[];
  if(view.mode==="form"&&!records.length) records=[{id:"form"}];
  document.getElementById("status").textContent=records.length?records.length+" saved":"Nothing saved yet";
  draw();
}
async function saveRecords(){
  if(!view||view.canSave===false) return;
  document.getElementById("status").textContent="Saving";
  var result=await request("tools/call",{name:"run_data_store_action",arguments:{action:"replace",collection:view.output,records:records}});
  var text=result&&result.content&&result.content[0]&&result.content[0].text;
  document.getElementById("status").textContent=text&&text.indexOf('"ok": true')!==-1?"Saved":"Save failed";
}
async function runMutation(name){
  var result=await request("tools/call",{name:"run_mutation",arguments:{action:name,args:{}}});
  var text=result&&result.content&&result.content[0]&&result.content[0].text;
  document.getElementById("status").textContent=text&&text.indexOf('"ok": true')!==-1?"Saved":"Save failed";
}
document.getElementById("save").onclick=saveRecords;
window.addEventListener("message", function(event){
  var data=event.data||{};
  if(data.id&&pending[data.id]){ pending[data.id](data.result||data.error); return; }
  if(data.method==="ui/notifications/tool-result") adopt(data.params&&data.params.structuredContent);
});
post({ jsonrpc:"2.0", method:"ui/notifications/initialized" });
request("ui/initialize",{ protocolVersion:"2026-01-26", appCapabilities:{ availableDisplayModes:["inline"] }, appInfo:{ name:"app-widget", version:"0.1.0" } });
`;

export function widgetFrameHtml(): string {
  return `<!doctype html><html><body><p id="status"></p><div id="main"></div><div id="actions"></div><button id="save">Save</button><script>${SCRIPT}</script></body></html>`;
}
