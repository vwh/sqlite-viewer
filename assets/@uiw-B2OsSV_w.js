import{_ as V,a as R}from"./@babel-BjXSgPXB.js";import{r as f,j as P}from"./react-DmpIMwDM.js";import{c as J,d as Q,s as X,h as Y,f as Z,a as $,l as ee,b as te,e as ae,g as re,i as oe,j as ie,k as ne,m as ce,E as A,n as se,o as U,p as le,q as fe,r as de,t as ue,u as ge,v as he,w as me,x as be,y as pe,z as w,A as h,B as ye,C as Se,D as ve,S as ke,F as xe,H as Ce}from"./@codemirror-Zs1-mvkz.js";import{a as e}from"./@lezer-DgLl1T_N.js";var j=function(t){t===void 0&&(t={});var{crosshairCursor:a=!1}=t,o=[];t.closeBracketsKeymap!==!1&&(o=o.concat(J)),t.defaultKeymap!==!1&&(o=o.concat(Q)),t.searchKeymap!==!1&&(o=o.concat(X)),t.historyKeymap!==!1&&(o=o.concat(Y)),t.foldKeymap!==!1&&(o=o.concat(Z)),t.completionKeymap!==!1&&(o=o.concat($)),t.lintKeymap!==!1&&(o=o.concat(ee));var r=[];return t.lineNumbers!==!1&&r.push(te()),t.highlightActiveLineGutter!==!1&&r.push(ae()),t.highlightSpecialChars!==!1&&r.push(re()),t.history!==!1&&r.push(oe()),t.foldGutter!==!1&&r.push(ie()),t.drawSelection!==!1&&r.push(ne()),t.dropCursor!==!1&&r.push(ce()),t.allowMultipleSelections!==!1&&r.push(A.allowMultipleSelections.of(!0)),t.indentOnInput!==!1&&r.push(se()),t.syntaxHighlighting!==!1&&r.push(U(le,{fallback:!0})),t.bracketMatching!==!1&&r.push(fe()),t.closeBrackets!==!1&&r.push(de()),t.autocompletion!==!1&&r.push(ue()),t.rectangularSelection!==!1&&r.push(ge()),a!==!1&&r.push(he()),t.highlightActiveLine!==!1&&r.push(me()),t.highlightSelectionMatches!==!1&&r.push(be()),t.tabSize&&typeof t.tabSize=="number"&&r.push(pe.of(" ".repeat(t.tabSize))),r.concat([w.of(o.flat())]).filter(Boolean)},Fe=h.theme({"&":{backgroundColor:"#fff"}},{dark:!1}),Ee=function(t){t===void 0&&(t={});var{indentWithTab:a=!0,editable:o=!0,readOnly:r=!1,theme:s="light",placeholder:l="",basicSetup:u=!0}=t,c=[];switch(a&&c.unshift(w.of([ye])),u&&(typeof u=="boolean"?c.unshift(j()):c.unshift(j(u))),l&&c.unshift(Se(l)),s){case"light":c.push(Fe);break;case"dark":c.push(ve);break;case"none":break;default:c.push(s);break}return o===!1&&c.push(h.editable.of(!1)),r&&c.push(A.readOnly.of(!0)),[...c]},Be=i=>({line:i.state.doc.lineAt(i.state.selection.main.from),lineCount:i.state.doc.lines,lineBreak:i.state.lineBreak,length:i.state.doc.length,readOnly:i.state.readOnly,tabSize:i.state.tabSize,selection:i.state.selection,selectionAsSingle:i.state.selection.asSingle().main,ranges:i.state.selection.ranges,selectionCode:i.state.sliceDoc(i.state.selection.main.from,i.state.selection.main.to),selections:i.state.selection.ranges.map(t=>i.state.sliceDoc(t.from,t.to)),selectedText:i.state.selection.ranges.some(t=>!t.empty)}),G=xe.define(),We=[];function Ne(i){var{value:t,selection:a,onChange:o,onStatistics:r,onCreateEditor:s,onUpdate:l,extensions:u=We,autoFocus:c,theme:m="light",height:C=null,minHeight:b=null,maxHeight:F=null,width:E=null,minWidth:B=null,maxWidth:W=null,placeholder:N="",editable:H=!0,readOnly:K=!1,indentWithTab:L=!0,basicSetup:M=!0,root:I,initialState:v}=i,[p,O]=f.useState(),[n,g]=f.useState(),[y,S]=f.useState(),z=h.theme({"&":{height:C,minHeight:b,maxHeight:F,width:E,minWidth:B,maxWidth:W},"& .cm-scroller":{height:"100% !important"}}),D=h.updateListener.of(d=>{if(d.docChanged&&typeof o=="function"&&!d.transactions.some(q=>q.annotation(G))){var x=d.state.doc,T=x.toString();o(T,d)}r&&r(Be(d))}),_=Ee({theme:m,editable:H,readOnly:K,placeholder:N,indentWithTab:L,basicSetup:M}),k=[D,z,..._];return l&&typeof l=="function"&&k.push(h.updateListener.of(l)),k=k.concat(u),f.useEffect(()=>{if(p&&!y){var d={doc:t,selection:a,extensions:k},x=v?A.fromJSON(v.json,d,v.fields):A.create(d);if(S(x),!n){var T=new h({state:x,parent:p,root:I});g(T),s&&s(T,x)}}return()=>{n&&(S(void 0),g(void 0))}},[p,y]),f.useEffect(()=>O(i.container),[i.container]),f.useEffect(()=>()=>{n&&(n.destroy(),g(void 0))},[n]),f.useEffect(()=>{c&&n&&n.focus()},[c,n]),f.useEffect(()=>{n&&n.dispatch({effects:ke.reconfigure.of(k)})},[m,u,C,b,F,E,B,W,N,H,K,L,M,o,l]),f.useEffect(()=>{if(t!==void 0){var d=n?n.state.doc.toString():"";n&&t!==d&&n.dispatch({changes:{from:0,to:d.length,insert:t||""},annotations:[G.of(!0)]})}},[t,n]),{state:y,setState:S,view:n,setView:g,container:p,setContainer:O}}var He=["className","value","selection","extensions","onChange","onStatistics","onCreateEditor","onUpdate","autoFocus","theme","height","minHeight","maxHeight","width","minWidth","maxWidth","basicSetup","placeholder","indentWithTab","editable","readOnly","root","initialState"],Ke=f.forwardRef((i,t)=>{var{className:a,value:o="",selection:r,extensions:s=[],onChange:l,onStatistics:u,onCreateEditor:c,onUpdate:m,autoFocus:C,theme:b="light",height:F,minHeight:E,maxHeight:B,width:W,minWidth:N,maxWidth:H,basicSetup:K,placeholder:L,indentWithTab:M,editable:I,readOnly:v,root:p,initialState:O}=i,n=V(i,He),g=f.useRef(null),{state:y,view:S,container:z}=Ne({container:g.current,root:p,value:o,autoFocus:C,theme:b,height:F,minHeight:E,maxHeight:B,width:W,minWidth:N,maxWidth:H,basicSetup:K,placeholder:L,indentWithTab:M,editable:I,readOnly:v,selection:r,onChange:l,onStatistics:u,onCreateEditor:c,onUpdate:m,extensions:s,initialState:O});if(f.useImperativeHandle(t,()=>({editor:g.current,state:y,view:S}),[g,z,y,S]),typeof o!="string")throw new Error("value must be typeof string but got "+typeof o);var D=typeof b=="string"?"cm-theme-"+b:"cm-theme";return P.jsx("div",R({ref:g,className:""+D+(a?" "+a:"")},n))});Ke.displayName="CodeMirror";var Le=i=>{var{theme:t,settings:a={},styles:o=[]}=i,r={".cm-gutters":{}},s={};a.background&&(s.backgroundColor=a.background),a.backgroundImage&&(s.backgroundImage=a.backgroundImage),a.foreground&&(s.color=a.foreground),a.fontSize&&(s.fontSize=a.fontSize),(a.background||a.foreground)&&(r["&"]=s),a.fontFamily&&(r["&.cm-editor .cm-scroller"]={fontFamily:a.fontFamily}),a.gutterBackground&&(r[".cm-gutters"].backgroundColor=a.gutterBackground),a.gutterForeground&&(r[".cm-gutters"].color=a.gutterForeground),a.gutterBorder&&(r[".cm-gutters"].borderRightColor=a.gutterBorder),a.caret&&(r[".cm-content"]={caretColor:a.caret},r[".cm-cursor, .cm-dropCursor"]={borderLeftColor:a.caret});var l={};a.gutterActiveForeground&&(l.color=a.gutterActiveForeground),a.lineHighlight&&(r[".cm-activeLine"]={backgroundColor:a.lineHighlight},l.backgroundColor=a.lineHighlight),r[".cm-activeLineGutter"]=l,a.selection&&(r["&.cm-focused .cm-selectionBackground, & .cm-line::selection, & .cm-selectionLayer .cm-selectionBackground, .cm-content ::selection"]={background:a.selection+" !important"}),a.selectionMatch&&(r["& .cm-selectionMatch"]={backgroundColor:a.selectionMatch});var u=h.theme(r,{dark:t==="dark"}),c=Ce.define(o),m=[u,U(c)];return m},Me={background:"#2e3440",foreground:"#FFFFFF",caret:"#FFFFFF",selection:"#00000073",selectionMatch:"#00000073",gutterBackground:"#2e3440",gutterForeground:"#4c566a",gutterActiveForeground:"#d8dee9",lineHighlight:"#4c566a29"},Oe=[{tag:e.keyword,color:"#5e81ac"},{tag:[e.name,e.deleted,e.character,e.propertyName,e.macroName],color:"#88c0d0"},{tag:[e.variableName],color:"#8fbcbb"},{tag:[e.function(e.variableName)],color:"#8fbcbb"},{tag:[e.labelName],color:"#81a1c1"},{tag:[e.color,e.constant(e.name),e.standard(e.name)],color:"#5e81ac"},{tag:[e.definition(e.name),e.separator],color:"#a3be8c"},{tag:[e.brace],color:"#8fbcbb"},{tag:[e.annotation],color:"#d30102"},{tag:[e.number,e.changed,e.annotation,e.modifier,e.self,e.namespace],color:"#b48ead"},{tag:[e.typeName,e.className],color:"#ebcb8b"},{tag:[e.operator,e.operatorKeyword],color:"#a3be8c"},{tag:[e.tagName],color:"#b48ead"},{tag:[e.squareBracket],color:"#bf616a"},{tag:[e.angleBracket],color:"#d08770"},{tag:[e.attributeName],color:"#ebcb8b"},{tag:[e.regexp],color:"#5e81ac"},{tag:[e.quote],color:"#b48ead"},{tag:[e.string],color:"#a3be8c"},{tag:e.link,color:"#a3be8c",textDecoration:"underline",textUnderlinePosition:"under"},{tag:[e.url,e.escape,e.special(e.string)],color:"#8fbcbb"},{tag:[e.meta],color:"#88c0d0"},{tag:[e.monospace],color:"#d8dee9",fontStyle:"italic"},{tag:[e.comment],color:"#4c566a",fontStyle:"italic"},{tag:e.strong,fontWeight:"bold",color:"#5e81ac"},{tag:e.emphasis,fontStyle:"italic",color:"#5e81ac"},{tag:e.strikethrough,textDecoration:"line-through"},{tag:e.heading,fontWeight:"bold",color:"#5e81ac"},{tag:e.special(e.heading1),fontWeight:"bold",color:"#5e81ac"},{tag:e.heading1,fontWeight:"bold",color:"#5e81ac"},{tag:[e.heading2,e.heading3,e.heading4],fontWeight:"bold",color:"#5e81ac"},{tag:[e.heading5,e.heading6],color:"#5e81ac"},{tag:[e.atom,e.bool,e.special(e.variableName)],color:"#d08770"},{tag:[e.processingInstruction,e.inserted],color:"#8fbcbb"},{tag:[e.contentSeparator],color:"#ebcb8b"},{tag:e.invalid,color:"#434c5e",borderBottom:"1px dotted #d30102"}],Te=i=>{var{theme:t="dark",settings:a={},styles:o=[]}={};return Le({theme:t,settings:R({},Me,a),styles:[...Oe,...o]})},je=Te();export{Ke as R,je as n};
