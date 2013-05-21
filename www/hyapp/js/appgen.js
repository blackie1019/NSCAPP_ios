/**
hyApp模組

@module APPGEN
**/

﻿var HYWEBAPP =
/**
hyApp 主類別

@class HYWEBAPP
@static
**/ 
(function(){
	var _PAGES = {},
		_ROUTER = new $.mobile.Router([], {}, { ajaxApp: true }),
		_PLATFORM = '',
		_NEXTPAGE, 
		_PREPAGE,
		_WATCH_ID = '',
		_LOCALSTORAGE = window.localStorage,
		_ORIENTATIONCHANGE = function(){
			console.log('orientation change at page: ' + $.mobile.activePage[0].id);
			var itemName, 
				pageid = $.mobile.activePage[0].id; 
			for(itemName in HYWEBAPP.page(pageid).items()){
				var item = HYWEBAPP.page(pageid).item(itemName);
				item.execHandler('orientationchange');
			}
		},
		_RESIZE = function(){
			console.log('resize at page: ' + $.mobile.activePage[0].id);
			var itemName, 
				pageid = $.mobile.activePage[0].id; 
			for(itemName in HYWEBAPP.page(pageid).items()){
				var item = HYWEBAPP.page(pageid).item(itemName);
				item.execHandler('resize');
			}
		};
	var _UTILS = {
		/**
		將XML格式的資料轉換成JSON格式。
		
		@method xmlToJson
		@param {XML} xml XML物件
		@return {JSON} JSON物件
		@example
			var jsonData = HYWEBAPP.xmlToJson(xmlData);
			var id = jsonData.user[0].id;
		**/
		xmlToJson : function(xml){ 
			return $.xmlToJSON(xml); 
		},
		
		/**
		由目前頁面前往至指定的頁面。
		
		@method toPage
		@param {String} url PAGE物件的ID，或是要前往的Url
		@param {Object} [params] 要帶入所前往頁面中的參數
		@example
			HYWEBAPP.toPage('detailPage');
		@example
			HYWEBAPP.toPage('infoPage',{id: 'admin', name: 'John'});
		@example
			HYWEBAPP.toPage('http://tw.yahoo.com');
		**/
		toPage : function(url, params, role){
			var obj;
			if(typeof url === "function"){
				url({
					success: function(result){
						console.log(result);
						HYWEBAPP.toPage(result, params);
					}
				});
				return;
			}
			if(typeof HYWEBAPP.page(url) === "undefined"){
				window.open(url);
				return;
			}
			for(obj in params){
				if (typeof params[obj] === 'function') {
					params[obj]({
						success: function(result){
									console.log(result);
									params[obj] = result;
									HYWEBAPP.toPage(url, params);
								}
					});
					return;
				}
			}
			url = "#" + url + "?";
			console.log("Params: " + JSON.stringify(params));
			for(obj in params){
				url = url + obj + "=" + encodeURIComponent(params[obj]) + "&";
			}
			if(role === 'dialog'){
				$.mobile.changePage(url, { role: 'dialog' });
			}else{
				$.mobile.changePage(url);
			}
		},
		
		/**
		取得目前裝置的連線狀態。
		
		@method checkConnection
		@return {String} 目前連線狀態
		@example
			var connStatus = HYWEBAPP.checkConnection();
		**/
		checkConnection: function(){
			//for debug, comment this line when pucblish
			if(typeof navigator.network === "undefined"){ return 'Cell 3G connection'; }
			var networkState = navigator.network.connection.type;
    		var states = {};
    		states[Connection.UNKNOWN]  = 'Unknown connection';
    		states[Connection.ETHERNET] = 'Ethernet connection';
    		states[Connection.WIFI]     = 'WiFi connection';
    		states[Connection.CELL_2G]  = 'Cell 2G connection';
    		states[Connection.CELL_3G]  = 'Cell 3G connection';
    		states[Connection.CELL_4G]  = 'Cell 4G connection';
    		states[Connection.NONE]     = 'No network connection';
    		return states[networkState];
		},
		/**
		取得目前裝置的作業系統。
		
		@method checkPlatform
		@return {String} 目前裝置的作業系統
		@example
			var platform = HYWEBAPP.checkPlatform();
		**/
		checkPlatform: function(){
			var devicePlatform = device.platform;
		    if(devicePlatform.substring(0, 6) == "iPhone") {
		        return 'ios';
		    }
		    return 'others';
		},
		
		getPlatform: function(){
		    return _PLATFORM;
		},
		
		/**
		依照key值由localStorage中取出對應的值。
		
		@method getLocalStorage
		@param {String} key Key值
		@return {String} localStorage中對應的值
		@example
			var result = HYWEBAPP.getLocalStorage('myResult');
		**/
		getLocalStorage: function(key){
			return _LOCALSTORAGE.getItem(key);
		},
		
		/**
		將物件存入localStorage中。
		
		@method setLocalStorage
		@param {String} key Key值
		@param {String} value 要存入的值
		@example
			HYWEBAPP.setLocalStorage('myResult', 'Test');
		**/
		setLocalStorage: function(key, value){
			return _LOCALSTORAGE.setItem(key, value);
		},
		
		/**
		依照key值將localStorage中對應的值刪除。
		
		@method removeLocalStorage
		@param {String} key Key值
		@example
			HYWEBAPP.removeLocalStorage('myResult');
		**/
		removeLocalStorage: function(key){
			return _LOCALSTORAGE.removeItem(key);
		},
		
		/**
		將localStorage中所有值刪除。
		
		@method clearLocalStorage
		@example
			HYWEBAPP.clearLocalStorage();
		**/
		clearLocalStorage: function(key){
			return _LOCALSTORAGE.clear();
		},
		
		/**
		取得目前GPS位置。
		
		@method getPosition
		@param {Object} callbacks 取得GPS位置後要執行的callback函式
		@example
			HYWEBAPP.getPosition({
				success: function(position){
					alert('Location: ' + position.coords.latitude + ',' + position.coords.longitude);
				}
			});
		**/
		getPosition: function(callbacks){
			navigator.geolocation.getCurrentPosition(callbacks.success, callbacks.error);
		},
		
		/**
		持續監看GPS位置。
		
		@method watchPosition
		@param {Object} callbacks 取得GPS位置後要執行的callback函式
		@param {Object} options 設定參數
		@return {String} Watch ID作為取消監看用
		@example
			var watchID = HYWEBAPP.watchPosition({
				success: function(position){
					alert('Location: ' + position.coords.latitude + ',' + position.coords.longitude);
				}
			}, { timeout: 30000 });
		**/
		watchPosition: function(callbacks, options){
			if(_WATCH_ID !== ''){ 
				navigator.geolocation.clearWatch(_WATCH_ID);
				_WATCH_ID = '';
			}
			_WATCH_ID = navigator.geolocation.watchPosition(callbacks.success, callbacks.error, options);
		},
		
		/**
		取消目前監看GPS函式。
		
		@method stopWatchPosition
		@example
			HYWEBAPP.stopWatchPosition();
		**/
		stopWatchPosition: function(){
			if(_WATCH_ID === ''){ return; }
			navigator.geolocation.clearWatch(_WATCH_ID);
			_WATCH_ID = '';
		},
		
		/**
		對指定的Url進行Ajax呼叫，並在取得回傳資料後執行Callback函式。
		
		@method ajaxCall
		@param {String} url 要送出Ajax Request的Url
		@param {String} type 回傳的資料型別
		@param {Object} data 要帶入的參數
		@param {Object} callbacks 取回資料後要執行的Callback函式
		@param {Object} options 其它相關設定，如Cache和Offline等
		@example
			HYWEBAPP.ajaxCall('http://www.test.com/getTestData', 'json', { id: "Aio", name: "Wei"}, {
							 	success: function(result){
							 		$("#telInfo").text(result.tel);
							 	}
							 }, { cache: "true" });
		**/
		ajaxCall : function(url, type, data, callbacks, options){
			for (pro in data) {
				if (typeof data[pro] === 'function') {
					data[pro]({
						success: function(result){
							data[pro] = result;
							HYWEBAPP.ajaxCall(url, type, data, callbacks, options);
						}
					});
					return;
				}
			}
			$.support.cors = true;
       		$.mobile.allowCrossDomainPages = true;
       		$.mobile.showPageLoadingMsg();
       		console.log("url: "+url);
       		$.ajax({
            	url: url,
            	type: 'GET',
            	dataType: type,
            	cache: false,
            	data: data,
            	error: function(jqXHR, textStatus, error) {
            		$.mobile.hidePageLoadingMsg();
                	console.log('Ajax ERROR!! '+textStatus);
                	if(typeof callbacks.error === 'function'){
                		callbacks.error(jqXHR, textStatus, error);
                	}else{
                		navigator.notification.alert('資料服務發生問題，請稍候再試', null, '錯誤', '確認');
                	}
            	},
            	success: function(result, textStatus, jqXHR) {
            		$.mobile.hidePageLoadingMsg();
            		console.log('Ajax SUCCESS!!');
            		if(typeof callbacks.success === 'function'){
            			if(type === 'xml'){
            				result = HYWEBAPP.xmlToJson(result);
            			}
            			callbacks.success(result);
            		}
            	}
        	});
		},
		
		/**
		將Parent物件中所有的屬性與方法，複製到Child物件中，並回傳Child物件。
		
		@method extend
		@param parentObj 要被複製的Parent物件
		@param childObj Child物件
		@return {Object} 完成複製後的Child物件
		@example
			var parentObj = { 
					say : function(name){
						return "My name is " + name;
					} 
				}, 
				childObj = {};
			childObj = HYWEBAPP.extend(parentObj, childObj);
			childObj.say("Jimmy");
		@example
			var sourceObj = { 
					food : function(foodName){
						return "My favorite food is " + foodName;
					} 
				};
			targetObj = HYWEBAPP.extend(sourceObj);
			targetObj.food("Ice Cream");
		**/
		extend : function(parentObj, childObj){
			var pros;
			var toStr = Object.prototype.toString;
			var astr = "[object Array]";
			
			childObj = childObj || {};
			
			if(typeof parentObj !== "undefined"){
				for(pros in parentObj){
					if(parentObj.hasOwnProperty(pros)){
						if(typeof parentObj[pros] === "object"){
							childObj[pros] = (toStr.call(parentObj[pros]) === astr) ? [] : {};
							//HYWEBAPP.deepCopy(parentObj, childObj);
							HYWEBAPP.extend(parentObj, childObj);
						}else{
							childObj[pros] = parentObj[pros];
						}
					}
				}
			}
			
			return childObj;
		}
	};
	
	/**
	PAGE 類別

	@class PAGE
	@constructor
	@param {String} id PAGE物件的ID
	**/
	function PAGE(id){
		var _ID = id;
		var _DS = {}; 
		var _VARIABLES = {}; 
		var _ITEMS = {};
		var _HANDLERS = {};
		var _CONTEXT = function(){
			return $("#" + id);
		};
		
		/**
		DS 類別

		@class DS
		@constructor
		@param {String} id DS物件的ID
		@param {String} pageID 此DS物件所屬的PAGE物件ID
		@param {String} type 此DS物件所提供資料的型別
		@param {Object} config 設定值物件，亦可為XML或JSON格式的資料字串
		**/
		function DS(id, pageID, type, config){
       		var _ID = id;
       		var _PAGEID = pageID;
       		var _CACHE = {};
       		var _CONFIG = config;
       							
       		return {
       			/**
				取得DS物件的ID。
		
				@method getID
				@return {String} DS物件的ID
				@example
					var id = HYWEBAPP.page('index').ds('xmlDS').getID();
				**/
       			getID : function(){
       				return _ID;
       			},
       			
       			/**
				取得此DS物件所屬的PAGE物件ID。
		
				@method getPageID
				@return {String} PAGE物件ID
				@example
					var pageid = HYWEBAPP.page('index').ds('xmlDS').getPageID();
				**/					
       			getPageID : function(){
       				return _PAGEID;
       			},
       			
       			/**
				傳入Cache ID，取得對應的Cache值。
		
				@method cache
				@param {String} cacheID Cache ID
				@return {Object} 對應的Cache值
				@example
					var cacheValue = HYWEBAPP.page('index').ds('xmlDS').cache("{ id: "aio", name: "Wei" }");
				**/					
       			cache : function(cacheID){
       				return _CACHE[cacheID];
       			},
       			
       			/**
				指定Cache ID，將值存入Cache中。
		
				@method addCache
				@param {String} cacheID Cache ID
				@param {Object} cacheObj 欲存入Cache的值
				@example
					HYWEBAPP.page('index').ds('xmlDS').addCache("{ id: "aio", name: "Wei" }", { "tel": "0913123456", "job": "Engineer" });
				**/					
       			addCache : function(cacheID, cacheObj){
       				_CACHE[cacheID] = cacheObj;
       			},
       			
       			/**
				 清除所有Cache。
		
				@method clearCache
				@example
					HYWEBAPP.page('index').ds('xmlDS').clearCache();
				**/
       			clearCache : function(){
       				_CACHE = {};
       			},
       			
       			/**
				取得此DS物件的設定值物件。
		
				@method getConfig
				@return {Object} CONFIG物件
				@example
					var ds_config = HYWEBAPP.page('index').ds('myDS').getConfig();
				**/
       			getConfig : function(){
       				return _CONFIG;
       			},
       			
       			/**
				設定DS物件的設定值物件。
		
				@method setConfig
				@param {Object} newConfig 新的設定值物件
				@example
					var newConfig = {
						url: 'http://mydomain/myservice',
						data: {
							id: 'myname'
						},
						options: {
							cache: true
						}
					};
					HYWEBAPP.page('index').ds('myDS').setConfig(newConfig);
				**/
       			setConfig : function(newConfig){
       				_CONFIG = newConfig;
       			}, 
       			
       			/**
				取用DS物件所提供的資料，並傳入Callback函式，在獲得資料時執行。
		
				@method getContent
				@param {Object} callbacks 當DS物件傳回資料時要執行的Callback函式
				@example
					HYWEBAPP.page('index').ds('jsonDS').getContent({
						success: function(data){
							$('#nameField').val(data.name);
						}
					});
				**/					
       			getContent : function(callbacks){
       				if(typeof _CONFIG.source !== "undefined"){
       					var result;
       					if(type === "json"){
       						 result = JSON.parse(_CONFIG.source);
       					}else if(type === "xml"){
       						 result = HYWEBAPP.xmlToJson(jQuery.parseXML(_CONFIG.source));
       					}
       					if(typeof _CONFIG.options.dataProcessor !== "undefined"){
							var iObj;
							for(iObj in result){
								_CONFIG.options.dataProcessor(result[iObj], iObj, _CONFIG.data);
							}
						}
						if(typeof _CONFIG.options.preProcessor !== "undefined"){
							result = _CONFIG.options.preProcessor(result, _CONFIG.data);
						}
       					callbacks.success(result);
       				}else if(typeof _CONFIG.url !== "undefined"){
       					if(_CONFIG.options.cache === true){
       						var cachekey = JSON.stringify(_CONFIG.data);
							if(typeof _CACHE[cachekey] !== "undefined"){
								console.log('Cache ACCESS!!');
								var cacheResult = _CACHE[cachekey];
								if(typeof _CONFIG.options.dataProcessor !== "undefined"){
									var iObj;
									for(iObj in cacheResult){
										_CONFIG.options.dataProcessor(cacheResult[iObj], iObj, _CONFIG.data);
									}
								}
								if(typeof _CONFIG.options.preProcessor !== "undefined"){
									cacheResult = _CONFIG.options.preProcessor(cacheResult, _CONFIG.data);
								}
								callbacks.success(cacheResult);
								return;
							}
       					}
       					if(HYWEBAPP.checkConnection() === "No network connection"){
							if(options.offline === true){
								var offlinekey = _PAGEID + "_" + _ID + JSON.stringify(_CONFIG.data);
								var offlineResult = _LOCALSTORAGE.getItem(offlinekey);
								if(typeof offlineResult !== "undefined"){
									console.log('Offline ACCESS!!');
									var offlineJsonResult = JSON.parse(offlineResult);
									if(typeof _CONFIG.options.dataProcessor !== "undefined"){
										var iObj;
										for(iObj in offlineJsonResult){
											_CONFIG.options.dataProcessor(offlineJsonResult[iObj], iObj, _CONFIG.data);
										}
									}
									if(typeof _CONFIG.options.preProcessor !== "undefined"){
										offlineJsonResult = _CONFIG.options.preProcessor(offlineJsonResult, _CONFIG.data);
									}
									callbacks.success(offlineJsonResult);
									return;
								}
							}
						}
						
       					HYWEBAPP.ajaxCall(_CONFIG.url, type, HYWEBAPP.extend(_CONFIG.data), {
       						success: function(result){
       							if(_CONFIG.options.cache === true){
       								var cachekey = JSON.stringify(_CONFIG.data);
            						_CACHE[cachekey] = result;
            						console.log('Cache SAVED!!');
       							}
       							if(_CONFIG.options.offline === true) { 
            						var offlinekey = _PAGEID + "_" + _ID + JSON.stringify(_CONFIG.data);
            						_LOCALSTORAGE.setItem(offlinekey, JSON.stringify(result));
            						console.log('Offline SAVED!!');
            					}
            					if(typeof _CONFIG.options.dataProcessor !== "undefined"){
									var iObj;
									for(iObj in result){
										_CONFIG.options.dataProcessor(result[iObj], iObj, _CONFIG.data);
									}
								}
								if(typeof _CONFIG.options.preProcessor !== "undefined"){
									result = _CONFIG.options.preProcessor(result, _CONFIG.data);
								}
            					callbacks.success(result);
       						},
       						error: callbacks.error
       					}, _CONFIG.options);
       				}
       			}
       		};
       							
       	}
       	
       	/**
		ITEM 類別

		@class ITEM
		@constructor
		@param {String} id ITEM物件的ID
		@param {String} pageid 此ITEM物件所屬的PAGE物件ID
		@param {String} type ITEM類型
		**/
       	function ITEM(id, pageid, type){
       		var _ID = id,
       			_PAGEID = pageid,
       			_TYPE = type,
       			_SUBSCRIBERS = { value: [] },
       			_PROPERTIES = [],
       			_HANDLERS = {},
       			_CONTEXT = function(){
       				return $("#" + _PAGEID + "_" + _ID);
       			},
       			itemObj = {
       				/**
					取得Item ID。
		
					@method getID
					@return {String} ITEM物件的ID
					@example
						var id = HYWEBAPP.page('index').getItem('text1').getID();
					**/
       				getID : function(){
       					return _ID;
       				},
       				
       				/**
					取得Item在HTML頁面上Render後真正的ID。
		
					@method getRealID
					@return {String} Item在HTML頁面上Render後真正的ID
					@example
						var id = HYWEBAPP.page('index').getItem('text1').getRealID();
					**/
	       			getRealID : function(){
	       				return _PAGEID + "_" + _ID;
	       			},
       			
	       			/**
					取得Item型別。
			
					@method getType
					@return {String} Item的類型
					@example
						var itemType = HYWEBAPP.page('index').getITEM('text1').getType();
					**/
	       			getType : function(){
	       				return _TYPE;
	       			},
       			
	       			/**
					取得代表此UI元件的jQuery物件。
			
					@method getContext
					@return {jQuery} jQuery物件
					@example
						var text1Context = HYWEBAPP.page('index').item('text1').getContext();
					**/
	       			getContext : function(){
	       				return _CONTEXT();
	       			}, 
	       			
	       			/**
					存取或設定ITEM物件的屬性值。
			
					@method property
					@param {String} propName 屬性名稱
					@param {String} propValue 屬性值
					@return {Object} 屬性值
					@example
						var txt = HYWEBAPP.page('index').item('text1').property('value');
					@example
						HYWEBAPP.page('index').item('text1').property('value', 'Hello World');
					**/
	       			property : function(propName, propValue){
	       				var i,
	       					propSize = _PROPERTIES.length;
	       				console.log("arguments length: " + arguments.length);
	       				console.log("property name :" + propName);
	       				if(arguments.length === 1){
	       					for(i=0;i<propSize;i++){
	       						if(_PROPERTIES[i].name === propName){
	       							console.log("getter: "+ _PROPERTIES[i].getter());
	       							return _PROPERTIES[i].getter();
	       						}
	       					}
	       					return;
	       				}
	       				for(i=0;i<propSize;i++){
       						if(_PROPERTIES[i].name === propName){
       							_PROPERTIES[i].setter(propValue);
       						}
       					}
	       			}, 
       			
	       			setHandler : function(eventType, func){
	       				if(typeof _HANDLERS[eventType] === "undefined"){
	       					_HANDLERS[eventType] = [];
	       				}
	       				_HANDLERS[eventType].push(func);
	       			},
       			
	       			execHandler : function(eventType){
	       				var i, 
	       					handlersSize = (typeof _HANDLERS[eventType] === "undefined")?0:_HANDLERS[eventType].length;
	       				for(i=0;i<handlersSize;i++){
	       					_HANDLERS[eventType][i]();
	       				}
	       			},
       			
	       			subscribers : function(attr){
	       				var subscriberArray = (typeof _SUBSCRIBERS[attr] === "undefined")?[]:_SUBSCRIBERS[attr];
	       				return subscriberArray;
	       			},
	       			
	       			addSubscriber : function(attr, subscriberObj){
	       				console.log("subscriber attr: " + attr);
	       				if(typeof _SUBSCRIBERS[attr] === "undefined"){
	       					_SUBSCRIBERS[attr] = [];
	       				}
	       				_SUBSCRIBERS[attr].push(subscriberObj);
	       			},
       			
	       			removeSubscriber : function(attr, index){
	       				if(typeof _SUBSCRIBERS[attr] !== "undefined"){
	       					_SUBSCRIBERS[attr].splice(index, 1);
	       				}
	       			},
	       			
	       			registerProperty : function(propObj){
	       				var i,
	       					propSize = _PROPERTIES.length;
	       				for(i=0;i<propSize;i++){
	       					if(_PROPERTIES[i].name === propObj.name){
	       						_PROPERTIES[i] = propObj;
	       						return;
	       					}
	       				}
	       				_PROPERTIES[i] = propObj;
	       			},
	       			
	       			removeProperty : function(propName){
	       				var i,
	       					propSize = _PROPERTIES.length;
	       				for(i=0;i<propSize;i++){
	       					if(_PROPERTIES[i].name === propName){
	       						_PROPERTIES.splice(i,1);
	       						return;
	       					}
	       				}
	       			},
	       			
	       			addEventHandler : function(eventName, handler) {
	       				_CONTEXT().live(eventName, handler);  
	       			}
       			};
       		
       		return HYWEBAPP.ui[_TYPE](itemObj);
       	}
	
		return {
			/**
			取得Page ID。
		
			@method getID
			@return {String} PAGE物件的ID
			@for PAGE
			@example
				var id = HYWEBAPP.page('index').getID();
			**/
			getID : function(){
				return _ID;
			},
		
			/**
			取得代表此頁面的jQuery物件。
		
			@method getContext
			@return {jQuery} jQuery物件
			@example
				var pageContext = HYWEBAPP.page('index').getContext();
			**/
			getContext : function(){
				return _CONTEXT();
			},
			
			refresh : function(){
				var context = _CONTEXT();
				context.trigger('pageinit');
				context.trigger('pagebeforeshow');
				context.trigger('pageshow');
			},
			
			setHandler : function(eventType, func){
   				if(typeof _HANDLERS[eventType] === "undefined"){
   					_HANDLERS[eventType] = [];
   				}
   				_HANDLERS[eventType].push(func);
   			},
		
   			execHandler : function(eventType){
   				var i, 
   					handlersSize = (typeof _HANDLERS[eventType] === "undefined")?0:_HANDLERS[eventType].length;
   				for(i=0;i<handlersSize;i++){
   					_HANDLERS[eventType][i]();
   				}
   			},
			
			/**
			清楚頁面所有DS物件的快取。
		
			@method clearCaches
			@example
				HYWEBAPP.page('index').clearCaches();
			**/
			clearCaches : function(){
				var dsObj
				for(dsObj in _DS){
					_DS[dsObj].clearCache();
				}
			},
			
			/**
			產生一個新的DS物件。
		
			@method createDS
			@param {String} dsID DS物件的ID
			@param {String} type 此DS物件所提供資料的型別
			@param {Object} config 設定值物件，亦可為XML或JSON格式的資料字串
			@return {DS} DS物件
			@example
				var newDS = HYWEBAPP.page('index').createDS('myDS','json',{ url: 'http://www.test.com/getJson', data: { id: 'aio' }, options: { cache: true } });
			@example
				var newDS = HYWEBAPP.page('index').createDS('myDS','json','[{ "name": "Wei", "tel": "0913234567" }, { "name": "Jojy", "tel": "0933123456" }]');
			**/
			createDS : function(dsID, type, config){
				return new DS(dsID, _ID, type, config);
			},
			
			/**
			加入一個DS物件。
		
			@method addDS
			@param {DS} dsObj 要加入的DS物件
			@example
				HYWEBAPP.page('index').addDS(newDS);
			**/
			addDS : function(dsObj){
				_DS[dsObj.getID()] = dsObj;
			},
		
			/**
			傳入Datasource ID，取得對應的DS物件。
		
			@method ds
			@param {String} dsID Datasource的ID
			@return {DS} DS物件
			@example
				var userDS = HYWEBAPP.page('index').ds('userInfo');
			**/
			ds : function(dsID){
				return _DS[dsID];
			},
		
			/**
			傳入Variable ID，取得對應的Variable值；或傳入Variable ID與值，設定該Variable物件的值。
		
			@method variable
			@param {String} varID Variable的ID
			@param {String} value Variable的值
			@return {Object} Variable的值
			@example
				var newLatitude = HYWEBAPP.page('map').variable('latitude');
			@example
				HYWEBAPP.page('map').variable('amount', '29300.56');
			**/
			variable : function(varID, value){
				if(arguments.length === 1){
					return _VARIABLES[varID];
				}else{
					_VARIABLES[varID] = value;
					return this;
				}
			},
			
			createItem : function(id, type){
				return new ITEM(id, _ID, type);
			},
		
			/**
			加入一個ITEM物件。
		
			@method addItem
			@param {ITEM} itemObj 要加入的ITEM物件
			@example
				HYWEBAPP.page('location').addItem(mapObj);
			**/
			addItem : function(itemObj){
				_ITEMS[itemObj.getID()] = itemObj;
			},
		
			/**
			傳入Item ID，取得對應的ITEM物件。
		
			@method item
			@param {String} itemID ITEM物件的ID
			@return {ITEM} ITEM物件
			@example
				var inputTel = HYWEBAPP.page('index').item('telField');
			**/
			item : function(itemID){
				return _ITEMS[itemID];
			},
		
			/**
			取得目前頁面上所有ITEM物件的集合。
		
			@method items
			@return {Object} ITEM物件集合
			@example
				var indexItems = HYWEBAPP.page('index').items();
			**/
			items : function(){
				return _ITEMS;
			},
			
			/**
			設定目前頁面的事件處理函式。
		
			@method addEventHandler
			@param {String} eventName 事件名稱
			@param {Object} handler 處理函式物件
			@example
				HYWEBAPP.page('index').addEventHandler('pageinit', function(){ console.log('page init!!'); });
			**/
			addEventHandler : function(eventName, handler) {
				if(eventName === "pageinit" || eventName === "pagebeforeshow" || eventName === "pageshow"){
					if(typeof _HANDLERS[eventName] === "undefined"){
	   					_HANDLERS[eventName] = [];
	   				}
	   				_HANDLERS[eventName].push(handler);
				}else{
					_CONTEXT().live(eventName, handler);
				}  
   			}
		};
	}
	
	return {
		/**
		傳入Page ID，取得對應的PAGE物件。
		
		@method page
		@param {String} pageID Page的ID
		@return {PAGE} PAGE物件
		@for HYWEBAPP
		@example
			var indexPage = HYWEBAPP.page('index');
		**/
		page : function(pageID){
			return _PAGES[pageID];
		},
		
		/**
		加入一個PAGE物件。
		
		@method addPage
		@param {PAGE} pageObj 要加入的PAGE物件
		@example
			HYWEBAPP.addPage(newPage);
		**/
		addPage : function(pageObj){
			_PAGES[pageObj.getID()] = pageObj;
		},
		
		/**
		加入一個ROUTE物件至ROUTER中。
		
		@method addRoute
		@param {ROUTE} routeObj 要加入的ROUTE物件
		@example
			HYWEBAPP.addRoute(newRoute);
		**/
		addRoute : function(routeObj){
			_ROUTER.add(routeObj);
		},
		
		/**
		解析Url中的Query String，並將結果組成一個Object回傳。
		
		@method getRouteParams
		@param {String} matchObj Query String字串
		@return {Object} Query String中各參數組成的物件
		@example
			var id = HYWEBAPP.getRouteParams(match).id;
		**/
		getRouteParams : function(matchObj){
			return _ROUTER.getParams(matchObj);
		}, 
		
		xmlToJson : _UTILS.xmlToJson,
		
		toPage : _UTILS.toPage,
	
		checkConnection : _UTILS.checkConnection,
		
		getLocalStorage : _UTILS.getLocalStorage,
		
		setLocalStorage : _UTILS.setLocalStorage,
		
		removeLocalStorage : _UTILS.removeLocalStorage,
		
		clearLocalStorage : _UTILS.clearLocalStorage,
	
		getPosition : _UTILS.getPosition,
		
		getPlatform : _UTILS.getPlatform,
		
		watchPosition : _UTILS.watchPosition,
		
		stopWatchPosition : _UTILS.stopWatchPosition,
	
		ajaxCall : _UTILS.ajaxCall,
		
		extend : _UTILS.extend,
		
		nextPage : _NEXTPAGE,
		
		prevPage : _PREPAGE,
		
		/**
		建立一個新的PAGE物件。
		
		@method createPage
		@param {String} id PAGE物件的ID
		@return {PAGE} 新的PAGE物件
		@example
			var newPage = HYWEBAPP.createPage("location");
		**/
		createPage : function(id){
			return new PAGE(id);
		},
		
		startUp : function(){
			var configs = $.getJSON('config/config.json', function(data){
				$.mobile.defaultPageTransition = data.transition;
				$.mobile.defaultDialogTransition = data.transition;
				$.mobile.loadingMessage = data.loadingMessage;
				$.mobile.loadingMessageTextVisible = data.loadingMessageTextVisible;
				document.addEventListener("deviceready", function(){ 
					_PLATFORM = device.platform;				
					$(window).bind('orientationchange', _ORIENTATIONCHANGE);
					$(window).bind('resize', _RESIZE);
					document.addEventListener("backbutton", function(e){
						if($.mobile.activePage.is('#' + data.startPage)){
					        e.preventDefault();
					        navigator.notification.confirm('是否關閉app', function(btnIndex){
					        	if(btnIndex === 1){ navigator.app.exitApp(); }
					        },'關閉app','確認,取消');
					    }
					    else {
					        navigator.app.backHistory();
					    }
					}, false);
					
					if(data.startPage !== false){
						HYWEBAPP.toPage(data.startPage,{});
					}
				}, false);
			});
		}
	};
	
}());