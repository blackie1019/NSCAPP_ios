//constructor 
function HyMap(draggable){
	//static variable
	var mapDiv,center,zoomsize;
	//variables
	var map,
		divDirectionDetail,
		nearAlertSpot,
		geolocationID,
		map_markers,
		map_paths,
		map_polyLines,
		map_infoWindowData,
		map_icons,
		geocoder,
		directionsService,
		DirectionsService,
		selectedTravelMode,
		isDraggable;
	//initialize
	this.map_markers=[];
	this.map_paths=[];
	this.map_polyLines=[];
	this.map_infoWindowData=[];
	this.map_icons={
		self:{icon:"img/Map/position_icon01.png"},
		route_A:{icon:"img/Map/position_icon08.png"},
		route_B:{icon:"img/Map/position_icon07.png"},
		position:{icon:"img/Map/position_icon11.png"}
	};
	this.geocoder= new google.maps.Geocoder();
	this.directionsService = new google.maps.DirectionsService();
	this.selectedTravelMode=google.maps.TravelMode["DRIVING"] ;//"DRIVING","WALKING","BICYCLING","TRANSIT"
	(typeof(draggable)=="undefined")?this.isDraggable=false:this.isDraggable=true;
}		
/*method*/
//[iniMap]地圖初始化
HyMap.prototype.ini=function(mapDiv,center,zoomsize){
	var oThis=this;
	//設定static variable
	oThis.mapDiv=mapDiv;
	oThis.center=center;
	oThis.zoomsize=zoomsize;
	//地圖設定
	var mapOptions = {
	 	disableDefaultUI:true,
	    zoom: zoomsize,
	    center: center,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	  };
	 oThis.map=new google.maps.Map(mapDiv,mapOptions);
	 //加入自身
	 oThis.addSelfMarker();
}
//[setDivDirectionDetail]設定規劃路徑逐步結果顯示
HyMap.prototype.setDivDirectionDetail=function(div){
	var oThis=this;
	oThis.divDirectionDetail=div;
}
//[refresh]重整地圖尺寸跟地圖調整中心
HyMap.prototype.refresh=function(){
	var oThis=this;
	//讓google map render size正常
	google.maps.event.trigger(oThis.map, 'resize');
	//重設地圖中心			
	if(typeof(oThis.center)==="undefined"||oThis.center==null){
		oThis.map.setCenter(new google.maps.LatLng(getGPRSData().lat,getGPRSData().lng));
	}else{
	  	oThis.map.setCenter(oThis.center);
	}
}
//[addSelfMarke]建立自身坐標marker
HyMap.prototype.addSelfMarker=function(){
	var oThis=this;
	 //加入自身
	 oThis.addMarker(new google.maps.LatLng(getGPRSData().lat,getGPRSData().lng),oThis.map_icons.self.icon);
}
//[addMarker]新增Marker
HyMap.prototype.addMarker=function(posLatLng,iconImg){
	var oThis=this;
	var marker = new google.maps.Marker({
	    map:oThis.map,
	    draggable:false,
	    animation: google.maps.Animation.DROP,
	    icon: iconImg,
	    position:posLatLng,
	    draggable: oThis.isDraggable
	});
	oThis.map_markers.push(marker);
}
//[addPolyLine]新增PolyLine至地圖
HyMap.prototype.addPolyLine=function(posLatLngArray){
	var oThis=this;
	var gPolyLine = new google.maps.Polyline({
		path: posLatLngArray,
		strokeColor: '#0300FA',
		strokeOpacity: 0.5,
		strokeWeight: 8
	});
	gPolyLine.setMap(oThis.map);
	oThis.map_polyLines.push(gPolyLine);
}
//[clearMapMarker]清除Marker
HyMap.prototype.clearMapMarker=function(){
	var oThis=this;
	for(var i=0;i<oThis.map_markers.length;i++){
		oThis.map_markers[i].setMap(null);
	}
	oThis.map_markers=[];
}
//[clearPolyLine]清除PolyLine
HyMap.prototype.clearPolyLine=function() {
	var oThis=this;
	for(var i=0;i<oThis.map_polyLines.length;i++){
		oThis.map_polyLines[i].setMap(null);
	}
	oThis.map_polyLines=[];
}

/*交通資訊 method*/
//[genTrafficBusLine]產生巡巴路線圖
HyMap.prototype.genTrafficBusLine=function(jsonData){
	var oThis=this;
	var posLatLngArray=[];
	//清除目前畫面內容
	oThis.clearMapMarker();
	oThis.clearPolyLine();
	//加入自身
	oThis.addSelfMarker();
	for(var i=0;i<jsonData.length;i++){
		var  posLatLng=new google.maps.LatLng(jsonData[i].lat,jsonData[i].lng);
		if(jsonData[i].type=='lbs'){
			//如果是LBS則addMarker
			 oThis.addMarker(posLatLng,oThis.map_icons.position.icon);
		}
		posLatLngArray.push(posLatLng);
	}
	//畫線
 	oThis.addPolyLine(posLatLngArray);
  	//重新設定zoom
  	oThis.map.setZoom(oThis.zoomsize);
 	//設定第一點為map中心點
 	oThis.center=posLatLngArray[0];
 	oThis.map.setCenter(oThis.center);
}
/*生活服務-地圖模組*/
//[showTargetMarker]只顯示目標Marker
HyMap.prototype.showTargetMarker=function(title,address,latitude,longitude,spotNo,ximage,iconImg){
	var oThis=this;
	//清除目前畫面內容
	oThis.clearMapMarker();
	oThis.clearPolyLine();
	//加入自身
 	oThis.addSelfMarker();
  	//重新設定zoom
  	oThis.map.setZoom(oThis.zoomsize);
	//重設地圖中心
	oThis.center=new google.maps.LatLng(latitude,longitude);
  	oThis.map.setCenter(oThis.center);
  	//增加Marker
	var marker = new google.maps.Marker({
	    map:oThis.map,
	    draggable:false,
	    animation: google.maps.Animation.DROP,
	    icon:iconImg,
	    position:new google.maps.LatLng(latitude,longitude)
	});
	//增加InfoWindow
	google.maps.event.addListener(marker, 'click', function() {
	   var infowindow=new google.maps.InfoWindow(genGMAPInfoWindowHTML(title,address,latitude,longitude,spotNo,ximage,iconImg));
   	   infowindow.open(oThis.map,this);
	});
	oThis.map_markers.push(marker);
}
//[showTargetAndOtherMarker]顯示目標與其他Marker
HyMap.prototype.showTargetAndOtherMarker=function(posObjectArray,setSelfToCenter){
	var oThis=this;
	//清除目前畫面內容
	oThis.clearMapMarker();
	oThis.clearPolyLine();
	//加入自身
 	oThis.addSelfMarker();
  	//重新設定zoom
  	oThis.map.setZoom(oThis.zoomsize);
	//重設地圖中心
	if(setSelfToCenter){
		oThis.center=new google.maps.LatLng(getGPRSData().lat,getGPRSData().lng);
	}else{
		oThis.center=new google.maps.LatLng(posObjectArray[0].latitude,posObjectArray[0].longitude);
	}
  	oThis.map.setCenter(oThis.center);
  	for(var i=0;i<posObjectArray.length;i++){
		var marker = new google.maps.Marker({
		    map:oThis.map,
		    draggable:false,
		    animation: google.maps.Animation.DROP,
		    icon:posObjectArray[i].xicon,
		    position:new google.maps.LatLng(posObjectArray[i].latitude,posObjectArray[i].longitude)
		});
		//增加InfoWindow
		google.maps.event.addListener(marker, 'click', function() {
		   var infowindow=new google.maps.InfoWindow(genGMAPInfoWindowHTML(posObjectArray[i].title,posObjectArray[i].address,posObjectArray[i].latitude,posObjectArray[i].longitude,posObjectArray[i].spotNo,posObjectArray[i].ximage,posObjectArray[i].xicon));
	   	   infowindow.open(oThis.map,this);
		});
		oThis.map_markers.push(marker);
	}
}
//[addAdvMarker]新增進階Marker
HyMap.prototype.addAdvMarker=function(title,address,latitude,longitude,spotNo,ximage,iconImg){
	var oThis=this;
	var marker = new google.maps.Marker({
	    map:oThis.map,
	    draggable:false,
	    animation: google.maps.Animation.DROP,
	    icon:iconImg,
	    position:new google.maps.LatLng(latitude,longitude)
	});
	//增加InfoWindow
	google.maps.event.addListener(marker, 'click', function() {
	   var infowindow=new google.maps.InfoWindow(genGMAPInfoWindowHTML(title,address,latitude,longitude,spotNo,ximage,iconImg));
   	   infowindow.open(oThis.map,this);
	});
	oThis.map_markers.push(marker);
}
//[doSearchByAddress]地址查詢
HyMap.prototype.doSearchByAddress=function(addr){
	var oThis=this;
	oThis.geocoder.geocode( { 'address': addr}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
		//清除目前畫面內容
		oThis.clearMapMarker();
		oThis.clearPolyLine();
	 	//加入自身
	 	oThis.addSelfMarker();
      	//重新設定zoom
      	oThis.map.setZoom(oThis.zoomsize);
		//重設地圖中心
		oThis.center=results[0].geometry.location;
      	oThis.map.setCenter(oThis.center);
      	//增加Marker
      	oThis.addAdvMarker(addr,addr,results[0].geometry.location.lat(),results[0].geometry.location.lng(),"","",oThis.map_icons.position.icon);
    }else{
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
//[getAddressByLatLng]座標反查地址
HyMap.prototype.getAddressByLatLng=function(posLatLng,inputControl){
	var oThis=this;
	oThis.geocoder.geocode({'latLng':posLatLng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			 $(inputControl).val(results[0].formatted_address);
		}
    });
}
//[doRoutePath]兩點路線規劃
//function(posLatLng1,posLatLng2,[option_pos1],[option_pos2])
//option_pos1={title,address,latitude,longitude,spotNo,ximage,xicon}
HyMap.prototype.doRoutePath=function(posLatLng1,posLatLng2,option_pos1,option_pos2){
	var oThis=this;
	var request = {
	  origin: posLatLng1,
	  destination: posLatLng2,
	  travelMode: oThis.selectedTravelMode
	};
	oThis.directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			//清除目前畫面內容
			oThis.clearMapMarker();
			oThis.clearPolyLine();
			//加入自身
			oThis.addSelfMarker();
  	      	//重新設定zoom
	      	oThis.map.setZoom(oThis.zoomsize);
			//重設地圖中心
			oThis.center=response.routes[0].legs[0].start_location;
	      	oThis.map.setCenter(oThis.center);
			//起訖Marker
			if(typeof(option_pos1)!=="undefined"&&option_pos1!=null){
				//如果查詢為一LBS點或特定點
				if(option_pos1.latitude==""||option_pos1.longitude==""){
					oThis.addAdvMarker(option_pos1.title,option_pos1.address,response.routes[0].legs[0].start_location.lat(),response.routes[0].legs[0].start_location.lng(),option_pos1.spotNo,option_pos1.ximage,oThis.map_icons.route_A.icon);
				}else{
					oThis.addAdvMarker(option_pos1.title,option_pos1.address,option_pos1.latitude,option_pos1.longitude,option_pos1.spotNo,option_pos1.ximage,oThis.map_icons.route_A.icon);
				}
			}else{
				oThis.addAdvMarker(response.routes[0].legs[0].start_address,response.routes[0].legs[0].start_address,response.routes[0].legs[0].start_location.lat(),response.routes[0].legs[0].start_location.lng(),"","",oThis.map_icons.route_A.icon);
			}
			if(typeof(option_pos2)!=="undefined"&&option_pos2!=null){
				//如果查詢為一LBS點或特定點
				if(option_pos2.latitude==""||option_pos2.longitude==""){
					oThis.addAdvMarker(option_pos2.title,option_pos2.address,response.routes[0].legs[0].end_location.lat(),response.routes[0].legs[0].end_location.lng(),option_pos2.spotNo,option_pos2.ximage,oThis.map_icons.route_B.icon);
				}else{
					oThis.addAdvMarker(option_pos2.title,option_pos2.address,option_pos2.latitude,option_pos2.longitude,option_pos2.spotNo,option_pos2.ximage,oThis.map_icons.route_B.icon);
				}
			}else{
				oThis.addAdvMarker(response.routes[0].legs[0].end_address,response.routes[0].legs[0].end_address,response.routes[0].legs[0].end_location.lat(),response.routes[0].legs[0].end_location.lng(),"","",oThis.map_icons.route_B.icon);
			}
			//規劃路線
			oThis.addPolyLine(response.routes[0].overview_path);
			//規劃路線逐步內容
			$(oThis.divDirectionDetail).html(genGmapStepListHtml(response));
		}
	});
}
//[changeCenterWithAddresss]根據指定地址重設自身位置
HyMap.prototype.changeCenterWithAddress=function(addr){
	var oThis=this;
	oThis.geocoder.geocode( { 'address': addr}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
		//清除目前畫面內容
		oThis.clearMapMarker();
		oThis.clearPolyLine();
		//重設自身
		oThis.center=results[0].geometry.location;
		 //加入自身(不可用原function)
		oThis.addMarker(oThis.center,oThis.map_icons.self.icon);
      	//重新設定zoom
      	oThis.map.setZoom(oThis.zoomsize);
		//重設地圖中心
      	oThis.map.setCenter(oThis.center);
    }else{
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
//[loadMapData]載入其他頁面儲存需顯示的地圖資料
HyMap.prototype.loadMapData=function(){
	var oThis=this;
	var mapData=getMapData();
	//判斷是否有mapData:單點顯示或是規劃路徑
	if(typeof(mapData)!=="undefined"&&mapData!=null){
		switch(mapData.method){
			case "route":
				//function(posLatLng1,posLatLng2,[option_pos1],[option_pos2])
				//option_pos1={title,address,latitude,longitude,spotNo,ximage,xicon}
				if(mapData.posObjects.length==2){
					var posLatLng1,posLatLng2;
					if(mapData.posObjects[0].latitude==""){
						posLatLng1=mapData.posObjects[0].address;
					}else{
						posLatLng1=new google.maps.LatLng(mapData.posObjects[0].latitude,mapData.posObjects[0].longitude);
					}
					if(mapData.posObjects[1].latitude==""){
						posLatLng2=mapData.posObjects[1].address;
					}else{
						posLatLng2=new google.maps.LatLng(mapData.posObjects[1].latitude,mapData.posObjects[1].longitude);
					}
					oThis.doRoutePath(posLatLng1,posLatLng2,mapData.posObjects[0],mapData.posObjects[1]);
				}
				break;
			case "spot":
				if(mapData.posObjects.length==1){
					if(mapData.posObjects[0].latitude==""){
						oThis.doSearchByAddress(mapData.posObjects[0].address);
					}else{
						oThis.showTargetMarker(mapData.posObjects[0].title,mapData.posObjects[0].address,mapData.posObjects[0].latitude,mapData.posObjects[0].longitude,mapData.posObjects[0].spotNo,mapData.posObjects[0].ximage,(mapData.posObjects[0].xicon!="position"&&mapData.posObjects[0].xicon!=""?mapData.posObjects[0].xicon:oThis.map_icons.position.icon));
					}
				}
				break;
			case "spots":
				if(mapData.posObjects.length>0){
					oThis.showTargetAndOtherMarker(mapData.posObjects,mapData.setSelfToCenter);
				}
				break;
		}
	}
	//清除mapData
	clearMapData();
}
//[setNearAlertSpot]設定接近提醒點
HyMap.prototype.setNearAlertSpot=function(spot){
	//spot={"spotNo":spotNo,"title":title,"address":address,"latitude":latitude,"longitude":longitude};
	var oThis=this;
	if(typeof(oThis.geolocationID)!=="undefined"&&oThis.geolocationID!=null){
		//先關閉之前的
		oThis.closeNearAlert();
	}
	//設定目前的
	oThis.nearAlertSpot=spot;
	//開始觀測
	oThis.startNearAlert();
}
HyMap.prototype.startNearAlert=function(){
	var oThis=this;
	 if (navigator.geolocation){
	     oThis.geolocationID =navigator.geolocation.watchPosition(function(position){
			//確認是否接近
			if(isNear(position.coords.latitude,position.coords.longitude,oThis.nearAlertSpot.latitude,oThis.nearAlertSpot.longitude)){
				oThis.nearSuccess();
				oThis.closeNearAlert();
			}
	    },function () { /*error*/ }, {maximumAge: 250, enableHighAccuracy: true});
	}
}
HyMap.prototype.closeNearAlert=function(){
	var oThis=this;
	navigator.geolocation.clearWatch(oThis.geolocationID);
	oThis.geolocationID=null;
	oThis.nearAlertSpot=null;
}
HyMap.prototype.nearSuccess=function(){
	var oThis=this;
	smoke.alert("你已經接近"+oThis.nearAlertSpot.title+"("+oThis.nearAlertSpot.address+")",{},function(){});
}
//function
function genGMAPInfoWindowHTML(title,address,latitude,longitude,spotNo,ximage,xicon){
	var contentHTML='<div class="gmapInfoWindow">'+
					'<div id="btnLBSCP" data-spotno="'+spotNo+'"><div class="ximage"><img src="'+ximage+'"></img></div>'+
					'<div class="title">'+title+'</div>';
		if(spotNo!=""){		
					contentHTML+='<div class="arrow"><img src="img/NSC/arrow.png" alt="arrow"></div>';
		};
		contentHTML+='</div>'+
					'<div class="function">'+
					'<button class="btn10" data-title="'+title+'" data-address="'+address+'" data-ximage="'+ximage+'" data-xicon="'+xicon+'" data-latitude="'+latitude+'" data-longitude="'+longitude+'" data-spotno="'+spotNo+'" id="btnDoRoute_InfoWindow">路線規劃</button>';
		// if(spotNo!=""){
		// 	contentHTML+='<button class="btn10" id="btnLBSCP" data-spotno="'+spotNo+'" id="btnDoRoute_InfoWindow">景點資料</button>';
		// }
		contentHTML+='<button class="btn10" data-title="'+title+'" data-address="'+address+'" data-latitude="'+latitude+'" data-spotno="'+spotNo+'" data-longitude="'+longitude+'" data-spotno="'+spotNo+'" id="btnSetNearAlert">接近提醒</button>'+
					'</div>'+'</div>';
	return {'content': contentHTML };
}
function getStepDirectionImg(instructions){
    var htmlResult="";
    htmlResult+="<div class='dir-ds-icon ";
    if (instructions.indexOf("向左急轉") >= 0){
        htmlResult+="dir-tt-turn-sharp-left-19";
    }else if(instructions.indexOf("向右急轉") >= 0){
        htmlResult+=".dir-tt-turn-sharp-right-19";
    }else if (instructions.indexOf("<b>左</b>微轉") >= 0){
        htmlResult+="dir-tt-turn-slight-left-19";
    }else if(instructions.indexOf("<b>左</b>轉") >= 0){
        htmlResult+="dir-tt-turn-left-19 ";
    }else if(instructions.indexOf("<b>右</b>微轉") >= 0){
        htmlResult+="dir-tt-turn-slight-right-19";
    }else if(instructions.indexOf("<b>右</b>轉") >= 0){
        htmlResult+="dir-tt-turn-right-19";
    }else if(instructions.indexOf("上匝道") >= 0){
        htmlResult+="dir-tt-merge-19";
    }else if(instructions.indexOf("出口下交流道") >= 0){
        if(instructions.indexOf("靠左於") >= 0){
            htmlResult+="dir-tt-ramp-left-19";
        }else{
             htmlResult+="dir-tt-ramp-right-19";
        }
    }else if(instructions.indexOf("分岔路口靠左") >= 0){
        htmlResult+="dir-tt-fork-left-19";
    }else if(instructions.indexOf("分岔路口靠右") >= 0){
        htmlResult+="dir-tt-fork-right-19";
    }else if(instructions.indexOf('')>=0){
        htmlResult+="dir-tt-uturn-left-19";
    }else{
        //alert(instructions.indexOf("左轉")+","+instructions);
    }
    htmlResult+=" '></div>";
    return htmlResult;
}
function genGmapStepListHtml(response){
    var htmlResult="";
        htmlResult+="<span>"+response.routes[0].legs[0].distance.text+"</span><table>";
        for(var i=0;i<response.routes[0].legs[0].steps.length;i++){
            htmlResult+="<tr>";
            htmlResult+="<td>"+(i+1)+".</td>";
            htmlResult+="<td class='gmap-icon'>"+getStepDirectionImg(response.routes[0].legs[0].steps[i].instructions)+"</td>";
            htmlResult+="<td class='adp-directions'>"+response.routes[0].legs[0].steps[i].instructions+"</td>";
            htmlResult+="<td><span>"+response.routes[0].legs[0].steps[i].distance.text+"</span></td>";
            htmlResult+="</tr>"
        }
    htmlResult+="</table>";
    return htmlResult;
}
function getXiconImg(classify2){
	var xicon="img/Map/position_icon11.png";
	if(typeof(classify2)!=="undefined"){
		xicon="img/Map/xicon_"+classify2+".png";
	}
	return xicon;
}
function isNear(lat1,lng1,lat2,lng2){
	var nearDistance=100;//100公尺
	var nowDistance=CalcDistanceBetween(lat1, lng1, lat2, lng2);
	var isNear=false;
	if(nowDistance<=nearDistance){
		isNear=true;
	}
	return isNear;
}
function CalcDistanceBetween(lat1, lon1, lat2, lon2) {
    //Radius of the earth in:  1.609344 miles,  6371 km  | var R = (6371 / 1.609344);
    var R = 6371000; // Radius of earth in m
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}
function toRad(Value) {
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}
/*其他頁面使用地圖模組*/
//constructor
function posObject(title,address,latitude,longitude,spotNo,ximage,xicon){
	return {"title":title,"address":address,"latitude":latitude,"longitude":longitude,"spotNo":spotNo,"ximage":ximage,"xicon":xicon};
}
//function
//[openMap]至地圖模組開啓指定點
function openMap(var1){
	//預設var1應為posObject
	//如果postObject為string(地址或地名)
	if(typeof(var1.title)==="undefined"){
		posObject=new posObject(var1,var1,"","","","","position");
	}else{
		posObject=var1;
	}
	//儲存現在資料狀態
	var mapData={"method":"spot","posObjects":[posObject]};
	setMapData(mapData);
	//至地圖模組
	// window.location.href="Page_LifeService.html#Map_LP";
	$.mobile.changePage('#Map_LP');
}
//[openMapWithRoute]至地圖模組規劃路徑, posObject1如果不傳則為自身
function openMapWithRoute(posObject2,posObject1){
	//調整目前資料
	if(typeof(posObject1)==="undefined"){
		posObject1=new posObject("目前所在位置","目前所在位置",getGPRSData().lat,getGPRSData().lng,"","","route_A");
	}else if(posObject1.xicon==""){
		posObject1.xicon="route_A";
	}
	if(typeof(posObject2)!=="undefined"&&posObject2.xicon==""){
		posObject2.xicon="route_B";
	}
	//儲存現在資料狀態
	var mapData={"method":"route","posObjects":[posObject1,posObject2]};
	setMapData(mapData);
	//至地圖模組
	// window.location.href="Page_LifeService.html#Map_LP";
	$.mobile.changePage('#Map_LP');
}
//[openMapWithTargetPosObjects]至地圖模組開啓指定點與其他指定marker
function openMapWithTargetPosObjects(posObjectArray,setSelfToCenter){
	//第一個為中心點，其它點僅顯示
	//儲存現在資料狀態
	var mapData={"method":"spots","posObjects":posObjectArray,"setSelfToCenter":setSelfToCenter};
	setMapData(mapData);
	//至地圖模組
	// window.location.href="Page_LifeService.html#LP";
	$.mobile.changePage('#Map_LP');
}