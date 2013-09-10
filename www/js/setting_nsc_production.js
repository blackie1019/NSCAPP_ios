/*DNS設定說明

1. 凌網測試機
http://nscallinone2.hyweb.com.tw:8080
http://nscallinone.hyweb.com.tw:8080

2. 國科會測試機
http://TAP0923.nsc.gov.tw

3. 國科會正式機
http://mas.most.gov.tw

*/
//global data
var Setting_imgSrc="http://mas.most.gov.tw/AppService/GetFile.do?fs=1&ftype=lbs&isAttache=false&path=server1/lbsData/";
var Setting_classifyImgSrc="http://mas.most.gov.tw/AppService/GetFile.do?fs=1&ftype=lbs&isAttache=false&path=server1/classify/";
var Setting_lineImgSrc="http://mas.most.gov.tw/AppService/GetFile.do?fs=1&ftype=lbs&isAttache=false&path=server1/line/";
var Setting_FAQImgSrc="http://mas.most.gov.tw/AppService/GetFile.do?fs=1&ftype=lbs&isAttache=false&path=server1/faqClassify/";
var notfindPic=Setting_imgSrc+"notfind.png";
//System String
var LoadingString="資料讀取中..";
var ServiceErrorString="資料讀取發生錯誤";
var ServiceDataErrorString="資料發生錯誤";
var ServiceCodeErrorString="服務程式發生錯誤";
var LBSDataVerifyError="請填入紅色星號必填欄位資料";
var timeoutErrorString="服務處理逾時,請重新操作";
var classify2RequirementString="<img src='img/NSC/ExclamationMark.png'></img>請先勾選一項類別";
var gprsErrorString="GPRS座標取得發生錯誤";
var gmapSearchNotFindString="查無此兩位置之路徑";
var nearAlertString_already="目前已將此點設為通知點";
var nearAlertString_notCheckedBeforeSendFromList="請選擇其中一位置坐位提醒點";
var SettingOKString="設定成功";
var SettingFailString="設定失敗，請重新操作";

var LoadingString_eng="Loading..";
var classify2RequirementString_eng="<img src='img/NSC/ExclamationMark.png'></img>Please choose at least one point";
var gprsErrorString_eng="GPRS error";
var gmapSearchNotFindString_eng="Can't find the path";
var nearAlertString_already_eng="Notification has been set";
var nearAlertString_notCheckedBeforeSendFromList_eng="Please choose at least one point";
var SettingOKString_eng="Setting success";
var SettingFailString_eng="Setting faild, please retry";

//Service URL
/*DefaultPage*/
var DefaultPage_ch="Page_NewsAndEvents.html";
var DefaultPage_eng="Page_AreaIntro.html"; 
/*DB*/
var commonURL_DB="http://mas.most.gov.tw/AppService/Main.do?name=commonURL_DB&jsoncallback=?";
/*LBS*/
var queryURL_LBS_LandInfo="http://mas.most.gov.tw/AppService/Main.do?name=queryURL_LBS_LandInfo&jsoncallback=?";
var queryURL_LBS_EntryPoint="http://mas.most.gov.tw/AppService/Main.do?name=queryURL_LBS_EntryPoint&jsoncallback=?";
var deleteURL_LBS_LandInfo="http://mas.most.gov.tw/AppService/Main.do?name=deleteURL_LBS_LandInfo";
var deleteURL_LBS_EntryPoint="http://mas.most.gov.tw/AppService/Main.do?name=deleteURL_LBS_EntryPoint";
var updateURL_LBS_LandInfo="http://mas.most.gov.tw/AppService/Main.do?name=updateURL_LBS_LandInfo";
var updateURL_LBS_EntryPoint="http://mas.most.gov.tw/AppService/Main.do?name=updateURL_LBS_EntryPoint";
var insertURL_LBS_LandInfo="http://mas.most.gov.tw/AppService/Main.do?name=insertURL_LBS_LandInfo";
var insertURL_LBS_EntryPoint="http://mas.most.gov.tw/AppService/Main.do?name=insertURL_LBS_EntryPoint";
//Data
/*科學園區簡介*/
var DataURL_ParkIntro="http://mas.most.gov.tw/AppService/Main.do?name=DataURL_ParkIntro&jsoncallback=?";
/*訊息與活動*/
var DataURL_NewsAndEvents_LP="http://mas.most.gov.tw/AppService/getNews.do?name=DataURL_NewsAndEvents_LP&jsoncallback=?";
var DataURL_NewsAndEvents_CP="http://mas.most.gov.tw/AppService/getNewsCP.do?name=DataURL_NewsAndEvents_CP&jsoncallback=?";
/*廠商資訊*/
var DataURL_VendorInfo_QP="http://mas.most.gov.tw/AppService/getVendorInfo.do?name=DataURL_VendorInfo_QP&jsoncallback=?";
var DataURL_VendorInfo_LP="http://mas.most.gov.tw/AppService/getVendorInfoLP.do?name=DataURL_VendorInfo_LP&jsoncallback=?";
var DataURL_VendorInfo_CP="http://mas.most.gov.tw/AppService/getVendorInfoCP.do?name=DataURL_VendorInfo_CP&jsoncallback=?";
var DataURL_VendorInfo_sub_CP="http://mas.most.gov.tw/AppService/getVendorInfoSubCP.do?name=DataURL_VendorInfo_sub_CP&jsoncallback=?";
/*交通資訊*/
var DataURL_TranspoltInfo_index="http://mas.most.gov.tw/AppService/json/Page_TranspotInfo_index.json";
var DataURL_TranspoltInfo_aroundStop="http://mas.most.gov.tw/TransportService/NeighborService?name=DataURL_TranspoltInfo_aroundStop&jsoncallback=?";
var DataURL_TranspoltInfo_index_03="http://mas.most.gov.tw/TransportService/HighwayBusQueryService?name=DataURL_TranspoltInfo_index_03&jsoncallback=?";
var DataURL_TranspoltInfo_index_04="http://mas.most.gov.tw/TransportService/PublicBusQueryService?name=DataURL_TranspoltInfo_index_04&jsoncallback=?";
var DataURL_TranspoltInfo_index_05="http://mas.most.gov.tw/TransportService/TrafficLineService?name=DataURL_TranspoltInfo_index_05&jsoncallback=?";
var DataURL_TranspoltInfo_LP_01="http://mas.most.gov.tw/TransportService/ThsrcTimetableService?name=DataURL_TranspoltInfo_LP_01&jsoncallback=?";
var DataURL_TranspoltInfo_LP_02="http://mas.most.gov.tw/TransportService/RailwayTimetableService?name=DataURL_TranspoltInfo_LP_02&jsoncallback=?";
var DataURL_TranspoltInfo_LP_03="http://mas.most.gov.tw/TransportService/HighwayBusTimetableService?name=DataURL_TranspoltInfo_LP_03&jsoncallback=?";
var DataURL_TranspoltInfo_LP_04_1="http://mas.most.gov.tw/TransportService/PublicBusTimetableService?name=DataURL_TranspoltInfo_LP_04_1&jsoncallback=?";
var DataURL_TranspoltInfo_LP_05_1="http://mas.most.gov.tw/TransportService/TrafficAllinOne?name=DataURL_TranspoltInfo_LP_05_1&jsoncallback=?";
var DataURL_TranspoltInfo_BusStopMap="http://mas.most.gov.tw/TransportService/TurningPointService?name=DataURL_TranspoltInfo_BusStopMap&jsoncallback=?";
var DataURL_TranspoltInfo_BusMap="http://mas.most.gov.tw/TransportService/BusLocationService?name=DataURL_TranspoltInfo_BusMap&jsoncallback=?";
var DataURL_TranspoltInfo_LP_05_2="http://mas.most.gov.tw/TransportService/TrafficQueryLineService?name=DataURL_TranspoltInfo_LP_05_2&jsoncallback=?";
var DataURL_TranspoltInfo_QP_05="http://mas.most.gov.tw/TransportService/TrafficQueryService?name=DataURL_TranspoltInfo_QP_05&jsoncallback=?";
var DataURL_TranspoltInfo_CP_01="http://mas.most.gov.tw/TransportService/ThsrcTransferService?name=DataURL_TranspoltInfo_CP_01&jsoncallback=?";
var DataURL_TranspoltInfo_CP_02="http://mas.most.gov.tw/TransportService/RailwayTransferService?name=DataURL_TranspoltInfo_CP_02&jsoncallback=?";
var DataURL_TranspoltInfo_CP_05="http://mas.most.gov.tw/TransportService/TrafficTransferService?name=DataURL_TranspoltInfo_CP_05&jsoncallback=?";
var DataURL_TranspoltInfo_CP_09="http://mas.most.gov.tw/AppService/Main.do?name=commonURL_DB&jsoncallback=?";
var DataURL_TranspoltInfo_getRouteLocationInfo="http://mas.most.gov.tw/AppService/getRouteLocationInfo.do?name=getRouteLocationInfo&jsoncallback=?";
/*生活服務*/
var DataURL_Classify="http://mas.most.gov.tw/AppService/getLifeService.do?name=DataURL_Classify&jsoncallback=?"
/*廠商徵才資訊*/
var DataURL_Jobs_QP="http://mas.most.gov.tw/AppService/getVendorJobInfo.do?name=DataURL_Jobs_QP&jsoncallback=?";
var DataURL_Jobs_LP="http://mas.most.gov.tw/AppService/getVendorJobInfoLP.do?name=DataURL_Jobs_LP&jsoncallback=?";
var DataURL_Jobs_CP="http://mas.most.gov.tw/AppService/getVendorJobInfoCP.do?name=DataURL_Jobs_CP&jsoncallback=?";
/*關於*/
/*系統公告*/
var DataURL_SystemMessage="http://mas.most.gov.tw/AppService/json/SystemMessage.json";
/*其他APP*/
var DataURL_AppInfo="http://mas.most.gov.tw/AppService/json/AppInfo.json";
/*常見問題*/
var DataURL_FAQ_NP="http://mas.most.gov.tw/AppService/getFAQInfo.do?name=DataURL_FAQ_NP&jsoncallback=?";
var DataURL_FAQ_LP="http://mas.most.gov.tw/AppService/getFAQLP.do?name=DataURL_FAQ_LP&jsoncallback=?";
var DataURL_ContactUs="http://mas.most.gov.tw/AppService/getAboutUs.do?name=DataURL_ContactUs&jsoncallback=?"
/*即時業務資訊*/
/*即時公告*/
var InstantMessage="http://mas.most.gov.tw/AppService/getAppInstantMessageLP.do?name=InstantMessage&jsoncallback=?";
/*內部訊息公告*/
var InsideInstantMessage_LP="http://mas.most.gov.tw/AppService/getInsideInstantMessageLP.do?name=InsideInstantMessage_LP&jsoncallback=?";
var InsideInstantMessage_CP="http://mas.most.gov.tw/AppService/getInsideInstantMessageCP.do?name=InsideInstantMessage_CP&jsoncallback=?";
/*公文簽核待辦通知*/
var DataURL_OfficialDocument_LP="http://mas.most.gov.tw/AppService/json/Page_OfficialDocument_LP.json";
var DataURL_OfficialDocument_index_lees="http://mas.most.gov.tw/AppService/json/Page_OfficialDocument_index_lees.json";
var DataURL_OfficialDocument_index_ken="http://mas.most.gov.tw/AppService/json/Page_OfficialDocument_index_ken.json";
/*新聞剪影*/
var DataURL_NewsAndDocument_index="http://mas.most.gov.tw/AppService/Main.do?name=DataURL_NewsAndDocument_index&jsoncallback=?";
var DataURL_NewsAndDocument_LP="http://mas.most.gov.tw/AppService/Main.do?name=DataURL_NewsAndDocument_LP&jsoncallback=?";
var DataURL_NewsAndDocument_CP="http://mas.most.gov.tw/AppService/Main.do?name=DataURL_NewsAndDocument_CP&jsoncallback=?";

/*LBS*/
var mapDefaultPoint_N={"lat":24.78190,"lng":121.00594};//竹科
var mapDefaultPoint_C={"lat":24.215187,"lng":120.61909};//中科
var mapDefaultPoint_S={"lat":23.099174,"lng":120.282977};//南科
var DataURL_LBSQueryService="http://mas.most.gov.tw/TransportService/LBSQueryService?name=DataURL_LBSQueryService&jsoncallback=?";
/*園區判定*/
var DataURL_ParkBaseArea="http://mas.most.gov.tw/AppService/json/area.json"; 
// var DataURL_ParkBaseArea="json/area.json"; 
/*會員資料*/
var DataURL_MemberData_getToken1="http://mas.most.gov.tw/AppService/GetToken1.do?name=DataURL_MemberData_getToken1&jsoncallback=?";
var DataURL_MemberData_vaildToken1="http://mas.most.gov.tw/AppService/ValidToken1.do?name=DataURL_MemberData_vaildToken1&jsoncallback=?";
var DataURL_MemberData_getToken2="http://mas.most.gov.tw/AppService/GetToken2.do?name=DataURL_MemberData_getToken2&jsoncallback=?";
var DataURL_MemberData_vaildToken2="http://mas.most.gov.tw/AppService/ValidToken2.do?name=DataURL_MemberData_vaildToken2&jsoncallback=?";
//Richard Dev
/*Page_ChooseUser.html*/
var DataURL_OfficialDocument_AGENT = "http://mas.most.gov.tw/AppService/GetODAgentInfo.do";
var DataURL_BFS_GETORGLIST = "http://mas.most.gov.tw/AppService/getOrgList.do?jsoncallback=?";
var DataURL_BFS_GETORGINFO = "http://mas.most.gov.tw/AppService/getOrgInfo.do?jsoncallback=?";
/*Page_BizFileSharing.html*/
var DataURL_BFS = "http://mas.most.gov.tw/AppService/Main.do";
var DataURL_BFS_android_Upload = "http://mas.most.gov.tw/AppService/Upload.do";
/*Page_officialDocument.html*/
var DataURL_OfficialDocument_LP = "http://mas.most.gov.tw/AppService/GetODToListMobInfo.do";
        
//Setting load from web service
function loadSetting(){
    //如果DB沒資料則取得資料後存回LocalStorage
    var ParkBaseData=[
        {
            "ParkCode":"01",
            "ParkName":"新竹科學園區",
            "ParkEName":"HSP",
            "Bases":[
                {"BaseCode":"01","BaseName":"新竹園區","BaseEName":"Hsinchu"},
                {"BaseCode":"02","BaseName":"竹南園區","BaseEName":"Zhunan"},                        
                {"BaseCode":"03","BaseName":"銅鑼園區","BaseEName":"Tongluo"},
                {"BaseCode":"04","BaseName":"生醫園區","BaseEName":"Biomedical"},
                {"BaseCode":"05","BaseName":"龍潭園區","BaseEName":"Longtan"},
                {"BaseCode":"06","BaseName":"宜蘭園區","BaseEName":"Yilan"},
            ]
        },
        {
            "ParkCode":"03",
            "ParkName":"中部科學園區",
            "ParkEName":"CTSP",
            "Bases":[
                {"BaseCode":"21","BaseName":"台中園區","BaseEName":"Taichung"},
                {"BaseCode":"22","BaseName":"雲林園區","BaseEName":"Huwei"},
                {"BaseCode":"23","BaseName":"后里園區","BaseEName":"Houli"},
                {"BaseCode":"24","BaseName":"二林園區","BaseEName":"Erlin"},
                {"BaseCode":"25","BaseName":"高等研究園區","BaseEName":"Advanced Research"}
            ]
        },
        {
            "ParkCode":"02",
            "ParkName":"南部科學園區",
            "ParkEName":"STSP",
            "Bases":[
                {"BaseCode":"11","BaseName":"台南園區","BaseEName":"Tainan"},
                {"BaseCode":"12","BaseName":"高雄園區","BaseEName":"Kaohsiung"}
            ]
        }
        ];
    var ClassifyData=[                
        {"classify1Name":"機關",
        "classify1Code":"A",
        "classify2s":[{"classify2Code":"001","classify2Name":"管理局"},{"classify2Code":"002","classify2Name":"公會"},{"classify2Code":"003","classify2Name":"服務大樓"}]},
        {"classify1Name":"文教古跡",
        "classify1Code":"B",
        "classify2s":[{"classify2Code":"004","classify2Name":"學校"},{"classify2Code":"005","classify2Name":"博物館"},{"classify2Code":"006","classify2Name":"廟宇"},{"classify2Code":"007","classify2Name":"公共藝術"}]
        },
        {"classify1Name":"運動休閒",
        "classify1Code":"C",
        "classify2s":[{"classify2Code":"008","classify2Name":"公園廣場"},{"classify2Code":"009","classify2Name":"生態保育區"},{"classify2Code":"010","classify2Name":"球場"},{"classify2Code":"011","classify2Name":"游泳池"}]
        },
        {"classify1Name":"民生",
        "classify1Code":"D",
        "classify2s":[{"classify2Code":"012","classify2Name":"餐廳"},{"classify2Code":"013","classify2Name":"公共廁所"},{"classify2Code":"014","classify2Name":"便利商店"},{"classify2Code":"015","classify2Name":"加油站"}]
        },
        {"classify1Name":"住宿",
        "classify1Code":"E",
        "classify2s":[{"classify2Code":"016","classify2Name":"宿舍"}]
        },
        {"classify1Name":"醫療",
        "classify1Code":"F",
        "classify2s":[{"classify2Code":"017","classify2Name":"園區聯合診所"}]
        },
        {"classify1Name":"金融",
        "classify1Code":"G",
        "classify2s":[{"classify2Code":"018","classify2Name":"郵局"},{"classify2Code":"019","classify2Name":"銀行"},{"classify2Code":"020","classify2Name":"ATM"}]
        },
        {"classify1Name":"警消",
        "classify1Code":"H",
        "classify2s":[{"classify2Code":"021","classify2Name":"保警隊"},{"classify2Code":"022","classify2Name":"消防隊"}]
        },
        {"classify1Name":"交通",
        "classify1Code":"I",
        "classify2s":[{"classify2Code":"023","classify2Name":"車站(站牌)"},{"classify2Code":"024","classify2Name":"停車場"},{"classify2Code":"025","classify2Name":"拖吊場"},{"classify2Code":"026","classify2Name":"園區重要入口(國道交流道入口)"}]
        },                              
        {"classify1Name":"廠商",
        "classify1Code":"J",
        "classify2s":[{"classify2Code":"027","classify2Name":"公司工廠"},{"classify2Code":"028","classify2Name":"報關行"},{"classify2Code":"029","classify2Name":"運輸"},{"classify2Code":"030","classify2Name":"律師&會計師"}]
        },
        {"classify1Name":"iTaiwan熱點",
        "classify1Code":"K",
        "classify2s":[{"classify2Code":"031","classify2Name":"iTaiwan熱點"}]
        }
    ]
    //存回LocalStorage
    setParkBaseData(ParkBaseData);
    setClassifyData(ClassifyData);
    //
}
//localStorage
function clearAllStorage(){
    var dataObject=getLoginData();
    var deviceOject=getDeviceData();
    var SettingData_NotificationDataObject=getNotificationData();
    window.localStorage.clear();
    //等待清除時間(1秒)
    setTimeout(function(){},1000);
    if(dataObject!=null&&typeof(dataObject.account)!="undefined"){
        var jsonObject={"Park":getDefaultParkAndBase().Park,"token":dataObject.token1,"account":dataObject.account};
        var jsonObjectStr = JSON.stringify(jsonObject);
        $.ajax({
            url:DataURL_MemberData_vaildToken1,
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
                            //menuNumber
                            setMenuNumber(data.jsonOutput.menuLoginDisplayNumber);
                            //device
                            setDeviceData(deviceOject);
                            //設定登入資料
                            setLoginData(dataObject);  
                        }
                    }else{
                        smoke.alert(data.message,{},function(){});
                    }
                    //設定通知效果
                    setNotificationData(SettingData_NotificationDataObject);
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
//暫存
function setTemp_ThsrcTransferService(Data)
{
    window.localStorage.setItem("Temp_ThsrcTransferService",JSON.stringify(Data));
}
function getTemp_ThsrcTransferService()
{
    return JSON.parse(window.localStorage.getItem("Temp_ThsrcTransferService"));
}
function clearTemp_ThsrcTransferService(){
    window.localStorage.removeItem("Temp_ThsrcTransferService");
}
function setMapData(Data)
{
    window.localStorage.setItem("MapData",JSON.stringify(Data));
}
function getMapData()
{
    return JSON.parse(window.localStorage.getItem("MapData"));
}
function clearMapData(){
    window.localStorage.removeItem("MapData");
}
//設定
function getTarget_LBS_LandInfoGUID(){
    return  window.localStorage.getItem("Target_LBS_LandInfoGUID");
}
function setTarget_LBS_LandInfoGUID(GUID){
    window.localStorage.setItem("Target_LBS_LandInfoGUID",GUID);
}
function removeTarget_LBS_LandInfoGUID(){
    window.localStorage.removeItem("Target_LBS_LandInfoGUID");
}
function getAppType_isShowAll(){
    return  window.localStorage.getItem("AppType_isShowAll");
}
function setAppType_isShowAll(isShow){
    window.localStorage.setItem("AppType_isShowAll",isShow);
}
function removeAppType_isShowAll(){
    window.localStorage.removeItem("AppType_isShowAll");
}
function getAppType(){ 
    return window.localStorage.getItem("AppType");
}
function setAppType(type){
    window.localStorage.setItem("AppType",type);
}
function removeAppType(){
    window.localStorage.removeItem("AppType");
}
function clearNotificationData(){
    window.localStorage.removeItem("SettingData_NotificationData");
}
function setNotificationData(data)
{
    window.localStorage.setItem("SettingData_NotificationData",JSON.stringify(data));
}
function getNotificationData()
{
    return JSON.parse(window.localStorage.getItem("SettingData_NotificationData"));
}
function getTarget_LBS_spotNo(){
    return  window.localStorage.getItem("Target_LBS_spotNo");
}
function setTarget_LBS_spotNo(spotNo){
    window.localStorage.setItem("Target_LBS_spotNo",spotNo);
}
function removeTarget_LBS_spotNo(){
    window.localStorage.removeItem("Target_LBS_spotNo");
}
function getTarget_LBS_code(){
    return  window.localStorage.getItem("Target_LBS_code");
}
function setTarget_LBS_code(code){
    window.localStorage.setItem("Target_LBS_code",code);
}
function removeTarget_LBS_code(){
    window.localStorage.removeItem("Target_LBS_code");
}
function getTarget_LBS_EntryPointID(){
    return  window.localStorage.getItem("Target_LBS_EntryPointID");
}
function setTarget_LBS_EntryPointID(EntryPointID){
    window.localStorage.setItem("Target_LBS_EntryPointID",EntryPointID);
}
function removeTarget_LBS_EntryPointID(){
    window.localStorage.removeItem("Target_LBS_EntryPointID");
}
function getTarget_LBS_LandInfoActionType(){
    return  window.localStorage.getItem("Target_LBS_LandInfoActionType");
}
function setTarget_LBS_LandInfoActionType(ActionType){
    window.localStorage.setItem("Target_LBS_LandInfoActionType",ActionType);
}
function removeTarget_LBS_LandInfoActionType(){
    window.localStorage.removeItem("Target_LBS_LandInfoActionType");
}
function getTarget_LBS_EntryPointActionType(){
    return  window.localStorage.getItem("Target_LBS_EntryPointActionType");
}
function setTarget_LBS_EntryPointActionType(ActionType){
    window.localStorage.setItem("Target_LBS_EntryPointActionType",ActionType);
}
function removeTarget_LBS_EntryPointActionType(){
    window.localStorage.removeItem("Target_LBS_EntryPointActionType");
}
function setLoginData(LoginData)
{
    window.localStorage.setItem("LoginData",JSON.stringify(LoginData));
}
function getLoginData()
{
    return JSON.parse(window.localStorage.getItem("LoginData"));
}
function clearLoginData(){
    window.localStorage.removeItem("LoginData");
}
function setClassifyData(ClassifyJsonObject)
{
    window.localStorage.setItem("SettingData_Classify",JSON.stringify(ClassifyJsonObject));
}
function getClassifyData()
{
    return JSON.parse(window.localStorage.getItem("SettingData_Classify"));
}
function clearClassifyData(){
    window.localStorage.removeItem("SettingData_Classify");
}
function setAppInstantMessage(jsonObject)
{
    window.localStorage.setItem("SettingData_AppInstantMessage",JSON.stringify(jsonObject));
}
function getAppInstantMessage()
{
    return window.localStorage.getItem("SettingData_AppInstantMessage")!="undefined"?JSON.parse(window.localStorage.getItem("SettingData_AppInstantMessage")):null;

}
function clearAppInstantMessage(){
    window.localStorage.removeItem("SettingData_AppInstantMessage");
}
function setTranspotInfoLoadPage(PageObject)
{
    window.localStorage.setItem("SettingData_TranspotInfoLoadPage",JSON.stringify(PageObject));
}
function getTranspotInfoLoadPage()
{
    return window.localStorage.getItem("SettingData_TranspotInfoLoadPage")!="undefined"?JSON.parse(window.localStorage.getItem("SettingData_TranspotInfoLoadPage")):null;
}
function clearTranspotInfoLoadPage(){
    window.localStorage.removeItem("SettingData_TranspotInfoLoadPage");
}
function setTranspotInfoBackPage(PageObject)
{
    window.localStorage.setItem("SettingData_TranspotInfoBackPage",JSON.stringify(PageObject));
}
function getTranspotInfoBackPage()
{
    return window.localStorage.getItem("SettingData_TranspotInfoBackPage")!="undefined"?JSON.parse(window.localStorage.getItem("SettingData_TranspotInfoBackPage")):null;
}
function clearTranspotInfoBackPage(){
    window.localStorage.removeItem("SettingData_TranspotInfoBackPage");
}

function setToken2VaildBackPage(Page)
{
    window.localStorage.setItem("SettingData_Token2VaildBackPage",Page);
}
function getToken2VaildBackPage()
{
    return window.localStorage.getItem("SettingData_Token2VaildBackPage");
}
function clearToken2VaildBackPage(){
    window.localStorage.removeItem("SettingData_Token2VaildBackPage");
}
//GPRS相關
function setDefaultBaseData(DefaultBase)
{
    window.localStorage.setItem("SettingData_DefaultBase",DefaultBase);
}
function getDefaultBaseData()
{
    return window.localStorage.getItem("SettingData_DefaultBase");
}
function clearDefaultBaseData(){
    window.localStorage.removeItem("SettingData_DefaultBase");
}
function setGPRSData(Data)
{
    window.localStorage.setItem("GPRSData",JSON.stringify(Data));
}
function getGPRSData()
{
    return JSON.parse(window.localStorage.getItem("GPRSData"));
}
function clearGPRSData(){
    window.localStorage.removeItem("GPRSData");
}
function setParkBaseData(ParksJsonObject)
{
    window.localStorage.setItem("SettingData_ParkBase",JSON.stringify(ParksJsonObject));
}
function getParkBaseData()
{
    return JSON.parse(window.localStorage.getItem("SettingData_ParkBase"));
}
function clearParkBaseData(){
    window.localStorage.removeItem("SettingData_ParkBase");
}
function setIdentifyParkBase(ParksJsonObject)
{
    window.localStorage.setItem("SettingData_IdentifyParkBase",JSON.stringify(ParksJsonObject));
}
function getIdentifyParkBase()
{
    return JSON.parse(window.localStorage.getItem("SettingData_IdentifyParkBase"));
}
function clearIdentifyParkBase(){
    window.localStorage.removeItem("SettingData_IdentifyParkBase");
} 
function setIsInArea(IsInArea)
{
    window.localStorage.setItem("SettingData_IsInArea",IsInArea);
}
function getIsInArea()
{
    return window.localStorage.getItem("SettingData_IsInArea");
}
function clearIsInArea(){
    window.localStorage.removeItem("SettingData_IsInArea");
} 
//Device data
function setDeviceData(Data){
    window.localStorage.setItem("DeviceData",JSON.stringify(Data));
}
function getDeviceData(){
    return  JSON.parse(window.localStorage.getItem("DeviceData"));
}
function clearDeviceData(){
    window.localStorage.removeItem("DeviceData");
}
//MenuNumber
function setMenuNumber(Data){
    window.localStorage.setItem("SettingData_MenuNumber",JSON.stringify(Data));
}
function getMenuNumber(){
    return  JSON.parse(window.localStorage.getItem("SettingData_MenuNumber"));
}
function clearMenuNumber(){
    window.localStorage.removeItem("SettingData_MenuNumber");
}
//AppSetting
function setAppFisrtIni(TrueOrFalse)
{
    window.localStorage.setItem("SettingData_AppFisrtIni",TrueOrFalse);
}
function getAppFisrtIni()
{
    return window.localStorage.getItem("SettingData_AppFisrtIni");
}
function clearAppFisrtIni(){
    window.localStorage.removeItem("SettingData_AppFisrtIni");
}
function setAppSetting_Data(Data){
    window.localStorage.setItem("SettingData_AppSetting_Data",JSON.stringify(Data));
}
function getAppSetting_Data(){
    return  JSON.parse(window.localStorage.getItem("SettingData_AppSetting_Data"));
}
function clearAppSetting_Data(){
    window.localStorage.removeItem("SettingData_AppSetting_Data");
}