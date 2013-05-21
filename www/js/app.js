$(document).bind("mobileinit", function () {
    $.mobile.pushStateEnabled = true;
});
 
$(function () {
    var menuStatus=false;
    
    // Show menu
    $("a.showMenu").click(function () {
        if (menuStatus != true) {
        	$('#menu').show();
            $(".ui-page-active").animate({
                marginLeft: "165px",
            }, 300, function () {
                menuStatus = true
            });
            return false;
        } else {
        	$('#menu').hide();
            $(".ui-page-active").animate({
                marginLeft: "0px",
            }, 300, function () {
                menuStatus = false
            });
            return false;
        }
    });
 
 
    $('#menu, .ui-page-active').live("swipeleft", function () {
        if (menuStatus) {
        	$('#menu').hide();
            $(".ui-page-active").animate({
                marginLeft: "0px",
            }, 300, function () {
                menuStatus = false
            });
        }
    });
 
    $('.ui-page-active').live("swiperight", function () {
        if (!menuStatus) {
        	$('#menu').show();
            $(".ui-page-active").animate({
                marginLeft: "165px",
            }, 300, function () {
                menuStatus = true
            });
        }
    });
 
    $('div[data-role="page"]').on('pagebeforeshow', function (event, ui) {
        menuStatus = false;
        $(".ui-page-active").css("margin-left", "0");
    });
    
    $( 'div[data-role="page"]' ).on( 'pageinit',function(event){

    });
    
    $('div[data-role="page"]').on('pagebeforehide', function (event, ui) {
    	$('#menu').hide();
    });
    
    $('div[data-role="page"]').on('pagehide', function (event, ui) {
    	
    });	
    	
    $('div[data-role="page"]').on('pageshow', function (event, ui) {
    });
    
    
    // Menu behaviour
    $("#menu li a").click(function () {
    	menuStatus = false;
    	var p = $(this).parent();
        if ($(p).hasClass('active')) {
            //$("#menu li").removeClass('active');
        } else {
            $("#menu li").removeClass('active');
            $(p).addClass('active');
        }
        
        
    });
});
 

