!function(e){var t={};function o(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=9)}([function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("lodash")},function(e,t){e.exports=require("express")},function(e,t,o){var n,r;n=o(4),r=o(5),e.exports=function(e,t){return e.use(r("dev")),e.use(n.json()),e.use(function(e,t,o){return t.header("Access-Control-Allow-Origin","*"),t.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept"),o()})}},function(e,t){e.exports=require("body-parser")},function(e,t){e.exports=require("morgan")},function(e,t,o){var n,r,i,s,a;s=o(7),a=o(8),r=o(0),n=o(1),i={},e.exports=function(e,{url:t,db:o}){o.mongo_sow&&(s.connect(o.mongo_sow).then(function(e){return function(e,t){return console.log(e,t)},i.find=function(t,o,n){return e.collection(t,{ObjectId:!1}).find(o,n)},i.aggregate_message=function(){var t,o;return o=function(t,o,...n){return e.collection(t,{ObjectId:!1}).remove({}).then(function(){return e.collection("message_by_story_for_face",{ObjectId:!1}).aggregate([{$sort:{date_min:1}},{$group:{_id:o,date:{$min:"$date_min"}}},{$out:`${t}_date_mins`}],{ObjectId:!1})}).then(function(t){return Promise.all(t.map(function({_id:t,date:o}){var n,r,i;return({story_id:i,face_id:n,mestype:r}=t),console.log({c:"messages",story_id:i,face_id:n,date:o}),e.collection("messags",{ObjectId:!1}).find({story_id:i,face_id:n,date:o}).then(function(e){return e.q=t,e})}))}).then(function(r){if(console.log({out:t,keys:o,ext:n,data_size:r.length}),r.length)return e.collection(t,{ObjectId:!1}).insert(r)})},t=function(t,o,...n){return e.collection("message_by_story_for_face",{ObjectId:!1}).aggregate([...n,{$group:{_id:o,date_min:{$min:"$date_min"},date_max:{$max:"$date_max"},max:{$max:"$max"},all:{$sum:"$all"},count:{$sum:"$count"},story_ids:{$addToSet:"$_id.story_id"}}},{$out:t}],{ObjectId:!1})},Promise.all([t("message_for_face",{face_id:"$_id.face_id"}),t("message_for_face_sow_auth",{face_id:"$_id.face_id",sow_auth_id:"$_id.sow_auth_id"}),t("message_for_face_mestype",{face_id:"$_id.face_id",mestype:"$_id.mestype"}),o("message_firsts_for_story_face_mestype",{story_id:"$_id.story_id",face_id:"$_id.face_id",mestype:"$_id.mestype"})])},i.aggregate_potof=function(){var t;return t=function(t,o,n,...r){return e.collection("potofs",{ObjectId:!1}).aggregate([...r,{$match:{story_id:{$exists:1,$nin:o},sow_auth_id:{$exists:1,$nin:[null,"master","admin","a1","a2","a3","a4","a5","a6","a7","a8","a9"]},face_id:{$exists:1,$ne:null}}},{$group:{_id:n,date_min:{$min:"$timer.entrieddt"},date_max:{$max:"$timer.entrieddt"},story_ids:{$addToSet:"$story_id"}}},{$out:t}],{ObjectId:!1}).then(function(){return console.log({out:t,keys:n,ext:r,story_ids:o})})},i.find("stories",{is_finish:!1},{_id:1}).then(function(e){var o;return o=e.map(function({_id:e}){return e}),console.log(o,"is progress (deny)."),Promise.all([t("potof_for_face",o,{face_id:"$face_id"}),t("potof_for_face_live",o,{face_id:"$face_id",live:"$live"}),t("potof_for_face_sow_auth",o,{face_id:"$face_id",sow_auth_id:"$sow_auth_id"}),t("potof_for_face_role",o,{face_id:"$face_id",role_id:"$role"},{$unwind:"$role"})])})},i.aggregate_max=function(){return e.collection("potof_for_face_sow_auth_max",{ObjectId:!1}).remove({}).then(function(){return e.collection("potof_for_face_sow_auth",{ObjectId:!1}).aggregate([{$project:{_id:1,count:{$size:"$story_ids"}}},{$group:{_id:{face_id:"$_id.face_id"},count:{$max:"$count"}}}],{ObjectId:!1})}).then(function(e){return Promise.all(e.map(function(e){return i.find("potof_for_face_sow_auth",{"_id.face_id":e._id.face_id,story_ids:{$size:e.count}}).then(function(t){var o;return[o]=n.sortBy(t,function(e){return e.date_min}),e.date_min=o.date_min,e.date_max=o.date_max,e._id=o._id,e})}))}).then(function(t){return console.log(`potof_for_face_sow_auth_max insert ${t.length} data.`),e.collection("potof_for_face_sow_auth_max",{ObjectId:!1}).insert(t)})},i.oldlog=function(){return e.collection("stories",{ObjectId:!1}).aggregate([{$match:{is_finish:{$eq:!0}}},{$project:{_id:1}},{$group:{_id:null,story_ids:{$addToSet:"$_id"}}}],{ObjectId:!1}).then(function([e]){var o,n,i,s;return o=function(){var o,r,a,c;for(c=[],o=0,r=(a=e.story_ids).length;o<r;o++)i=a[o],n=`./static/sow/${i}.json.gz`,s=`${t.api}/story/oldlog/${i}`,c.push(`  ls "${n}" || curl "${s}" | gzip --stdout --best > "${n}"  `);return c}(),n="./static/sow/index.json.gz",s=`${t.api}/story/oldlog`,o.push(` curl "${s}" | gzip --stdout --best > "${n}"  `),n="./static/aggregate/faces/index.json.gz",s=`${t.api}/aggregate/faces`,o.push(` curl "${s}" | gzip --stdout --best > "${n}"  `),o.push(" npm run gulp amazon:gz "),r.writeFile("./static/sow.sh",o.join("\n"),function(e){return e?console.error(e):(console.log("write."),r.chmod("./static/sow.sh",511,function(e){return e?console.error(e):(console.log("chmod."),a.exec("./static/sow.sh",function(e,t,o){return e?console.error(e):console.log(o)}))}))}),!1})},i.scan=function(){return e.collection("message_by_story_for_face",{ObjectId:!1}).aggregate([{$group:{_id:null,story_ids:{$addToSet:"$_id.story_id"}}}],{ObjectId:!1}).then(function([t]){var o,n;return o=null!=(n=null!=t?t.story_ids:void 0)?n:[],e.collection("stories",{ObjectId:!1}).aggregate([{$match:{_id:{$nin:o},is_finish:{$eq:!0}}},{$project:{_id:1}},{$group:{_id:null,story_ids:{$addToSet:"$_id"}}}],{ObjectId:!1})}).then(function([e]){var t,o,n,r;return o=null!=(n=null!=e?e.story_ids:void 0)?n:[],console.log("step B"),console.log(o),r=function(){var e,n,r;for(r=[],e=0,n=o.length;e<n;e++)t=o[e],r.push(i.set_base(t));return r}(),Promise.all(r)})},i.set_base=function(t){return console.log(`step for ${t}`),e.collection("messages",{ObjectId:!1}).aggregate([{$match:{story_id:t,sow_auth_id:{$exists:1,$ne:null},face_id:{$exists:1,$ne:null},logid:{$exists:1,$ne:null},log:{$exists:1,$ne:null}}},{$project:{sow_auth_id:1,story_id:1,face_id:1,logid:1,date:1,size:{$strLenCP:"$log"}}},{$group:{_id:{sow_auth_id:"$sow_auth_id",story_id:"$story_id",face_id:"$face_id",mestype:{$substr:["$logid",0,2]}},date_min:{$min:"$date"},date_max:{$max:"$date"},max:{$max:"$size"},all:{$sum:"$size"},count:{$sum:1}}}],{ObjectId:!1}).then(function(o){return o.length?e.collection("message_by_story_for_face").insert(o):console.log(`${t} for message_by_story_for_face size 0.`)})}}).catch(function(){return console.log("!!! mongodb connect error !!!")}),e.get("/api/aggregate/job",function(e,t,o){return i.scan().then(function(){return i.aggregate_message()}).then(function(){return i.aggregate_potof()}).then(function(){return i.aggregate_max()}).then(function(){return i.oldlog()}).then(function(){return t.json({started:!0}),o()}).catch(function(e){return t.json(e),o()})}),e.get("/api/aggregate/faces",function(e,t,o){var n;return n={},Promise.all([i.find("message_for_face",n),i.find("potof_for_face",n),i.find("potof_for_face_sow_auth_max",n)]).then(function([e,n,r]){return t.json({m_faces:e,faces:n,sow_auths:r}),o()}).catch(function(t){return console.error(e,t),o()})}),e.get("/api/aggregate/faces/:id",function(e,t,o){var n,r;return({id:n}=e.params),r={"_id.face_id":n},Promise.all([i.find("message_for_face",r),i.find("message_for_face_mestype",r),i.find("message_for_face_sow_auth",r),i.find("potof_for_face",r),i.find("potof_for_face_role",r),i.find("potof_for_face_live",r)]).then(function([e,n,r,i,s,a]){return t.json({m_faces:e,mestypes:n,sow_auths:r,faces:i,roles:s,lives:a}),o()}).catch(function(t){return console.error(e,t),o()})}),e.get("/api/plan/progress",function(e,t,o){var n;return 432e7,n=new Date(new Date-432e7),i.find("sow_village_plans",{write_at:{$gte:n},state:{$in:[null,/議事/]}}).then(function(e){return t.json({plans:e}),o()}).catch(function(t){return console.error(e,t),o()})}),e.get("/api/story/progress",function(e,t,o){var n,r,s;return s={is_epilogue:!1,is_finish:!1},n={comment:0,password:0},r={},i.find("stories",s,n).then(function(e){return r.stories=e,e.map(function(e){return`${e._id}-0`})}).then(function(e){return i.find("events",{_id:{$in:e}})}).then(function(e){return r.events=e}).then(function(){return t.json(r),o()}).catch(function(t){return console.error(e,t),o()})}),e.get("/api/story/oldlog",function(e,t,o){var n,r;return r={is_epilogue:!0,is_finish:!0},n={comment:0,password:0},Promise.all([i.find("stories",r,n),i.find("potof_for_face",{})]).then(function([e,n]){return t.json({stories:e,faces:n}),o()}).catch(function(t){return console.error(e,t),o()})}),e.get("/api/story/oldlog/:story_id",function(e,t,o){var n,r;return({story_id:r}=e.params),n={password:0},Promise.all([i.find("stories",{_id:r,is_epilogue:!0,is_finish:!0},n),i.find("messages",{story_id:r}),i.find("events",{story_id:r}),i.find("potofs",{story_id:r})]).then(function([e,n,r,i]){return e.length||(n=r=i=[]),t.json({stories:e,messages:n,events:r,potofs:i}),o()}).catch(function(t){return console.error(e,t),o()})}))}},function(e,t){e.exports=require("mongodb-bluebird")},function(e,t){e.exports=require("child_process")},function(e,t,o){var n,r,i,s,a;n=o(2)(),r=o(10),o(11)("giji-sow-api:server"),({pm_id:s}=process.env),Object.assign(r,{pm_id:s}),process.on("unhandledRejection",console.dir),o(3)(n,r),r.use_api&&o(6)(n,r),i=r.host||"127.0.0.1",a=(r.port||4e3)+(s-0||0),n.set("port",a),n.listen(a,i),console.log(`Server is listening on http://${i}:${a}`)},function(e,t){e.exports=require("config")},function(e,t){e.exports=require("debug")}]);
//# sourceMappingURL=app.js.map