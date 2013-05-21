HYWEBAPP.addPage(HYWEBAPP.createPage("pullUpList"));

HYWEBAPP.addRoute({
    "#pullUpList(?:[?](.*))?": {
        events: "bs",
        handler: function(eventType, match, ui) {

            HYWEBAPP.prevPage = ui.prevPage;
            HYWEBAPP.nextPage = ui.nextPage;



            HYWEBAPP.page("pullUpList").execHandler('pagebeforeshow');

            for (itemName in HYWEBAPP.page("pullUpList").items()) {
                var item = HYWEBAPP.page("pullUpList").item(itemName);
                console.log(itemName + " Start Init!!");
                item.execHandler('pagebeforeshow');
            }
        }
    }
});

HYWEBAPP.addRoute({
    "#pullUpList(?:[?](.*))?": {
        events: "s",
        handler: function(eventType, match, ui) {

            HYWEBAPP.prevPage = ui.prevPage;
            HYWEBAPP.nextPage = ui.nextPage;

            HYWEBAPP.page("pullUpList").execHandler('pageshow');

            for (itemName in HYWEBAPP.page("pullUpList").items()) {
                var item = HYWEBAPP.page("pullUpList").item(itemName);
                console.log(itemName + " Show!!");
                item.execHandler('pageshow');
            }
        }
    }
});

HYWEBAPP.addRoute({
    "#pullUpList(?:[?](.*))?": {
        events: "bh",
        handler: function(eventType, match, ui) {
            HYWEBAPP.nextPage = ui.nextPage;
            HYWEBAPP.page("pullUpList").execHandler('pagebeforehide');
        }
    }
});



HYWEBAPP.addRoute({
    "#pullUpList(?:[?](.*))?": {
        events: "i",
        handler: function(eventType, match, ui) {

            HYWEBAPP.prevPage = ui.prevPage;
            HYWEBAPP.nextPage = ui.nextPage;


            $('#pullUpList_content').live('iscroll_onpullup', function(e, d) {
                console.log('page: pullUpList pull up to refresh!!');

                var callback =

                function(e, d) {
                    var nowSettings = hylist.getSettings();
                    eval('nowSettings.pullUpHandler = ' + nowSettings.pullUpHandler);
                    if (typeof nowSettings.pullUpHandler === 'function') {
                        nowSettings.pullUpHandler(e, d);
                    }
                }

                ;
                callback(e, d);

            });


            HYWEBAPP.page("pullUpList").execHandler('pageinit');

            for (itemName in HYWEBAPP.page("pullUpList").items()) {
                var item = HYWEBAPP.page("pullUpList").item(itemName);
                item.execHandler('pageinit');
            }
        }
    }
});


HYWEBAPP.page("pullUpList").addItem(
HYWEBAPP.page("pullUpList").createItem("itemList", "list"));

HYWEBAPP.page("pullUpList").addEventHandler("pageinit", function() {


    var nowSettings = hylist.getSettings();
    $('#pullUpList_content').iscrollview("option", {
        pullUpResetText: nowSettings.pullUpText,
        pullUpPulledText: nowSettings.pulledText,
        pullUpLoadingText: nowSettings.pullLoadingText
    });


});

HYWEBAPP.page("pullUpList").addEventHandler("pageshow", function() {


    hylist.init('pullUpList_content', HYWEBAPP.page('pullUpList').item('itemList').getContext());


});