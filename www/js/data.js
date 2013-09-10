//停用AJAX
// $.mobile.ajaxEnabled=false;
//載入設定
loadSetting();
//返回
$(document).on('click',".btnBack",function(){
    $.mobile.back();
});
//Other 
function setDefaultAppSetting(attributes){
    var dataJsonObject=getAppSetting_Data();
    dataJsonObject[attributeName]=attributeValue;
    for(var i=0;i<attributes.length;i++){
        dataJsonObject[attributes.name]=attributes.value;
    }
    setAppSetting_Data(dataJsonObject);
}
function doDefaultAppSetting(){
    var dataJsonObject={"language":'ch',"park":"01"};
    //設定至Storage
    setAppSetting_Data(dataJsonObject);
}  
function swichLanguageTo(lang){
    var dataJsonObject=getAppSetting_Data();
    if(dataJsonObject.language!=lang){
        dataJsonObject.language=lang;
        setAppSetting_Data(dataJsonObject);
            // app即時公告
            var Park=getIdentifyParkBase().Park;
            LoadingObject.show();
            var jsonObject={"langType":getAppSetting_Data().language,"Park":Park};
            var jsonObjectStr = JSON.stringify(jsonObject);
            $.ajax({
                url:InstantMessage,
                data:  {"jsonInput":jsonObjectStr},
                type:"POST",
                dataType :"jsonp",
                async:false,
                success:function(data){
                    if(data==null&&typeof(data.jsonOutput)!="undefined"){
                         smoke.alert(ServiceCodeErrorString,{},function(){});
                    }else{
                        if(data.status=="success"){
                            if(data.jsonOutput.length>0){
                                window.localStorage.setItem("SettingData_AppInstantMessage",JSON.stringify(data.jsonOutput[0]));
                            }else{
                                window.localStorage.setItem("SettingData_AppInstantMessage",null);
                            }
                        }else{
                            smoke.alert(ServiceCodeErrorString,{},function(){});
                        }
                    }
                    $.mobile.changePage('index.html');
                },
                error: function(data){
                    LoadingObject.hide(); 
                    smoke.alert(ServiceErrorString,{},function(){});
                },
                complete: function() {
                    LoadingObject.hide();
                }
            });
        // genMenu($('div[data-role="page"]:eq(0)'));
        // $('div[data-role="page"]:eq(0)').page('create');
    }
}
function genAppInstantMessage(contentPage,title){
    var content=$(contentPage).html(),aHTML="",langType=getAppSetting_Data().language;
    if(typeof(content)!="undefined"&&content.indexOf("marqueeDiv1")==-1){
        var headr_str="即時公告";
        switch(getAppType()){
            case "N":
                if(langType=="ch"){
                    headr_str="竹科即時公告";
                }else{
                    headr_str="HS News";
                }
                break;
            case "C":
                if(langType=="ch"){
                    headr_str="中科即時公告";
                }else{
                    headr_str="CS News";
                }
                break;
            case "S":
                if(langType=="ch"){
                    headr_str="南科即時公告";
                }else{
                    headr_str="SS News";
                }
                break;
        }
        aHTML='<div class="title2"><div class="tickercontainer" id="marqueeDiv1"><a rel="external" href="index.html#AppInstantMessage"><span>'+headr_str+':</span>'+title+'</a></div><div style="display:none;" id="marqueeDiv2"><marquee class="tickercontainer" scrollamount="3"><a rel="external" href="index.html#AppInstantMessage"><span>'+headr_str+':</span>'+title+'</a></marquee></div></div>';
    }
    contentPage.html(aHTML+content);
    //設定啓動跑馬燈(3秒後)
    setTimeout("showMarquee()",3000);
}
function showMarquee(){
    $("#marqueeDiv1").hide();
    $("#marqueeDiv2").show();
}
function goToIndexPage(){
    //下面這個會重復導暫時不用
    $.mobile.changePage('index.html');
}
//ajax web service
function doLoadLBSLandInfoToPage(spotNo,page){
    var member=getLoginData(),targetObj,mobiScroll_LBS_ParkBase,mobiScroll_LBS_classify,divLBSIMGList,imgSrc,isMain;
    LoadingObject.show();
    $.ajax({
        url:queryURL_LBS_LandInfo,
        data:  {"uploadStaff":member.account},
        type:"POST",
        dataType :"jsonp",
        async:false,
        success:function(data){
            if(data==null){
                 smoke.alert(ServiceCodeErrorString,{},function(){});
            }else{
                if(data.status=="success"){
                        if(data.spotpool.length>0){
                        targetObj=null;
                        for(var i=0;i<data.spotpool.length;i++){
                            if(data.spotpool[i].spotNo==spotNo){
                                targetObj=new LBS_LandInfo();
                                targetObj.loadDataFromServiceJSON(data.spotpool[i]);
                                break;
                            }
                        }
                        if(targetObj!=null){
                            if($(page).attr("id")=="LBS_ViewLandInfo"){
                                $(page).find('#ParkBase').text(getParkBase(targetObj.Park+"_"+targetObj.Base,"code","name"));
                                $(page).find('#classify').text(getClassify(targetObj.classify1+"_"+targetObj.classify2,"code","name"));
                                $(page).find('#cName').text(targetObj.cName);
                                $(page).find('#eName').text(targetObj.eName);
                                $(page).find('#targetLongitude').text(targetObj.targetLongitude);
                                $(page).find('#targetLatitude').text(targetObj.targetLatitude);
                                $(page).find('#targetAddress').text(targetObj.targetAddress);
                                $(page).find('#tel').text(targetObj.tel);
                                $(page).find('#comment').text(targetObj.comment);
                                $(page).find('#dataTag').text(targetObj.dataTag);
                                //初始化
                                var LBSView_map=new HyMap();
                                // LBSView_map.ini(document.getElementById('LBS_map_canvas'),new google.maps.LatLng(getGPRSData().lat,getGPRSData().lng),12);
                                LBSView_map.ini(document.getElementById('LBS_map_canvas'),new google.maps.LatLng(targetObj.targetLatitude,targetObj.targetLongitude),15);
                                LBSView_map.clearMapMarker();
                                LBSView_map.addMarker(new google.maps.LatLng(targetObj.targetLatitude,targetObj.targetLongitude),LBSView_map.map_icons.position.icon);
                            }else if($(page).attr("id")=="LBS_NewLandInfo"){   
                                //For EditShow
                                mobiScroll_LBS_ParkBase=$(page).find('#mobiScroll_LBS_ParkBase');
                                $(mobiScroll_LBS_ParkBase).val(1).mobiscroll('setValue',[targetObj.Park+'_'+targetObj.Base]);
                                $(page).find('#mobiScroll_LBS_ParkBase'+'_dummy').val($(mobiScroll_LBS_ParkBase).find('optgroup[data-value="'+targetObj.Park+'"]').attr('label')+"/"+$(mobiScroll_LBS_ParkBase).find('option[value="'+targetObj.Park+'_'+targetObj.Base+'"]').text());
                                mobiScroll_LBS_classify=$(page).find('#mobiScroll_LBS_classify');
                                $(mobiScroll_LBS_classify).val(1).mobiscroll('setValue',[targetObj.classify1+'_'+targetObj.classify2]);        
                                $(page).find('#mobiScroll_LBS_classify'+'_dummy').val($(mobiScroll_LBS_classify).find('optgroup[data-value="'+targetObj.classify1+'"]').attr('label')+"/"+$(mobiScroll_LBS_classify).find('option[value="'+targetObj.classify1+'_'+targetObj.classify2+'"]').text());
                                $(page).find('#cName').val(targetObj.cName);
                                $(page).find('#eName').val(targetObj.eName);
                                $(page).find('#targetLongitude').val(targetObj.targetLongitude);
                                $(page).find('#targetLatitude').val(targetObj.targetLatitude);
                                $(page).find('#targetAddress').val(targetObj.targetAddress);
                                $(page).find('#tel').val(targetObj.tel);
                                $(page).find('#comment').val(targetObj.comment);
                                $(page).find('#dataTag').val(targetObj.dataTag);
                            }
                            divLBSIMGList="";
                            photo.imageArray=[];//先清空
                            if(typeof(targetObj.imageArray)!=="undefined"&&targetObj.imageArray!=null&&targetObj.imageArray.length>0){
                                for (var imgIndex =0;imgIndex<targetObj.imageArray.length; imgIndex++) {
                                    imgSrc=targetObj.imageArray[imgIndex].ximage;
                                    isMain=targetObj.imageArray[imgIndex].isMain;
                                    //將圖片存入Array
                                    photo.imageArray.push([imgSrc,(isMain==1?true:false)]);
                                 };
                            }
                            //重新整理
                            photo.refreshPicture($(page).find('#imageArray'));
                        }
                    }
                }else{
                    smoke.alert(ServiceCodeErrorString,{},function(){});
                }
            }
        },
        error: function(data){
            LoadingObject.hide();
            smoke.alert(ServiceErrorString,{},function(){});
        },
        beforeSend: function() {
        },
        complete: function() {
           LoadingObject.hide();
           member=null;targetObj=null;mobiScroll_LBS_ParkBase=null;mobiScroll_LBS_classify=null;divLBSIMGList=null;imgSrc=null;isMain=null;
           delete member;delete targetObj;delete mobiScroll_LBS_ParkBase;delete mobiScroll_LBS_classify;delete divLBSIMGList;delete imgSrc;delete isMain;
        }

    });
}
function doLoadLBSEntryPointToPage(spotNo,code,page){ 
    var member=getLoginData(),targetObj,divLBSIMGList,imgSrc,isMain;
     $.ajax({
        url:queryURL_LBS_LandInfo,
        data:  {"uploadStaff":member.account},
        type:"POST",
        dataType :"jsonp",
        async:false,
        success:function(data){
            if(data==null){
                 smoke.alert(ServiceCodeErrorString,{},function(){});
            }else{
                if(data.status=="success"){
                        if(data.spotpool.length>0){
                        targetObj=null;
                        for(var i=0;i<data.spotpool.length;i++){
                            if(spotNo==data.spotpool[i].spotNo&&data.spotpool[i].EntryPoints.length>0){
                                for(var j=0;j<data.spotpool[i].EntryPoints.length;j++){
                                    if(code==data.spotpool[i].EntryPoints[j].code){
                                        targetObj=new LBS_EntryPointInfo();
                                        targetObj.loadDataFromServiceJSON(spotNo,data.spotpool[i].EntryPoints[j]);
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        if(targetObj!=null){
                            $(page).find('#cName').val(targetObj.cName);
                            $(page).find('#eName').val(targetObj.eName);
                            $(page).find('#targetLongitude').val(targetObj.targetLongitude);
                            $(page).find('#targetLatitude').val(targetObj.targetLatitude);
                            $(page).find('#targetAddress').val(targetObj.targetAddress);
                            $(page).find('#comment').val(targetObj.comment);
                            divLBSIMGList="";
                            photo.imageArray=[];//先清空
                            if(typeof(targetObj.imageArray)!=="undefined"&&targetObj.imageArray!=null&&targetObj.imageArray.length>0){
                                for (var imgIndex =0;imgIndex<targetObj.imageArray.length; imgIndex++) {
                                    imgSrc=targetObj.imageArray[imgIndex].ximage;
                                    isMain=targetObj.imageArray[imgIndex].isMain;
                                    //將圖片存入Array
                                    photo.imageArray.push([imgSrc,(isMain==1?true:false)]);
                                 };
                            }
                            photo.refreshPicture($(page).find('#imageArray'));
                        }
                    }
                }else{
                    smoke.alert(ServiceCodeErrorString,{},function(){});
                }
            }
        },
        error: function(data){
            LoadingObject.hide();
            smoke.alert(ServiceErrorString,{},function(){});
        },
        complete: function() {
           LoadingObject.hide();
           member=null;targetObj=null;divLBSIMGList=null;imgSrc=null;isMain=null;
           delete member;delete targetObj;delete divLBSIMGList;delete imgSrc;delete isMain;
        }

    });
}
function doQueryLBSUnSubmitData(page,dataTable){  
   LoadingObject.show();
    var member=getLoginData(),htmlResult,li;
    $.ajax({
        url:queryURL_LBS_LandInfo,
        data:  {"uploadStaff":member.account},
        type:"POST",
        dataType :"jsonp",
        async:false,
        success:function(data){
            if(data==null){
                 smoke.alert(ServiceCodeErrorString,{},function(){});
            }else{
                if(data.status=="success"){
                    htmlResult='<tr><th scope="col" class="number">序號</th><th scope="col">照片</th><th scope="col">地點名稱</th><th scope="col">維護</th></tr>';
                    if(data.spotpool.length>0){
                        for(var i=0;i<data.spotpool.length;i++){
                            htmlResult+="<tr>";
                            li=new LBS_LandInfo();
                            li.loadDataFromServiceJSON(data.spotpool[i]);
                            htmlResult+=li.convertToListShowStr(i+1);
                            htmlResult+="</tr>";
                        }
                    }
                    $(dataTable).html(htmlResult);
                    $(page).trigger('create');
                }else{
                    smoke.alert(ServiceCodeErrorString,{},function(){});
                }
            }
        },
        error: function(data){
            LoadingObject.hide();
            smoke.alert(ServiceErrorString,{},function(){});
        },
        complete: function() {
            LoadingObject.hide();
            member=null;htmlResult=null;li=null;
            delete member;delete htmlResult;delete li;
        }
    });
}
function doDeleteLBSUnSubmitData(spotNo){
    LoadingObject.show();
    var jsonObjectStr='{"spotNo":"'+spotNo+'"}';
    $.ajax({
        url:deleteURL_LBS_LandInfo,
        data:{"jsontry":jsonObjectStr},
        type:"POST",
        dataType :"json",
        async:false,
        success:function(data){
            if(data==null){
                 smoke.alert(ServiceCodeErrorString,{},function(){});
            }else{
                if(data.status=="success"){
                }else{
                    smoke.alert(ServiceCodeErrorString,{},function(){});
                }
            }
        },
        error: function(data){
            LoadingObject.hide();
            smoke.alert(ServiceErrorString,{},function(){});
        },
        complete: function() {
            LoadingObject.hide();
            jsonObjectStr=null;
            delete jsonObjectStr;
        }
    });
}
function doQueryLBSUnSubmitEntryPointData(spotNo,page,dataTable){
    LoadingObject.show();
    var member=getLoginData(),htmlResult,li;
    $.ajax({
        url:queryURL_LBS_LandInfo,
        data:  {"uploadStaff":member.account},
        type:"POST",
        dataType :"jsonp",
        async:false,
        success:function(data){
            if(data==null){
                 smoke.alert(ServiceCodeErrorString,{},function(){});
            }else{
                if(data.status=="success"){
                    htmlResult='<tr><th scope="col">圖片</th><th scope="col">中文名稱</th><th scope="col">英文名稱</th><th scope="col">維護</th></tr>';
                    if(data.spotpool.length>0){
                        for(var i=0;i<data.spotpool.length;i++){
                            if(spotNo==data.spotpool[i].spotNo&&data.spotpool[i].EntryPoints.length>0){
                                for(var j=0;j<data.spotpool[i].EntryPoints.length;j++){
                                    li=new LBS_EntryPointInfo();
                                    li.loadDataFromServiceJSON(spotNo,data.spotpool[i].EntryPoints[j]);
                                    htmlResult+=li.convertToListShowStr();
                                }
                                break;
                            }
                        }
                    }
                    $(dataTable).html(htmlResult);
                    $(page).trigger('create');
                }else{
                    smoke.alert(ServiceCodeErrorString,{},function(){});
                }
            }
        },
        error: function(data){
            LoadingObject.hide(); 
            smoke.alert(ServiceErrorString,{},function(){});
        },
        complete: function() {
            LoadingObject.hide();
            member=null;htmlResult=null;li=null;
            delete member;delete htmlResult;delete li;
        }
    });
}
function doDeleteLBSUnSubmitEntryPointData(code){
    LoadingObject.show();
    var jsonObjectStr='{"code":"'+code+'"}';
    $.ajax({
        url:deleteURL_LBS_EntryPoint,
        data:{"jsontry":jsonObjectStr},
        type:"POST",
        dataType :"json",
        async:false,
        success:function(data){
            if(data==null){
                 smoke.alert(ServiceCodeErrorString,{},function(){});
            }else{
                if(data.status=="success"){
                }else{
                    smoke.alert(ServiceCodeErrorString,{},function(){});
                }
            }
        },
        error: function(data){
            LoadingObject.hide();
            smoke.alert(ServiceErrorString,{},function(){});
        },
        complete: function() {
            LoadingObject.hide();
            jsonObjectStr=null;
            delete jsonObjectStr;
        }
    });
}
function doInsertLBSUnSubmitData(LandInfoGUID,Park,Base,classify1,classify2,cName,eName,targetLongitude,targetLatitude,targetAddress,tel,comment,dataTag,imageArray){
    var member=getLoginData(),JsonObject_LBS_EntryPoints=[],db=window.openDatabase("NSC","1.0","NSC DB","1000000"),newEntryPointsSQLStr="",len,jsonObjectStr,obj,JsonObject_LBS_LandInfo,jsonStr,page;
    LoadingObject.show();
    db.transaction(function(tx){
        tx.executeSql('select * from temp_LBS_EnrtyPoint where LandInfoGUID=?',[LandInfoGUID],function(tx,results){
            //將資料轉讀出後轉存
            len=results.rows.length;
            if(len>0){
                for(var i=0;i<len;i++){
                    jsonObjectStr=results.rows.item(i).value;
                    obj=convertToAddLBS_EnrtyPointJSON(jsonObjectStr);
                    JsonObject_LBS_EntryPoints.push(obj);
                }
            }
            JsonObject_LBS_LandInfo={'uploadStaff':member.account,'idept':member.idept,'GUID':LandInfoGUID,'parkArea':Park,'parkLocation':Base,'xLBSClassify1':classify1,'xLBSClassify2':classify2,'chtName':cName,'engName':eName,'longitude':targetLongitude,'latitude':targetLatitude,'chtAddress':targetAddress,'tel':tel,'chtMemo':comment,'tagDesc':dataTag,'imageArray':imageArray,"EntryPoints":JsonObject_LBS_EntryPoints};
            jsonStr = JSON.stringify(JsonObject_LBS_LandInfo);
            $.ajax({
                url:insertURL_LBS_LandInfo,
                data:{"jsontry":jsonStr},
                type:"POST",
                dataType :"json",
                async:false,
                success:function(data){
                    if(data==null){
                         smoke.alert(ServiceCodeErrorString,{},function(){});
                    }else{
                        if(data.status=="success"){
                            page=$('#LBS_PostBack_List');
                            doQueryLBSUnSubmitData(page,page.find('#dataTable'));
                        }else{
                            smoke.alert(ServiceCodeErrorString,{},function(){});
                        }
                    }
                },
                error: function(data){
                    LoadingObject.hide();
                    smoke.alert(ServiceErrorString,{},function(){});
                },
                complete: function() {
                    LoadingObject.hide();
                    member=null;JsonObject_LBS_EntryPoints=null;newEntryPointsSQLStr=null;len=null;jsonObjectStr=null;obj=null;JsonObject_LBS_LandInfo=null;jsonStr=null;page;
                    delete member;delete JsonObject_LBS_EntryPoints;delete newEntryPointsSQLStr;delete len;delete jsonObjectStr;delete obj;delete JsonObject_LBS_LandInfo;delete jsonStr;delete page;
                }
            });
            tx.executeSql('delete from temp_LBS_EnrtyPoint where LandInfoGUID="'+LandInfoGUID+'"',[]);
        },errorDB); 
    },errorDB);
    db=null;
   delete db;
}
function doInsertLBSUnSubmitData_EntryPoint(spotNo,cName,eName,targetLongitude,targetLatitude,targetAddress,comment,imageArray){
    LoadingObject.show();
    var member=getLoginData();
    var jsonObject={"uploadStaff":member.account,"idept":member.idept,"spotNo":spotNo,"chtName":cName,"engName":eName,"latitude":targetLatitude,"longitude":targetLongitude,"chtAddress":targetAddress,'chtMemo':comment,"imageArray":imageArray};
    var jsonObjectStr = JSON.stringify(jsonObject);
    $.ajax({
        url:insertURL_LBS_EntryPoint,
        data:{"jsontry":jsonObjectStr},
        type:"POST",
        dataType :"json",
        async:false,
        success:function(data){
            if(data==null){
                 smoke.alert(ServiceCodeErrorString,{},function(){});
            }else{
                if(data.status=="success"){
                }else{
                    smoke.alert(ServiceCodeErrorString,{},function(){});
                }
            }
        },
        error: function(data){
            LoadingObject.hide();
            smoke.alert(ServiceErrorString,{},function(){});
        },
        complete: function() {
            LoadingObject.hide();
            member=null;jsonObject=null;jsonObjectStr=null;
            delete member;delete jsonObject;delete jsonObjectStr;
        }
    });
}
function doUpdateLBSUnSubmitData(spotNo,Park,Base,classify1,classify2,cName,eName,targetLongitude,targetLatitude,targetAddress,tel,comment,dataTag,imageArray){
      LoadingObject.show();  
    var member=getLoginData();
    var JsonObject_LBS_LandInfo={'uploadStaff':member.account,'idept':member.idept,'spotNo':spotNo,'parkArea':Park,'parkLocation':Base,'xLBSClassify1':classify1,'xLBSClassify2':classify2,'chtName':cName,'engName':eName,'longitude':targetLongitude,'latitude':targetLatitude,'chtAddress':targetAddress,'tel':tel,'chtMemo':comment,'tagDesc':dataTag,'imageArray':imageArray};
    var jsonObjectStr = JSON.stringify(JsonObject_LBS_LandInfo);
    $.ajax({
        url:updateURL_LBS_LandInfo,
        data:{"jsontry":jsonObjectStr},
        type:"POST",
        dataType :"json",
        async:false,
        success:function(data){
            if(data==null){
                 smoke.alert(ServiceCodeErrorString,{},function(){});
            }else{
                if(data.status=="success"){
                }else{
                    smoke.alert(ServiceCodeErrorString,{},function(){});
                }
            }
        },
        error: function(data){
            LoadingObject.hide();
            smoke.alert(ServiceErrorString,{},function(){});
        },
        complete: function() {
            LoadingObject.hide();
            member=null;JsonObject_LBS_LandInfo=null;jsonObjectStr=null;
            delete member;delete JsonObject_LBS_LandInfo;delete jsonObjectStr;
        }
    });
}
function doUpadteLBSUnSubmitData_EntryPoint(spotNo,code,cName,eName,targetLongitude,targetLatitude,targetAddress,comment,imageArray){
                LoadingObject.show();
    var member=getLoginData();
    var JsonObject_EntryPoint={"uploadStaff":member.account,"idept":member.idept,"spotNo":spotNo,"code":code,"chtName":cName,"engName":eName,"latitude":targetLatitude,"longitude":targetLongitude,"chtAddress":targetAddress,'chtMemo':comment,'imageArray':imageArray};
    var jsonObjectStr = JSON.stringify(JsonObject_EntryPoint);
    $.ajax({
        url:updateURL_LBS_EntryPoint,
        data:{"jsontry":jsonObjectStr},
        type:"POST",
        dataType :"json",
        async:false,
        success:function(data){
            if(data==null){
                 smoke.alert(ServiceCodeErrorString,{},function(){});
            }else{
                if(data.status=="success"){
                }else{
                    smoke.alert(ServiceCodeErrorString,{},function(){});
                }
            }
        },
        error: function(data){
            LoadingObject.hide();
            smoke.alert(ServiceErrorString,{},function(){});
        },        
        complete: function() {
            LoadingObject.hide();
            member=null;JsonObject_EntryPoint=null;jsonObjectStr=null;
            delete member;delete JsonObject_EntryPoint;delete jsonObjectStr;
        }
    });
}
//Web SQL Storage
function addLBS_EnrtyPointToTempDB(LandInfoGUID,cName,eName,targetLongitude,targetLatitude,targetAddress,comment,imageArray){
   
    var JsonObject_LBS_EnrtyPoint={'LandInfoGUID':LandInfoGUID,'cName':cName,'eName':eName,'targetLongitude':targetLongitude,'targetLatitude':targetLatitude,'targetAddress':targetAddress,'comment':comment,'imageArray':imageArray};
    var jsonStr = escape(JSON.stringify(JsonObject_LBS_EnrtyPoint));
    var EntryPointID=GenGUID();
    var db=window.openDatabase("NSC","1.0","NSC DB","1000000");
    var sqlStr='Insert into temp_LBS_EnrtyPoint(EntryPointID,LandInfoGUID,value) values ("'+EntryPointID+'","'+LandInfoGUID+'","'+jsonStr+'")';
    db.transaction(function(tx,jsonStr){
        LoadingObject.show();
        tx.executeSql(sqlStr);
        LoadingObject.hide();
        JsonObject_LBS_EnrtyPoint=null;jsonStr=null;EntryPointID=null;sqlStr=null;
        delete JsonObject_LBS_EntryPoints;delete jsonStr;delete EntryPointID;delete sqlStr;
    },errorDB);
    db=null;
    delete db;
}
function deleteLBS_EnrtyPointToTempDB(EntryPointID){
   
    var db=window.openDatabase("NSC","1.0","NSC DB","1000000");
    var sqlStr='delete from temp_LBS_EnrtyPoint where EntryPointID="'+EntryPointID+'"';
    db.transaction(function(tx,jsonStr){
        LoadingObject.show();
        tx.executeSql(sqlStr);
        LoadingObject.hide();
        sqlStr=null;
        delete sqlStr;
    },errorDB);
    db=null;
    delete db;
}
function updateLBS_EnrtyPointToTempDB(EntryPointID,LandInfoGUID,cName,eName,targetLongitude,targetLatitude,targetAddress,comment,imageArray){
   
    var JsonObject_LBS_EnrtyPoint={'LandInfoGUID':LandInfoGUID,'cName':cName,'eName':eName,'targetLongitude':targetLongitude,'targetLatitude':targetLatitude,'targetAddress':targetAddress,'comment':comment,'imageArray':imageArray};
    var jsonStr = escape(JSON.stringify(JsonObject_LBS_EnrtyPoint));
    var db=window.openDatabase("NSC","1.0","NSC DB","1000000");
    var sqlStr='Update temp_LBS_EnrtyPoint set LandInfoGUID="'+LandInfoGUID+'",value="'+jsonStr+'" where EntryPointID="'+EntryPointID+'"';
    db.transaction(function(tx,jsonStr){
        LoadingObject.show();
        tx.executeSql(sqlStr);
        LoadingObject.hide();
        JsonObject_LBS_EnrtyPoint=null;jsonStr=null;sqlStr=null;
        delete JsonObject_LBS_EntryPoints;delete jsonStr;delete sqlStr;
    },errorDB);
    db=null;
    delete db;
}
function clearLBS_LandInfoToDB(){
    var db=window.openDatabase("NSC","1.0","NSC DB","1000000");
     db.transaction(function(tx){
         tx.executeSql('delete from  temp_LBS_EnrtyPoint');
     },errorDB);
     db=null;
     delete db;
}
function convertToAddLBS_EnrtyPointJSON(jsonObjectStr){
    var EntryPoints=JSON.parse(unescape(jsonObjectStr));
    var result={"chtName":EntryPoints.cName,"engName":EntryPoints.eName,"latitude":EntryPoints.targetLatitude,"longitude":EntryPoints.targetLongitude,"chtAddress":EntryPoints.targetAddress,"chtMemo":EntryPoints.comment,"imageArray":EntryPoints.imageArray};
    EntryPoints=null;
    delete EntryPoints;
    return result;
}
function readLBS_EntryPointFromDBToList(page,LandInfoGUID,dataTable,ActionType) {
    if(ActionType=="add"){
       var db=window.openDatabase("NSC","1.0","NSC DB","1000000"),len,data,EntryPointID,dataObject,imgSrc;
        db.transaction(function(tx){
            LoadingObject.show();
            //改成暫存的入口都視為新增景點的入口
            //tx.executeSql('select * from temp_LBS_EnrtyPoint where LandInfoGUID=?',[LandInfoGUID],function(tx,results){
            tx.executeSql('select * from temp_LBS_EnrtyPoint where LandInfoGUID=?',[LandInfoGUID],function(tx,results){
                len=results.rows.length;
                data='<tr><th scope="col">圖片</th><th scope="col">中文名稱</th><th scope="col">英文名稱</th><th scope="col">維護</th>';
                if(len>0){
                    for(var i=0;i<len;i++){
                        EntryPointID=results.rows.item(i).EntryPointID;
                        //parsing jsonObject
                        dataObject=JSON.parse(unescape(results.rows.item(i).value));
                        imgSrc="";
                        if(typeof(dataObject.imageArray)!="undefined"&&dataObject.imageArray!=null&&dataObject.imageArray.length>0){
                            for (var imgIndex =0;imgIndex< dataObject.imageArray.length ;imgIndex++) {
                                if(imgIndex== 0){
                                    imgSrc=dataObject.imageArray[imgIndex].ximage;
                                }else if(dataObject.imageArray[imgIndex].isMain=="1"){
                                    imgSrc=dataObject.imageArray[imgIndex].ximage;
                                    break;
                                }
                            }
                        }
                        //Read To List
                        data+='<tr>';
                        data+='<td class="image"><img src="data:image/jpeg;base64,'+imgSrc+'" alt="圖片說明" /></td>';
                        //data+='<td class="image"><img src="data:image/png;base64,'+dataObject.imageArray+'" alt="圖片說明" /></td>';
                        data+='<td>'+dataObject.cName+'</td>';
                        data+='<td>'+dataObject.eName+'</td>';
                        data+='<td class="maintain"><input data-theme="e" data-nsc-lbs-targetentrypointid="'+EntryPointID+'" data-mini="true" type="button" data-role="button" data-inline="true" id="btnEdit" value="修改"></input></td>';
                        data+='</tr>';
                    }
                }
                $(dataTable).html(data);
                $(page).trigger('create');
                LoadingObject.hide();
            },errorDB); 
        },errorDB);
        db=null;len=null;data=null;EntryPointID=null;dataObject=null;imgSrc=null;
        delete db;delete len;delete data;delete EntryPointID;delete dataObject;delete imgSrc;
    }
}
function resetDB(){
    var db=window.openDatabase("NSC","1.0","NSC DB","1000000");
    db.transaction(function(tx,jsonStr){
        tx.executeSql('drop table if exists temp_LBS_EnrtyPoint');
        tx.executeSql('Create table if not exists temp_LBS_EnrtyPoint(EntryPointID,LandInfoGUID,value)');
    },errorDB);
    db=null;
    delete db;
}
function errorDB (err) {
    //先關閉Loading
    LoadingObject.hide();
    //顯示錯誤
    alert("Error code:"+err.code+"\n"+"Error processing SQL:"+err.message);
}
//ClearUp
function ClearUpInput (page) {
    //清空圖片區
    photo.clear();
    $(page).find('#imageArray').html('');
    //清空地圖
    loc.clear();
    //清空輸入
    $(page).find('input').val('');  
    $(page).find('input.InputControl').val('');
}
//GUID
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
function GenGUID(){
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}
//Object
function LBS_LandInfo(){
    //attribute
    this.spotNo=null;
    this.LandInfoGUID=null;
    this.Park=null;
    this.Base=null;
    this.classify1=null;
    this.classify2=null;
    this.cName=null;
    this.eName=null;
    this.targetLongitude=null;
    this.targetLatitude=null;
    this.targetAddress=null;
    this.tel=null;
    this.comment=null;
    this.dataTag=null;
    this.imageArray=null;
    //function
    this.loadDataFromServiceJSON=function(JSONObj){
        this.LandInfoGUID=JSONObj.GUID;
        this.spotNo=JSONObj.spotNo;
        this.Park=JSONObj.parkArea;
        this.Base=JSONObj.parkLocation;
        this.classify1=JSONObj.xLBSClassify1;
        this.classify2=JSONObj.xLBSClassify2;
        this.cName=JSONObj.chtName;
        this.eName=JSONObj.engName;
        this.targetLongitude=JSONObj.longitude;
        this.targetLatitude=JSONObj.latitude;
        this.targetAddress=JSONObj.chtAddress;
        this.tel=JSONObj.tel;
        this.comment=JSONObj.chtMemo;
        this.dataTag=JSONObj.tagDesc;
        this.imageArray=JSONObj.imageArray;
    };
    this.convertToListShowStr=function(sno){
        var imgSrc="",result;
        if(typeof(this.imageArray)!="undefined"&&this.imageArray!=null&&this.imageArray.length>0){
            for (var imgIndex =0;imgIndex < this.imageArray.length ; imgIndex ++) {
                if(imgIndex==0){
                    imgSrc=this.imageArray[imgIndex ].ximage;
                }else if(this.imageArray[imgIndex ].isMain=="1"){
                    imgSrc=this.imageArray[imgIndex ].ximage;
                    break;
                }
            }
        }
        result="<tr>";
        result+='<th class="number">'+sno+'.</th>';
        result+='<td class="image"><img src="'+imgSrc+'" alt="圖片說明"/></td>';
        result+='<td>'+this.cName+'</td>';
        result+='<td class="maintain">';
        result+='<input data-theme="e" data-nsc-lbs-targetguid="'+this.LandInfoGUID+'" data-nsc-lbs-targetspotno="'+this.spotNo+'" data-mini="true" type="button" data-role="button" data-inline="true" value="修改" id="btnEdit"></input>';
        result+='<input data-theme="f" data-nsc-lbs-targetguid="'+this.LandInfoGUID+'" data-nsc-lbs-targetspotno="'+this.spotNo+'" data-mini="true" type="button" data-role="button" data-inline="true" value="檢視" id="btnView"></input>';
        result+='</td></tr>';
        imgSrc=null;
        delete imgSrc;
        return result;
    };
}
function LBS_EntryPointInfo(){
    //attribute
    this.code=GenGUID();
    this.spotNo=null;
    this.LandInfoGUID=null;
    this.EntryPointID=null;
    this.cName=null;
    this.eName=null;
    this.targetLongitude=null;
    this.targetLatitude=null;
    this.targetAddress=null;
    this.comment=null;
    this.imageArray=null;
    //function
    this.loadDataFromDB=function(GUID,EntryPointID,Page){
        var result=null,db=window.openDatabase("NSC","1.0","NSC DB","1000000"),len,dataObject,divLBSIMGList,imgSrc,isMain;
        LoadingObject.show();
        db.transaction(function(tx){
            tx.executeSql('select * from temp_LBS_EnrtyPoint where EntryPointID=? and LandInfoGUID=? limit 1',[EntryPointID,GUID],function(tx,results){              
                len=results.rows.length;
                if(len>0){
                        dataObject=JSON.parse(unescape(results.rows.item(0).value));
                        $(Page).find('#cName').val(dataObject.cName);
                        $(Page).find('#eName').val(dataObject.eName)
                        $(Page).find('#targetLongitude').val(dataObject.targetLongitude);
                        $(Page).find('#targetLatitude').val(dataObject.targetLatitude);
                        $(Page).find('#targetAddress').val(dataObject.targetAddress);
                        $(Page).find('#comment').val(dataObject.comment);
                        divLBSIMGList="";
                        if(typeof(dataObject.imageArray)!=="undefined"&&dataObject.imageArray!=null&&dataObject.imageArray.length>0){
                            for (var imgIndex =0;imgIndex<dataObject.imageArray.length; imgIndex++) {
                                imgSrc=dataObject.imageArray[imgIndex].ximage;
                                isMain=dataObject.imageArray[imgIndex].isMain;
                                //套入HTML
                                divLBSIMGList+='<div class="divLBSIMGList" id="picdiv1"><img data-isMain="'+isMain+'"" src="data:image/jpeg;base64,'+imgSrc+'" alt="圖片說明"/><ul><li class="'+(isMain=="1"?"enableSet":"disableSet")+'"><input type="button" value="'+(isMain=="1"?"此為主圖":"設為主圖")+'" onclick="photo.setMain(&#39;'+imgIndex+'&#39;)"></input></li><li class="delete"><input type="button" value="刪除此圖" onclick="photo.deletePhoto(&#39;'+imgIndex+'&#39;)"></input></li></ul></div>';
                                photo.imageArray.push([imgSrc,(isMain==1?true:false)]);
                            };
                        }
                        $(Page).find('#imageArray').html(divLBSIMGList);                        
                    }
                  LoadingObject.hide();
            },errorDB); 
        },errorDB);
        result=null;db=null;len=null;dataObject=null;divLBSIMGList=null;imgSrc=null;isMain=null;
        delete result;delete db;delete len;delete dataObject;delete divLBSIMGList;delete imgSrc;delete isMain;
    };
    this.loadDataFromServiceJSON=function(spotNo,JSONObj){
        if(typeof(JSONObj.code)!="undefined"){
            this.code=JSONObj.code;
        }
        this.spotNo=spotNo;
        this.LandInfoGUID=JSONObj.GUID;
        this.cName=JSONObj.chtName;
        this.eName=JSONObj.engName;
        this.targetLongitude=JSONObj.longitude;
        this.targetLatitude=JSONObj.latitude;
        this.targetAddress=JSONObj.chtAddress;
        this.comment=JSONObj.chtMemo;
        this.imageArray=JSONObj.imageArray;
        
    };
    this.convertToListShowStr=function(){
        var imgSrc="",result;
        if(typeof(this.imageArray)!="undefined"&&this.imageArray!=null&&this.imageArray.length>0){
            for (var imgIndex=0;imgIndex<this.imageArray.length ;imgIndex++) {
                if(imgIndex==0){
                    imgSrc=this.imageArray[imgIndex].ximage;
                }else if(this.imageArray[imgIndex].isMain=="1"){
                    imgSrc=this.imageArray[imgIndex].ximage;
                    break;
                }
            }
        }
        result="<tr>";
        result+='<td class="image"><img src="'+imgSrc+'" alt="圖片說明"/></td>';
        result+='<td>'+this.cName+'</td>';
        result+='<td>'+this.eName+'</td>';
        result+='<td class="maintain">';
        result+='<input data-theme="e" data-nsc-lbs-targetguid="'+this.LandInfoGUID+'" data-nsc-lbs-targetspotno="'+this.spotNo+'" data-nsc-lbs-targetcode="'+this.code+'" data-mini="true" type="button" data-role="button" data-inline="true" value="修改" id="btnEdit"></input>';
        result+='</td></tr>';
        imgSrc=null;
        delete imgSrc;
        return result;
    };
}
//Member
function doLogIn(account,pw,token){
    LoadingObject.show();
    var errorStr="",GUID="";
    if(getDeviceData()!=null){
        GUID=getDeviceData().uuid;
    }else{
        GUID="tttt-eeee-ssss-tttt";
    }
    if(account==""||pw==""||token==""){
        errorStr="帳號,密碼或認證碼填寫不正確";
        smoke.alert(errorStr,{},function(){});
    }else{
        var jsonObject={"Park":getDefaultParkAndBase().Park,"account":account,"password":pw,"token":token,"GUID":GUID};
        var jsonObjectStr = JSON.stringify(jsonObject);
        $.ajax({
            url:DataURL_MemberData_getToken1,
            data: {"jsonInput":jsonObjectStr},
            type:"POST",
            dataType :"json",
            async:false,
            success:function(data){
                if(data==null){
                     smoke.alert(ServiceCodeErrorString,{},function(){});
                }else{
                    if(data.status=="success"){
                        if(typeof(data.jsonOutput.token1)!="undefined"){
                            if(typeof(data.jsonOutput.accountInfo)!="undefined"){
                               var dataObj={"token1":data.jsonOutput.token1,"account":data.jsonOutput.accountInfo.account,"accountSN":data.jsonOutput.accountInfo.accountSN,"accountName":data.jsonOutput.accountInfo.accountName,"accountSN":data.jsonOutput.accountSN,"idept_govCode":data.jsonOutput.accountInfo.idept_govCode,"idept_nscuCode":data.jsonOutput.accountInfo.idept_nscuCode,"idept":data.jsonOutput.accountInfo.idept_govCode+data.jsonOutput.accountInfo.idept_nscuCode,"ideptName":data.jsonOutput.accountInfo.ideptName};
                                setLoginData(dataObj);
                                $('#index #logoutButton').closest('.ui-btn').show();
                                $('#LBS_PostBack #logoutButton').closest('.ui-btn').show();
                                //menuNumber
                                setMenuNumber(data.jsonOutput.menuLoginDisplayNumber);
                                $.mobile.changePage('index.html');
                            }else{
                                 errorStr="登入失敗，請確認資料無誤後再重新登入";
                            }
                        }else{
                            errorStr="登入失敗，無法取得身份授權碼";
                        }
                        if(errorStr!=""){
                            smoke.alert(errorStr,{},function(){});
                        }
                    }else{
                        smoke.alert(data.message,{},function(){});
                    }
                }
            },
            error: function(data){
                LoadingObject.hide();
                smoke.alert(ServiceErrorString,{},function(){});
            },
            complete: function() {
                LoadingObject.hide();
                errorStr=null;
                delete errorStr;
            }
        });
    }
     LoadingObject.hide();
}
// function doGetMenuNumber(account,token1){
//      var jsonObject={"token":dataObject.token1,"account":dataObject.account};
//     var jsonObjectStr = JSON.stringify(jsonObject);
//     $.ajax({
//         url:DataURL_MemberData_vaildToken1,
//         data: {"jsonInput":jsonObjectStr},
//         type:"POST",
//         dataType :"json",
//         async:false,
//         success:function(data){
//             if(data==null){
//                  smoke.alert(ServiceCodeErrorString,{},function(){});
//             }else{
//                 if(data.status=="success"){
//                     if(data.jsonOutput.isValid){
//                         //menuNubers.InsideInstantMessage
//                         // menuNubers.BizFileSharing
//                         // menuNubers.OfficialDocument
//                         // menuNubers.NewsAndDocument
//                         //設定登入資料
//                         setLoginData(dataObject);  
//                     }
//                 }else{
//                     smoke.alert(data.message,{},function(){});
//                 }
//             }
//         },
//         error: function(data){
//             LoadingObject.hide();
//             smoke.alert(ServiceErrorString,{},function(){});
//         },
//         complete: function() {
//             LoadingObject.hide();
//             errorStr=null;
//             delete errorStr;
//         }
//     });  
// }
function doVaildLogin(account,pw,page){
    LoadingObject.show();
    var dataObject=getLoginData(),menuNumberObject={};
    var errorStr="";
    if(account==""||pw==""){
        errorStr="帳號,密碼填寫不正確";
        smoke.alert(errorStr,{},function(){});
    }else{
        var jsonObject={"account":account,"password":pw};
        var jsonObjectStr = JSON.stringify(jsonObject);
        $.ajax({
            url:DataURL_MemberData_getToken2,
            data: {"jsonInput":jsonObjectStr},
            type:"POST",
            dataType :"json",
            async:false,
            success:function(data){
                if(data==null){
                     smoke.alert(ServiceCodeErrorString,{},function(){});
                }else{
                    if(data.status=="success"){
                        if(typeof(data.jsonOutput.token1)!="undefined"){
                            dataObject={"token1":dataObject.token1,"token2":data.jsonOutput.token1,"account":dataObject.account,"accountSN":dataObject.accountSN,"accountName":dataObject.accountName,"idept_govCode":dataObject.idept_govCode,"idept_nscuCode":dataObject.idept_nscuCode,"idept":dataObject.idept,"ideptName":dataObject.ideptName}; 
                            setLoginData(dataObject);
                            // $.mobile.changePage(page);
                            window.location.href=page;
                        }else{
                            errorStr="登入失敗，無法取得身份授權碼";
                        }
                        if(errorStr!=""){
                            smoke.alert(errorStr,{},function(){});
                        }
                    }else{
                        smoke.alert(data.message,{},function(){});
                    }
                }
            },
            error: function(data){
                LoadingObject.hide();
                smoke.alert(ServiceErrorString,{},function(){});
            },
            complete: function() {
                LoadingObject.hide();
                errorStr=null;
                delete errorStr;
            }
        });
    }
}
function doVaildToken2(token2,page){
    var jsonObject={"token":dataObject.token2};
    var jsonObjectStr = JSON.stringify(jsonObject);
    $.ajax({
        url:DataURL_MemberData_vaildToken2,
        data: {"jsonInput":jsonObjectStr},
        type:"POST",
        dataType :"json",
        async:false,
        success:function(data){
            if(data==null){
                 smoke.alert(ServiceCodeErrorString,{},function(){});
            }else{
                if(data.status=="success"){
                    if(data.jsonOutput.isValid){
                        clearToken2VaildBackPage();
                        $.mobile.changePage(page);
                    }else{
                        window.location="Page_Login.html#MemberValidation";
                    }
                }else{
                    smoke.alert(data.message,{},function(){
                        window.location="Page_Login.html#MemberValidation";
                    });
                }
            }
        },
        error: function(data){
            LoadingObject.hide();
            smoke.alert(ServiceErrorString,{},function(){
                window.location="Page_Login.html#MemberValidation";
            });
        },
        complete: function() {
            LoadingObject.hide();
            errorStr=null;
            delete errorStr;
        }
    });
}
function checkLogin(){
    var result=false;
    if(getLoginData()!=null){
        if(getLoginData().account!=null){
            result=true;
        }
    }
    return result;
}
function doLogOut(){
    smoke.confirm("確定要解除手機註冊嗎？<br/>(解除需於EIP重新註冊，才可使用APP員工專區)",function(e) {
        if(e){
            menuDisplayMemberSection(false,null);
            clearLoginData();
        }
    },{ok:"確定",cancel:"取消"});
}
function menuDisplayMemberSection(isDisplay,RootElement){
    var menuLi,btnlogin,btnlogout;
    if(RootElement!=null){
        menuLi=$(RootElement).find(".LoginSection");
        btnlogin=$(RootElement).find("a.btnlogin");
        btnlogout=$(RootElement).find("a.btnlogout");
    }else{
        menuLi=$(".LoginSection");
        btnlogin=$("a.btnlogin");
        btnlogout=$("a.btnlogout");
    }
    if(isDisplay){
        //Menu呈現
        $(menuLi).show();
        //Menu btnLogin隱藏
        $(btnlogin).css("visibility","hidden");
        //Menu btnLogout顯示
        $(btnlogout).css("visibility","visible");
    }else{
        //Menu遮蔽
        $(menuLi).hide();
        //Menu btnLogin顯示
        $(btnlogin).css("visibility","visible");
        //Menu btnLogout隱藏
        $(btnlogout).css("visibility","hidden");
    }
    menuLi=null;btnlogin=null;btnlogout=null;
    delete menuLi;delete btnlogin;delete btnlogout;
}
function genAppTypeChangeMenuLi(lang){
    var result="";
    if(getAppType_isShowAll()!="false"){
        result+='<li data-icon="false"><select onchange="changeAppType(this);">';
        if(typeof(lang)!="undefined"&&lang=="eng"){
            if(getAppType()=="S"){
                result+='<option value="N">HS Ver</option>'+
                        '<option value="C">CS Ver</option>'+
                        '<option selected="selected" value="S">SS Ver</option>';
            }else if(getAppType()=="C"){
                result+='<option value="N">HS Ver</option>'+
                        '<option selected="selected" value="C">CS Ver</option>'+
                        '<option value="S">SS Ver</option>';
            }else{
                result+='<option selected="selected" value="N">HS Ver</option>'+
                        '<option value="C">CS Ver</option>'+
                        '<option value="S">SS Ver</option>';
            }
        }else{
            if(getAppType()=="S"){
                result+='<option value="N">竹科版</option>'+
                '<option value="C">中科版</option>'+
                '<option selected="selected" value="S">南科版</option>';
            }else if(getAppType()=="C"){
                result+='<option value="N">竹科版</option>'+
                '<option selected="selected" value="C">中科版</option>'+
                '<option value="S">南科版</option>';
            }else{
                result+='<option selected="selected" value="N">竹科版</option>'+
                '<option value="C">中科版</option>'+
                '<option value="S">南科版</option>';
            }
        }
        result+='</select></li>';
    }
    return result;
}
function changeAppType(obj){
    setAppType(obj.value);
    $.mobile.changePage("initial.html");
}
function genMenu(RootElement){
    var dataJsonObject=getAppSetting_Data(),html='',lang=dataJsonObject.language;
    if(typeof(lang)!="undefined"&&lang=="eng"){
        html+='<ul data-role="listview" data-theme="a" data-divider-theme="f" data-count-theme="e">';
        html+=genAppTypeChangeMenuLi(lang);
        html+='<fieldset data-role="controlgroup" data-type="horizontal" class="acenter">';
        html+='<input type="radio" name="radio-choice-lang" id="radio-choice-ch" onclick="swichLanguageTo(&#39;ch&#39;)" value="ch" data-lang="ch" checked="checked">';
        html+='<label for="radio-choice-ch" class="chLabel">中文</label>';
        html+='<input type="radio" name="radio-choice-lang" checked="checked" id="radio-choice-eng" onclick="swichLanguageTo(&#39;eng&#39;)" value="eng"  data-lang="eng">';
        html+='<label for="radio-choice-eng" class="engLabel">English</label>';
        html+='</fieldset>';
        html+='<li data-icon="false"><a rel="external" href="Page_AreaIntro.html"><img class="ui-li-icon ui-corner-none nsc-menu-ui-li-icon" src="img/SlideMenu/info_icon01.png">About SP</a></li>';
        html+='<li data-icon="false"><a rel="external" href="Page_VendorInfo.html"><img class="ui-li-icon ui-corner-none nsc-menu-ui-li-icon" src="img/SlideMenu/info_icon03.png">Companies</a></li>';
        html+='<li data-icon="false"><a rel="external" href="Page_LifeService.html"><img class="ui-li-icon ui-corner-none nsc-menu-ui-li-icon" src="img/SlideMenu/info_icon05.png">Life Information</a></li>';
        html+='<li data-icon="false"><a rel="external" href="Page_About.html"><img class="ui-li-icon ui-corner-none nsc-menu-ui-li-icon" src="img/SlideMenu/info_icon07.png">About</a></li>';
        html+='</ul>';
    }else{
        html+='<ul data-role="listview" data-theme="a" data-divider-theme="f" data-count-theme="e">';
        html+=genAppTypeChangeMenuLi(lang);
        html+='<fieldset data-role="controlgroup" data-type="horizontal" class="acenter">';
        html+='<input type="radio" name="radio-choice-lang" checked="checked" id="radio-choice-ch" onclick="swichLanguageTo(&#39;ch&#39;)" value="ch"  data-lang="ch" checked="checked">';
        html+='<label for="radio-choice-ch" class="chLabel">中文</label>';
        html+='<input type="radio" name="radio-choice-lang" id="radio-choice-eng" onclick="swichLanguageTo(&#39;eng&#39;)" value="eng" data-lang="eng">';
        html+='<label for="radio-choice-eng" class="engLabel">English</label>';
        html+='</fieldset>';
        html+='<li data-icon="false"><a rel="external" href="Page_AreaIntro.html"><img class="ui-li-icon ui-corner-none nsc-menu-ui-li-icon" src="img/SlideMenu/info_icon01.png">科學園區簡介</a></li>';
        html+='<li data-icon="false"><a rel="external" href="Page_NewsAndEvents.html"><img class="ui-li-icon ui-corner-none nsc-menu-ui-li-icon" src="img/SlideMenu/info_icon02.png">訊息與活動</a></li>';
        html+='<li data-icon="false"><a rel="external" href="Page_VendorInfo.html"><img class="ui-li-icon ui-corner-none nsc-menu-ui-li-icon" src="img/SlideMenu/info_icon03.png">廠商資訊</a></li>';
        html+='<li data-icon="false"><a rel="external" href="Page_TranspotInfo.html"><img class="ui-li-icon ui-corner-none nsc-menu-ui-li-icon" src="img/SlideMenu/info_icon04.png">交通資訊</a></li>';
        html+='<li data-icon="false"><a rel="external" href="Page_LifeService.html"><img class="ui-li-icon ui-corner-none nsc-menu-ui-li-icon" src="img/SlideMenu/info_icon05.png">生活服務</a></li>';
        if(getAppType()=="S"){
            html+='<li data-icon="false"><a data-rel="popup" data-position-to="window" href="#popupDialog_ERT" data-transition="pop"><img class="ui-li-icon ui-corner-none nsc-menu-ui-li-icon" src="img/SlideMenu/info_icon12.png">防汛網站</a></li>';
        }
        html+='<li data-icon="false"><a rel="external" href="Page_Jobs.html"><img class="ui-li-icon ui-corner-none nsc-menu-ui-li-icon" src="img/SlideMenu/info_icon06.png">廠商徵才資訊</a></li>';
        html+='<li data-icon="false"><a rel="external" href="Page_About.html"><img class="ui-li-icon ui-corner-none nsc-menu-ui-li-icon" src="img/SlideMenu/info_icon07.png">關於</a></li>';
        html+='<li data-role="list-divider" data-theme="f" class="nsc-menu-ui-li-divider"><img src="img/SlideMenu/info_icon08.png"></img>員工專區';
        html+='<a href="Page_Login.html" rel="external" data-role="button" data-mini="true" data-inline="true" data-theme="f" id="btnlogin" class="btnlogin">登入</a>';
        // html+='<a href="javascript:doLogOut();" data-role="button" data-mini="true" data-inline="true" data-theme="e" id="btnlogout" class="btnlogout">登出</a>';
        html+='</li>';
        if(getLoginData()!=null&&getMenuNumber()!=null){
            var menuNubers=getMenuNumber();
            html+='<li class="LoginSection" data-icon="false"><a rel="external" href="Page_InsideInstantMessage.html">內部訊息公告'+(menuNubers.InsideInstantMessage!=0?'<span class="ui-li-count">'+menuNubers.InsideInstantMessage+'</span>':'')+'</a></li>';
            html+='<li class="LoginSection" data-icon="false"><a rel="external" href="Page_BizFileSharing.html">即時業務資訊'+(menuNubers.BizFileSharing!=0?'<span class="ui-li-count">'+menuNubers.BizFileSharing+'</span>':'')+'</a></li>';
            html+='<li class="LoginSection" data-icon="false"><a rel="external" href="Page_OfficialDocument.html">公文簽核待辦'+(menuNubers.OfficialDocument!=0?'<span class="ui-li-count">'+menuNubers.OfficialDocument+'</span>':'')+'</a></li>';
            html+='<li class="LoginSection" data-icon="false"><a rel="external" href="Page_NewsAndDocument.html">新聞剪影'+(menuNubers.NewsAndDocument!=0?'<span class="ui-li-count">'+menuNubers.NewsAndDocument+'</span>':'')+'</a></li>';
            html+='<li class="LoginSection" data-icon="false"><a rel="external" href="Page_LBS.html#LBS_PostBack">巡查資料回傳</a></li>';
            menuNubers=null;
            delete menuNubers; 
        }else{
            html+='<li class="LoginSection" data-icon="false"><a rel="external" href="Page_InsideInstantMessage.html">內部訊息公告</a></li>';
            html+='<li class="LoginSection" data-icon="false"><a rel="external" href="Page_BizFileSharing.html">即時業務資訊</a></li>';
            html+='<li class="LoginSection" data-icon="false"><a rel="external" href="Page_OfficialDocument.html">公文簽核待辦</a></li>';
            html+='<li class="LoginSection" data-icon="false"><a rel="external" href="Page_NewsAndDocument.html">新聞剪影</a></li>';
            html+='<li class="LoginSection" data-icon="false"><a rel="external" href="Page_LBS.html#LBS_PostBack">巡查資料回傳</a></li>';
        }
        html+='<li class="LoginSection" data-icon="false"><a id="btnlogout" onclick="javascript:doLogOut();">解除裝置註冊</a></li>';
        html+='</ul>';
        //防汛網站
        html+=' <div data-role="popup" id="popupDialog_ERT" data-overlay-theme="a" data-theme="a" data-dismissible="false" style="max-width:400px;padding:20px;" class="ui-corner-all">'+
                '<a data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right" style="position:absolute;top: -10px;">關閉</a><ul data-role="listview" data-inset="true">'+
                '<li><a href="javascript:openBrowser(&#39;http://ert.stsipa.gov.tw/STSP/IPHONE_F/leak-now.php&#39;)">台南園區</a></li>'+
                '<li><a href="javascript:openBrowser(&#39;http://60.249.201.137/pda/&#39;)">高雄園區</a></li>'+
                '</ul></dvi>';
    }
    if(typeof($(RootElement).find("#menu").html())!="undefined"){
        $(RootElement).find("#menu").html(html);
    }else{
        $(RootElement).append('<div data-role="panel" class="menu" data-position="left" data-display="push" data-theme="a" id="menu">'+html+'</div>');
    }
    $(RootElement).trigger('create');
    html=null;lang=null;
    delete html;delete lang;    
}
function getImageArray(HTML_imgs){
    var imageArray=[],toRemove ="data:image/jpeg;base64,",imgSrc,isMain,imgObject;
    if(typeof(HTML_imgs) !== "undefined"&&HTML_imgs!=null&&HTML_imgs.length>0){
        for (var imgIndex=0;imgIndex< HTML_imgs.length; imgIndex++) {
            isMain=$(HTML_imgs[imgIndex]).data("ismain");
            imgSrc=$(HTML_imgs[imgIndex]).attr("src");
            if(typeof(imgSrc) !== "undefined"){
                imgSrc=imgSrc.replace(toRemove,'');
            }
            imgObject={'isMain':''+isMain+'','ximage':imgSrc};
            imageArray.push(imgObject);
        };
    }
    toRemove=null;imgSrc=null;imgObject=null;
    delete toRemove;delete imgSrc,delete imgObject;
    return imageArray;
}
//園區判別
console.log(123);
function identifyParkBase(){
    LoadingObject.show();
    var park,base,result_Base="",result_index="",ap,targetPoint;
    navigator.geolocation.getCurrentPosition(function(position){
        $.ajax({
            url:DataURL_ParkBaseArea,
            data:  {},
            type:"POST",
            dataType :"json",
            async:false,
            success:function(data){
                if(data==null){
                     smoke.alert(ServiceCodeErrorString,{},function(){});
                }else{
                    targetPoint=new point(position.coords.latitude,position.coords.longitude);
                    for(var p_index=0;p_index<data.Parks.length;p_index++){
                        for(var b_index=0;b_index<data.Parks[p_index].Bases.length;b_index++){
                            if(data.Parks[p_index].Bases[b_index].Points.length>0){
                                ap=new Polygon();
                                ap.addJSONsPolyPoints(data.Parks[p_index].Bases[b_index].Points);
                                result_Base=(ap.isPointIn(targetPoint))?data.Parks[p_index].ParkCode+"_"+data.Parks[p_index].Bases[b_index].BaseCode:"";
                                if(result_Base!=""){
                                    if(getDefaultParkAndBase().Park==data.Parks[p_index].ParkCode){
                                        result_index=p_index+"_"+b_index;
                                        break;
                                    }else{
                                        result_Base="";
                                    }
                                }
                            }
                        }
                        if(result_Base!=""){
                            break;
                        }
                    }
                }
                if(result_Base==""){
                    setIdentifyParkBase(getDefaultParkAndBase());
                    setIsInArea(false);
                }else{
                    var defaultPark=result_Base.split('_')[0];
                    var defaultBase=result_Base.split('_')[1];
                    var defaultParkSelectIndex=result_index.split('_')[0];
                    var defaultBaseSelectIndex=result_index.split('_')[1];
                    setIdentifyParkBase({"Park":defaultPark,"Base":defaultBase,"ParkIndex":defaultParkSelectIndex,"BaseIndex":defaultBaseSelectIndex});
                    setIsInArea(true);
                }
                console.log("1208");
            },
            error: function(data){
                LoadingObject.hide();
                setIdentifyParkBase(getDefaultParkAndBase());
                smoke.alert(ServiceErrorString,{},function(){});
            },
            complete: function() {
                LoadingObject.hide();
                result_Base=null;ap=null;targetPoint=null;
                delete result_Base;delete ap;delete targetPoint;
            }
        });
    },function(){setIdentifyParkBase(getDefaultParkAndBase());});
}
//LBS園區判別
function getDefaultParkAndBase(){
    var defaultPark="01";
    var defaultBase="01";
    var defaultParkSelectIndex=0;
    var defaultBaseSelectIndex=0;
    switch(getAppType()){
        case "N":
            defaultPark="01";
            defaultBase="01";
            defaultParkSelectIndex=0;
            defaultBaseSelectIndex=0;
            break;
        case "C":
            defaultPark="03";
            defaultBase="21";
            defaultParkSelectIndex=1;
            defaultBaseSelectIndex=0;
            break;
        case "S":
            defaultPark="02";
            defaultBase="11";
            defaultParkSelectIndex=2;
            defaultBaseSelectIndex=0;
            break;
    }
    return {"Park":defaultPark,"Base":defaultBase,"ParkIndex":defaultParkSelectIndex,"BaseIndex":defaultBaseSelectIndex};
}
function getDefaultParkBaseSelectData(hasAll,langType){
    var defaultPark=getIdentifyParkBase().Park,defaultBase=getIdentifyParkBase().Base,defaultParkStr,defaultBaseStr,targetObj;
    var ParkBaseData=getParkBaseData();
    for(var park_index=0;park_index<ParkBaseData.length;park_index++){
        for(var base_index=0;base_index<ParkBaseData[park_index].Bases.length;base_index++){
            if(ParkBaseData[park_index].ParkCode==defaultPark&&ParkBaseData[park_index].Bases[base_index].BaseCode==defaultBase){

                if(langType=="ch"){
                    defaultParkStr=ParkBaseData[park_index].ParkName;
                    defaultBaseStr=ParkBaseData[park_index].Bases[base_index].BaseName;
                }else{
                    defaultParkStr=ParkBaseData[park_index].ParkEName;
                    defaultBaseStr=ParkBaseData[park_index].Bases[base_index].BaseEName;
                }
                break;
            }
        }
    }
    switch(langType){
        case "ch":
            if(hasAll){
                defaultBase="00";
                defaultBaseStr="全部";
            }
            break;
        case "eng":
            if(hasAll){
                defaultBase="00";
                defaultBaseStr="All";
            }
            break;
    }

    return  {"defaultParkBase":defaultPark+"_"+defaultBase,"defaultParkBaseStr":defaultParkStr+"/"+defaultBaseStr};
}
function getDefaultParkBase(){
    LoadingObject.show();
    var result_Base="",ap,targetPoint;
    navigator.geolocation.getCurrentPosition(function(position){
        $.ajax({
            url:DataURL_ParkBaseArea,
            data:  {},
            type:"POST",
            dataType :"json",
            async:false,
            success:function(data){
                if(data==null){
                     smoke.alert(ServiceCodeErrorString,{},function(){});
                }else{
                    targetPoint=new point(position.coords.latitude,position.coords.longitude);
                    for(var p_index=0;p_index<data.Parks.length;p_index++){
                        for(var b_index=0;b_index<data.Parks[p_index].Bases.length;b_index++){
                            if(data.Parks[p_index].Bases[b_index].Points.length>0){
                                ap=new Polygon();
                                ap.addJSONsPolyPoints(data.Parks[p_index].Bases[b_index].Points);
                                result_Base=(ap.isPointIn(targetPoint))?data.Parks[p_index].ParkCode+"_"+data.Parks[p_index].Bases[b_index].BaseCode:"";
                                setDefaultBaseData(result_Base);
                                if(result_Base!=""){
                                    break;
                                }
                            }
                        }
                        if(result_Base!=""){
                            break;
                        }
                    }
                }
                if(result_Base==""){
                    smoke.alert("沒有鄰近的基地別",{},function(){});
                }
            },
            error: function(data){
                LoadingObject.hide();
                smoke.alert(ServiceErrorString,{},function(){});
            },
            complete: function() {
                LoadingObject.hide();
                result_Base=null;ap=null;targetPoint=null;
                delete result_Base;delete ap;delete targetPoint;
            }
        });
    }, onError);
}
function onError(error) {
    smoke.alert('code:'+ error.code+'\n'+'message:'+ error.message + '\n',{},function(){});
    LoadingObject.hide();
}
function openBrowser(linkURL){
    /*
    20130620 Richard指示這邊先改成inapp模式，並確保不會讓使用者之後反應修改任何與inapp browser相關之問題
    */
    if(navigator.userAgent.match(/(iPhone|iPod|iPad)/)){
        openBrowserInApp(linkURL);
    }else{
        var tempURL=encodeURI(linkURL)
        if(linkURL.indexOf("GetFile.do?") !== -1){
            tempURL=linkURL;
        }
        var ref = window.open(tempURL, '_system', 'location=yes');
        ref.addEventListener('loadstart', function() { alert(event.url); });
    }
}
function openBrowserInApp(linkURL){
    var tempURL=encodeURI(linkURL)
    if(linkURL.indexOf("GetFile.do?") !== -1){
        tempURL=linkURL;
    }
    var ref = window.open(tempURL, '_blank', 'location=no,enableViewportScale=yes');
    ref.addEventListener('loadstart', function() { alert(event.url); });
}
// function openMap(address){
//     var url="http://maps.google.com/maps?q="+address;
//     openBrowser(url);
// }
function getParkBase(inputData,inputType,returnType){
    var result=null;
    var jsonObject_ParkBase=getParkBaseData();
    var park,base,spiltStr;
    var ParkObject,BaseObject;
    if(jsonObject_ParkBase!=null&&typeof(jsonObject_ParkBase)!=="undefined"){
        if(inputType=="name"){
            //inputData like 新竹科學園區/新竹園區
            spiltStr="/";
        }else{
            //inputData like 1_1
            spiltStr="_";
        }
        if(typeof(spiltStr) !=="undefined"){
            var tmp=inputData.split(spiltStr);
            if(tmp.length==2){
                park=tmp[0];
                base=tmp[1];
                for(var p_index=0;p_index<jsonObject_ParkBase.length;p_index++){
                    if((inputType=="name"&&jsonObject_ParkBase[p_index].ParkName==park)||(inputType=="code"&&jsonObject_ParkBase[p_index].ParkCode==park)){
                        ParkObject=jsonObject_ParkBase[p_index]; 
                    }
                    if(typeof(ParkObject)!=="undefined"){
                        for(var b_index=0;b_index<ParkObject.Bases.length;b_index++){
                            if((inputType=="name"&&ParkObject.Bases[b_index].BaseName==base)||(inputType=="code"&&ParkObject.Bases[b_index].BaseCode==base)){
                                BaseObject=ParkObject.Bases[b_index];
                                break;
                            }
                        }
                        
                        if(typeof(BaseObject)!=="undefined"){
                            
                            if(returnType=="name"){
                                //inputData like 新竹科學園區/新竹園區
                                result=ParkObject.ParkName+"/"+BaseObject.BaseName;
                            }else{
                                //inputData like 1_1
                                result=ParkObject.ParkCode+"_"+BaseObject.BaseCode;
                            }
                            break;
                        }
                    }
                }
            }
        }
    }
    return result;
}
function getClassify(inputData,inputType,returnType){
    var result=null;
    var jsonObject_Classify=getClassifyData();
    var classify1,classify2,spiltStr;
    var Classify1Object,Classify2Object;
    if(jsonObject_Classify!=null&&typeof(jsonObject_Classify)!=="undefined"){
        if(inputType=="name"){
            //inputData like 機關/管理局
            spiltStr="/";
        }else{
            //inputData like A_001
            spiltStr="_";
        }
        if(typeof(spiltStr) !=="undefined"){
            var tmp=inputData.split(spiltStr);
            if(tmp.length==2){
                classify1=tmp[0];
                classify2=tmp[1];
                for(var c1_index=0;c1_index<jsonObject_Classify.length;c1_index++){
                    if((inputType=="name"&&jsonObject_Classify[c1_index].classify1Name==classify1)||(inputType=="code"&&jsonObject_Classify[c1_index].classify1Code==classify1)){
                        Classify1Object=jsonObject_Classify[c1_index]; 
                    }
                    if(typeof(Classify1Object)!=="undefined"){
                        for(var c2_index=0;c2_index<Classify1Object.classify2s.length;c2_index++){
                            if((inputType=="name"&&Classify1Object.classify2s[c2_index].classify2Name==classify2)||(inputType=="code"&&Classify1Object.classify2s[c2_index].classify2Code==classify2)){
                                Classify2Object=Classify1Object.classify2s[c2_index];
                                break;
                            }
                        }

                        if(typeof(Classify2Object)!=="undefined"){
                            
                            if(returnType=="name"){
                                //inputData like 新竹科學園區/新竹園區
                                result=Classify1Object.classify1Name+"/"+Classify2Object.classify2Name;
                            }else{
                                //inputData like 1_1
                                result=Classify1Object.classify1Code+"_"+Classify2Object.classify2Code;
                            }
                            break;
                        }
                    }
                }
            }
        }
    }
    return result;
}
function iniGPRS(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            setGPRSData({"lat":position.coords.latitude,"lng":position.coords.longitude});
        });
    }else{
        smoke.alert(gprsErrorString,{},function(){});
        var point=getMapDefaultPoint();
        setGPRSData({"lat":point.lat,"lng":point.lng});
    } 
}
function getMapDefaultPoint(){
    var defaultPoint;
    switch(getAppType()){
        case "N":
            defaultPoint=mapDefaultPoint_N;
            break;
        case "C":
            defaultPoint=mapDefaultPoint_C;
            break;
        case "S":
            defaultPoint=mapDefaultPoint_S;
            break;
        default:
            defaultPoint=mapDefaultPoint_N;
    }  
    return defaultPoint;
}
function showInstantMessage(park,messageContent){
    var Park_str="" 
    switch(park){
        case "01":
            Park_str="竹科";
            break;
        case "03":
            Park_str="中科";
            break;
        case "02":
            Park_str="南科";
            break;
    }
    if(messageContent!=""){
    //structure header
        var header = $("<div>").
            attr("data-role", "header").
            attr("data-theme","a").
            addClass("ui-header ui-bar-f").
            html("<h1>"+Park_str+"即時公告</h1>");

        //structure content div
        var content = $("<div>").
            attr("data-role", "content").
            attr("data-theme","f").
            addClass("ui-corner-bottom ui-content").
            html('<h3 class="ui-title">'+messageContent+'</h3><div style="text-align:center;"><a data-role="button" href="index.html" data-inline="true" data-mini="true" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="e" class="ui-btn ui-shadow ui-btn-corner-all ui-mini ui-btn-inline ui-btn-up-e"><span class="ui-btn-inner"><span class="ui-btn-text">確認</span></span></a></div>');
            // html('<h3 class="ui-title">'+messageContent+'</h3><div style="text-align:center;"><button onclick="goToIndexPage();" data-mini="true" data-role="button" data-inline="true" data-rel="back" data-theme="e">確定</button></div>');
            // content.find('button').button().button('refresh');

        //put it all together
        var div = $("<div>").
            attr("data-role", "popup").
            attr("data-overlay-theme","a").
            attr("data-dismissible","false").
            attr("class","ui-corner-top").
            attr("style","max-width:280px;min-width: 280px;").
            attr("id", "InstantMessage_PopupDialog").
            append(header).
            append(content);
        div.trigger('create');
        setTimeout(function () {

           div.popup().popup('open');
        }, 500);
    }
}
