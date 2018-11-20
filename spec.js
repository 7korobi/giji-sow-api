!function(e){var t={};function o(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,o),i.l=!0,i.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)o.d(n,i,function(t){return e[t]}.bind(null,i));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=12)}([function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("lodash")},function(e,t){e.exports=require("express")},function(e,t,o){var n,i;n=o(4),i=o(5),e.exports=function(e,t){return e.use(i("dev")),e.use(n.json()),e.use(function(e,t,o){return t.header("Access-Control-Allow-Origin","*"),t.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept"),o()})}},function(e,t){e.exports=require("body-parser")},function(e,t){e.exports=require("morgan")},function(e,t,o){var n,i,a,s,r;s=o(7),r=o(8),i=o(0),n=o(1),a={},e.exports=function(e,{url:t,db:o}){o.mongo_sow&&(s.connect(o.mongo_sow).then(function(e){return function(e,t){return console.log(e,t)},a.find=function(t,o,n){return e.collection(t,{ObjectId:!1}).find(o,n)},a.aggregate_message=function(){var t,o;return o=function(t,o,...n){return e.collection(t,{ObjectId:!1}).remove({}).then(function(){return e.collection("message_by_story_for_face",{ObjectId:!1}).aggregate([{$sort:{date_min:1}},{$group:{_id:o,date:{$min:"$date_min"}}},{$out:`${t}_date_mins`}],{ObjectId:!1})}).then(function(t){return Promise.all(t.map(function({_id:t,date:o}){var n,i,a;return({story_id:a,face_id:n,mestype:i}=t),e.collection("messags",{ObjectId:!1}).find({story_id:a,face_id:n,date:o}).then(function(e){return e.q=t,e})}))}).then(function(o){return e.collection(t,{ObjectId:!1}).insert(o)})},t=function(t,o,...n){return e.collection("message_by_story_for_face",{ObjectId:!1}).aggregate([...n,{$group:{_id:o,date_min:{$min:"$date_min"},date_max:{$max:"$date_max"},max:{$max:"$max"},all:{$sum:"$all"},count:{$sum:"$count"},story_ids:{$addToSet:"$_id.story_id"}}},{$out:t}],{ObjectId:!1})},Promise.all([t("message_for_face",{face_id:"$_id.face_id"}),t("message_for_face_sow_auth",{face_id:"$_id.face_id",sow_auth_id:"$_id.sow_auth_id"}),t("message_for_face_mestype",{face_id:"$_id.face_id",mestype:"$_id.mestype"}),o("message_firsts_for_story_face_mestype",{story_id:"$_id.story_id",face_id:"$_id.face_id",mestype:"$_id.mestype"})])},a.aggregate_potof=function(){var t;return t=function(t,o,n,...i){return e.collection("potofs",{ObjectId:!1}).aggregate([...i,{$match:{story_id:{$exists:1,$nin:o},sow_auth_id:{$exists:1,$nin:[null,"master","admin","a1","a2","a3","a4","a5","a6","a7","a8","a9"]},face_id:{$exists:1,$ne:null}}},{$group:{_id:n,date_min:{$min:"$timer.entrieddt"},date_max:{$max:"$timer.entrieddt"},story_ids:{$addToSet:"$story_id"}}},{$out:t}],{ObjectId:!1})},a.find("stories",{is_finish:!1},{_id:1}).then(function(e){var o;return o=e.map(function({_id:e}){return e}),console.log(o,"is progress (deny)."),Promise.all([t("potof_for_face",o,{face_id:"$face_id"}),t("potof_for_face_live",o,{face_id:"$face_id",live:"$live"}),t("potof_for_face_sow_auth",o,{face_id:"$face_id",sow_auth_id:"$sow_auth_id"}),t("potof_for_face_role",o,{face_id:"$face_id",role_id:"$role"},{$unwind:"$role"})])})},a.aggregate_max=function(){return e.collection("potof_for_face_sow_auth_max",{ObjectId:!1}).remove({}).then(function(){return e.collection("potof_for_face_sow_auth",{ObjectId:!1}).aggregate([{$project:{_id:1,count:{$size:"$story_ids"}}},{$group:{_id:{face_id:"$_id.face_id"},count:{$max:"$count"}}}],{ObjectId:!1})}).then(function(e){return Promise.all(e.map(function(e){return a.find("potof_for_face_sow_auth",{"_id.face_id":e._id.face_id,story_ids:{$size:e.count}}).then(function(t){var o;return[o]=n.sortBy(t,function(e){return e.date_min}),e.date_min=o.date_min,e.date_max=o.date_max,e._id=o._id,e})}))}).then(function(t){return e.collection("potof_for_face_sow_auth_max",{ObjectId:!1}).insert(t)})},a.oldlog=function(){return e.collection("stories",{ObjectId:!1}).aggregate([{$match:{is_finish:{$eq:!0}}},{$project:{_id:1}},{$group:{_id:null,story_ids:{$addToSet:"$_id"}}}],{ObjectId:!1}).then(function([e]){var o,n,a,s;return o=function(){var o,i,r,c;for(c=[],o=0,i=(r=e.story_ids).length;o<i;o++)a=r[o],n=`./static/sow/${a}.json.gz`,s=`${t.api}/story/oldlog/${a}`,c.push(`  ls "${n}" || curl "${s}" | gzip --stdout --best > "${n}"  `);return c}(),n="./static/sow/index.json.gz",s=`${t.api}/story/oldlog`,o.push(` curl "${s}" | gzip --stdout --best > "${n}"  `),n="./static/aggregate/faces/index.json.gz",s=`${t.api}/aggregate/faces`,o.push(` curl "${s}" | gzip --stdout --best > "${n}"  `),o.push(" npm run gulp amazon:gz "),i.writeFile("./static/sow.sh",o.join("\n"),function(e){return e?console.error(e):(console.log("write."),i.chmod("./static/sow.sh",511,function(e){return e?console.error(e):(console.log("chmod."),r.exec("./static/sow.sh",function(e,t,o){return e?console.error(e):console.log(o)}))}))}),!1})},a.scan=function(){return e.collection("message_by_story_for_face",{ObjectId:!1}).aggregate([{$group:{_id:null,story_ids:{$addToSet:"$_id.story_id"}}}],{ObjectId:!1}).then(function([t]){var o,n;return o=null!=(n=null!=t?t.story_ids:void 0)?n:[],e.collection("stories",{ObjectId:!1}).aggregate([{$match:{_id:{$nin:o},is_finish:{$eq:!0}}},{$project:{_id:1}},{$group:{_id:null,story_ids:{$addToSet:"$_id"}}}],{ObjectId:!1})}).then(function([e]){var t,o,n,i;return o=null!=(n=null!=e?e.story_ids:void 0)?n:[],console.log("step B"),console.log(o),i=function(){var e,n,i;for(i=[],e=0,n=o.length;e<n;e++)t=o[e],i.push(a.set_base(t));return i}(),Promise.all(i)})},a.set_base=function(t){return e.collection("messages",{ObjectId:!1}).aggregate([{$match:{story_id:t,sow_auth_id:{$exists:1,$ne:null},face_id:{$exists:1,$ne:null},logid:{$exists:1,$ne:null},log:{$exists:1,$ne:null}}},{$project:{sow_auth_id:1,story_id:1,face_id:1,logid:1,date:1,size:{$strLenCP:"$log"}}},{$group:{_id:{sow_auth_id:"$sow_auth_id",story_id:"$story_id",face_id:"$face_id",mestype:{$substr:["$logid",0,2]}},date_min:{$min:"$date"},date_max:{$max:"$date"},max:{$max:"$size"},all:{$sum:"$size"},count:{$sum:1}}}],{ObjectId:!1}).then(function(t){return e.collection("message_by_story_for_face").insert(t)})}}).catch(function(){return console.log("!!! mongodb connect error !!!")}),e.get("/api/aggregate/job",function(e,t,o){return a.scan().then(function(){return a.aggregate_message()}).then(function(){return a.aggregate_potof()}).then(function(){return a.aggregate_max()}).then(function(){return a.oldlog()}).then(function(){return t.json({started:!0}),o()}).catch(function(e){return t.json(e),o()})}),e.get("/api/aggregate/faces",function(e,t,o){var n;return n={},Promise.all([a.find("message_for_face",n),a.find("potof_for_face",n),a.find("potof_for_face_sow_auth_max",n)]).then(function([e,n,i]){return t.json({m_faces:e,faces:n,sow_auths:i}),o()}).catch(function(t){return console.error(e,t),o()})}),e.get("/api/aggregate/faces/:id",function(e,t,o){var n,i;return({id:n}=e.params),i={"_id.face_id":n},Promise.all([a.find("message_for_face",i),a.find("message_for_face_mestype",i),a.find("message_for_face_sow_auth",i),a.find("potof_for_face",i),a.find("potof_for_face_role",i),a.find("potof_for_face_live",i)]).then(function([e,n,i,a,s,r]){return t.json({m_faces:e,mestypes:n,sow_auths:i,faces:a,roles:s,lives:r}),o()}).catch(function(t){return console.error(e,t),o()})}),e.get("/api/plan/progress",function(e,t,o){var n;return n={state:{$in:[null,/議事/]}},a.find("sow_village_plans",n).then(function(e){return t.json({plans:e}),o()}).catch(function(t){return console.error(e,t),o()})}),e.get("/api/story/progress",function(e,t,o){var n,i,s;return s={is_epilogue:!1,is_finish:!1},n={comment:0,password:0},i={},a.find("stories",s,n).then(function(e){return i.stories=e,e.map(function(e){return`${e._id}-0`})}).then(function(e){return a.find("events",{_id:{$in:e}})}).then(function(e){return i.events=e}).then(function(){return t.json(i),o()}).catch(function(t){return console.error(e,t),o()})}),e.get("/api/story/oldlog",function(e,t,o){var n,i;return i={is_epilogue:!0,is_finish:!0},n={comment:0,password:0},Promise.all([a.find("stories",i,n),a.find("potof_for_face",{})]).then(function([e,n]){return t.json({stories:e,faces:n}),o()}).catch(function(t){return console.error(e,t),o()})}),e.get("/api/story/oldlog/:story_id",function(e,t,o){var n,i;return({story_id:i}=e.params),n={password:0},Promise.all([a.find("stories",{_id:i,is_epilogue:!0,is_finish:!0},n),a.find("messages",{story_id:i}),a.find("events",{story_id:i}),a.find("potofs",{story_id:i})]).then(function([e,n,i,a]){return e.length||(n=i=a=[]),t.json({stories:e,messages:n,events:i,potofs:a}),o()}).catch(function(t){return console.error(e,t),o()})}))}},function(e,t){e.exports=require("mongodb-bluebird")},function(e,t){e.exports=require("child_process")},,,,function(e,t,o){var n,i,a,s,r,c,d,u,l,_;l=o(13),r=o(2),u=o(14),c=o(0),s=o(15).load(c.readFileSync("./config/spec.yml","UTF-8")),_={_id:"local-test-user",provider:"local-test",icon:"https://s3-ap-northeast-1.amazonaws.com/giji-assets/images/portrate/w52.jpg",mail:"7korobi.sys@gmail.com",nick:"テスト中",sign:"SIGN.SPEC",write_at:new Date-0,token:"DEADBEEF",account:"user"},n=o(1),a=function(e){return e.match=function(e,t){var o;return(o=[e]).index=0,o.input=e,this.deepEqual(o,e.match(t))},e.deepContain=function(e,t){return t=n.mergeWith(t,e,function(e,t){switch(null!=e?e.constructor:void 0){case null:case void 0:return t;case Array:case Object:return;default:return e}}),this.deepEqual(e,t)}},i=r(),o(3)(i,s),o(6)(i,s),i.post("/test/session",function(e,t,o){var n,i;return null==(n=e.session).passport&&(n.passport={}),null==(i=e.session.passport).user&&(i.user=_),t.json(e.session.passport)}),d=u.agent(i),o(16)(i,{test:l,bless:a,http:d}),o(17)(i,{test:l,bless:a,http:d}),o(18)(i,{test:l,bless:a,http:d})},function(e,t){e.exports=require("ava")},function(e,t){e.exports=require("supertest")},function(e,t){e.exports=require("js-yaml")},function(e,t){var o;o={sign:"公開サイン"},e.exports=function(e,{test:t,http:n,bless:i}){return t.serial("post api/user fail.",async function(e){var t;return await n.post("/logout"),({text:t}=await n.post("/api/user").send({user:{sign:"公開サイン"}})),i(e),e.deepContain(JSON.parse(t),{message:"ログインしていません。"})}),t.serial("post api/user",async function(e){var t;return await n.post("/test/session"),({text:t}=await n.post("/api/user").send({user:o})),i(e),e.deepContain(JSON.parse(t),{user:o})}),t("get /auth/google/callback.",async function(e){var t,o;return({redirect:o,header:{location:t}}=await n.get("/auth/google/callback")),i(e),e.is(o,!0),e.match(t,/https:\/\/accounts.google.com\/o\/oauth2\/v2\/auth\?response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A\d\d\d\d\d%2Fauth%2Fgoogle%2Fundefined%2Fauth%2Fgoogle%2Fcallback&client_id=TEST-CLIENT-ID/)}),t("get /auth/facebook/callback.",async function(e){var t,o;return({redirect:o,header:{location:t}}=await n.get("/auth/facebook/callback")),i(e),e.is(o,!0),e.match(t,/https:\/\/www.facebook.com\/dialog\/oauth\?response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A\d\d\d\d\d%2Fauth%2Ffacebook%2Fundefined%2Fauth%2Ffacebook%2Fcallback&client_id=TEST-CLIENT-ID/)})}},function(e,t){e.exports=function(e,{test:t,http:o,bless:n}){return t.serial("post api/books",async function(e){var t,i,a;return await o.post("/test/session"),({book:t,potof:i}={book:{label:"testcase",chat:{interval:"1d",night:"0",player:4,mob:0},game:{vote:"sign",vote_by:["live"]},tag_ids:["god","travel"],option:["vote_by_live"]},potof:{_id:"test-1-NPC",face_id:"sf10",job:"保安技師",sign:"公開サイン"},chats:[{idx:"welcome"},{idx:"vrule",log:"1. 多重ログインをしない。\n2. システムの出力内容を、そのまま書き写さない。\n3. エピローグまで秘密を守る。参加中の村の内容は秘密だ。\n4. エピローグまで秘密を守る。希望した能力、画面を見ているきみが何者なのかは秘密だ。"}],part:{_id:"test-1-1",idx:"1",label:"一日目"}}),({text:a}=await o.post("/api/books").type("json").send({book:t,potof:i})),n(e),e.deepContain(JSON.parse(a),{book:{label:"testcase",chat:{interval:"1d",night:"0",player:4,mob:0},game:{vote:"sign",vote_by:["live"]},tag_ids:["god","travel"],option:["vote_by_live"]},potof:{idx:"NPC",face_id:"sf10",job:"保安技師",sign:"公開サイン"},part:{idx:"0",label:"プロローグ"},phases:[{idx:"BM",handle:"MAKER",update:!0},{idx:"MM",handle:"SSAY",update:!0},{idx:"TM",handle:"private",update:!1},{idx:"SM",handle:"public",update:!1},{idx:"TS",handle:"TSAY",update:!1},{idx:"Aim",handle:"AIM",update:!1},{idx:"SS",handle:"SSAY",update:!1},{idx:"VS",handle:"VSAY",update:!1}],chats:[{idx:"welcome"},{idx:"nrule"},{idx:"vrule"},{idx:"0"}]})}),t("post api/books/:book_id",async function(e){var t,i,a;return({book:t,potof:i}={book:{label:"testcase",chat:{interval:"1d",night:"0",player:4,mob:0},game:{vote:"sign",vote_by:["live"]},tag_ids:["god","travel"],option:["vote_by_live"]},potof:{_id:"test-1-NPC",face_id:"sf10",job:"保安技師",sign:"公開サイン"},chats:[{idx:"welcome"},{idx:"vrule",log:"1. 多重ログインをしない。\n2. システムの出力内容を、そのまま書き写さない。\n3. エピローグまで秘密を守る。参加中の村の内容は秘密だ。\n4. エピローグまで秘密を守る。希望した能力、画面を見ているきみが何者なのかは秘密だ。"}],part:{_id:"test-1-1",idx:"1",label:"一日目"}}),({text:a}=await o.post("/api/books/test-1").type("json").send({book:t,potof:i})),n(e),e.deepContain(JSON.parse(a),{book:{label:"testcase",chat:{interval:"1d",night:"0",player:4,mob:0},game:{vote:"sign",vote_by:["live"]},tag_ids:["god","travel"],option:["vote_by_live"]},potof:{_id:"test-1-NPC",face_id:"sf10",job:"保安技師",sign:"公開サイン"},phases:[{_id:"test-1-0-BM",idx:"BM"},{_id:"test-1-0-MM",idx:"MM"}],chats:[{_id:"test-1-0-BM-welcome",idx:"welcome"},{_id:"test-1-0-BM-nrule",idx:"nrule"},{_id:"test-1-0-BM-vrule",idx:"vrule"}]})}),t("post api/books/:book_id/part",async function(e){var t,i;return({part:t}={book:{label:"testcase",chat:{interval:"1d",night:"0",player:4,mob:0},game:{vote:"sign",vote_by:["live"]},tag_ids:["god","travel"],option:["vote_by_live"]},potof:{_id:"test-1-NPC",face_id:"sf10",job:"保安技師",sign:"公開サイン"},chats:[{idx:"welcome"},{idx:"vrule",log:"1. 多重ログインをしない。\n2. システムの出力内容を、そのまま書き写さない。\n3. エピローグまで秘密を守る。参加中の村の内容は秘密だ。\n4. エピローグまで秘密を守る。希望した能力、画面を見ているきみが何者なのかは秘密だ。"}],part:{_id:"test-1-1",idx:"1",label:"一日目"}}),({text:i}=await o.post("/api/books/test-1/part").type("json").send({part:t})),n(e),e.deepContain(JSON.parse(i),{part:{_id:"test-1-1",idx:"1",label:"一日目"},phases:[{idx:"TM",handle:"private",update:!1},{idx:"SM",handle:"public",update:!1},{idx:"TS",handle:"TSAY",update:!1},{idx:"Aim",handle:"AIM",update:!1},{idx:"SS",handle:"SSAY",update:!1},{idx:"VS",handle:"VSAY",update:!1}],chats:[{idx:"0"}]})}),t("get api/books",async function(e){var t,i,a,s,r,c;for(({text:c}=await o.get("/api/books")),n(e),r=[],i=0,a=(s=JSON.parse(c).books).length;i<a;i++)t=s[i],r.push(e.deepContain(t,{label:"testcase",chat:{interval:"1d",night:"0",player:4,mob:0},game:{vote:"sign",vote_by:["live"]},tag_ids:["god","travel"],option:["vote_by_live"]}));return r}),t("get api/books/:book_id",async function(e){var t;return({text:t}=await o.get("/api/books/test-1")),n(e),e.deepContain(JSON.parse(t),{book:{label:"testcase",chat:{interval:"1d",night:"0",player:4,mob:0},game:{vote:"sign",vote_by:["live"]},tag_ids:["god","travel"],option:["vote_by_live"]},potofs:[],stats:[],cards:[],parts:[],phases:[]})}),t("get api/books/:book_id/chats",async function(e){var t;return({text:t}=await o.get("/api/books/test-1/chats")),n(e),e.deepContain(JSON.parse(t),{chats:[]})})}},function(e,t){e.exports=function(e,{test:t,http:o,bless:n}){return t("post api/books/test-1/potof.",async function(e){var t,i;return await o.post("/test/session"),({potof:t}={potof:{face_id:"sf10",job:"保安技師",sign:"公開サイン"},part:{_id:"test-1-1",idx:"1",label:"一日目"}}),({text:i}=await o.post("/api/books/test-1/potof").type("json").send({potof:t,phase_id:"test-1-1-SSAY"})),n(e),e.deepContain(JSON.parse(i),{stat:{idx:"SSAY",give:0,sw:!1},card:{idx:"request",role_id:null},chat:{}},t)})}}]);
//# sourceMappingURL=spec.js.map