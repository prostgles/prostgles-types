!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n=e();for(var i in n)("object"==typeof exports?exports:t)[i]=n[i]}}(this||window,(function(){return(()=>{"use strict";var t={444:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.EXISTS_KEYS=e.GeomFilter_Funcs=e.GeomFilterKeys=e.TextFilterFTSKeys=e.TextFilter_FullTextSearchFilterKeys=e.CompareInFilterKeys=e.CompareFilterKeys=void 0,e.CompareFilterKeys=["=","$eq","<>",">",">=","<=","$eq","$ne","$gt","$gte","$lte"],e.CompareInFilterKeys=["$in","$nin"],e.TextFilter_FullTextSearchFilterKeys=["to_tsquery","plainto_tsquery","phraseto_tsquery","websearch_to_tsquery"],e.TextFilterFTSKeys=["@@","@>","<@","$contains","$containedBy"],e.GeomFilterKeys=["~","~=","@","|&>","|>>",">>","=","<<|","<<","&>","&<|","&<","&&&","&&"],e.GeomFilter_Funcs=["ST_MakeEnvelope","ST_MakeEnvelope".toLowerCase()],e.EXISTS_KEYS=["$exists","$notExists","$existsJoined","$notExistsJoined"]},590:function(t,e,n){var i=this&&this.__createBinding||(Object.create?function(t,e,n,i){void 0===i&&(i=n),Object.defineProperty(t,i,{enumerable:!0,get:function(){return e[n]}})}:function(t,e,n,i){void 0===i&&(i=n),t[i]=e[n]}),r=this&&this.__exportStar||function(t,e){for(var n in t)"default"===n||Object.prototype.hasOwnProperty.call(e,n)||i(e,t,n)};Object.defineProperty(e,"__esModule",{value:!0}),e.get=e.WAL=e.unpatchText=e.stableStringify=e.isEmpty=e.getTextPatch=e.asName=e.CHANNELS=e.TS_PG_Types=e._PG_postgis=e._PG_date=e._PG_bool=e._PG_json=e._PG_numbers=e._PG_strings=void 0,e._PG_strings=["bpchar","char","varchar","text","citext","uuid","bytea","inet","time","timetz","interval","name"],e._PG_numbers=["int2","int4","int8","float4","float8","numeric","money","oid"],e._PG_json=["json","jsonb"],e._PG_bool=["bool"],e._PG_date=["date","timestamp","timestamptz"],e._PG_postgis=["geometry","geography"],e.TS_PG_Types={string:e._PG_strings,number:e._PG_numbers,boolean:e._PG_bool,Object:e._PG_json,Date:e._PG_date,"Array<number>":e._PG_numbers.map((t=>`_${t}`)),"Array<boolean>":e._PG_bool.map((t=>`_${t}`)),"Array<string>":e._PG_strings.map((t=>`_${t}`)),"Array<Object>":e._PG_json.map((t=>`_${t}`)),"Array<Date>":e._PG_date.map((t=>`_${t}`)),any:[]};const s="_psqlWS_.";e.CHANNELS={SCHEMA_CHANGED:s+"schema-changed",SCHEMA:s+"schema",DEFAULT:s,SQL:"_psqlWS_.sql",METHOD:"_psqlWS_.method",NOTICE_EV:"_psqlWS_.notice",LISTEN_EV:"_psqlWS_.listen",REGISTER:"_psqlWS_.register",LOGIN:"_psqlWS_.login",LOGOUT:"_psqlWS_.logout",AUTHGUARD:"_psqlWS_.authguard",_preffix:s};var o=n(128);Object.defineProperty(e,"asName",{enumerable:!0,get:function(){return o.asName}}),Object.defineProperty(e,"getTextPatch",{enumerable:!0,get:function(){return o.getTextPatch}}),Object.defineProperty(e,"isEmpty",{enumerable:!0,get:function(){return o.isEmpty}}),Object.defineProperty(e,"stableStringify",{enumerable:!0,get:function(){return o.stableStringify}}),Object.defineProperty(e,"unpatchText",{enumerable:!0,get:function(){return o.unpatchText}}),Object.defineProperty(e,"WAL",{enumerable:!0,get:function(){return o.WAL}}),Object.defineProperty(e,"get",{enumerable:!0,get:function(){return o.get}}),r(n(444),e)},899:(t,e)=>{function n(t,e){var n=t[0],i=t[1],c=t[2],l=t[3];n=r(n,i,c,l,e[0],7,-680876936),l=r(l,n,i,c,e[1],12,-389564586),c=r(c,l,n,i,e[2],17,606105819),i=r(i,c,l,n,e[3],22,-1044525330),n=r(n,i,c,l,e[4],7,-176418897),l=r(l,n,i,c,e[5],12,1200080426),c=r(c,l,n,i,e[6],17,-1473231341),i=r(i,c,l,n,e[7],22,-45705983),n=r(n,i,c,l,e[8],7,1770035416),l=r(l,n,i,c,e[9],12,-1958414417),c=r(c,l,n,i,e[10],17,-42063),i=r(i,c,l,n,e[11],22,-1990404162),n=r(n,i,c,l,e[12],7,1804603682),l=r(l,n,i,c,e[13],12,-40341101),c=r(c,l,n,i,e[14],17,-1502002290),n=s(n,i=r(i,c,l,n,e[15],22,1236535329),c,l,e[1],5,-165796510),l=s(l,n,i,c,e[6],9,-1069501632),c=s(c,l,n,i,e[11],14,643717713),i=s(i,c,l,n,e[0],20,-373897302),n=s(n,i,c,l,e[5],5,-701558691),l=s(l,n,i,c,e[10],9,38016083),c=s(c,l,n,i,e[15],14,-660478335),i=s(i,c,l,n,e[4],20,-405537848),n=s(n,i,c,l,e[9],5,568446438),l=s(l,n,i,c,e[14],9,-1019803690),c=s(c,l,n,i,e[3],14,-187363961),i=s(i,c,l,n,e[8],20,1163531501),n=s(n,i,c,l,e[13],5,-1444681467),l=s(l,n,i,c,e[2],9,-51403784),c=s(c,l,n,i,e[7],14,1735328473),n=o(n,i=s(i,c,l,n,e[12],20,-1926607734),c,l,e[5],4,-378558),l=o(l,n,i,c,e[8],11,-2022574463),c=o(c,l,n,i,e[11],16,1839030562),i=o(i,c,l,n,e[14],23,-35309556),n=o(n,i,c,l,e[1],4,-1530992060),l=o(l,n,i,c,e[4],11,1272893353),c=o(c,l,n,i,e[7],16,-155497632),i=o(i,c,l,n,e[10],23,-1094730640),n=o(n,i,c,l,e[13],4,681279174),l=o(l,n,i,c,e[0],11,-358537222),c=o(c,l,n,i,e[3],16,-722521979),i=o(i,c,l,n,e[6],23,76029189),n=o(n,i,c,l,e[9],4,-640364487),l=o(l,n,i,c,e[12],11,-421815835),c=o(c,l,n,i,e[15],16,530742520),n=a(n,i=o(i,c,l,n,e[2],23,-995338651),c,l,e[0],6,-198630844),l=a(l,n,i,c,e[7],10,1126891415),c=a(c,l,n,i,e[14],15,-1416354905),i=a(i,c,l,n,e[5],21,-57434055),n=a(n,i,c,l,e[12],6,1700485571),l=a(l,n,i,c,e[3],10,-1894986606),c=a(c,l,n,i,e[10],15,-1051523),i=a(i,c,l,n,e[1],21,-2054922799),n=a(n,i,c,l,e[8],6,1873313359),l=a(l,n,i,c,e[15],10,-30611744),c=a(c,l,n,i,e[6],15,-1560198380),i=a(i,c,l,n,e[13],21,1309151649),n=a(n,i,c,l,e[4],6,-145523070),l=a(l,n,i,c,e[11],10,-1120210379),c=a(c,l,n,i,e[2],15,718787259),i=a(i,c,l,n,e[9],21,-343485551),t[0]=h(n,t[0]),t[1]=h(i,t[1]),t[2]=h(c,t[2]),t[3]=h(l,t[3])}function i(t,e,n,i,r,s){return e=h(h(e,t),h(i,s)),h(e<<r|e>>>32-r,n)}function r(t,e,n,r,s,o,a){return i(e&n|~e&r,t,e,s,o,a)}function s(t,e,n,r,s,o,a){return i(e&r|n&~r,t,e,s,o,a)}function o(t,e,n,r,s,o,a){return i(e^n^r,t,e,s,o,a)}function a(t,e,n,r,s,o,a){return i(n^(e|~r),t,e,s,o,a)}function c(t){var e,n=[];for(e=0;e<64;e+=4)n[e>>2]=t.charCodeAt(e)+(t.charCodeAt(e+1)<<8)+(t.charCodeAt(e+2)<<16)+(t.charCodeAt(e+3)<<24);return n}Object.defineProperty(e,"__esModule",{value:!0}),e.md5=e.md5cycle=void 0,e.md5cycle=n;var l="0123456789abcdef".split("");function u(t){for(var e="",n=0;n<4;n++)e+=l[t>>8*n+4&15]+l[t>>8*n&15];return e}function d(t){return function(t){for(var e=0;e<t.length;e++)t[e]=u(t[e]);return t.join("")}(function(t){var e,i=t.length,r=[1732584193,-271733879,-1732584194,271733878];for(e=64;e<=t.length;e+=64)n(r,c(t.substring(e-64,e)));t=t.substring(e-64);var s=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(e=0;e<t.length;e++)s[e>>2]|=t.charCodeAt(e)<<(e%4<<3);if(s[e>>2]|=128<<(e%4<<3),e>55)for(n(r,s),e=0;e<16;e++)s[e]=0;return s[14]=8*i,n(r,s),r}(t))}function h(t,e){return t+e&4294967295}if(e.md5=d,"5d41402abc4b2a76b9719d911017c592"!=d("hello")){function h(t,e){var n=(65535&t)+(65535&e);return(t>>16)+(e>>16)+(n>>16)<<16|65535&n}}},128:function(t,e,n){var i=this&&this.__awaiter||function(t,e,n,i){return new(n||(n=Promise))((function(r,s){function o(t){try{c(i.next(t))}catch(t){s(t)}}function a(t){try{c(i.throw(t))}catch(t){s(t)}}function c(t){var e;t.done?r(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(o,a)}c((i=i.apply(t,e||[])).next())}))};Object.defineProperty(e,"__esModule",{value:!0}),e.get=e.isEmpty=e.WAL=e.unpatchText=e.getTextPatch=e.stableStringify=e.asName=void 0;const r=n(899);function s(t){for(var e in t)return!1;return!0}e.asName=function(t){if(null==t||!t.toString||!t.toString())throw"Expecting a non empty string";return`"${t.toString().replace(/"/g,'""')}"`},e.stableStringify=function(t,e){e||(e={}),"function"==typeof e&&(e={cmp:e});var n,i="boolean"==typeof e.cycles&&e.cycles,r=e.cmp&&(n=e.cmp,function(t){return function(e,i){var r={key:e,value:t[e]},s={key:i,value:t[i]};return n(r,s)}}),s=[];return function t(e){if(e&&e.toJSON&&"function"==typeof e.toJSON&&(e=e.toJSON()),void 0!==e){if("number"==typeof e)return isFinite(e)?""+e:"null";if("object"!=typeof e)return JSON.stringify(e);var n,o;if(Array.isArray(e)){for(o="[",n=0;n<e.length;n++)n&&(o+=","),o+=t(e[n])||"null";return o+"]"}if(null===e)return"null";if(-1!==s.indexOf(e)){if(i)return JSON.stringify("__cycle__");throw new TypeError("Converting circular structure to JSON")}var a=s.push(e)-1,c=Object.keys(e).sort(r&&r(e));for(o="",n=0;n<c.length;n++){var l=c[n],u=t(e[l]);u&&(o&&(o+=","),o+=JSON.stringify(l)+":"+u)}return s.splice(a,1),"{"+o+"}"}}(t)},e.getTextPatch=function(t,e){if(!(t&&e&&t.trim().length&&e.trim().length))return e;if(t===e)return{from:0,to:0,text:"",md5:r.md5(e)};function n(n=1){let i=n<1?-1:0,r=!1;for(;!r&&Math.abs(i)<=e.length;){const s=n<1?[i]:[0,i];t.slice(...s)!==e.slice(...s)?r=!0:i+=1*Math.sign(n)}return i}let i=n()-1,s=t.length+n(-1)+1,o=e.length+n(-1)+1;return{from:i,to:s,text:e.slice(i,o),md5:r.md5(e)}},e.unpatchText=function(t,e){if(!e||"string"==typeof e)return e;const{from:n,to:i,text:s,md5:o}=e;if(null===s||null===t)return s;let a=t.slice(0,n)+s+t.slice(i);if(o&&r.md5(a)!==o)throw"Patch text error: Could not match md5 hash: (original/result) \n"+t+"\n"+a;return a},e.WAL=class{constructor(t){if(this.changed={},this.sending={},this.sentHistory={},this.callbacks=[],this.sort=(t,e)=>{const{orderBy:n}=this.options;return n&&t&&e&&n.map((n=>{if(!(n.fieldName in t)||!(n.fieldName in e))throw"Replication error: \n   some orderBy fields missing from data";let i=n.asc?t[n.fieldName]:e[n.fieldName],r=n.asc?e[n.fieldName]:t[n.fieldName],s=+i-+r,o=i<r?-1:i==r?0:1;return"number"===n.tsDataType&&Number.isFinite(s)?s:o})).find((t=>t))||0},this.isInHistory=t=>{if(!t)throw"Provide item";const e=t[this.options.synced_field];if(!Number.isFinite(+e))throw"Provided item Synced field value is missing/invalid ";const n=this.sentHistory[this.getIdStr(t)],i=null==n?void 0:n[this.options.synced_field];if(n){if(!Number.isFinite(+i))throw"Provided historic item Synced field value is missing/invalid";if(+i==+e)return!0}return!1},this.addData=t=>{s(this.changed)&&this.options.onSendStart&&this.options.onSendStart(),t.map((t=>{const{initial:e,current:n}=Object.assign({},t);if(!n)throw"Expecting { current: object, initial?: object }";const i=this.getIdStr(n);this.changed=this.changed||{},this.changed[i]=this.changed[i]||{initial:e,current:n},this.changed[i].current=Object.assign(Object.assign({},this.changed[i].current),n)})),this.sendItems()},this.isSendingTimeout=void 0,this.willDeleteHistory=void 0,this.sendItems=()=>i(this,void 0,void 0,(function*(){const{synced_field:t,onSend:e,onSendEnd:n,batch_size:i,throttle:r,historyAgeSeconds:o=2}=this.options;if(this.isSendingTimeout||this.sending&&!s(this.sending))return;if(!this.changed||s(this.changed))return;let a,c=[],l=[],u={};Object.keys(this.changed).sort(((t,e)=>this.sort(this.changed[t].current,this.changed[e].current))).slice(0,i).map((t=>{let e=Object.assign({},this.changed[t]);this.sending[t]=e,l.push(Object.assign({},e)),u[t]=Object.assign({},e.current),delete this.changed[t]})),c=l.map((t=>t.current)),this.isSendingTimeout||(this.isSendingTimeout=setTimeout((()=>{this.isSendingTimeout=void 0,s(this.changed)||this.sendItems()}),r));try{yield e(c,l),o&&(this.sentHistory=Object.assign(Object.assign({},this.sentHistory),u),this.willDeleteHistory||(this.willDeleteHistory=setTimeout((()=>{this.willDeleteHistory=void 0,this.sentHistory={}}),1e3*o)))}catch(t){a=t,console.error("WAL onSend failed:",t,c,l)}if(this.callbacks.length){const t=Object.keys(this.sending);this.callbacks.forEach(((e,n)=>{e.idStrs=e.idStrs.filter((e=>t.includes(e))),e.idStrs.length||e.cb(a)})),this.callbacks=this.callbacks.filter((t=>t.idStrs.length))}this.sending={},s(this.changed)?n&&n(c,l,a):this.sendItems()})),this.options=Object.assign({},t),!this.options.orderBy){const{synced_field:e,id_fields:n}=t;this.options.orderBy=[e,...n.sort()].map((t=>({fieldName:t,tsDataType:t===e?"number":"string",asc:!0})))}}isSending(){return!(s(this.sending)&&s(this.changed))}getIdStr(t){return this.options.id_fields.sort().map((e=>`${t[e]||""}`)).join(".")}getIdObj(t){let e={};return this.options.id_fields.sort().map((n=>{e[n]=t[n]})),e}getDeltaObj(t){let e={};return Object.keys(t).map((n=>{this.options.id_fields.includes(n)||(e[n]=t[n])})),e}},e.isEmpty=s,e.get=function(t,e){let n=e,i=t;return t?("string"==typeof n&&(n=n.split(".")),n.reduce(((t,e)=>t&&t[e]?t[e]:void 0),i)):t}}},e={};return function n(i){if(e[i])return e[i].exports;var r=e[i]={exports:{}};return t[i].call(r.exports,r,r.exports,n),r.exports}(590)})()}));