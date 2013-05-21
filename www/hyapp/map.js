HYWEBAPP.addPage(HYWEBAPP.createPage("map"));

HYWEBAPP.addRoute({
    "#map(?:[?](.*))?": {
        events: "bs",
        handler: function(eventType, match, ui) {

            HYWEBAPP.prevPage = ui.prevPage;
            HYWEBAPP.nextPage = ui.nextPage;


            var params = HYWEBAPP.getRouteParams(match[1]);

            if (params !== null) {
                console.log("action: " + params.action);
                //HYWEBAPP.page("map").addVar("action", params.action);
                HYWEBAPP.page("map").variable("action", params.action);
            } else {
                console.log("No Params");
                //HYWEBAPP.page("map").addVar("action", "");
                HYWEBAPP.page("map").variable("action", "");
            }

            if (params !== null) {
                console.log("title: " + params.title);
                //HYWEBAPP.page("map").addVar("title", params.title);
                HYWEBAPP.page("map").variable("title", params.title);
            } else {
                console.log("No Params");
                //HYWEBAPP.page("map").addVar("title", "");
                HYWEBAPP.page("map").variable("title", "");
            }

            if (params !== null) {
                console.log("start: " + params.start);
                //HYWEBAPP.page("map").addVar("start", params.start);
                HYWEBAPP.page("map").variable("start", params.start);
            } else {
                console.log("No Params");
                //HYWEBAPP.page("map").addVar("start", "");
                HYWEBAPP.page("map").variable("start", "");
            }

            if (params !== null) {
                console.log("end: " + params.end);
                //HYWEBAPP.page("map").addVar("end", params.end);
                HYWEBAPP.page("map").variable("end", params.end);
            } else {
                console.log("No Params");
                //HYWEBAPP.page("map").addVar("end", "");
                HYWEBAPP.page("map").variable("end", "");
            }

            if (params !== null) {
                console.log("keyword: " + params.keyword);
                //HYWEBAPP.page("map").addVar("keyword", params.keyword);
                HYWEBAPP.page("map").variable("keyword", params.keyword);
            } else {
                console.log("No Params");
                //HYWEBAPP.page("map").addVar("keyword", "");
                HYWEBAPP.page("map").variable("keyword", "");
            }


            HYWEBAPP.page("map").execHandler('pagebeforeshow');

            for (itemName in HYWEBAPP.page("map").items()) {
                var item = HYWEBAPP.page("map").item(itemName);
                console.log(itemName + " Start Init!!");
                item.execHandler('pagebeforeshow');
            }
        }
    }
});

HYWEBAPP.addRoute({
    "#map(?:[?](.*))?": {
        events: "s",
        handler: function(eventType, match, ui) {

            HYWEBAPP.prevPage = ui.prevPage;
            HYWEBAPP.nextPage = ui.nextPage;

            HYWEBAPP.page("map").execHandler('pageshow');

            for (itemName in HYWEBAPP.page("map").items()) {
                var item = HYWEBAPP.page("map").item(itemName);
                console.log(itemName + " Show!!");
                item.execHandler('pageshow');
            }
        }
    }
});

HYWEBAPP.addRoute({
    "#map(?:[?](.*))?": {
        events: "bh",
        handler: function(eventType, match, ui) {
            HYWEBAPP.nextPage = ui.nextPage;
            HYWEBAPP.page("map").execHandler('pagebeforehide');
        }
    }
});



HYWEBAPP.addRoute({
    "#map(?:[?](.*))?": {
        events: "i",
        handler: function(eventType, match, ui) {

            HYWEBAPP.prevPage = ui.prevPage;
            HYWEBAPP.nextPage = ui.nextPage;



            HYWEBAPP.page("map").execHandler('pageinit');

            for (itemName in HYWEBAPP.page("map").items()) {
                var item = HYWEBAPP.page("map").item(itemName);
                item.execHandler('pageinit');
            }
        }
    }
});


HYWEBAPP.page("map").addItem(
HYWEBAPP.page("map").createItem("searchField", "text"));

HYWEBAPP.page("map").addItem(
HYWEBAPP.page("map").createItem("searchBtn", "button"));

HYWEBAPP.page("map").addItem(
HYWEBAPP.page("map").createItem("startIcon", "image"));

HYWEBAPP.page("map").addItem(
HYWEBAPP.page("map").createItem("startField", "text"));

HYWEBAPP.page("map").addItem(
HYWEBAPP.page("map").createItem("swapIcon", "image"));

HYWEBAPP.page("map").addItem(
HYWEBAPP.page("map").createItem("endIcon", "image"));

HYWEBAPP.page("map").addItem(
HYWEBAPP.page("map").createItem("endField", "text"));

HYWEBAPP.page("map").addItem(
HYWEBAPP.page("map").createItem("directionIcon", "image"));

HYWEBAPP.page("map").addEventHandler("pageinit", function() {


    hymenu.createMenu("spotCategoriesMenu", "map_content", spotCategories, function(event, name, value) {
        if (hymenu.context() != null) {
            hymenu.closeMenu();
        }
        $.ajax({
            url: 'http://localhost:8800/getSpots',
            type: 'GET',
            data: {
                type: value
            },
            dataType: 'json',
            success: function(result) {
                var data = result.data;
                $.each(data, function(index, obj) {
                    var position = obj.lat + ',' + obj.lon,
                        iconUrl = '';
                    if (value === '0') {
                        iconUrl = 'images/icons/map/gover.png';
                    } else if (value === '1') {
                        iconUrl = 'images/icons/map/school.png';
                    } else if (value === '2') {
                        iconUrl = 'images/icons/map/sport.png';
                    } else if (value === '3') {
                        iconUrl = 'images/icons/map/restaurant.png';
                    } else if (value === '4') {
                        iconUrl = 'images/icons/map/hotel.png';
                    } else if (value === '5') {
                        iconUrl = 'images/icons/map/hospital.png';
                    } else if (value === '6') {
                        iconUrl = 'images/icons/map/bank.png';
                    } else if (value === '7') {
                        iconUrl = 'images/icons/map/police.png';
                    } else if (value === '8') {
                        iconUrl = 'images/icons/map/transport.png';
                    } else if (value === '9') {
                        iconUrl = 'images/icons/map/factory.png';
                    } else if (value === '10') {
                        iconUrl = 'images/icons/map/wifi.png';
                    }
                    hymap.addMarker(position, $('#mainMap'), {
                        'icon': iconUrl
                    }, function() {
                        var coord = this.getPosition();
                        hymap.openInfoWindow($('#mainMap'), {
                            'content': '<div class="map-info-window"><h3 class="info-name">' + obj.name + '</h3><span class="map-info-link"><a href="#" onclick="javascript: hymap.closeInfoWindow($(\'#mainMap\'));">關閉</a></span><span class="map-info-link"><a href="#" onclick="javascript: hymap.showPath(\'\', \'' + coord.hb + ',' + coord.ib + '\', $(\'#mainMap\'), { panel: document.getElementById(\'mainList\') });">規劃路徑</a></span><span class="map-info-link"><a href="#" onclick="javascript: hymap.setAlert({ name:\'' + obj.name + '\', lat:\'' + coord.hb + '\', lon:\'' + coord.ib + '\' }); hymap.closeInfoWindow($(\'#mainMap\'));">接近提醒</a></span></div>'
                        }, this);
                    });
                });
            }
        });
    });

    $('img[name="searchIcon"]').live('click', function() {
        HYWEBAPP.page('map').variable('action', 'search');
        if ($('.search-row:visible').length > 0) {
            $('.search-row').hide();
        } else {
            $('.search-row').show();
            $('.path-start-row').hide();
            $('.path-end-row').hide();
        }
    });

    $('img[name="pathIcon"]').live('click', function() {
        HYWEBAPP.page('map').variable('action', 'path');
        if ($('.path-start-row:visible').length > 0) {
            $('.path-start-row').hide();
            $('.path-end-row').hide();
        } else {
            $('.search-row').hide();
            $('.path-start-row').show();
            $('.path-end-row').show();
            HYWEBAPP.page('map').item('startField').getContext().val('我的位置');
        }
    });

    $('img[name="spotIcon"]').live('click', function() {
        if (hymenu.isHidden()) {
            hymenu.showMenu();
        } else {
            hymenu.closeMenu();
        }
    });

    $('img[name="nearIcon"]').live('click', function() {
        $.mobile.changePage('#nearAlert', {
            role: 'dialog'
        });
    });

    $('#showMapTab').live('click', function() {
        $('#mainList').hide();
        $('#mainMap').show();
    });

    $('#showListTab').live('click', function() {
        $('#mainMap').hide();
        $('#mainList').show();
    });

    HYWEBAPP.page('map').item('searchBtn').getContext().live('click', function() {
        var keyword = HYWEBAPP.page('map').item('searchField').getContext().val();
        if (keyword !== '') {
            hymap.findSpot(keyword, $('#mainMap'), function(results) {
                var position = results[0].geometry.location;
                hymap.addMarker(position, $('#mainMap'), {}, function() {
                    var coord = this.getPosition();
                    hymap.openInfoWindow($('#mainMap'), {
                        'content': '<div class="map-info-window"><h3 class="info-name">' + results[0].address_components[0].long_name + '</h3><span class="map-info-link"><a href="#" onclick="javascript: hymap.closeInfoWindow($(\'#mainMap\'));">關閉</a></span><span class="map-info-link"><a href="#" onclick="javascript: hymap.showPath(\'\', \'' + coord.hb + ',' + coord.ib + '\', $(\'#mainMap\'), { panel: document.getElementById(\'mainList\') }, function(){ $(\'.path-type-tabs\').show(); });">規劃路徑</a></span><span class="map-info-link"><a href="#" onclick="javascript: hymap.setAlert({ name:\'' + results[0].address_components[0].long_name + '\', lat:\'' + coord.hb + '\', lon:\'' + coord.ib + '\' }); hymap.closeInfoWindow($(\'#mainMap\'));">接近提醒</a></span></div>'
                    }, this);
                });
                $('.search-row').hide();
                $('.path-type-tabs').hide();
            });
        }
    });

    HYWEBAPP.page('map').item('swapIcon').getContext().live('click', function() {
        var start = HYWEBAPP.page('map').item('startField').getContext().val(),
            end = HYWEBAPP.page('map').item('endField').getContext().val();
        HYWEBAPP.page('map').item('startField').getContext().val(end);
        HYWEBAPP.page('map').item('endField').getContext().val(start);
    });

    HYWEBAPP.page('map').item('directionIcon').getContext().live('click', function() {
        var start = HYWEBAPP.page('map').item('startField').getContext().val(),
            end = HYWEBAPP.page('map').item('endField').getContext().val();
        if (start === '' && end === '') {
            return;
        }
        if (start === '我的位置') {
            start = '';
        }
        if (end === '我的位置') {
            end = '';
        }
        hymap.showPath(start, end, $('#mainMap'), {
            panel: document.getElementById('mainList')
        }, function() {
            $('.path-start-row').hide();
            $('.path-end-row').hide();
            $('.path-type-tabs').show();
        });
    });


});

HYWEBAPP.page("map").addEventHandler("pagebeforeshow", function() {


    $('#mainMap').gmap();


});

HYWEBAPP.page("map").addEventHandler("pageshow", function() {


    var action = (HYWEBAPP.page('map').variable('action') !== '') ? HYWEBAPP.page('map').variable('action') : (hymap.getDefaultAction() !== null) ? hymap.getDefaultAction() : '',
        start = (HYWEBAPP.page('map').variable('start') !== '') ? HYWEBAPP.page('map').variable('start') : (hymap.getDefaultStart() !== null) ? hymap.getDefaultStart() : '',
        end = (HYWEBAPP.page('map').variable('end') !== '') ? HYWEBAPP.page('map').variable('end') : (hymap.getDefaultEnd() !== null) ? hymap.getDefaultEnd() : '',
        keyword = (HYWEBAPP.page('map').variable('keyword') !== '') ? HYWEBAPP.page('map').variable('keyword') : (hymap.getDefaultKeyword() !== null) ? hymap.getDefaultKeyword() : '';
    $('.search-row').hide();
    $('.path-start-row').hide();
    $('.path-end-row').hide();
    $('#mainList').hide();
    if (action === 'path') {
        console.log(start);
        console.log(end);
        hymap.showPath(start, end, $('#mainMap'), {
            panel: document.getElementById('mainList')
        }, function() {
            $('.path-type-tabs').hide();
            var footerOffset = $('#map .ui-footer').offset(),
                headerHeight = $('#map .ui-header').height();
            $('#mainMap').css('height', (footerOffset.top - headerHeight) + 'px');
            $('.path-type-tabs').show();
        });
    } else if (action === 'search') {
        hymap.findSpot(keyword, $('#mainMap'), function(results) {
            var position = results[0].geometry.location;
            hymap.addMarker(position, $('#mainMap'), {}, function() {
                var coord = this.getPosition();
                hymap.openInfoWindow($('#mainMap'), {
                    'content': '<div class="map-info-window"><h3 class="info-name">' + results[0].address_components[0].long_name + '</h3><span class="map-info-link"><a href="#" onclick="javascript: hymap.closeInfoWindow($(\'#mainMap\'));">關閉</a></span><span class="map-info-link"><a href="#" onclick="javascript: hymap.showPath(\'\', \'' + coord.hb + ',' + coord.ib + '\', $(\'#mainMap\'), { panel: document.getElementById(\'mainList\') }, function(){ $(\'.path-type-tabs\').show(); });">規劃路徑</a></span><span class="map-info-link"><a href="#" onclick="javascript: hymap.setAlert({ name:\'' + results[0].address_components[0].long_name + '\', lat:\'' + coord.hb + '\', lon:\'' + coord.ib + '\' }); hymap.closeInfoWindow($(\'#mainMap\'));">接近提醒</a></span></div>'
                }, this);
            });
        });
        $('.path-type-tabs').hide();
        var footerOffset = $('#map .ui-footer').offset(),
            headerHeight = $('#map .ui-header').height();
        $('#mainMap').css('height', (footerOffset.top - headerHeight) + 'px');
    }


});