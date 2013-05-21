var hymap = (function(){
	var _WATCH_POSITION = null,
		_WATCH_DISTANCE = null,
		_LAST_RESULT = [],
		_GET_DISTANCE = function(lat1,lon1,lat2,lon2) {
			var R = 6371; // km (change this constant to get miles)
			var dLat = (lat2-lat1) * Math.PI / 180;
			var dLon = (lon2-lon1) * Math.PI / 180;
			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
				Math.sin(dLon/2) * Math.sin(dLon/2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			var d = R * c;
			return d;
		};
	return {
		/**
		路徑規劃
		@method showPath
		@param {String} start 路徑起點
		@param {String} end 路徑終點
		@param {Object} mapObj 地圖物件
		@param {Object} options 路徑規劃設定參數
		@param {Function} callback 回呼函式
		@return
		**/
		showPath: function(start, end, mapObj, options, callback){
			var settings = {
					travelMode: 'DRIVING',
					panel: null,
					callback: function(){
						
					}
				};
			if(typeof options !== 'undefined'){
				$.extend(true, settings, options);
			}
			
			if(typeof callback === 'function'){
				settings.callback = callback;
			}
			
			if(start === '' && end === ''){
				return;
			}
			
			if(start === '' || end === ''){
				HYWEBAPP.getPosition({
					success: function(position){
						var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
							destination = (start !== '')?start:end;
						_LAST_RESULT = [{ name: position.coords.latitude + ',' + position.coords.longitude }, {}];
						mapObj.gmap('closeInfoWindow');
						mapObj.gmap('clear','markers');
						mapObj.gmap('displayDirections', {'origin': location, 'destination': destination, 'travelMode': settings.travelMode}, { 'panel': settings.panel }, function(result, status){
							if(result.routes.length > 0){
								var routesCount = result.routes.length,
									startPoint = { name:result.routes[0].legs[0].start_address, lat:result.routes[0].legs[0].start_location.lat(), lon:result.routes[0].legs[0].start_location.lng() },
									endPoint = { name:result.routes[routesCount - 1].legs[result.routes[routesCount - 1].legs.length - 1].end_address, lat:result.routes[routesCount - 1].legs[result.routes[routesCount - 1].legs.length - 1].end_location.lat(), lon:result.routes[routesCount - 1].legs[result.routes[routesCount - 1].legs.length - 1].end_location.lng() };
								_LAST_RESULT = [ startPoint, endPoint ];
								console.log(JSON.stringify(_LAST_RESULT));
							}
							settings.callback(result, status);
						});
					},
					error: function(){
						navigator.notification.alert('無法取得GPS位置', null, "", "確認");
						return;
					}
				});
			}
			
			if(start !== '' && end !== ''){
				mapObj.gmap('closeInfoWindow');
				mapObj.gmap('clear','markers');
				mapObj.gmap('displayDirections', {'origin': start, 'destination': end, 'travelMode': settings.travelMode}, { 'panel': settings.panel }, function(result, status){
					if(result.routes.length > 0){
						var routesCount = result.routes.length,
							startPoint = { name:result.routes[0].legs[0].start_address, lat:result.routes[0].legs[0].start_location.lat(), lon:result.routes[0].legs[0].start_location.lng() },
							endPoint = { name:result.routes[routesCount - 1].legs[result.routes[routesCount - 1].legs.length - 1].end_address, lat:result.routes[routesCount - 1].legs[result.routes[routesCount - 1].legs.length - 1].end_location.lat(), lon:result.routes[routesCount - 1].legs[result.routes[routesCount - 1].legs.length - 1].end_location.lng() };
						_LAST_RESULT = [ startPoint, endPoint ];
						console.log(JSON.stringify(_LAST_RESULT));
					}
					settings.callback(result, status);
				});
			}
		},
		
		/**
		地點搜尋
		@method findSpot
		@param {String} keyword 搜尋關鍵字
		@param {Object} mapObj 地圖物件
		@param {Function} callback 回呼函式
		@return
		**/
		findSpot: function(keyword, mapObj, callback){
			if(keyword === ''){
				return;
			}
			mapObj.gmap('closeInfoWindow');
			mapObj.gmap('clear','markers');
			mapObj.gmap('search', { 'address': keyword }, function(results, status){
				if (status === 'OK') {
					mapObj.gmap('option', 'zoom', 15);
					mapObj.gmap('option', 'center', results[0].geometry.location);
					_LAST_RESULT = [ { name: results[0].address_components[0].long_name, lat: results[0].geometry.location.lat(), lon: results[0].geometry.location.lng() } ];
					console.log(JSON.stringify(_LAST_RESULT));
				}
				if(typeof callback === 'function'){
					callback(results, status);
				}
			});
		},
		
		/**
		在地圖上增加標記
		@method addMarker
		@param {String} position 標記的坐標
		@param {Object} mapObj 地圖物件
		@param {Object} options 標記設定參數
		@param {Function} clickHandler 點選標記時的處理函式
		@return
		**/
		addMarker: function(position, mapObj, options, clickHandler){
			var settings = {
					'bounds': false
				};
			if(typeof options !== 'undefined'){
				$.extend(true, settings, options);
			}
			settings.position = position;
			var marker = mapObj.gmap('addMarker', settings);
			if(typeof clickHandler === 'function'){
				marker.click(clickHandler);
			}
		},
		
		/**
		顯示資訊視窗
		@method openInfoWindow
		@param {Object} mapObj 地圖物件
		@param {Object} options 資訊視窗設定參數
		@param {Object} target 資訊視窗所要綁定的目標物件
		@return
		**/
		openInfoWindow: function(mapObj, options, target){
			mapObj.gmap('openInfoWindow', options, target);
		},
		
		/**
		隱藏資訊視窗
		@method closeInfoWindow
		@param {Object} mapObj 地圖物件
		@return
		**/
		closeInfoWindow: function(mapObj){
			mapObj.gmap('closeInfoWindow');
		},
		
		/**
		設定接近提醒
		@method setAlert
		@param {Object} target 目標位置物件
		@param {Object} options 接近提醒設定參數
		@param {Function} callback 回呼函式
		@return
		**/
		setAlert: function(target, options, callback){
			var settings = {
					distance: 200,
					timeout: 30000,
					callback: function(position){
						if(_GET_DISTANCE(_WATCH_POSITION.lat, _WATCH_POSITION.lon, position.coords.latitude, position.coords.longitude) * 1000 <= _WATCH_DISTANCE){
							HYWEBAPP.stopWatchPosition();
							navigator.notification.alert('您已接近' + _WATCH_POSITION.name + '。', function(){}, '接近提醒', '關閉');
							_WATCH_POSITION = null;
							_WATCH_DISTANCE = null;
						}
					}
				};
			if(typeof options !== 'undefined'){
				$.extend(true, settings, options);
			}
			if(typeof callback === 'function'){
				settings.callback = callback;
			}
			if(_WATCH_POSITION !== null){
				HYWEBAPP.stopWatchPosition();
			}
			_WATCH_POSITION = $.extend({ name:target.lat + ',' + target.lon }, target);
			_WATCH_DISTANCE = settings.distance;
			HYWEBAPP.watchPosition({
				success: function(position){
					settings.callback(position);
				}
			}, { timeout: settings.timeout });
		},
		
		/**
		取得目前接近提醒設定的目標物件
		@method getAlertTarget
		@return {Object}
		**/
		getAlertTarget: function(){
			return _WATCH_POSITION;
		},
		
		/**
		計算兩點坐標距離（km）
		@method getDistance
		@param {Number} lat1 第一點的經度坐標
		@param {Number} lon1 第一點的緯度坐標
		@param {Number} lat2 第二點的經度坐標
		@param {Number} lon2 第二點的緯度坐標
		@return {Number}
		**/
		getDistance: function(lat1,lon1,lat2,lon2) {
			return _GET_DISTANCE(lat1,lon1,lat2,lon2);
		},
		
		/**
		取得上次查詢或路徑規劃的位置點資訊
		@method getLastResult
		@return {Object[]}
		**/
		getLastResult: function(){
			return _LAST_RESULT;
		},
		
		/**
		設定預設執行動作（Android使用）
		@method setDefaultAction
		@param {String} action 動作代碼
		@return
		**/
		setDefaultAction: function(action){
			//HYWEBAPP.setLocalStorage('com.hyweb.app.module.map.action', action);
			window.sessionStorage.setItem('com.hyweb.app.module.map.action', action);
		},
		
		/**
		取得預設執行動作（Android使用）
		@method getDefaultAction
		@return {String}
		**/
		getDefaultAction: function(){
			//HYWEBAPP.setLocalStorage('com.hyweb.app.module.map.action', action);
			return window.sessionStorage.getItem('com.hyweb.app.module.map.action');
		},
		
		/**
		設定預設查詢關鍵字（Android使用）
		@method setDefaultKeyword
		@param {String} keyword 關鍵字
		@return
		**/
		setDefaultKeyword: function(keyword){
			//HYWEBAPP.setLocalStorage('com.hyweb.app.module.map.keyword', keyword);
			window.sessionStorage.setItem('com.hyweb.app.module.map.keyword', keyword);
		},
		
		/**
		取得預設查詢關鍵字（Android使用）
		@method getDefaultKeyword
		@return {String}
		**/
		getDefaultKeyword: function(){
			//HYWEBAPP.setLocalStorage('com.hyweb.app.module.map.keyword', keyword);
			return window.sessionStorage.getItem('com.hyweb.app.module.map.keyword');
		},
		
		/**
		設定預設路徑規劃起點（Android使用）
		@method setDefaultStart
		@param {String} start 路徑規劃起點
		@return
		**/
		setDefaultStart: function(start){
			//HYWEBAPP.setLocalStorage('com.hyweb.app.module.map.start', start);
			window.sessionStorage.setItem('com.hyweb.app.module.map.start', start);
		},
		
		/**
		取得預設路徑規劃起點（Android使用）
		@method getDefaultStart
		@return {String}
		**/
		getDefaultStart: function(){
			//HYWEBAPP.setLocalStorage('com.hyweb.app.module.map.start', start);
			return window.sessionStorage.getItem('com.hyweb.app.module.map.start');
		},
		
		/**
		設定預設路徑規劃終點（Android使用）
		@method setDefaultEnd
		@param {String} end 路徑規劃終點
		@return
		**/
		setDefaultEnd: function(end){
			//HYWEBAPP.setLocalStorage('com.hyweb.app.module.map.end', end);
			window.sessionStorage.setItem('com.hyweb.app.module.map.end', end);
		},
		
		/**
		取得預設路徑規劃終點（Android使用）
		@method getDefaultEnd
		@return {String}
		**/
		getDefaultEnd: function(){
			//HYWEBAPP.setLocalStorage('com.hyweb.app.module.map.end', end);
			return window.sessionStorage.getItem('com.hyweb.app.module.map.end');
		}
	};
}());