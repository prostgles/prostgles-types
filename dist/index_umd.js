!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n=e();for(var i in n)("object"==typeof exports?exports:t)[i]=n[i]}}(this||window,(function(){return(()=>{"use strict";var t={590:(t,e,n)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.WAL=e.isEmpty=e.unpatchText=e.getTextPatch=e.AGGREGATION_FUNCTIONS=e.FIELD_FILTER_TYPES=void 0,e.FIELD_FILTER_TYPES=["$ilike","$gte"],e.AGGREGATION_FUNCTIONS=["$max","$min","$count"];var i=n(128);Object.defineProperty(e,"getTextPatch",{enumerable:!0,get:function(){return i.getTextPatch}}),Object.defineProperty(e,"unpatchText",{enumerable:!0,get:function(){return i.unpatchText}}),Object.defineProperty(e,"isEmpty",{enumerable:!0,get:function(){return i.isEmpty}}),Object.defineProperty(e,"WAL",{enumerable:!0,get:function(){return i.WAL}})},899:(t,e)=>{function n(t,e){var n=t[0],i=t[1],u=t[2],a=t[3];n=r(n,i,u,a,e[0],7,-680876936),a=r(a,n,i,u,e[1],12,-389564586),u=r(u,a,n,i,e[2],17,606105819),i=r(i,u,a,n,e[3],22,-1044525330),n=r(n,i,u,a,e[4],7,-176418897),a=r(a,n,i,u,e[5],12,1200080426),u=r(u,a,n,i,e[6],17,-1473231341),i=r(i,u,a,n,e[7],22,-45705983),n=r(n,i,u,a,e[8],7,1770035416),a=r(a,n,i,u,e[9],12,-1958414417),u=r(u,a,n,i,e[10],17,-42063),i=r(i,u,a,n,e[11],22,-1990404162),n=r(n,i,u,a,e[12],7,1804603682),a=r(a,n,i,u,e[13],12,-40341101),u=r(u,a,n,i,e[14],17,-1502002290),n=o(n,i=r(i,u,a,n,e[15],22,1236535329),u,a,e[1],5,-165796510),a=o(a,n,i,u,e[6],9,-1069501632),u=o(u,a,n,i,e[11],14,643717713),i=o(i,u,a,n,e[0],20,-373897302),n=o(n,i,u,a,e[5],5,-701558691),a=o(a,n,i,u,e[10],9,38016083),u=o(u,a,n,i,e[15],14,-660478335),i=o(i,u,a,n,e[4],20,-405537848),n=o(n,i,u,a,e[9],5,568446438),a=o(a,n,i,u,e[14],9,-1019803690),u=o(u,a,n,i,e[3],14,-187363961),i=o(i,u,a,n,e[8],20,1163531501),n=o(n,i,u,a,e[13],5,-1444681467),a=o(a,n,i,u,e[2],9,-51403784),u=o(u,a,n,i,e[7],14,1735328473),n=s(n,i=o(i,u,a,n,e[12],20,-1926607734),u,a,e[5],4,-378558),a=s(a,n,i,u,e[8],11,-2022574463),u=s(u,a,n,i,e[11],16,1839030562),i=s(i,u,a,n,e[14],23,-35309556),n=s(n,i,u,a,e[1],4,-1530992060),a=s(a,n,i,u,e[4],11,1272893353),u=s(u,a,n,i,e[7],16,-155497632),i=s(i,u,a,n,e[10],23,-1094730640),n=s(n,i,u,a,e[13],4,681279174),a=s(a,n,i,u,e[0],11,-358537222),u=s(u,a,n,i,e[3],16,-722521979),i=s(i,u,a,n,e[6],23,76029189),n=s(n,i,u,a,e[9],4,-640364487),a=s(a,n,i,u,e[12],11,-421815835),u=s(u,a,n,i,e[15],16,530742520),n=c(n,i=s(i,u,a,n,e[2],23,-995338651),u,a,e[0],6,-198630844),a=c(a,n,i,u,e[7],10,1126891415),u=c(u,a,n,i,e[14],15,-1416354905),i=c(i,u,a,n,e[5],21,-57434055),n=c(n,i,u,a,e[12],6,1700485571),a=c(a,n,i,u,e[3],10,-1894986606),u=c(u,a,n,i,e[10],15,-1051523),i=c(i,u,a,n,e[1],21,-2054922799),n=c(n,i,u,a,e[8],6,1873313359),a=c(a,n,i,u,e[15],10,-30611744),u=c(u,a,n,i,e[6],15,-1560198380),i=c(i,u,a,n,e[13],21,1309151649),n=c(n,i,u,a,e[4],6,-145523070),a=c(a,n,i,u,e[11],10,-1120210379),u=c(u,a,n,i,e[2],15,718787259),i=c(i,u,a,n,e[9],21,-343485551),t[0]=d(n,t[0]),t[1]=d(i,t[1]),t[2]=d(u,t[2]),t[3]=d(a,t[3])}function i(t,e,n,i,r,o){return e=d(d(e,t),d(i,o)),d(e<<r|e>>>32-r,n)}function r(t,e,n,r,o,s,c){return i(e&n|~e&r,t,e,o,s,c)}function o(t,e,n,r,o,s,c){return i(e&r|n&~r,t,e,o,s,c)}function s(t,e,n,r,o,s,c){return i(e^n^r,t,e,o,s,c)}function c(t,e,n,r,o,s,c){return i(n^(e|~r),t,e,o,s,c)}function u(t){var e,n=[];for(e=0;e<64;e+=4)n[e>>2]=t.charCodeAt(e)+(t.charCodeAt(e+1)<<8)+(t.charCodeAt(e+2)<<16)+(t.charCodeAt(e+3)<<24);return n}Object.defineProperty(e,"__esModule",{value:!0}),e.md5=e.md5cycle=void 0,e.md5cycle=n;var a="0123456789abcdef".split("");function h(t){for(var e="",n=0;n<4;n++)e+=a[t>>8*n+4&15]+a[t>>8*n&15];return e}function f(t){return function(t){for(var e=0;e<t.length;e++)t[e]=h(t[e]);return t.join("")}(function(t){var e,i=t.length,r=[1732584193,-271733879,-1732584194,271733878];for(e=64;e<=t.length;e+=64)n(r,u(t.substring(e-64,e)));t=t.substring(e-64);var o=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(e=0;e<t.length;e++)o[e>>2]|=t.charCodeAt(e)<<(e%4<<3);if(o[e>>2]|=128<<(e%4<<3),e>55)for(n(r,o),e=0;e<16;e++)o[e]=0;return o[14]=8*i,n(r,o),r}(t))}function d(t,e){return t+e&4294967295}if(e.md5=f,"5d41402abc4b2a76b9719d911017c592"!=f("hello")){function d(t,e){var n=(65535&t)+(65535&e);return(t>>16)+(e>>16)+(n>>16)<<16|65535&n}}},128:function(t,e,n){var i=this&&this.__awaiter||function(t,e,n,i){return new(n||(n=Promise))((function(r,o){function s(t){try{u(i.next(t))}catch(t){o(t)}}function c(t){try{u(i.throw(t))}catch(t){o(t)}}function u(t){var e;t.done?r(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(s,c)}u((i=i.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.isEmpty=e.WAL=e.unpatchText=e.getTextPatch=e.stableStringify=void 0;const r=n(899);function o(t){for(var e in t)return!1;return!0}e.stableStringify=function(t,e){e||(e={}),"function"==typeof e&&(e={cmp:e});var n,i="boolean"==typeof e.cycles&&e.cycles,r=e.cmp&&(n=e.cmp,function(t){return function(e,i){var r={key:e,value:t[e]},o={key:i,value:t[i]};return n(r,o)}}),o=[];return function t(e){if(e&&e.toJSON&&"function"==typeof e.toJSON&&(e=e.toJSON()),void 0!==e){if("number"==typeof e)return isFinite(e)?""+e:"null";if("object"!=typeof e)return JSON.stringify(e);var n,s;if(Array.isArray(e)){for(s="[",n=0;n<e.length;n++)n&&(s+=","),s+=t(e[n])||"null";return s+"]"}if(null===e)return"null";if(-1!==o.indexOf(e)){if(i)return JSON.stringify("__cycle__");throw new TypeError("Converting circular structure to JSON")}var c=o.push(e)-1,u=Object.keys(e).sort(r&&r(e));for(s="",n=0;n<u.length;n++){var a=u[n],h=t(e[a]);h&&(s&&(s+=","),s+=JSON.stringify(a)+":"+h)}return o.splice(c,1),"{"+s+"}"}}(t)},e.getTextPatch=function(t,e){if(!(t&&e&&t.trim().length&&e.trim().length))return e;function n(n=1){let i=n<1?-1:0,r=!1;for(;!r&&Math.abs(i)<=e.length;){const o=n<1?[i]:[0,i];t.slice(...o)!==e.slice(...o)?r=!0:i+=1*Math.sign(n)}return i}let i=n()-1,o=t.length+n(-1)+1,s=e.length+n(-1)+1;return{from:i,to:o,text:e.slice(i,s),md5:r.md5(e)}},e.unpatchText=function(t,e){if(!e||"string"==typeof e)return e;const{from:n,to:i,text:o,md5:s}=e;if(null===o||null===t)return o;let c=t.slice(0,n)+o+t.slice(i);if(s&&r.md5(c)!==s)throw"Patch text error: Could not match md5 hash";return c},e.WAL=class{constructor(t){this.changed={},this.sending={},this.addData=t=>{o(this.changed)&&this.options.onSendStart&&this.options.onSendStart(),t.map((t=>{const e=this.getIdStr(t);this.changed=this.changed||{},this.changed[e]=Object.assign(Object.assign({},this.changed[e]),t)})),this.sendItems()},this.isSendingTimeout=null,this.sendItems=()=>i(this,void 0,void 0,(function*(){const{synced_field:t,onSend:e,onSendEnd:n,batch_size:i,throttle:r}=this.options;if(this.isSendingTimeout||this.sending&&!o(this.sending))return;if(!this.changed||o(this.changed))return;let s,c=[];Object.keys(this.changed).sort(((e,n)=>+this.changed[e][t]-+this.changed[n][t])).slice(0,i).map((t=>{let e=Object.assign({},this.changed[t]);this.sending[t]=e,c.push(Object.assign({},e)),delete this.changed[t]})),this.isSendingTimeout=setTimeout((()=>{this.isSendingTimeout=void 0,o(this.changed)||this.sendItems()}),r);try{yield e(c)}catch(t){s=t,console.error(t,c)}this.sending={},o(this.changed)?n&&n(c,s):this.sendItems()})),this.options=Object.assign({},t)}isSending(){return!(o(this.sending)&&o(this.changed))}getIdStr(t){return this.options.id_fields.sort().map((e=>`${t[e]||""}`)).join(".")}getIdObj(t){let e={};return this.options.id_fields.sort().map((n=>{e[n]=t[n]})),e}},e.isEmpty=o}},e={};return function n(i){if(e[i])return e[i].exports;var r=e[i]={exports:{}};return t[i].call(r.exports,r,r.exports,n),r.exports}(590)})()}));