HYWEBAPP.addPage(HYWEBAPP.createPage("pullDownList"));

HYWEBAPP.addRoute({
    "#pullDownList(?:[?](.*))?": {
        events: "bs",
        handler: function(eventType, match, ui) {

            HYWEBAPP.prevPage = ui.prevPage;
            HYWEBAPP.nextPage = ui.nextPage;



            HYWEBAPP.page("pullDownList").execHandler('pagebeforeshow');

            for (itemName in HYWEBAPP.page("pullDownList").items()) {
                var item = HYWEBAPP.page("pullDownList").item(itemName);
                console.log(itemName + " Start Init!!");
                item.execHandler('pagebeforeshow');
            }
        }
    }
});

HYWEBAPP.addRoute({
    "#pullDownList(?:[?](.*))?": {
        events: "s",
        handler: function(eventType, match, ui) {

            HYWEBAPP.prevPage = ui.prevPage;
            HYWEBAPP.nextPage = ui.nextPage;

            HYWEBAPP.page("pullDownList").execHandler('pageshow');

            for (itemName in HYWEBAPP.page("pullDownList").items()) {
                var item = HYWEBAPP.page("pullDownList").item(itemName);
                console.log(itemName + " Show!!");
                item.execHandler('pageshow');
            }
        }
    }
});

HYWEBAPP.addRoute({
    "#pullDownList(?:[?](.*))?": {
        events: "bh",
        handler: function(eventType, match, ui) {
            HYWEBAPP.nextPage = ui.nextPage;
            HYWEBAPP.page("pullDownList").execHandler('pagebeforehide');
        }
    }
});



HYWEBAPP.addRoute({
    "#pullDownList(?:[?](.*))?": {
        events: "i",
        handler: function(eventType, match, ui) {

            HYWEBAPP.prevPage = ui.prevPage;
            HYWEBAPP.nextPage = ui.nextPage;


            $('#pullDownList_content').live('iscroll_onpulldown', function(e, d) {
                console.log('page: pullDownList pull down to refresh!!');

                var callback =

                function(e, d) {
                    var nowSettings = hylist.getSettings();
                    eval('nowSettings.pullDownHandler = ' + nowSettings.pullDownHandler);
                    if (typeof nowSettings.pullDownHandler === 'function') {
                        nowSettings.pullDownHandler(e, d);
                    }
                }

                ;
                callback(e, d);

            });


            HYWEBAPP.page("pullDownList").execHandler('pageinit');

            for (itemName in HYWEBAPP.page("pullDownList").items()) {
                var item = HYWEBAPP.page("pullDownList").item(itemName);
                item.execHandler('pageinit');
            }
        }
    }
});


HYWEBAPP.page("pullDownList").addItem(
HYWEBAPP.page("pullDownList").createItem("itemList", "list"));

HYWEBAPP.page("pullDownList").addEventHandler("pageinit", function() {


    var nowSettings = hylist.getSettings();
    $('#pullDownList_content').iscrollview("option", {
        pullDownResetText: nowSettings.pullDownText,
        pullDownPulledText: nowSettings.pulledText,
        pullDownLoadingText: nowSettings.pullLoadingText
    });


});

HYWEBAPP.page("pullDownList").addEventHandler("pageshow", function() {


    hylist.init('pullDownList_content', HYWEBAPP.page('pullDownList').item('itemList').getContext());


});