var Neutralino=function(e){"use strict";function t(e,t,n,o){return new(n||(n=Promise))((function(i,r){function s(e){try{c(o.next(e))}catch(e){r(e)}}function a(e){try{c(o.throw(e))}catch(e){r(e)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,a)}c((o=o.apply(e,t||[])).next())}))}function n(){return f("extensions.getStats")}var o={__proto__:null,dispatch:function(e,o,i){return new Promise(((r,s)=>t(this,void 0,void 0,(function*(){let t=yield n();if(t.loaded.includes(e))if(t.connected.includes(e))try{let t=yield f("extensions.dispatch",{extensionId:e,event:o,data:i});r(t)}catch(e){s(e)}else!function(e,t){e in d?d[e].push(t):d[e]=[t]}(e,{method:"extensions.dispatch",data:{extensionId:e,event:o,data:i},resolve:r,reject:s});else s({code:"NE_EX_EXTNOTL",message:`${e} is not loaded`})}))))},broadcast:function(e,t){return f("extensions.broadcast",{event:e,data:t})},getStats:n};function i(e,t){return window.addEventListener(e,t),Promise.resolve({success:!0,message:"Event listener added"})}function r(e,t){let n=new CustomEvent(e,{detail:t});return window.dispatchEvent(n),Promise.resolve({success:!0,message:"Message dispatched"})}function s(e){let t=window.atob(e),n=t.length,o=new Uint8Array(n);for(let e=0;e<n;e++)o[e]=t.charCodeAt(e);return o.buffer}let a,c={},u=[],d={};function l(){window.NL_TOKEN&&sessionStorage.setItem("NL_TOKEN",window.NL_TOKEN),a=new WebSocket(`ws://${window.location.hostname}:${window.NL_PORT}`),function(){if(i("ready",(()=>t(this,void 0,void 0,(function*(){if(yield p(u),!window.NL_EXTENABLED)return;let e=yield n();for(let t of e.connected)r("extensionReady",t)})))),i("extClientConnect",(e=>{r("extensionReady",e.detail)})),!window.NL_EXTENABLED)return;i("extensionReady",(e=>t(this,void 0,void 0,(function*(){e.detail in d&&(yield p(d[e.detail]),delete d[e.detail])}))))}(),function(){a.addEventListener("message",(e=>{var t,n,o;const i=JSON.parse(e.data);i.id&&i.id in c?((null===(t=i.data)||void 0===t?void 0:t.error)?(c[i.id].reject(i.data.error),"NE_RT_INVTOKN"==i.data.error.code&&(a.close(),document.body.innerText="",document.write("<code>NE_RT_INVTOKN</code>: Neutralinojs application configuration prevents accepting native calls from this client."))):(null===(n=i.data)||void 0===n?void 0:n.success)&&c[i.id].resolve(i.data.hasOwnProperty("returnValue")?i.data.returnValue:i.data),delete c[i.id]):i.event&&("openedFile"==i.event&&"dataBinary"==(null===(o=null==i?void 0:i.data)||void 0===o?void 0:o.action)&&(i.data.data=s(i.data.data)),r(i.event,i.data))})),a.addEventListener("open",(e=>t(this,void 0,void 0,(function*(){r("ready")})))),a.addEventListener("close",(e=>t(this,void 0,void 0,(function*(){r("serverOffline",{code:"NE_CL_NSEROFF",message:"Neutralino server is offline. Try restarting the application"})}))))}()}function f(e,t){return new Promise(((n,o)=>{if((null==a?void 0:a.readyState)!=WebSocket.OPEN)return i={method:e,data:t,resolve:n,reject:o},void u.push(i);var i;const r="10000000-1000-4000-8000-100000000000".replace(/[018]/g,(e=>(e^crypto.getRandomValues(new Uint8Array(1))[0]&15>>e/4).toString(16))),s=window.NL_TOKEN||sessionStorage.getItem("NL_TOKEN")||"";c[r]={resolve:n,reject:o},a.send(JSON.stringify({id:r,method:e,data:t,accessToken:s}))}))}function p(e){return t(this,void 0,void 0,(function*(){for(;e.length>0;){let t=e.shift();try{let e=yield f(t.method,t.data);t.resolve(e)}catch(e){t.reject(e)}}}))}function g(e,t){return f("filesystem.writeBinaryFile",{path:e,data:m(t)})}function m(e){let t=new Uint8Array(e),n="";for(let e of t)n+=String.fromCharCode(e);return window.btoa(n)}var w,v,_={__proto__:null,createDirectory:function(e){return f("filesystem.createDirectory",{path:e})},removeDirectory:function(e){return f("filesystem.removeDirectory",{path:e})},writeFile:function(e,t){return f("filesystem.writeFile",{path:e,data:t})},appendFile:function(e,t){return f("filesystem.appendFile",{path:e,data:t})},writeBinaryFile:g,appendBinaryFile:function(e,t){return f("filesystem.appendBinaryFile",{path:e,data:m(t)})},readFile:function(e,t){return f("filesystem.readFile",Object.assign({path:e},t))},readBinaryFile:function(e,t){return new Promise(((n,o)=>{f("filesystem.readBinaryFile",Object.assign({path:e},t)).then((e=>{n(s(e))})).catch((e=>{o(e)}))}))},openFile:function(e){return f("filesystem.openFile",{path:e})},createWatcher:function(e){return f("filesystem.createWatcher",{path:e})},removeWatcher:function(e){return f("filesystem.removeWatcher",{id:e})},getWatchers:function(){return f("filesystem.getWatchers")},updateOpenedFile:function(e,t,n){return f("filesystem.updateOpenedFile",{id:e,event:t,data:n})},getOpenedFileInfo:function(e){return f("filesystem.getOpenedFileInfo",{id:e})},removeFile:function(e){return f("filesystem.removeFile",{path:e})},readDirectory:function(e){return f("filesystem.readDirectory",{path:e})},copyFile:function(e,t){return f("filesystem.copyFile",{source:e,destination:t})},moveFile:function(e,t){return f("filesystem.moveFile",{source:e,destination:t})},getStats:function(e){return f("filesystem.getStats",{path:e})}};function h(e,t){return f("os.execCommand",Object.assign({command:e},t))}!function(e){e.WARNING="WARNING",e.ERROR="ERROR",e.INFO="INFO",e.QUESTION="QUESTION"}(w||(w={})),function(e){e.OK="OK",e.OK_CANCEL="OK_CANCEL",e.YES_NO="YES_NO",e.YES_NO_CANCEL="YES_NO_CANCEL",e.RETRY_CANCEL="RETRY_CANCEL",e.ABORT_RETRY_IGNORE="ABORT_RETRY_IGNORE"}(v||(v={}));var y={__proto__:null,get Icon(){return w},get MessageBoxChoice(){return v},execCommand:h,spawnProcess:function(e,t){return f("os.spawnProcess",{command:e,cwd:t})},updateSpawnedProcess:function(e,t,n){return f("os.updateSpawnedProcess",{id:e,event:t,data:n})},getSpawnedProcesses:function(){return f("os.getSpawnedProcesses")},getEnv:function(e){return f("os.getEnv",{key:e})},getEnvs:function(){return f("os.getEnvs")},showOpenDialog:function(e,t){return f("os.showOpenDialog",Object.assign({title:e},t))},showFolderDialog:function(e,t){return f("os.showFolderDialog",Object.assign({title:e},t))},showSaveDialog:function(e,t){return f("os.showSaveDialog",Object.assign({title:e},t))},showNotification:function(e,t,n){return f("os.showNotification",{title:e,content:t,icon:n})},showMessageBox:function(e,t,n,o){return f("os.showMessageBox",{title:e,content:t,choice:n,icon:o})},setTray:function(e){return f("os.setTray",e)},open:function(e){return f("os.open",{url:e})},getPath:function(e){return f("os.getPath",{name:e})}};var N={__proto__:null,getMemoryInfo:function(){return f("computer.getMemoryInfo")},getArch:function(){return f("computer.getArch")},getKernelInfo:function(){return f("computer.getKernelInfo")},getOSInfo:function(){return f("computer.getOSInfo")},getCPUInfo:function(){return f("computer.getCPUInfo")},getDisplays:function(){return f("computer.getDisplays")},getMousePosition:function(){return f("computer.getMousePosition")}};var E,O={__proto__:null,setData:function(e,t){return f("storage.setData",{key:e,data:t})},getData:function(e){return f("storage.getData",{key:e})},getKeys:function(){return f("storage.getKeys")}};function R(e,t){return f("debug.log",{message:e,type:t})}!function(e){e.WARNING="WARNING",e.ERROR="ERROR",e.INFO="INFO"}(E||(E={}));var b={__proto__:null,get LoggerType(){return E},log:R};function T(e){return f("app.exit",{code:e})}var S={__proto__:null,exit:T,killProcess:function(){return f("app.killProcess")},restartProcess:function(e){return new Promise((n=>t(this,void 0,void 0,(function*(){let t=window.NL_ARGS.reduce(((e,t)=>(t.includes(" ")&&(t=`"${t}"`),e+=" "+t)),"");(null==e?void 0:e.args)&&(t+=" "+e.args),yield h(t,{background:!0}),T(),n()}))))},getConfig:function(){return f("app.getConfig")},broadcast:function(e,t){return f("app.broadcast",{event:e,data:t})}};const P=new WeakMap;function D(e,t){return f("window.move",{x:e,y:t})}function L(){return f("window.getSize")}var F={__proto__:null,setTitle:function(e){return f("window.setTitle",{title:e})},getTitle:function(){return f("window.getTitle")},maximize:function(){return f("window.maximize")},unmaximize:function(){return f("window.unmaximize")},isMaximized:function(){return f("window.isMaximized")},minimize:function(){return f("window.minimize")},setFullScreen:function(){return f("window.setFullScreen")},exitFullScreen:function(){return f("window.exitFullScreen")},isFullScreen:function(){return f("window.isFullScreen")},show:function(){return f("window.show")},hide:function(){return f("window.hide")},isVisible:function(){return f("window.isVisible")},focus:function(){return f("window.focus")},setIcon:function(e){return f("window.setIcon",{icon:e})},move:D,center:function(){return f("window.center")},setDraggableRegion:function(e){return new Promise(((n,o)=>{const i=e instanceof Element?e:document.getElementById(e);let r=0,s=0,a=0,c=!1,u=performance.now();if(!i)return o({code:"NE_WD_DOMNOTF",message:"Unable to find DOM element"});if(P.has(i))return o({code:"NE_WD_ALRDREL",message:"This DOM element is already an active draggable region"});function d(e){return t(this,void 0,void 0,(function*(){if(c){const t=performance.now(),n=t-u;if(n<5)return;return u=t-(n-5),void(yield D(e.screenX-r,e.screenY-s))}a=Math.sqrt(e.movementX*e.movementX+e.movementY*e.movementY),a>=10&&(c=!0,i.setPointerCapture(e.pointerId))}))}function l(e){0===e.button&&(r=e.clientX,s=e.clientY,i.addEventListener("pointermove",d))}function f(e){i.removeEventListener("pointermove",d),i.releasePointerCapture(e.pointerId)}i.addEventListener("pointerdown",l),i.addEventListener("pointerup",f),P.set(i,{pointerdown:l,pointerup:f}),n({success:!0,message:"Draggable region was activated"})}))},unsetDraggableRegion:function(e){return new Promise(((t,n)=>{const o=e instanceof Element?e:document.getElementById(e);if(!o)return n({code:"NE_WD_DOMNOTF",message:"Unable to find DOM element"});if(!P.has(o))return n({code:"NE_WD_NOTDRRE",message:"DOM element is not an active draggable region"});const{pointerdown:i,pointerup:r}=P.get(o);o.removeEventListener("pointerdown",i),o.removeEventListener("pointerup",r),P.delete(o),t({success:!0,message:"Draggable region was deactivated"})}))},setSize:function(e){return new Promise(((n,o)=>t(this,void 0,void 0,(function*(){let t=yield L();f("window.setSize",e=Object.assign(Object.assign({},t),e)).then((e=>{n(e)})).catch((e=>{o(e)}))}))))},getSize:L,getPosition:function(){return f("window.getPosition")},setAlwaysOnTop:function(e){return f("window.setAlwaysOnTop",{onTop:e})},create:function(e,t){return new Promise(((n,o)=>{function i(e){return"string"!=typeof e||(e=e.trim()).includes(" ")&&(e=`"${e}"`),e}t=Object.assign(Object.assign({},t),{useSavedState:!1});let r=window.NL_ARGS.reduce(((e,t,n)=>((t.includes("--path=")||t.includes("--debug-mode")||t.includes("--load-dir-res")||0==n)&&(e+=" "+i(t)),e)),"");r+=" --url="+i(e);for(let e in t){if("processArgs"==e)continue;r+=` --window${e.replace(/[A-Z]|^[a-z]/g,(e=>"-"+e.toLowerCase()))}=${i(t[e])}`}t&&t.processArgs&&(r+=" "+t.processArgs),h(r,{background:!0}).then((e=>{n(e)})).catch((e=>{o(e)}))}))}};var I={__proto__:null,broadcast:function(e,t){return f("events.broadcast",{event:e,data:t})},on:i,off:function(e,t){return window.removeEventListener(e,t),Promise.resolve({success:!0,message:"Event listener removed"})},dispatch:r};let C=null;var x={__proto__:null,checkForUpdates:function(e){return new Promise(((n,o)=>t(this,void 0,void 0,(function*(){if(!e)return o({code:"NE_RT_NATRTER",message:"Missing require parameter: url"});try{let t=yield fetch(e);C=JSON.parse(yield t.text()),!function(e){return!!(e.applicationId&&e.applicationId==window.NL_APPID&&e.version&&e.resourcesURL)}(C)?o({code:"NE_UP_CUPDMER",message:"Invalid update manifest or mismatching applicationId"}):n(C)}catch(e){o({code:"NE_UP_CUPDERR",message:"Unable to fetch update manifest"})}}))))},install:function(){return new Promise(((e,n)=>t(this,void 0,void 0,(function*(){if(!C)return n({code:"NE_UP_UPDNOUF",message:"No update manifest loaded"});try{let t=yield fetch(C.resourcesURL),n=yield t.arrayBuffer();yield g(window.NL_PATH+"/resources.neu",n),e({success:!0,message:"Update installed. Restart the process to see updates"})}catch(e){n({code:"NE_UP_UPDINER",message:"Update installation error"})}}))))}};var A={__proto__:null,readText:function(e,t){return f("clipboard.readText",{key:e,data:t})},writeText:function(e){return f("clipboard.writeText",{data:e})}};var M={__proto__:null,getMethods:function(){return f("custom.getMethods")}};let U=!1;return e.app=S,e.clipboard=A,e.computer=N,e.custom=M,e.debug=b,e.events=I,e.extensions=o,e.filesystem=_,e.init=function(e={}){if(e=Object.assign({exportCustomMethods:!0},e),!U){if(l(),window.NL_ARGS.find((e=>"--neu-dev-auto-reload"==e))&&i("neuDev_reloadApp",(()=>t(this,void 0,void 0,(function*(){yield R("Reloading the application..."),location.reload()})))),e.exportCustomMethods&&window.NL_CMETHODS&&window.NL_CMETHODS.length>0)for(let e of window.NL_CMETHODS)Neutralino.custom[e]=(...t)=>{let n={};for(let[e,o]of t.entries())n="object"!=typeof o||Array.isArray(o)||null==o?Object.assign(Object.assign({},n),{["arg"+e]:o}):Object.assign(Object.assign({},n),o);return f("custom."+e,n)};window.NL_CVERSION="3.13.0",window.NL_CCOMMIT="26e9ccc7986db4fb7df7041ea7c90b3d2ed1093e",U=!0}},e.os=y,e.storage=O,e.updater=x,e.window=F,e}({});
