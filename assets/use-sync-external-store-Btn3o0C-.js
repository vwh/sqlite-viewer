import{g as V}from"./attr-accept-BWI1aNlo.js";import{r as E}from"./react-BLNIRDtH.js";var y={exports:{}},w={},$={exports:{}},j={};/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var f=E;function g(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var O=typeof Object.is=="function"?Object.is:g,_=f.useState,D=f.useEffect,k=f.useLayoutEffect,q=f.useDebugValue;function C(e,t){var n=t(),i=_({inst:{value:n,getSnapshot:t}}),r=i[0].inst,u=i[1];return k(function(){r.value=n,r.getSnapshot=t,S(r)&&u({inst:r})},[e,n,t]),D(function(){return S(r)&&u({inst:r}),e(function(){S(r)&&u({inst:r})})},[e]),q(n),n}function S(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!O(e,n)}catch{return!0}}function F(e,t){return t()}var L=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?F:C;j.useSyncExternalStore=f.useSyncExternalStore!==void 0?f.useSyncExternalStore:L;$.exports=j;var M=$.exports;/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var v=E,R=M;function W(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var z=typeof Object.is=="function"?Object.is:W,A=R.useSyncExternalStore,B=v.useRef,G=v.useEffect,H=v.useMemo,I=v.useDebugValue;w.useSyncExternalStoreWithSelector=function(e,t,n,i,r){var u=B(null);if(u.current===null){var c={hasValue:!1,value:null};u.current=c}else c=u.current;u=H(function(){function d(o){if(!x){if(x=!0,p=o,o=i(o),r!==void 0&&c.hasValue){var s=c.value;if(r(s,o))return l=s}return l=o}if(s=l,z(p,o))return s;var m=i(o);return r!==void 0&&r(s,m)?s:(p=o,l=m)}var x=!1,p,l,h=n===void 0?null:n;return[function(){return d(t())},h===null?void 0:function(){return d(h())}]},[t,n,i,r]);var a=A(e,u[0],u[1]);return G(function(){c.hasValue=!0,c.value=a},[a]),I(a),a};y.exports=w;var J=y.exports;const P=V(J);export{P as u};
