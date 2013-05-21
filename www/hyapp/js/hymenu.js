//for測試用, 正式使用時可將借接回來的資料傳入createMenu的options參數
var spotCategories = [{name:'機關', value:'0'}, {name:'文教古蹟', value:'1'}, {name:'運動休閒', value:'2'}, {name:'民生', value:'3'}, {name:'住宿', value:'4'}, {name:'醫療', value:'5'}, {name:'金融', value:'6'}, {name:'警消', value:'7'}, {name:'交通', value:'8'}, {name:'廠商', value:'9'}, {name:'iTaiwan熱點', value:'10'}];

var hymenu = (function(){
	var _MENU = null,
		_IS_HIDDEN = true;
	return {
		/**
		建立選單
		@method createMenu
		@param {String} menuid 選單的ID
		@param {String} parentid 選單的父元素ID
		@param {Object[]} options 選單選項陣列
		@param {Function} menuHandler 選單選項的click handler function
		@return
		**/
		createMenu: function(menuId, parentId, options, menuHandler){
		    //create a containing div
		    var div = $("<div id='" + menuId + "div'></div>").appendTo("#"+parentId).hide();

		    //create select tag
		    var menuElm = $("<select id='" + menuId + "' data-inline='true' data-native-menu='false'></select>").appendTo(div);

		    //add options
		    for (var i = 0; i < options.length; i++){
		        $("<option value='" + options[i].value + "'>" + options[i].name + "</option>").appendTo("#"+menuId);
		    }

		    //convert to JQueryMobile menu
		    $("#" + menuId).selectmenu();

		    //find custom menu that JQM creates
		    var menus = $(".ui-selectmenu");
		    for (var i = 0; i < menus.length; i++){
		        //if ($(menus[i]).children("ul:#" + menuId + "-menu").length > 0)
		        if ($(menus[i]).children("ul").filter("#" + menuId + "-menu").length > 0){
		        	_MENU = $(menus[i]);
		            break;
		        }
		    }

		    //Hack for JQM 1.2 - check if parent of select menu is ui-popup-container
		    var menuContainer = $(menus).parent(".ui-popup-container");
		    if (menuContainer.length > 0){
		        var pageElm = menuContainer.parent("div[data-role='page']");
		        if (pageElm.length > 0) {
		            menus.detach();
		            menuContainer.remove();
		            pageElm.append(menus);
		            menus.css("width", "80%");
		            menus.css("max-width", "350px");
		        }
		    } 

		    if (_MENU == null){
		        console.log("Error creating menu");
		        return;
		    }

		    //Associate click handler with menu items, i.e. anchor tags
		    var itemCounts = $(_MENU).find(".ui-selectmenu-list li a").length;
		    for(var i = 0;i < itemCounts;i++){
		    	$(_MENU).find(".ui-selectmenu-list li a").eq(i).attr('menu-option-value', options[i].value);
		    }
		    $(_MENU).find(".ui-selectmenu-list li a").click(function(event){
		    	if(typeof menuHandler === 'function'){
		    		menuHandler(event, $(this).text(), $(this).attr('menu-option-value'));
		    	}else{
		    		if (_MENU != null){
		    	    	closeMenu();
		    	    }
		    	}
		    });    

		    //Add Close option
		    /*var menuHeader = $(_MENU).find(".ui-header");
		    var closeLinkId = menuId + "_close_id";
		    menuHeader.prepend("<span style='position:relative;float:left'>" +
		        "<a href='#' id='" + closeLinkId + "'>X</href></span>");  
		    $("#" + closeLinkId).click(function(e){
		    	_MENU.hide();
		    });*/

		    return _MENU.hide();
		},
		
		/**
		顯示選單
		@method showMenu
		@return
		**/
		showMenu: function(){
		    if (_MENU == null){
		    	return;
		    }

		    //show menu at center of the window
		    var left = ($(window).width() - $(_MENU).width()) / 2;
		    //consider vertical scrolling when calculating top
		    var top = (($(window).height() - $(_MENU).height()) / 2) + $(window).scrollTop();
		    $(_MENU).css({
		        left: left,
		        top: top
		    });
		    
		    $(_MENU).show();
		    _IS_HIDDEN = false;
		},
		
		/**
		關閉選單
		@method closeMenu
		@return
		**/
		closeMenu: function(){
		    $(_MENU).hide();
		    _IS_HIDDEN = true;
		},
		
		/**
		目前選單是否可見
		@method isHidden
		@return {Boolean}
		**/
		isHidden: function(){
			return _IS_HIDDEN;
		},
		
		/**
		回傳選單物件
		@method context
		@return {Object}
		**/
		context: function(){
			return _MENU;
		}
	};
}());