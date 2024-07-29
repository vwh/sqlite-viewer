import{r as l,j as e,R as P}from"./react-DmpIMwDM.js";import{c as Ke}from"./react-dom-tIxIBQuZ.js";import{c as Ge}from"./zustand-oOA47TU4.js";import{i as Je}from"./sql.js-lzln2bbd.js";import{F as V}from"./file-saver-DhbZvGod.js";import{c as We}from"./clsx-B-dksMZM.js";import{t as Ye}from"./tailwind-merge-BkWO730n.js";import{S as Ze,c as U,I as Xe,d as _,e as K,f as et,g as G,V as tt,L as J,h as W,i as st,j as at,k as Y,l as rt,G as ot,m as lt,n as Z,o as nt,p as it,q as ct,r as X,s as dt,t as ut,u as ee,v as mt,w as ft,x as te,y as pt,z as se,A as ae,B as re,E as oe,F as le,H as ne,J as ie,K as xt,M as ht}from"./@radix-ui-D_gCN1bM.js";import{c as ce}from"./class-variance-authority-Bb4qSo10.js";import{C as gt,a as bt,b as de,c as yt,d as jt,K as wt,e as Nt,f as vt,g as Ct,T as Rt,L as St,D as Tt,P as Et,h as Pt,i as kt,M as Dt,j as Lt,S as At,k as Ht,l as Qt,G as It}from"./lucide-react-CvnTk8cx.js";import{u as Mt}from"./react-dropzone-D-IBOhIS.js";import{J as L,T as qt}from"./sonner-BJG0sXho.js";import{D as N}from"./vaul-t6qA3T7B.js";import"./attr-accept-BWI1aNlo.js";import"./scheduler-CzFDRTuY.js";import"./use-sync-external-store-ByYeed7R.js";import"./aria-hidden-DQ5UC2Eg.js";import"./react-remove-scroll-BOyN_WUU.js";import"./tslib-CuZy2iRz.js";import"./react-remove-scroll-bar-DZjhPxUV.js";import"./react-style-singleton-CpxBwIWS.js";import"./get-nonce-C-Z93AgS.js";import"./use-sidecar-D8_hMcUG.js";import"./use-callback-ref-DRzK4jWO.js";import"./@floating-ui-DGkE6due.js";import"./prop-types-psm7UO16.js";import"./file-selector-CBHVlu32.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(o){if(o.ep)return;o.ep=!0;const n=a(o);fetch(o.href,n)}})();const Ft="https://sql.js.org/dist/sql-wasm.wasm",Ot=async t=>{try{const[s,a]=await Promise.all([t.arrayBuffer(),Je({locateFile:()=>Ft})]);return new a.Database(new Uint8Array(s))}catch(s){throw console.error("Failed to load database:",s),s}},I=t=>{var s;try{return((s=t.exec("SELECT name FROM sqlite_master WHERE type='table';")[0])==null?void 0:s.values.flat())||[]}catch(a){return console.error("Failed to get table names:",a),[]}},$t=async(t,s)=>{try{const[a,r]=t.exec(`
      PRAGMA table_info("${s}");
      PRAGMA foreign_key_list("${s}");
    `),o=a.values.reduce((n,i)=>(n[i[1]]={type:i[2],isPrimaryKey:i[5]===1,isForeignKey:!1},n),{});return r==null||r.values.forEach(n=>{const i=n[3];o[i]&&(o[i].isForeignKey=!0)}),o}catch(a){throw console.error(`Failed to get schema for table "${s}":`,a),a}},A=t=>{if(t.length===0)return{data:[],columns:[]};const{columns:s,values:a}=t[0];return{data:a.map(o=>Object.fromEntries(s.map((n,i)=>[n,o[i]]))),columns:s}},zt=t=>{try{const s=t.export(),a=new Blob([s],{type:"application/x-sqlite3"});V.saveAs(a,"database.sqlite")}catch(s){throw console.error("Failed to export database:",s),s}},Bt=(t,s)=>{const a=t.map(o=>`"${o}"`).join(","),r=s.map(o=>t.map(n=>`"${o[n]??""}"`).join(","));return[a,...r].join(`
`)},M=(t,s,a)=>{try{const r=s.exec(t);if(r.length===0)throw new Error(`Query "${t}" returned no results.`);const{data:o,columns:n}=A(r),i=Bt(n,o),u=new Blob([i],{type:"text/csv;charset=utf-8;"});V.saveAs(u,`${a}.csv`)}catch(r){throw console.error(`Failed to get CSV for query "${t}":`,r),r}},Vt=(t,s)=>{const r=I(t)[s],o=`SELECT * FROM "${r}"`;M(o,t,r)},Ut=t=>{I(t).forEach(s=>{const a=`SELECT * FROM "${s}"`;M(a,t,s)})},_t=(t,s)=>{M(s,t,"custom_query")},T=Ge((t,s)=>({db:null,isLoading:!1,queryError:null,tables:[],selectedTable:"0",tableSchemas:{},rowPerPageOrAuto:"auto",isCustomQuery:!1,loadDatabase:async a=>{t({isLoading:!0,queryError:null});try{const r=await Ot(a),o=I(r),n=await Promise.all(o.map(async d=>{const m=r.exec(`SELECT COUNT(*) FROM "${d}"`),f=parseInt(m[0].values[0][0],10),p=await $t(r,d);return{name:d,count:f,schema:p}})),i=n.map(({name:d,count:m})=>({name:d,count:m})),u=n.reduce((d,{name:m,schema:f})=>(d[m]=f,d),{});t({db:r,tables:i,tableSchemas:u,isLoading:!1})}catch(r){console.error("Failed to load database:",r),t({isLoading:!1,queryError:"Failed to load database"})}},query:a=>{const{db:r}=s();return r?r.exec(a):(console.warn("Database is not loaded."),[])},setQueryError:a=>t({queryError:a}),setTables:a=>t({tables:a}),setSelectedTable:a=>t({selectedTable:a}),setTableSchemas:a=>t({tableSchemas:a}),setRowPerPageOrAuto:a=>t({rowPerPageOrAuto:a}),customQuery:"",setIsCustomQuery:a=>t({isCustomQuery:a}),setCustomQuery:a=>t({customQuery:a}),queryHestory:[],setQueryHestory:a=>t({queryHestory:a}),unShiftToQueryHestory:a=>t(r=>({queryHestory:[a,...r.queryHestory]})),expandPage:!1,setExpandPage:a=>t({expandPage:a})}));function Kt(t,s,a,r){const{db:o,setQueryError:n,setIsCustomQuery:i,query:u,unShiftToQueryHestory:d,customQuery:m,setCustomQuery:f}=T(),[p,g]=l.useState([]),[j,b]=l.useState([]),[C,S]=l.useState(!0);l.useEffect(()=>{if(o&&t&&!r){S(!0);const x=`SELECT * FROM "${t}" LIMIT ${s} OFFSET ${a};`;(async()=>{try{const v=u(x),{data:y,columns:R}=A(v);b(R),g(y),n(null),f(x)}catch(v){v instanceof Error&&n(v.message)}finally{S(!1),d(x)}})()}},[o,t,a,s,r,n,u]);const w=l.useCallback(()=>{if(m.trim()===""){n(null);return}S(!0),(async()=>{try{const x=u(m),{data:v,columns:y}=A(x);b(y),g(v),i(!0),n(null)}catch(x){x instanceof Error&&n(x.message)}finally{S(!1)}})()},[m,u,n,i]);return{data:p,columns:j,customQuery:m,setCustomQuery:f,isQueryLoading:C,handleCustomQuery:w}}function Gt(t){const{setIsCustomQuery:s}=T(),[a,r]=l.useState(0);l.useEffect(()=>{r(0),s(!1)},[s]);let o=30;if(t==="auto"){const n=window.innerHeight,i=[{height:1700,rowHeight:65},{height:1300,rowHeight:70},{height:1200,rowHeight:75},{height:1100,rowHeight:75},{height:1e3,rowHeight:80},{height:950,rowHeight:85},{height:900,rowHeight:90},{height:850,rowHeight:95},{height:800,rowHeight:100},{height:750,rowHeight:105},{height:700,rowHeight:110},{height:600,rowHeight:120},{height:550,rowHeight:150},{height:500,rowHeight:190},{height:0,rowHeight:280}];let d=120;for(const m of i)if(n>m.height){d=m.rowHeight;break}o=Math.max(1,Math.floor(n/d))}else o=t;return{page:a,setPage:r,rowsPerPage:o}}function c(...t){return Ye(We(t))}const q=l.forwardRef(({className:t,type:s,...a},r)=>e.jsx("input",{type:s,className:c("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",t),ref:r,...a}));q.displayName="Input";const F=ce("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground hover:bg-destructive/90",outline:"border border-input bg-background hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-10 px-4 py-2",sm:"h-9 rounded-md px-3",lg:"h-11 rounded-md px-8",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}}),h=l.forwardRef(({className:t,variant:s,size:a,asChild:r=!1,...o},n)=>{const i=r?Ze:"button";return e.jsx(i,{className:c(F({variant:s,size:a,className:t})),ref:n,...o})});h.displayName="Button";function Jt({page:t,setPage:s,rowsPerPage:a,rowCount:r}){const o=Math.ceil(r/a),n=Math.floor(t/a)+1,i=()=>{n<o&&s(t+a)},u=()=>{n>1&&s(t-a)};return e.jsx("section",{className:"fixed bottom-[8px] left-0 right-0 z-10 mx-auto w-[270px]",children:e.jsxs("div",{className:"flex justify-between gap-2 rounded border bg-secondary p-[6px]",children:[e.jsx(h,{onClick:u,title:"Previous page",disabled:n===1,children:e.jsx(gt,{className:"h-4 w-4"})}),e.jsxs("span",{className:"flex items-center justify-center text-sm",children:["Page ",n," of ",o]}),e.jsx(h,{onClick:i,title:"Next page",disabled:n>=o,children:e.jsx(bt,{className:"h-4 w-4"})})]})})}const Wt=rt,Yt=ot,Zt=lt,ue=l.forwardRef(({className:t,children:s,...a},r)=>e.jsxs(U,{ref:r,className:c("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",t),...a,children:[s,e.jsx(Xe,{asChild:!0,children:e.jsx(de,{className:"h-4 w-4 opacity-50"})})]}));ue.displayName=U.displayName;const me=l.forwardRef(({className:t,...s},a)=>e.jsx(_,{ref:a,className:c("flex cursor-default items-center justify-center py-1",t),...s,children:e.jsx(yt,{className:"h-4 w-4"})}));me.displayName=_.displayName;const fe=l.forwardRef(({className:t,...s},a)=>e.jsx(K,{ref:a,className:c("flex cursor-default items-center justify-center py-1",t),...s,children:e.jsx(de,{className:"h-4 w-4"})}));fe.displayName=K.displayName;const pe=l.forwardRef(({className:t,children:s,position:a="popper",...r},o)=>e.jsx(et,{children:e.jsxs(G,{ref:o,className:c("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",a==="popper"&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",t),position:a,...r,children:[e.jsx(me,{}),e.jsx(tt,{className:c("p-1",a==="popper"&&"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),children:s}),e.jsx(fe,{})]})}));pe.displayName=G.displayName;const xe=l.forwardRef(({className:t,...s},a)=>e.jsx(J,{ref:a,className:c("py-1.5 pl-8 pr-2 text-sm font-semibold",t),...s}));xe.displayName=J.displayName;const he=l.forwardRef(({className:t,children:s,...a},r)=>e.jsxs(W,{ref:r,className:c("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",t),...a,children:[e.jsx("span",{className:"absolute left-2 flex h-3.5 w-3.5 items-center justify-center",children:e.jsx(st,{children:e.jsx(jt,{className:"h-4 w-4"})})}),e.jsx(at,{children:s})]}));he.displayName=W.displayName;const Xt=l.forwardRef(({className:t,...s},a)=>e.jsx(Y,{ref:a,className:c("-mx-1 my-1 h-px bg-muted",t),...s}));Xt.displayName=Y.displayName;const es=ce("inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground"}},defaultVariants:{variant:"default"}});function ge({className:t,variant:s,...a}){return e.jsx("div",{className:c(es({variant:s}),t),...a})}function ts(){const{tables:t,selectedTable:s,setSelectedTable:a}=T(),r=l.useMemo(()=>{var i;const n=parseInt(s);return isNaN(n)?0:((i=t[n])==null?void 0:i.count)||0},[t,s]),o=l.useMemo(()=>t.map((n,i)=>e.jsx(he,{value:`${i}`,children:n.name},n.name)),[t]);return e.jsxs("section",{className:"flex grow items-center justify-center gap-1",children:[e.jsxs(Wt,{value:s,onValueChange:a,children:[e.jsx(ue,{className:"grow",children:e.jsx(Zt,{placeholder:"Select a table"})}),e.jsx(pe,{children:e.jsxs(Yt,{children:[e.jsx(xe,{children:"Tables"}),o]})})]}),e.jsx(ge,{title:"Rows",className:"min-w-[100px] grow py-2 text-sm md:min-w-[200px]",variant:"outline",children:e.jsx("span",{className:"w-full text-center",children:r})})]})}const be=nt,ye=it,O=l.forwardRef(({className:t,align:s="start",side:a="bottom",sideOffset:r=4,...o},n)=>e.jsx(Z,{ref:n,align:s,side:a,sideOffset:r,className:c("z-50 w-64 text-balance break-words rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",t),...o}));O.displayName=Z.displayName;const je=l.forwardRef(({className:t,...s},a)=>e.jsx("div",{className:"relative w-full overflow-auto",children:e.jsx("table",{ref:a,className:c("w-full caption-bottom text-sm",t),...s})}));je.displayName="Table";const we=l.forwardRef(({className:t,...s},a)=>e.jsx("thead",{ref:a,className:c("[&_tr]:border-b",t),...s}));we.displayName="TableHeader";const Ne=l.forwardRef(({className:t,...s},a)=>e.jsx("tbody",{ref:a,className:c("[&_tr:last-child]:border-0",t),...s}));Ne.displayName="TableBody";const ss=l.forwardRef(({className:t,...s},a)=>e.jsx("tfoot",{ref:a,className:c("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",t),...s}));ss.displayName="TableFooter";const H=l.forwardRef(({className:t,...s},a)=>e.jsx("tr",{ref:a,className:c("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",t),...s}));H.displayName="TableRow";const ve=l.forwardRef(({className:t,...s},a)=>e.jsx("th",{ref:a,className:c("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",t),...s}));ve.displayName="TableHead";const Ce=l.forwardRef(({className:t,children:s,dataType:a,...r},o)=>e.jsx("td",{ref:o,className:c("max-w-[200px] overflow-hidden truncate text-ellipsis whitespace-nowrap p-4 align-middle [&:has([role=checkbox])]:pr-0",t),...r,children:e.jsxs(be,{children:[e.jsx(ye,{asChild:!0,children:e.jsx("span",{className:"cursor-pointer hover:underline",children:s})}),e.jsx(O,{side:"bottom",align:"start",children:e.jsxs("div",{className:"flex flex-col gap-1",children:[a==="BLOB"?e.jsx("span",{className:"max-w-[200px] overflow-hidden truncate text-ellipsis whitespace-nowrap",children:s}):s,a&&e.jsx(ge,{className:"text-xs",children:a})]})})]})}));Ce.displayName="TableCell";const as=l.forwardRef(({className:t,...s},a)=>e.jsx("caption",{ref:a,className:c("mt-4 text-sm text-muted-foreground",t),...s}));as.displayName="TableCaption";const rs=P.memo(({columnSchema:t})=>t!=null&&t.isPrimaryKey?e.jsx(wt,{className:"h-4 w-4"}):t!=null&&t.isForeignKey?e.jsx(Nt,{className:"h-4 w-4"}):(t==null?void 0:t.type)==="BLOB"?e.jsx(vt,{className:"h-4 w-4"}):(t==null?void 0:t.type)==="DATETIME"?e.jsx(Ct,{className:"h-4 w-4"}):null),os=P.memo(({col:t,columnSchema:s})=>e.jsx(ve,{children:e.jsxs(be,{children:[e.jsx(ye,{asChild:!0,children:e.jsx("span",{className:"cursor-pointer hover:underline",children:e.jsxs("div",{className:"flex gap-1",children:[t,e.jsx(rs,{columnSchema:s})]})})}),e.jsx(O,{side:"bottom",align:"start",children:(s==null?void 0:s.type)||"Unknown"})]})})),ls=P.memo(({value:t,dataType:s})=>e.jsx(Ce,{dataType:s,children:t||e.jsx("span",{className:"italic opacity-40",children:"NULL"})}));function ns({data:t,columns:s,tableName:a,tableSchemas:r}){const o=l.useMemo(()=>e.jsx(we,{children:e.jsx(H,{children:s.map((i,u)=>e.jsx(os,{col:i,columnSchema:r[a][i]},u))})}),[s,r,a]),n=l.useMemo(()=>e.jsx(Ne,{children:t.map((i,u)=>e.jsx(H,{children:s.map((d,m)=>{var f;return e.jsx(ls,{value:i[d],dataType:(f=r[a][d])==null?void 0:f.type},m)})},u))}),[t,s,r,a]);return e.jsxs(je,{children:[o,n]})}function Q({children:t}){return e.jsxs("div",{className:"flex items-center justify-center gap-4 rounded border p-4",children:[e.jsx(Rt,{className:"h-6 w-6"}),e.jsx("span",{className:"font-semibold",children:t})]})}function Re({children:t}){return e.jsxs("div",{className:"flex items-center justify-center gap-4 rounded border p-4",children:[e.jsx(St,{className:"h-6 w-6 animate-spin"}),e.jsx("span",{className:"font-semibold",children:t})]})}const is=dt,cs=ut,Se=l.forwardRef(({className:t,align:s="center",sideOffset:a=4,...r},o)=>e.jsx(ct,{children:e.jsx(X,{ref:o,align:s,sideOffset:a,className:c("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",t),...r})}));Se.displayName=X.displayName;function ds(){const{selectedTable:t,tables:s,customQuery:a,db:r}=T(),o=l.useCallback((i,u,d,m)=>e.jsx(h,{className:m,onClick:i,title:d,children:e.jsx("span",{className:"ml-2",children:u})}),[]),n=l.useMemo(()=>{var i;return r&&e.jsxs("div",{className:"flex flex-col gap-1",children:[o(()=>zt(r),"Export as SQLite","Download database as SQLite"),o(()=>Vt(r,parseInt(t)),`Export ${((i=s[parseInt(t)])==null?void 0:i.name)||"selected"} table as CSV`,"Export selected table as CSV"),o(()=>Ut(r),"Export all tables as CSV","Export all tables as CSV"),o(()=>_t(r,a),"Export custom query as CSV","Export the result of the custom query as CSV")]})},[r,o,t,s,a]);return e.jsxs(is,{children:[e.jsx(cs,{asChild:!0,children:e.jsx(h,{title:"Open export options",children:e.jsx(Tt,{className:"h-5 w-5"})})}),e.jsx(Se,{align:"end",className:"w-80",children:n})]})}function us(){const{tables:t,selectedTable:s,tableSchemas:a,queryError:r,setQueryError:o,rowPerPageOrAuto:n,isCustomQuery:i,setIsCustomQuery:u,customQuery:d,setCustomQuery:m,expandPage:f,setExpandPage:p}=T(),{page:g,setPage:j,rowsPerPage:b}=Gt(n),C=l.useMemo(()=>{var E;return(E=t[parseInt(s)])==null?void 0:E.name},[t,s]),S=l.useMemo(()=>{var E;return((E=t[parseInt(s)])==null?void 0:E.count)||0},[t,s]),{data:w,columns:x,isQueryLoading:v,handleCustomQuery:y}=Kt(C,b,g,i),R=l.useCallback(()=>{o(null),m(""),u(!1)},[u,o,m]),k=l.useCallback(()=>{j(0),R()},[R,j]);l.useEffect(()=>{j(0)},[s]);const D=l.useMemo(()=>e.jsxs("div",{className:"flex flex-col gap-2 md:flex-row",children:[e.jsx(q,{type:"text",value:d,onChange:E=>m(E.target.value),placeholder:"Enter your custom query",className:"w-full"}),e.jsxs("div",{className:"flex gap-1",children:[e.jsx(h,{className:"w-full",onClick:y,title:"Run custom query",children:e.jsx(Et,{className:"h-5 w-5"})}),e.jsx(h,{className:"w-full",onClick:R,title:"Reset query",children:e.jsx(Pt,{className:"h-5 w-5"})}),e.jsx(h,{className:"w-full",onClick:k,title:"Reset to first page",disabled:g===0,children:e.jsx(kt,{className:"h-5 w-5"})})]})]}),[d,y,R,k,g]),_e=l.useMemo(()=>v?e.jsxs(Re,{children:["Loading ",C]}):w.length>0?e.jsx("div",{className:"rounded border",children:e.jsx(ns,{data:w,columns:x,tableName:C,tableSchemas:a})}):e.jsx(Q,{children:`Table ${C} is empty`}),[v,w,x,C,a]);return e.jsxs("div",{className:"flex flex-col gap-3 pb-8",children:[e.jsxs("section",{className:"flex flex-col gap-2 rounded border p-3 pb-2",children:[e.jsxs("div",{className:"flex h-full gap-1",children:[e.jsx(ts,{}),e.jsx(h,{className:"ml-1 hidden expand:block",onClick:()=>p(!f),title:"Toggle page size",children:f?e.jsx(Dt,{className:"h-5 w-5"}):e.jsx(Lt,{className:"h-5 w-5"})}),e.jsx(ds,{})]}),D,r&&e.jsx("p",{className:"text-center text-xs capitalize text-red-500",children:r})]}),_e,!i&&e.jsx(Jt,{page:g,setPage:j,rowsPerPage:b,rowCount:S})]})}const Te=({shouldScaleBackground:t=!0,...s})=>e.jsx(N.Root,{shouldScaleBackground:t,...s});Te.displayName="Drawer";const ms=N.Trigger,fs=N.Portal,ps=N.Close,Ee=l.forwardRef(({className:t,...s},a)=>e.jsx(N.Overlay,{ref:a,className:c("fixed inset-0 z-50 bg-black/80",t),...s}));Ee.displayName=N.Overlay.displayName;const Pe=l.forwardRef(({className:t,children:s,...a},r)=>e.jsxs(fs,{children:[e.jsx(Ee,{}),e.jsxs(N.Content,{ref:r,className:c("fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",t),...a,children:[e.jsx("div",{className:"mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted"}),s]})]}));Pe.displayName="DrawerContent";const ke=({className:t,...s})=>e.jsx("div",{className:c("grid gap-1.5 p-4 text-center sm:text-left",t),...s});ke.displayName="DrawerHeader";const De=({className:t,...s})=>e.jsx("div",{className:c("mt-auto flex flex-col gap-2 p-4",t),...s});De.displayName="DrawerFooter";const Le=l.forwardRef(({className:t,...s},a)=>e.jsx(N.Title,{ref:a,className:c("text-lg font-semibold leading-none tracking-tight",t),...s}));Le.displayName=N.Title.displayName;const Ae=l.forwardRef(({className:t,...s},a)=>e.jsx(N.Description,{ref:a,className:c("text-sm text-muted-foreground",t),...s}));Ae.displayName=N.Description.displayName;const He=l.forwardRef(({className:t,children:s,...a},r)=>e.jsxs(ee,{ref:r,className:c("relative overflow-hidden",t),...a,children:[e.jsx(mt,{className:"h-full w-full rounded-[inherit]",children:s}),e.jsx(Qe,{}),e.jsx(ft,{})]}));He.displayName=ee.displayName;const Qe=l.forwardRef(({className:t,orientation:s="vertical",...a},r)=>e.jsx(te,{ref:r,orientation:s,className:c("flex touch-none select-none transition-colors",s==="vertical"&&"h-full w-2.5 border-l border-l-transparent p-[1px]",s==="horizontal"&&"h-2.5 flex-col border-t border-t-transparent p-[1px]",t),...a,children:e.jsx(pt,{className:"relative flex-1 rounded-full bg-border"})}));Qe.displayName=te.displayName;const Ie=l.forwardRef(({className:t,orientation:s="horizontal",decorative:a=!0,...r},o)=>e.jsx(se,{ref:o,decorative:a,orientation:s,className:c("shrink-0 bg-border",s==="horizontal"?"h-[1px] w-full":"h-full w-[1px]",t),...r}));Ie.displayName=se.displayName;const $="rowsPerPage";function xs(){const{setRowPerPageOrAuto:t,setIsCustomQuery:s,queryHestory:a}=T(),[r,o]=l.useState(null),[n,i]=l.useState(!1);l.useEffect(()=>{const f=localStorage.getItem($);if(f)if(f==="auto")i(!0);else{const p=Number(f);o(p),t(p)}},[t]);const u=l.useCallback(f=>{const p=Number(f.target.value);isNaN(p)||(o(p),i(!1))},[]),d=l.useCallback(()=>{i(f=>!f)},[]),m=l.useCallback(()=>{if(s(!1),r===null){L.error("Please provide a number of rows per page or set it to auto.");return}if(r<1){L.error("Please provide a positive number of rows per page.");return}const f=n?"auto":r.toString();localStorage.setItem($,f),t(n?"auto":r)},[r,n,s,t]);return e.jsxs(Te,{children:[e.jsx(ms,{asChild:!0,children:e.jsx(h,{className:"grow",title:"Open settings drawer",children:e.jsx(At,{className:"h-5 w-5"})})}),e.jsx(Pe,{children:e.jsxs("div",{className:"mx-auto w-full max-w-md",children:[e.jsxs(ke,{children:[e.jsx(Le,{children:"Settings"}),e.jsx(Ae,{children:"Personalize your site experience here."})]}),e.jsxs("div",{className:"flex flex-col gap-4 p-4 pb-0",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1 text-sm text-muted-foreground",children:"Rows Per Page"}),e.jsxs("div",{className:"flex items-center justify-center gap-1 rounded border p-2",children:[e.jsx(q,{value:r||"",onChange:u,disabled:n,placeholder:"Number of rows",type:"number",name:"rowsPerPage"}),e.jsx("span",{className:"h-full text-center text-sm text-muted-foreground",children:"OR"}),e.jsx(h,{className:n?"border border-primary":"",onClick:d,title:"Toggle auto rows per page",variant:"outline",children:"Auto Calculate"})]}),e.jsx(h,{className:"mt-2 w-full",onClick:m,title:"Save rows per page settings",variant:"outline",children:e.jsx("span",{children:"Save"})})]}),e.jsxs("div",{children:[e.jsxs("p",{className:"mb-1 text-sm text-muted-foreground",children:["Query History (",a.length,")"]}),e.jsx(He,{className:"h-48 rounded-md border",children:e.jsx("div",{className:"p-4",children:a.map((f,p)=>e.jsxs("div",{children:[e.jsx("div",{className:"text-sm",children:f}),e.jsx(Ie,{className:"my-2"})]},p))})})]})]}),e.jsx(De,{children:e.jsx(ps,{asChild:!0,children:e.jsx(h,{title:"Close settings drawer",variant:"outline",children:"Close"})})})]})})]})}const z="darkMode",B="animate-circular-reveal";function Me(){const[t,s]=l.useState(!1),a=l.useCallback(o=>{s(o),document.body.classList.toggle("dark",o),localStorage.setItem(z,o.toString()),document.body.classList.add(B),setTimeout(()=>{document.body.classList.remove(B)},500)},[]);l.useEffect(()=>{const o=localStorage.getItem(z),n=o!==null?o==="true":window.matchMedia("(prefers-color-scheme: dark)").matches;a(n);const i=d=>{a(d.matches)},u=window.matchMedia("(prefers-color-scheme: dark)");return u.addEventListener("change",i),()=>{u.removeEventListener("change",i)}},[a]);const r=l.useCallback(()=>{a(!t)},[t,a]);return e.jsx(h,{className:"relative grow",onClick:r,title:t?"Enable light mode":"Enable dark mode",children:t?e.jsx(Ht,{className:"h-5 w-5"}):e.jsx(Qt,{className:"h-5 w-5"})})}const hs={"application/vnd.sqlite3":[".sqlite",".sqlite3"],"application/x-sqlite3":[".sqlite",".sqlite3"],"application/octet-stream":[".db"],"application/sql":[".sql"]},gs={CHINOOK:"https://github.com/vwh/sqlite-viewer/raw/main/db_examples/chinook.db"};function bs(){const{loadDatabase:t,setTables:s,setSelectedTable:a,db:r}=T(),[o,n]=l.useState([]),i=l.useCallback(async(p,g)=>{if(n([]),s([]),a("0"),p.length>0&&await t(p[0]),g.length>0){const j=g.flatMap(b=>b.errors);n(j)}},[t,s,a]),{getRootProps:u,getInputProps:d}=Mt({onDrop:i,multiple:!1,accept:hs}),m=l.useCallback(p=>e.jsxs("div",{className:`flex h-full items-center justify-center gap-2 ${p?"px-[10px]":"px-0"}`,children:[e.jsxs("div",{...u(),className:`flex h-full grow cursor-pointer flex-col items-center justify-center rounded border p-6 text-center ${p?"py-0":"py-32"}`,children:[e.jsx("input",{id:"file-upload",...d()}),e.jsx("label",{htmlFor:"file-upload",className:"sr-only",children:"Upload SQLite File"}),e.jsx("p",{className:"hidden sm:block",children:"Drag and drop a SQLite file here, or click to select one"}),e.jsx("p",{className:"block sm:hidden",children:p?"Click to select a file":"Click to select a SQLite file"}),!p&&e.jsx("a",{href:gs.CHINOOK,className:"text-sm text-link hover:underline",title:"Download sample file",children:"Or download & try this sample file"})]}),p&&e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx(Me,{}),e.jsx(xs,{})]})]}),[u,d]),f=l.useMemo(()=>m(!!r),[m,r]);return e.jsxs("section",{children:[f,e.jsx(ys,{errors:o})]})}const ys=P.memo(({errors:t})=>(P.useEffect(()=>{t==null||t.forEach(s=>L(s.message,{position:"bottom-right"}))},[t]),null));function js(){const[t,s]=l.useState(()=>document.body.classList.contains("dark"));return l.useEffect(()=>{const a=new MutationObserver(()=>{s(document.body.classList.contains("dark"))});return a.observe(document.body,{attributes:!0,attributeFilter:["class"]}),()=>a.disconnect()},[]),t}function ws(){const s=js()?"/sqlite-dark.webp":"/sqlite-light.webp";return e.jsx("section",{className:"flex justify-center rounded border py-3",children:e.jsxs("div",{className:"flex flex-col items-center gap-3",children:[e.jsx("img",{id:"logo",title:"SQLite Logo",src:s,alt:"SQLite Logo",width:"170",height:"80",draggable:"false"}),e.jsx("p",{className:"text-sm",children:"View SQLite files in the browser"})]})})}const Ns=ht,vs=xt,qe=l.forwardRef(({className:t,...s},a)=>e.jsx(ae,{className:c("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",t),...s,ref:a}));qe.displayName=ae.displayName;const Fe=l.forwardRef(({className:t,...s},a)=>e.jsxs(vs,{children:[e.jsx(qe,{}),e.jsx(re,{ref:a,className:c("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",t),...s})]}));Fe.displayName=re.displayName;const Oe=({className:t,...s})=>e.jsx("div",{className:c("flex flex-col space-y-2 text-left",t),...s});Oe.displayName="AlertDialogHeader";const $e=({className:t,...s})=>e.jsx("div",{className:c("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",t),...s});$e.displayName="AlertDialogFooter";const ze=l.forwardRef(({className:t,...s},a)=>e.jsx(oe,{ref:a,className:c("text-lg font-semibold",t),...s}));ze.displayName=oe.displayName;const Be=l.forwardRef(({className:t,...s},a)=>e.jsx(le,{ref:a,className:c("text-sm",t),...s}));Be.displayName=le.displayName;const Ve=l.forwardRef(({className:t,...s},a)=>e.jsx(ne,{ref:a,className:c(F(),t),...s}));Ve.displayName=ne.displayName;const Ue=l.forwardRef(({className:t,...s},a)=>e.jsx(ie,{ref:a,className:c(F({variant:"outline"}),"mt-2 sm:mt-0",t),...s}));Ue.displayName=ie.displayName;function Cs({showDialog:t,setShowDialog:s,fn:a}){return e.jsx(Ns,{open:t,onOpenChange:s,children:e.jsxs(Fe,{children:[e.jsxs(Oe,{children:[e.jsx(ze,{children:"Retry using a proxy?"}),e.jsx(Be,{children:"Failed to load the database from the provided URL due to possible CORS restrictions."})]}),e.jsx("div",{className:"text-sm font-semibold",children:"Using the proxy may expose your database to corsproxy.io services."}),e.jsxs($e,{children:[e.jsx(Ue,{onClick:()=>s(!1),children:"Cancel"}),e.jsx(Ve,{onClick:a,children:"Confirm"})]})]})})}const Rs="https://github.com/vwh/sqlite-viewer";function Ss(){return e.jsxs("footer",{className:"flex items-center justify-between rounded border p-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"hidden text-xs sm:block",children:"No file will be uploaded to server. using JavaScript, sql.js"}),e.jsx("p",{className:"block text-xs sm:hidden",children:"No file uploads to server."}),e.jsxs("a",{href:Rs,target:"_blank",className:"flex items-center gap-1 text-sm text-link hover:underline",title:"Star on GitHub",children:[e.jsx(It,{className:"h-4 w-4"}),e.jsx("span",{children:"Star us on GitHub"})]})]}),e.jsx("div",{className:"flex gap-1",children:e.jsx(Me,{})})]})}function Ts(){const{db:t,tables:s,isLoading:a,loadDatabase:r,expandPage:o}=T(),[n,i]=l.useState(null),[u,d]=l.useState(!1),[m,f]=l.useState(null),[p,g]=l.useState(!1),j=l.useRef(!1),b=l.useCallback(async(w,x=!1)=>{if(!/^(https?:\/\/(?:www\.)?[a-zA-Z0-9-]{1,256}\.[a-zA-Z]{2,6}(?:\/[^\s]*)?)$/i.test(w)){i("Invalid URL");return}try{g(!0);const y=x?`https://corsproxy.io/?${encodeURIComponent(w)}`:w,R=await fetch(y);if(!R.ok)throw new Error("URL not found or invalid");const k=await R.blob(),D=new File([k],"database.sqlite");await r(D),i(null)}catch(y){x?i(`Error whilefetching, ${y instanceof Error?y.message:String(y)}`):(f(w),d(!0))}finally{g(!1)}},[r]);l.useEffect(()=>{if(j.current)return;const x=new URLSearchParams(window.location.search).get("url");x&&(b(decodeURIComponent(x)),j.current=!0)},[b]);const C=l.useCallback(()=>{m&&(b(m,!0),d(!1))},[m,b]),S=()=>a||p?e.jsxs(Re,{children:[p?"Fetching":"Loading"," SQLite file"]}):n&&!t?e.jsx(Q,{children:n}):t?s.length>0?e.jsx(us,{}):e.jsx(Q,{children:"Your database is empty, no tables found"}):null;return e.jsxs("main",{className:`mx-auto flex h-screen flex-col gap-3 p-4 ${o?"w-full":"container"}`,children:[!t&&e.jsx(ws,{}),e.jsx(bs,{}),S(),e.jsx(Cs,{showDialog:u,setShowDialog:d,fn:C}),!t&&e.jsx(Ss,{})]})}const Es=({...t})=>e.jsx(qt,{className:"toaster group",toastOptions:{classNames:{toast:"group toast group-[.toaster]:bg-primary group-[.toaster]:text-background group-[.toaster]:border-border group-[.toaster]:shadow-lg",description:"group-[.toast]:text-muted-foreground",actionButton:"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",cancelButton:"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"}},...t});Ke.createRoot(document.getElementById("root")).render(e.jsxs(P.StrictMode,{children:[e.jsx(Ts,{}),e.jsx(Es,{})]}));