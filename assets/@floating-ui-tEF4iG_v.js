const Mt=["top","right","bottom","left"],k=Math.min,R=Math.max,ot=Math.round,nt=Math.floor,I=t=>({x:t,y:t}),Ft={left:"right",right:"left",bottom:"top",top:"bottom"},Wt={start:"end",end:"start"};function ft(t,e,o){return R(t,k(e,o))}function W(t,e){return typeof t=="function"?t(e):t}function H(t){return t.split("-")[0]}function G(t){return t.split("-")[1]}function dt(t){return t==="x"?"y":"x"}function mt(t){return t==="y"?"height":"width"}function _(t){return["top","bottom"].includes(H(t))?"y":"x"}function ht(t){return dt(_(t))}function Ht(t,e,o){o===void 0&&(o=!1);const n=G(t),i=ht(t),s=mt(i);let r=i==="x"?n===(o?"end":"start")?"right":"left":n==="start"?"bottom":"top";return e.reference[s]>e.floating[s]&&(r=it(r)),[r,it(r)]}function Bt(t){const e=it(t);return[at(t),e,at(e)]}function at(t){return t.replace(/start|end/g,e=>Wt[e])}function Nt(t,e,o){const n=["left","right"],i=["right","left"],s=["top","bottom"],r=["bottom","top"];switch(t){case"top":case"bottom":return o?e?i:n:e?n:i;case"left":case"right":return e?s:r;default:return[]}}function Vt(t,e,o,n){const i=G(t);let s=Nt(H(t),o==="start",n);return i&&(s=s.map(r=>r+"-"+i),e&&(s=s.concat(s.map(at)))),s}function it(t){return t.replace(/left|right|bottom|top/g,e=>Ft[e])}function $t(t){return{top:0,right:0,bottom:0,left:0,...t}}function Rt(t){return typeof t!="number"?$t(t):{top:t,right:t,bottom:t,left:t}}function st(t){const{x:e,y:o,width:n,height:i}=t;return{width:n,height:i,top:o,left:e,right:e+n,bottom:o+i,x:e,y:o}}function wt(t,e,o){let{reference:n,floating:i}=t;const s=_(e),r=ht(e),l=mt(r),c=H(e),f=s==="y",d=n.x+n.width/2-i.width/2,u=n.y+n.height/2-i.height/2,h=n[l]/2-i[l]/2;let a;switch(c){case"top":a={x:d,y:n.y-i.height};break;case"bottom":a={x:d,y:n.y+n.height};break;case"right":a={x:n.x+n.width,y:u};break;case"left":a={x:n.x-i.width,y:u};break;default:a={x:n.x,y:n.y}}switch(G(e)){case"start":a[r]-=h*(o&&f?-1:1);break;case"end":a[r]+=h*(o&&f?-1:1);break}return a}const zt=async(t,e,o)=>{const{placement:n="bottom",strategy:i="absolute",middleware:s=[],platform:r}=o,l=s.filter(Boolean),c=await(r.isRTL==null?void 0:r.isRTL(e));let f=await r.getElementRects({reference:t,floating:e,strategy:i}),{x:d,y:u}=wt(f,n,c),h=n,a={},m=0;for(let g=0;g<l.length;g++){const{name:x,fn:p}=l[g],{x:w,y,data:b,reset:v}=await p({x:d,y:u,initialPlacement:n,placement:h,strategy:i,middlewareData:a,rects:f,platform:r,elements:{reference:t,floating:e}});d=w??d,u=y??u,a={...a,[x]:{...a[x],...b}},v&&m<=50&&(m++,typeof v=="object"&&(v.placement&&(h=v.placement),v.rects&&(f=v.rects===!0?await r.getElementRects({reference:t,floating:e,strategy:i}):v.rects),{x:d,y:u}=wt(f,h,c)),g=-1)}return{x:d,y:u,placement:h,strategy:i,middlewareData:a}};async function Z(t,e){var o;e===void 0&&(e={});const{x:n,y:i,platform:s,rects:r,elements:l,strategy:c}=t,{boundary:f="clippingAncestors",rootBoundary:d="viewport",elementContext:u="floating",altBoundary:h=!1,padding:a=0}=W(e,t),m=Rt(a),x=l[h?u==="floating"?"reference":"floating":u],p=st(await s.getClippingRect({element:(o=await(s.isElement==null?void 0:s.isElement(x)))==null||o?x:x.contextElement||await(s.getDocumentElement==null?void 0:s.getDocumentElement(l.floating)),boundary:f,rootBoundary:d,strategy:c})),w=u==="floating"?{x:n,y:i,width:r.floating.width,height:r.floating.height}:r.reference,y=await(s.getOffsetParent==null?void 0:s.getOffsetParent(l.floating)),b=await(s.isElement==null?void 0:s.isElement(y))?await(s.getScale==null?void 0:s.getScale(y))||{x:1,y:1}:{x:1,y:1},v=st(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({elements:l,rect:w,offsetParent:y,strategy:c}):w);return{top:(p.top-v.top+m.top)/b.y,bottom:(v.bottom-p.bottom+m.bottom)/b.y,left:(p.left-v.left+m.left)/b.x,right:(v.right-p.right+m.right)/b.x}}const It=t=>({name:"arrow",options:t,async fn(e){const{x:o,y:n,placement:i,rects:s,platform:r,elements:l,middlewareData:c}=e,{element:f,padding:d=0}=W(t,e)||{};if(f==null)return{};const u=Rt(d),h={x:o,y:n},a=ht(i),m=mt(a),g=await r.getDimensions(f),x=a==="y",p=x?"top":"left",w=x?"bottom":"right",y=x?"clientHeight":"clientWidth",b=s.reference[m]+s.reference[a]-h[a]-s.floating[m],v=h[a]-s.reference[a],A=await(r.getOffsetParent==null?void 0:r.getOffsetParent(f));let L=A?A[y]:0;(!L||!await(r.isElement==null?void 0:r.isElement(A)))&&(L=l.floating[y]||s.floating[m]);const N=b/2-v/2,D=L/2-g[m]/2-1,E=k(u[p],D),V=k(u[w],D),Y=E,Q=L-g[m]-V,O=L/2-g[m]/2+N,q=ft(Y,O,Q),F=!c.arrow&&G(i)!=null&&O!==q&&s.reference[m]/2-(O<Y?E:V)-g[m]/2<0,P=F?O<Y?O-Y:O-Q:0;return{[a]:h[a]+P,data:{[a]:q,centerOffset:O-q-P,...F&&{alignmentOffset:P}},reset:F}}}),_t=function(t){return t===void 0&&(t={}),{name:"flip",options:t,async fn(e){var o,n;const{placement:i,middlewareData:s,rects:r,initialPlacement:l,platform:c,elements:f}=e,{mainAxis:d=!0,crossAxis:u=!0,fallbackPlacements:h,fallbackStrategy:a="bestFit",fallbackAxisSideDirection:m="none",flipAlignment:g=!0,...x}=W(t,e);if((o=s.arrow)!=null&&o.alignmentOffset)return{};const p=H(i),w=_(l),y=H(l)===l,b=await(c.isRTL==null?void 0:c.isRTL(f.floating)),v=h||(y||!g?[it(l)]:Bt(l)),A=m!=="none";!h&&A&&v.push(...Vt(l,g,m,b));const L=[l,...v],N=await Z(e,x),D=[];let E=((n=s.flip)==null?void 0:n.overflows)||[];if(d&&D.push(N[p]),u){const O=Ht(i,r,b);D.push(N[O[0]],N[O[1]])}if(E=[...E,{placement:i,overflows:D}],!D.every(O=>O<=0)){var V,Y;const O=(((V=s.flip)==null?void 0:V.index)||0)+1,q=L[O];if(q)return{data:{index:O,overflows:E},reset:{placement:q}};let F=(Y=E.filter(P=>P.overflows[0]<=0).sort((P,$)=>P.overflows[1]-$.overflows[1])[0])==null?void 0:Y.placement;if(!F)switch(a){case"bestFit":{var Q;const P=(Q=E.filter($=>{if(A){const z=_($.placement);return z===w||z==="y"}return!0}).map($=>[$.placement,$.overflows.filter(z=>z>0).reduce((z,kt)=>z+kt,0)]).sort(($,z)=>$[1]-z[1])[0])==null?void 0:Q[0];P&&(F=P);break}case"initialPlacement":F=l;break}if(i!==F)return{reset:{placement:F}}}return{}}}};function yt(t,e){return{top:t.top-e.height,right:t.right-e.width,bottom:t.bottom-e.height,left:t.left-e.width}}function vt(t){return Mt.some(e=>t[e]>=0)}const jt=function(t){return t===void 0&&(t={}),{name:"hide",options:t,async fn(e){const{rects:o}=e,{strategy:n="referenceHidden",...i}=W(t,e);switch(n){case"referenceHidden":{const s=await Z(e,{...i,elementContext:"reference"}),r=yt(s,o.reference);return{data:{referenceHiddenOffsets:r,referenceHidden:vt(r)}}}case"escaped":{const s=await Z(e,{...i,altBoundary:!0}),r=yt(s,o.floating);return{data:{escapedOffsets:r,escaped:vt(r)}}}default:return{}}}}};async function Yt(t,e){const{placement:o,platform:n,elements:i}=t,s=await(n.isRTL==null?void 0:n.isRTL(i.floating)),r=H(o),l=G(o),c=_(o)==="y",f=["left","top"].includes(r)?-1:1,d=s&&c?-1:1,u=W(e,t);let{mainAxis:h,crossAxis:a,alignmentAxis:m}=typeof u=="number"?{mainAxis:u,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...u};return l&&typeof m=="number"&&(a=l==="end"?m*-1:m),c?{x:a*d,y:h*f}:{x:h*f,y:a*d}}const Xt=function(t){return t===void 0&&(t=0),{name:"offset",options:t,async fn(e){var o,n;const{x:i,y:s,placement:r,middlewareData:l}=e,c=await Yt(e,t);return r===((o=l.offset)==null?void 0:o.placement)&&(n=l.arrow)!=null&&n.alignmentOffset?{}:{x:i+c.x,y:s+c.y,data:{...c,placement:r}}}}},qt=function(t){return t===void 0&&(t={}),{name:"shift",options:t,async fn(e){const{x:o,y:n,placement:i}=e,{mainAxis:s=!0,crossAxis:r=!1,limiter:l={fn:x=>{let{x:p,y:w}=x;return{x:p,y:w}}},...c}=W(t,e),f={x:o,y:n},d=await Z(e,c),u=_(H(i)),h=dt(u);let a=f[h],m=f[u];if(s){const x=h==="y"?"top":"left",p=h==="y"?"bottom":"right",w=a+d[x],y=a-d[p];a=ft(w,a,y)}if(r){const x=u==="y"?"top":"left",p=u==="y"?"bottom":"right",w=m+d[x],y=m-d[p];m=ft(w,m,y)}const g=l.fn({...e,[h]:a,[u]:m});return{...g,data:{x:g.x-o,y:g.y-n}}}}},Ut=function(t){return t===void 0&&(t={}),{options:t,fn(e){const{x:o,y:n,placement:i,rects:s,middlewareData:r}=e,{offset:l=0,mainAxis:c=!0,crossAxis:f=!0}=W(t,e),d={x:o,y:n},u=_(i),h=dt(u);let a=d[h],m=d[u];const g=W(l,e),x=typeof g=="number"?{mainAxis:g,crossAxis:0}:{mainAxis:0,crossAxis:0,...g};if(c){const y=h==="y"?"height":"width",b=s.reference[h]-s.floating[y]+x.mainAxis,v=s.reference[h]+s.reference[y]-x.mainAxis;a<b?a=b:a>v&&(a=v)}if(f){var p,w;const y=h==="y"?"width":"height",b=["top","left"].includes(H(i)),v=s.reference[u]-s.floating[y]+(b&&((p=r.offset)==null?void 0:p[u])||0)+(b?0:x.crossAxis),A=s.reference[u]+s.reference[y]+(b?0:((w=r.offset)==null?void 0:w[u])||0)-(b?x.crossAxis:0);m<v?m=v:m>A&&(m=A)}return{[h]:a,[u]:m}}}},Kt=function(t){return t===void 0&&(t={}),{name:"size",options:t,async fn(e){const{placement:o,rects:n,platform:i,elements:s}=e,{apply:r=()=>{},...l}=W(t,e),c=await Z(e,l),f=H(o),d=G(o),u=_(o)==="y",{width:h,height:a}=n.floating;let m,g;f==="top"||f==="bottom"?(m=f,g=d===(await(i.isRTL==null?void 0:i.isRTL(s.floating))?"start":"end")?"left":"right"):(g=f,m=d==="end"?"top":"bottom");const x=a-c.top-c.bottom,p=h-c.left-c.right,w=k(a-c[m],x),y=k(h-c[g],p),b=!e.middlewareData.shift;let v=w,A=y;if(u?A=d||b?k(y,p):p:v=d||b?k(w,x):x,b&&!d){const N=R(c.left,0),D=R(c.right,0),E=R(c.top,0),V=R(c.bottom,0);u?A=h-2*(N!==0||D!==0?N+D:R(c.left,c.right)):v=a-2*(E!==0||V!==0?E+V:R(c.top,c.bottom))}await r({...e,availableWidth:A,availableHeight:v});const L=await i.getDimensions(s.floating);return h!==L.width||a!==L.height?{reset:{rects:!0}}:{}}}};function J(t){return Ct(t)?(t.nodeName||"").toLowerCase():"#document"}function C(t){var e;return(t==null||(e=t.ownerDocument)==null?void 0:e.defaultView)||window}function B(t){var e;return(e=(Ct(t)?t.ownerDocument:t.document)||window.document)==null?void 0:e.documentElement}function Ct(t){return t instanceof Node||t instanceof C(t).Node}function S(t){return t instanceof Element||t instanceof C(t).Element}function M(t){return t instanceof HTMLElement||t instanceof C(t).HTMLElement}function bt(t){return typeof ShadowRoot>"u"?!1:t instanceof ShadowRoot||t instanceof C(t).ShadowRoot}function et(t){const{overflow:e,overflowX:o,overflowY:n,display:i}=T(t);return/auto|scroll|overlay|hidden|clip/.test(e+n+o)&&!["inline","contents"].includes(i)}function Gt(t){return["table","td","th"].includes(J(t))}function rt(t){return[":popover-open",":modal"].some(e=>{try{return t.matches(e)}catch{return!1}})}function gt(t){const e=pt(),o=S(t)?T(t):t;return o.transform!=="none"||o.perspective!=="none"||(o.containerType?o.containerType!=="normal":!1)||!e&&(o.backdropFilter?o.backdropFilter!=="none":!1)||!e&&(o.filter?o.filter!=="none":!1)||["transform","perspective","filter"].some(n=>(o.willChange||"").includes(n))||["paint","layout","strict","content"].some(n=>(o.contain||"").includes(n))}function Jt(t){let e=j(t);for(;M(e)&&!K(e);){if(gt(e))return e;if(rt(e))return null;e=j(e)}return null}function pt(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function K(t){return["html","body","#document"].includes(J(t))}function T(t){return C(t).getComputedStyle(t)}function ct(t){return S(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function j(t){if(J(t)==="html")return t;const e=t.assignedSlot||t.parentNode||bt(t)&&t.host||B(t);return bt(e)?e.host:e}function Et(t){const e=j(t);return K(e)?t.ownerDocument?t.ownerDocument.body:t.body:M(e)&&et(e)?e:Et(e)}function tt(t,e,o){var n;e===void 0&&(e=[]),o===void 0&&(o=!0);const i=Et(t),s=i===((n=t.ownerDocument)==null?void 0:n.body),r=C(i);if(s){const l=ut(r);return e.concat(r,r.visualViewport||[],et(i)?i:[],l&&o?tt(l):[])}return e.concat(i,tt(i,[],o))}function ut(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function St(t){const e=T(t);let o=parseFloat(e.width)||0,n=parseFloat(e.height)||0;const i=M(t),s=i?t.offsetWidth:o,r=i?t.offsetHeight:n,l=ot(o)!==s||ot(n)!==r;return l&&(o=s,n=r),{width:o,height:n,$:l}}function xt(t){return S(t)?t:t.contextElement}function U(t){const e=xt(t);if(!M(e))return I(1);const o=e.getBoundingClientRect(),{width:n,height:i,$:s}=St(e);let r=(s?ot(o.width):o.width)/n,l=(s?ot(o.height):o.height)/i;return(!r||!Number.isFinite(r))&&(r=1),(!l||!Number.isFinite(l))&&(l=1),{x:r,y:l}}const Qt=I(0);function Tt(t){const e=C(t);return!pt()||!e.visualViewport?Qt:{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}}function Zt(t,e,o){return e===void 0&&(e=!1),!o||e&&o!==C(t)?!1:e}function X(t,e,o,n){e===void 0&&(e=!1),o===void 0&&(o=!1);const i=t.getBoundingClientRect(),s=xt(t);let r=I(1);e&&(n?S(n)&&(r=U(n)):r=U(t));const l=Zt(s,o,n)?Tt(s):I(0);let c=(i.left+l.x)/r.x,f=(i.top+l.y)/r.y,d=i.width/r.x,u=i.height/r.y;if(s){const h=C(s),a=n&&S(n)?C(n):n;let m=h,g=ut(m);for(;g&&n&&a!==m;){const x=U(g),p=g.getBoundingClientRect(),w=T(g),y=p.left+(g.clientLeft+parseFloat(w.paddingLeft))*x.x,b=p.top+(g.clientTop+parseFloat(w.paddingTop))*x.y;c*=x.x,f*=x.y,d*=x.x,u*=x.y,c+=y,f+=b,m=C(g),g=ut(m)}}return st({width:d,height:u,x:c,y:f})}function te(t){let{elements:e,rect:o,offsetParent:n,strategy:i}=t;const s=i==="fixed",r=B(n),l=e?rt(e.floating):!1;if(n===r||l&&s)return o;let c={scrollLeft:0,scrollTop:0},f=I(1);const d=I(0),u=M(n);if((u||!u&&!s)&&((J(n)!=="body"||et(r))&&(c=ct(n)),M(n))){const h=X(n);f=U(n),d.x=h.x+n.clientLeft,d.y=h.y+n.clientTop}return{width:o.width*f.x,height:o.height*f.y,x:o.x*f.x-c.scrollLeft*f.x+d.x,y:o.y*f.y-c.scrollTop*f.y+d.y}}function ee(t){return Array.from(t.getClientRects())}function Lt(t){return X(B(t)).left+ct(t).scrollLeft}function ne(t){const e=B(t),o=ct(t),n=t.ownerDocument.body,i=R(e.scrollWidth,e.clientWidth,n.scrollWidth,n.clientWidth),s=R(e.scrollHeight,e.clientHeight,n.scrollHeight,n.clientHeight);let r=-o.scrollLeft+Lt(t);const l=-o.scrollTop;return T(n).direction==="rtl"&&(r+=R(e.clientWidth,n.clientWidth)-i),{width:i,height:s,x:r,y:l}}function oe(t,e){const o=C(t),n=B(t),i=o.visualViewport;let s=n.clientWidth,r=n.clientHeight,l=0,c=0;if(i){s=i.width,r=i.height;const f=pt();(!f||f&&e==="fixed")&&(l=i.offsetLeft,c=i.offsetTop)}return{width:s,height:r,x:l,y:c}}function ie(t,e){const o=X(t,!0,e==="fixed"),n=o.top+t.clientTop,i=o.left+t.clientLeft,s=M(t)?U(t):I(1),r=t.clientWidth*s.x,l=t.clientHeight*s.y,c=i*s.x,f=n*s.y;return{width:r,height:l,x:c,y:f}}function At(t,e,o){let n;if(e==="viewport")n=oe(t,o);else if(e==="document")n=ne(B(t));else if(S(e))n=ie(e,o);else{const i=Tt(t);n={...e,x:e.x-i.x,y:e.y-i.y}}return st(n)}function Dt(t,e){const o=j(t);return o===e||!S(o)||K(o)?!1:T(o).position==="fixed"||Dt(o,e)}function se(t,e){const o=e.get(t);if(o)return o;let n=tt(t,[],!1).filter(l=>S(l)&&J(l)!=="body"),i=null;const s=T(t).position==="fixed";let r=s?j(t):t;for(;S(r)&&!K(r);){const l=T(r),c=gt(r);!c&&l.position==="fixed"&&(i=null),(s?!c&&!i:!c&&l.position==="static"&&!!i&&["absolute","fixed"].includes(i.position)||et(r)&&!c&&Dt(t,r))?n=n.filter(d=>d!==r):i=l,r=j(r)}return e.set(t,n),n}function re(t){let{element:e,boundary:o,rootBoundary:n,strategy:i}=t;const r=[...o==="clippingAncestors"?rt(e)?[]:se(e,this._c):[].concat(o),n],l=r[0],c=r.reduce((f,d)=>{const u=At(e,d,i);return f.top=R(u.top,f.top),f.right=k(u.right,f.right),f.bottom=k(u.bottom,f.bottom),f.left=R(u.left,f.left),f},At(e,l,i));return{width:c.right-c.left,height:c.bottom-c.top,x:c.left,y:c.top}}function ce(t){const{width:e,height:o}=St(t);return{width:e,height:o}}function le(t,e,o){const n=M(e),i=B(e),s=o==="fixed",r=X(t,!0,s,e);let l={scrollLeft:0,scrollTop:0};const c=I(0);if(n||!n&&!s)if((J(e)!=="body"||et(i))&&(l=ct(e)),n){const u=X(e,!0,s,e);c.x=u.x+e.clientLeft,c.y=u.y+e.clientTop}else i&&(c.x=Lt(i));const f=r.left+l.scrollLeft-c.x,d=r.top+l.scrollTop-c.y;return{x:f,y:d,width:r.width,height:r.height}}function lt(t){return T(t).position==="static"}function Ot(t,e){return!M(t)||T(t).position==="fixed"?null:e?e(t):t.offsetParent}function Pt(t,e){const o=C(t);if(rt(t))return o;if(!M(t)){let i=j(t);for(;i&&!K(i);){if(S(i)&&!lt(i))return i;i=j(i)}return o}let n=Ot(t,e);for(;n&&Gt(n)&&lt(n);)n=Ot(n,e);return n&&K(n)&&lt(n)&&!gt(n)?o:n||Jt(t)||o}const fe=async function(t){const e=this.getOffsetParent||Pt,o=this.getDimensions,n=await o(t.floating);return{reference:le(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:n.width,height:n.height}}};function ae(t){return T(t).direction==="rtl"}const ue={convertOffsetParentRelativeRectToViewportRelativeRect:te,getDocumentElement:B,getClippingRect:re,getOffsetParent:Pt,getElementRects:fe,getClientRects:ee,getDimensions:ce,getScale:U,isElement:S,isRTL:ae};function de(t,e){let o=null,n;const i=B(t);function s(){var l;clearTimeout(n),(l=o)==null||l.disconnect(),o=null}function r(l,c){l===void 0&&(l=!1),c===void 0&&(c=1),s();const{left:f,top:d,width:u,height:h}=t.getBoundingClientRect();if(l||e(),!u||!h)return;const a=nt(d),m=nt(i.clientWidth-(f+u)),g=nt(i.clientHeight-(d+h)),x=nt(f),w={rootMargin:-a+"px "+-m+"px "+-g+"px "+-x+"px",threshold:R(0,k(1,c))||1};let y=!0;function b(v){const A=v[0].intersectionRatio;if(A!==c){if(!y)return r();A?r(!1,A):n=setTimeout(()=>{r(!1,1e-7)},1e3)}y=!1}try{o=new IntersectionObserver(b,{...w,root:i.ownerDocument})}catch{o=new IntersectionObserver(b,w)}o.observe(t)}return r(!0),s}function me(t,e,o,n){n===void 0&&(n={});const{ancestorScroll:i=!0,ancestorResize:s=!0,elementResize:r=typeof ResizeObserver=="function",layoutShift:l=typeof IntersectionObserver=="function",animationFrame:c=!1}=n,f=xt(t),d=i||s?[...f?tt(f):[],...tt(e)]:[];d.forEach(p=>{i&&p.addEventListener("scroll",o,{passive:!0}),s&&p.addEventListener("resize",o)});const u=f&&l?de(f,o):null;let h=-1,a=null;r&&(a=new ResizeObserver(p=>{let[w]=p;w&&w.target===f&&a&&(a.unobserve(e),cancelAnimationFrame(h),h=requestAnimationFrame(()=>{var y;(y=a)==null||y.observe(e)})),o()}),f&&!c&&a.observe(f),a.observe(e));let m,g=c?X(t):null;c&&x();function x(){const p=X(t);g&&(p.x!==g.x||p.y!==g.y||p.width!==g.width||p.height!==g.height)&&o(),g=p,m=requestAnimationFrame(x)}return o(),()=>{var p;d.forEach(w=>{i&&w.removeEventListener("scroll",o),s&&w.removeEventListener("resize",o)}),u==null||u(),(p=a)==null||p.disconnect(),a=null,c&&cancelAnimationFrame(m)}}const he=Xt,ge=qt,pe=_t,xe=Kt,we=jt,ye=It,ve=Ut,be=(t,e,o)=>{const n=new Map,i={platform:ue,...o},s={...i.platform,_c:n};return zt(t,e,{...i,platform:s})};export{xe as a,ye as b,be as c,me as d,pe as f,we as h,ve as l,he as o,ge as s};
