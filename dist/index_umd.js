!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var i=t();for(var n in i)("object"==typeof exports?exports:e)[n]=i[n]}}(this||window,(()=>(()=>{"use strict";var e={444:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.EXISTS_KEYS=t.GeomFilter_Funcs=t.GeomFilterKeys=t.TextFilterFTSKeys=t.TextFilter_FullTextSearchFilterKeys=t.TextFilterKeys=t.CompareInFilterKeys=t.CompareFilterKeys=void 0,t.CompareFilterKeys=["=","$eq","<>",">",">=","<=","$eq","$ne","$gt","$gte","$lte"],t.CompareInFilterKeys=["$in","$nin"],t.TextFilterKeys=["$ilike","$like"],t.TextFilter_FullTextSearchFilterKeys=["to_tsquery","plainto_tsquery","phraseto_tsquery","websearch_to_tsquery"],t.TextFilterFTSKeys=["@@","@>","<@","$contains","$containedBy"],t.GeomFilterKeys=["~","~=","@","|&>","|>>",">>","=","<<|","<<","&>","&<|","&<","&&&","&&"];const i=["ST_MakeEnvelope","ST_MakePolygon"];t.GeomFilter_Funcs=i.concat(i.map((e=>e.toLowerCase()))),t.EXISTS_KEYS=["$exists","$notExists","$existsJoined","$notExistsJoined"]},590:function(e,t,i){var n=this&&this.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i);var r=Object.getOwnPropertyDescriptor(t,i);r&&!("get"in r?!t.__esModule:r.writable||r.configurable)||(r={enumerable:!0,get:function(){return t[i]}}),Object.defineProperty(e,n,r)}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),r=this&&this.__exportStar||function(e,t){for(var i in e)"default"===i||Object.prototype.hasOwnProperty.call(t,i)||n(t,e,i)};Object.defineProperty(t,"__esModule",{value:!0}),t.getKeys=t.isObject=t.isDefined=t.get=t.WAL=t.unpatchText=t.stableStringify=t.isEmpty=t.getTextPatch=t.asName=t.RULE_METHODS=t.CHANNELS=t.TS_PG_Types=t._PG_postgis=t._PG_date=t._PG_bool=t._PG_json=t._PG_numbers=t._PG_strings=void 0,t._PG_strings=["bpchar","char","varchar","text","citext","uuid","bytea","inet","time","timetz","interval","name"],t._PG_numbers=["int2","int4","int8","float4","float8","numeric","money","oid"],t._PG_json=["json","jsonb"],t._PG_bool=["bool"],t._PG_date=["date","timestamp","timestamptz"],t._PG_postgis=["geometry","geography"],t.TS_PG_Types={string:t._PG_strings,number:t._PG_numbers,boolean:t._PG_bool,Date:t._PG_date,"Array<number>":t._PG_numbers.map((e=>`_${e}`)),"Array<boolean>":t._PG_bool.map((e=>`_${e}`)),"Array<string>":t._PG_strings.map((e=>`_${e}`)),"Array<Object>":t._PG_json.map((e=>`_${e}`)),"Array<Date>":t._PG_date.map((e=>`_${e}`)),any:[]};const s="_psqlWS_.";t.CHANNELS={SCHEMA_CHANGED:s+"schema-changed",SCHEMA:s+"schema",DEFAULT:s,SQL:"_psqlWS_.sql",METHOD:"_psqlWS_.method",NOTICE_EV:"_psqlWS_.notice",LISTEN_EV:"_psqlWS_.listen",REGISTER:"_psqlWS_.register",LOGIN:"_psqlWS_.login",LOGOUT:"_psqlWS_.logout",AUTHGUARD:"_psqlWS_.authguard",_preffix:s},t.RULE_METHODS={getColumns:["getColumns"],getInfo:["getInfo"],insert:["insert","upsert"],update:["update","upsert","updateBatch"],select:["findOne","find","count","size"],delete:["delete","remove"],sync:["sync","unsync"],subscribe:["unsubscribe","subscribe","subscribeOne"]};var o=i(128);Object.defineProperty(t,"asName",{enumerable:!0,get:function(){return o.asName}}),Object.defineProperty(t,"getTextPatch",{enumerable:!0,get:function(){return o.getTextPatch}}),Object.defineProperty(t,"isEmpty",{enumerable:!0,get:function(){return o.isEmpty}}),Object.defineProperty(t,"stableStringify",{enumerable:!0,get:function(){return o.stableStringify}}),Object.defineProperty(t,"unpatchText",{enumerable:!0,get:function(){return o.unpatchText}}),Object.defineProperty(t,"WAL",{enumerable:!0,get:function(){return o.WAL}}),Object.defineProperty(t,"get",{enumerable:!0,get:function(){return o.get}}),Object.defineProperty(t,"isDefined",{enumerable:!0,get:function(){return o.isDefined}}),Object.defineProperty(t,"isObject",{enumerable:!0,get:function(){return o.isObject}}),Object.defineProperty(t,"getKeys",{enumerable:!0,get:function(){return o.getKeys}}),r(i(444),t)},899:(e,t)=>{function i(e,t){var i=e[0],n=e[1],a=e[2],l=e[3];i=r(i,n,a,l,t[0],7,-680876936),l=r(l,i,n,a,t[1],12,-389564586),a=r(a,l,i,n,t[2],17,606105819),n=r(n,a,l,i,t[3],22,-1044525330),i=r(i,n,a,l,t[4],7,-176418897),l=r(l,i,n,a,t[5],12,1200080426),a=r(a,l,i,n,t[6],17,-1473231341),n=r(n,a,l,i,t[7],22,-45705983),i=r(i,n,a,l,t[8],7,1770035416),l=r(l,i,n,a,t[9],12,-1958414417),a=r(a,l,i,n,t[10],17,-42063),n=r(n,a,l,i,t[11],22,-1990404162),i=r(i,n,a,l,t[12],7,1804603682),l=r(l,i,n,a,t[13],12,-40341101),a=r(a,l,i,n,t[14],17,-1502002290),i=s(i,n=r(n,a,l,i,t[15],22,1236535329),a,l,t[1],5,-165796510),l=s(l,i,n,a,t[6],9,-1069501632),a=s(a,l,i,n,t[11],14,643717713),n=s(n,a,l,i,t[0],20,-373897302),i=s(i,n,a,l,t[5],5,-701558691),l=s(l,i,n,a,t[10],9,38016083),a=s(a,l,i,n,t[15],14,-660478335),n=s(n,a,l,i,t[4],20,-405537848),i=s(i,n,a,l,t[9],5,568446438),l=s(l,i,n,a,t[14],9,-1019803690),a=s(a,l,i,n,t[3],14,-187363961),n=s(n,a,l,i,t[8],20,1163531501),i=s(i,n,a,l,t[13],5,-1444681467),l=s(l,i,n,a,t[2],9,-51403784),a=s(a,l,i,n,t[7],14,1735328473),i=o(i,n=s(n,a,l,i,t[12],20,-1926607734),a,l,t[5],4,-378558),l=o(l,i,n,a,t[8],11,-2022574463),a=o(a,l,i,n,t[11],16,1839030562),n=o(n,a,l,i,t[14],23,-35309556),i=o(i,n,a,l,t[1],4,-1530992060),l=o(l,i,n,a,t[4],11,1272893353),a=o(a,l,i,n,t[7],16,-155497632),n=o(n,a,l,i,t[10],23,-1094730640),i=o(i,n,a,l,t[13],4,681279174),l=o(l,i,n,a,t[0],11,-358537222),a=o(a,l,i,n,t[3],16,-722521979),n=o(n,a,l,i,t[6],23,76029189),i=o(i,n,a,l,t[9],4,-640364487),l=o(l,i,n,a,t[12],11,-421815835),a=o(a,l,i,n,t[15],16,530742520),i=c(i,n=o(n,a,l,i,t[2],23,-995338651),a,l,t[0],6,-198630844),l=c(l,i,n,a,t[7],10,1126891415),a=c(a,l,i,n,t[14],15,-1416354905),n=c(n,a,l,i,t[5],21,-57434055),i=c(i,n,a,l,t[12],6,1700485571),l=c(l,i,n,a,t[3],10,-1894986606),a=c(a,l,i,n,t[10],15,-1051523),n=c(n,a,l,i,t[1],21,-2054922799),i=c(i,n,a,l,t[8],6,1873313359),l=c(l,i,n,a,t[15],10,-30611744),a=c(a,l,i,n,t[6],15,-1560198380),n=c(n,a,l,i,t[13],21,1309151649),i=c(i,n,a,l,t[4],6,-145523070),l=c(l,i,n,a,t[11],10,-1120210379),a=c(a,l,i,n,t[2],15,718787259),n=c(n,a,l,i,t[9],21,-343485551),e[0]=f(i,e[0]),e[1]=f(n,e[1]),e[2]=f(a,e[2]),e[3]=f(l,e[3])}function n(e,t,i,n,r,s){return t=f(f(t,e),f(n,s)),f(t<<r|t>>>32-r,i)}function r(e,t,i,r,s,o,c){return n(t&i|~t&r,e,t,s,o,c)}function s(e,t,i,r,s,o,c){return n(t&r|i&~r,e,t,s,o,c)}function o(e,t,i,r,s,o,c){return n(t^i^r,e,t,s,o,c)}function c(e,t,i,r,s,o,c){return n(i^(t|~r),e,t,s,o,c)}function a(e){var t,i=[];for(t=0;t<64;t+=4)i[t>>2]=e.charCodeAt(t)+(e.charCodeAt(t+1)<<8)+(e.charCodeAt(t+2)<<16)+(e.charCodeAt(t+3)<<24);return i}Object.defineProperty(t,"__esModule",{value:!0}),t.md5=t.md5cycle=void 0,t.md5cycle=i;var l="0123456789abcdef".split("");function u(e){for(var t="",i=0;i<4;i++)t+=l[e>>8*i+4&15]+l[e>>8*i&15];return t}function d(e){return function(e){for(var t=0;t<e.length;t++)e[t]=u(e[t]);return e.join("")}(function(e){var t,n=e.length,r=[1732584193,-271733879,-1732584194,271733878];for(t=64;t<=e.length;t+=64)i(r,a(e.substring(t-64,t)));e=e.substring(t-64);var s=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(t=0;t<e.length;t++)s[t>>2]|=e.charCodeAt(t)<<(t%4<<3);if(s[t>>2]|=128<<(t%4<<3),t>55)for(i(r,s),t=0;t<16;t++)s[t]=0;return s[14]=8*n,i(r,s),r}(e))}function f(e,t){return e+t&4294967295}t.md5=d,d("hello")},128:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.getKeys=t.isDefined=t.isObject=t.get=t.isEmpty=t.WAL=t.unpatchText=t.getTextPatch=t.stableStringify=t.asName=void 0;const n=i(899);function r(e){for(var t in e)return!1;return!0}t.asName=function(e){if(null==e||!e.toString||!e.toString())throw"Expecting a non empty string";return`"${e.toString().replace(/"/g,'""')}"`},t.stableStringify=function(e,t){t||(t={}),"function"==typeof t&&(t={cmp:t});var i,n="boolean"==typeof t.cycles&&t.cycles,r=t.cmp&&(i=t.cmp,function(e){return function(t,n){var r={key:t,value:e[t]},s={key:n,value:e[n]};return i(r,s)}}),s=[];return function e(t){if(t&&t.toJSON&&"function"==typeof t.toJSON&&(t=t.toJSON()),void 0!==t){if("number"==typeof t)return isFinite(t)?""+t:"null";if("object"!=typeof t)return JSON.stringify(t);var i,o;if(Array.isArray(t)){for(o="[",i=0;i<t.length;i++)i&&(o+=","),o+=e(t[i])||"null";return o+"]"}if(null===t)return"null";if(-1!==s.indexOf(t)){if(n)return JSON.stringify("__cycle__");throw new TypeError("Converting circular structure to JSON")}var c=s.push(t)-1,a=Object.keys(t).sort(r&&r(t));for(o="",i=0;i<a.length;i++){var l=a[i],u=e(t[l]);u&&(o&&(o+=","),o+=JSON.stringify(l)+":"+u)}return s.splice(c,1),"{"+o+"}"}}(e)},t.getTextPatch=function(e,t){if(!(e&&t&&e.trim().length&&t.trim().length))return t;if(e===t)return{from:0,to:0,text:"",md5:(0,n.md5)(t)};function i(i=1){let n=i<1?-1:0,r=!1;for(;!r&&Math.abs(n)<=t.length;){const s=i<1?[n]:[0,n];e.slice(...s)!==t.slice(...s)?r=!0:n+=1*Math.sign(i)}return n}let r=i()-1,s=e.length+i(-1)+1,o=t.length+i(-1)+1;return{from:r,to:s,text:t.slice(r,o),md5:(0,n.md5)(t)}},t.unpatchText=function(e,t){if(!t||"string"==typeof t)return t;const{from:i,to:r,text:s,md5:o}=t;if(null===s||null===e)return s;let c=e.slice(0,i)+s+e.slice(r);if(o&&(0,n.md5)(c)!==o)throw"Patch text error: Could not match md5 hash: (original/result) \n"+e+"\n"+c;return c},t.WAL=class{constructor(e){if(this.changed={},this.sending={},this.sentHistory={},this.callbacks=[],this.sort=(e,t)=>{const{orderBy:i}=this.options;return i&&e&&t&&i.map((i=>{if(!(i.fieldName in e)||!(i.fieldName in t))throw"Replication error: \n   some orderBy fields missing from data";let n=i.asc?e[i.fieldName]:t[i.fieldName],r=i.asc?t[i.fieldName]:e[i.fieldName],s=+n-+r,o=n<r?-1:n==r?0:1;return"number"===i.tsDataType&&Number.isFinite(s)?s:o})).find((e=>e))||0},this.isInHistory=e=>{if(!e)throw"Provide item";const t=e[this.options.synced_field];if(!Number.isFinite(+t))throw"Provided item Synced field value is missing/invalid ";const i=this.sentHistory[this.getIdStr(e)],n=i?.[this.options.synced_field];if(i){if(!Number.isFinite(+n))throw"Provided historic item Synced field value is missing/invalid";if(+n==+t)return!0}return!1},this.addData=e=>{r(this.changed)&&this.options.onSendStart&&this.options.onSendStart(),e.map((e=>{var t;const{initial:i,current:n}={...e};if(!n)throw"Expecting { current: object, initial?: object }";const r=this.getIdStr(n);this.changed??(this.changed={}),(t=this.changed)[r]??(t[r]={initial:i,current:n}),this.changed[r].current={...this.changed[r].current,...n}})),this.sendItems()},this.isOnSending=!1,this.isSendingTimeout=void 0,this.willDeleteHistory=void 0,this.sendItems=async()=>{const{DEBUG_MODE:e,onSend:t,onSendEnd:i,batch_size:n,throttle:s,historyAgeSeconds:o=2}=this.options;if(this.isSendingTimeout||this.sending&&!r(this.sending))return;if(!this.changed||r(this.changed))return;let c,a=[],l=[],u={};Object.keys(this.changed).sort(((e,t)=>this.sort(this.changed[e].current,this.changed[t].current))).slice(0,n).map((e=>{let t={...this.changed[e]};this.sending[e]={...t},l.push({...t}),u[e]={...t.current},delete this.changed[e]})),a=l.map((e=>e.current)),e&&console.log(this.options.id," SENDING lr->",a[a.length-1]),this.isSendingTimeout||(this.isSendingTimeout=setTimeout((()=>{this.isSendingTimeout=void 0,r(this.changed)||this.sendItems()}),s)),this.isOnSending=!0;try{await t(a,l),o&&(this.sentHistory={...this.sentHistory,...u},this.willDeleteHistory||(this.willDeleteHistory=setTimeout((()=>{this.willDeleteHistory=void 0,this.sentHistory={}}),1e3*o)))}catch(e){c=e,console.error("WAL onSend failed:",e,a,l)}if(this.isOnSending=!1,this.callbacks.length){const e=Object.keys(this.sending);this.callbacks.forEach(((t,i)=>{t.idStrs=t.idStrs.filter((t=>e.includes(t))),t.idStrs.length||t.cb(c)})),this.callbacks=this.callbacks.filter((e=>e.idStrs.length))}this.sending={},e&&console.log(this.options.id," SENT lr->",a[a.length-1]),r(this.changed)?i&&i(a,l,c):this.sendItems()},this.options={...e},!this.options.orderBy){const{synced_field:t,id_fields:i}=e;this.options.orderBy=[t,...i.sort()].map((e=>({fieldName:e,tsDataType:e===t?"number":"string",asc:!0})))}}isSending(){const e=this.isOnSending||!(r(this.sending)&&r(this.changed));return this.options.DEBUG_MODE&&console.log(this.options.id," CHECKING isSending ->",e),e}getIdStr(e){return this.options.id_fields.sort().map((t=>`${e[t]||""}`)).join(".")}getIdObj(e){let t={};return this.options.id_fields.sort().map((i=>{t[i]=e[i]})),t}getDeltaObj(e){let t={};return Object.keys(e).map((i=>{this.options.id_fields.includes(i)||(t[i]=e[i])})),t}},t.isEmpty=r,t.get=function(e,t){let i=t,n=e;return e?("string"==typeof i&&(i=i.split(".")),i.reduce(((e,t)=>e&&e[t]?e[t]:void 0),n)):e},t.isObject=function(e){return Boolean(e&&"object"==typeof e&&!Array.isArray(e))},t.isDefined=function(e){return null!=e},t.getKeys=function(e){return Object.keys(e)}}},t={};return function i(n){var r=t[n];if(void 0!==r)return r.exports;var s=t[n]={exports:{}};return e[n].call(s.exports,s,s.exports,i),s.exports}(590)})()));