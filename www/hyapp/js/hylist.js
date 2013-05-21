var hylist = (function(){
	var _LIST = null,
		_PARENT_ID = '',
		_ITEM_TEMPLATE = {
			type: 'item',
			title: '',
			link: '#',
			subtitle: [],
			thumb: '',
			bubbleCount: '',
			groupName: '',
			groupItems: []
		},
		_DATA = (window.sessionStorage.getItem('com.hyweb.app.module.list.data') !== null)?JSON.parse(window.sessionStorage.getItem('com.hyweb.app.module.list.data')):[],
		_IS_ARRAY = function(a){
			return Object.prototype.toString.apply(a) === '[object Array]';
		},
		_SETTINGS = {
			filter: false,
			filterText: 'Search...',
			readonly: false,
			pullDownText: 'Pull down to refresh...',
			pullDownHandler: function(e,d){
				
			},
			pullUpText: 'Pull up to refresh...',
			pullUpHandler: function(e,d){
				
			},
			pulledText: 'Release to refresh...',
			pullLoadingText: 'Loading...'
		},
		_ITEM_GENERATOR = function(obj){
			var nowSettings = (window.sessionStorage.getItem('com.hyweb.app.module.list.options') !== null)?JSON.parse(window.sessionStorage.getItem('com.hyweb.app.module.list.options')):_SETTINGS,
				liHtml = '';
			liHtml = liHtml + '<li>';
			if(nowSettings.readonly === true){
				if(obj.thumb !== ''){
					liHtml = liHtml + '<img src="' + obj.thumb + '" class="ui-li-thumb" />';
				}
				liHtml = liHtml + '<h3 class="ui-li-heading">' + obj.title + '</h3>';
				if(obj.bubbleCount !== ''){
					liHtml = liHtml + '<span class="ui-li-count">' + obj.bubbleCount + '</span>';
				}
				if(obj.subtitle.length > 0){
					for(var j = 0;j < obj.subtitle.length;j++){
						liHtml = liHtml + '<p class="ui-li-desc">' + obj.subtitle[j] + '</p>';
					}
				}
			}else if(nowSettings.readonly === false){
				liHtml = liHtml + '<a data-ajax="false" href="' + obj.link + '">';
				if(obj.thumb !== ''){
					liHtml = liHtml + '<img src="' + obj.thumb + '" class="ui-li-thumb" />';
				}
				liHtml = liHtml + '<h3 class="ui-li-heading">' + obj.title + '</h3>';
				if(obj.bubbleCount !== ''){
					liHtml = liHtml + '<span class="ui-li-count">' + obj.bubbleCount + '</span>';
				}
				if(obj.subtitle.length > 0){
					for(var j = 0;j < obj.subtitle.length;j++){
						liHtml = liHtml + '<p class="ui-li-desc">' + obj.subtitle[j] + '</p>';
					}
				}
				liHtml = liHtml + '</a>';
			}
			liHtml = liHtml + '</li>';
			return liHtml;
		},
		_GENERATOR = function(){
			var nowSettings = (window.sessionStorage.getItem('com.hyweb.app.module.list.options') !== null)?JSON.parse(window.sessionStorage.getItem('com.hyweb.app.module.list.options')):_SETTINGS;
			if(nowSettings.filter === false){
				$('#' + _PARENT_ID + ' form.ui-listview-filter').hide();
			}else{
				$('#' + _PARENT_ID + ' form.ui-listview-filter').show();
			}
			$('#' + _PARENT_ID + ' form.ui-listview-filter div.ui-input-search input').attr('placeholder', nowSettings.filterText);
			
			console.log(JSON.stringify(nowSettings));
			console.log(JSON.stringify(_DATA));
			
			if(typeof _DATA === 'string'){
				_LIST.html(_DATA);
			}else{
				var liHtml = '';
				for(var i = 0;i < _DATA.length;i++){
					var obj = $.extend(true, {}, _ITEM_TEMPLATE, _DATA[i]);
					if(obj.type !== 'group'){
						liHtml = liHtml + _ITEM_GENERATOR(obj);
					}else if(obj.type === 'group'){
						liHtml = liHtml + '<li data-role="list-divider" class="ui-li-divider" >' + obj.groupName + '</li>';
						for(var j = 0;j < obj.groupItems.length;j++){
							var gobj = $.extend(true, {}, _ITEM_TEMPLATE, obj.groupItems[j]);
							liHtml = liHtml + _ITEM_GENERATOR(gobj);
						}
					}
				}
				_LIST.html(liHtml);
			}
		};
	return {
		set: function(data, options){
			var extendSettings;
			if(typeof data !== 'undefined'){
				window.sessionStorage.setItem('com.hyweb.app.module.list.data', JSON.stringify(data))
			}
			if(typeof options !== 'undefined'){
				extendSettings =  $.extend(true, {}, _SETTINGS, options);
			}else{
				extendSettings =  $.extend(true, {}, _SETTINGS);
			}
			extendSettings.pullUpHandler = extendSettings.pullUpHandler.toString();
			extendSettings.pullDownHandler = extendSettings.pullDownHandler.toString();
			window.sessionStorage.setItem('com.hyweb.app.module.list.options', JSON.stringify(extendSettings))
		},
		
		init: function(parentId, listObj){
			_PARENT_ID = parentId;
			_LIST = listObj;
			this.clear();
			_GENERATOR();
			this.refresh();
		},
		
		refresh: function(){
			if(_LIST !== null){
				_LIST.listview('refresh');
			}
			$('#'+_PARENT_ID).iscrollview('refresh');
		},
		
		clear: function(){
			if(_LIST !== null){
				_LIST.html('');
			}
		},
		
		append: function(data){
			if(typeof data === 'string'){
				_LIST.append(data);
			}else{
				for(var i = 0;i < data.length;i++){
					_DATA.push(data[i]);
				}
				this.clear();
				_GENERATOR();
			}
			this.refresh();
		},
		
		prepend: function(data){
			if(typeof data === 'string'){
				_LIST.prepend(data);
			}else{
				var newData = [];
				for(var i = 0;i < data.length;i++){
					newData.push(data[i]);
				}
				for(var i = 0;i < _DATA.length;i++){
					newData.push(_DATA[i]);
				}
				_DATA = newData;
				this.clear();
				_GENERATOR();
			}
			this.refresh();
		},
		
		getSettings: function(){
			return (window.sessionStorage.getItem('com.hyweb.app.module.list.options') !== null)?JSON.parse(window.sessionStorage.getItem('com.hyweb.app.module.list.options')):_SETTINGS;
		},
		
		count: function(){
			return _LIST.children('li').length;
		}
	};
}());