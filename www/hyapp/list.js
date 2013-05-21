HYWEBAPP.addPage(HYWEBAPP.createPage("list"));

HYWEBAPP.addRoute({
    "#list(?:[?](.*))?": {
        events: "bs",
        handler: function(eventType, match, ui) {

            HYWEBAPP.prevPage = ui.prevPage;
            HYWEBAPP.nextPage = ui.nextPage;



            HYWEBAPP.page("list").execHandler('pagebeforeshow');

            for (itemName in HYWEBAPP.page("list").items()) {
                var item = HYWEBAPP.page("list").item(itemName);
                console.log(itemName + " Start Init!!");
                item.execHandler('pagebeforeshow');
            }
        }
    }
});

HYWEBAPP.addRoute({
    "#list(?:[?](.*))?": {
        events: "s",
        handler: function(eventType, match, ui) {

            HYWEBAPP.prevPage = ui.prevPage;
            HYWEBAPP.nextPage = ui.nextPage;

            HYWEBAPP.page("list").execHandler('pageshow');

            for (itemName in HYWEBAPP.page("list").items()) {
                var item = HYWEBAPP.page("list").item(itemName);
                console.log(itemName + " Show!!");
                item.execHandler('pageshow');
            }
        }
    }
});

HYWEBAPP.addRoute({
    "#list(?:[?](.*))?": {
        events: "bh",
        handler: function(eventType, match, ui) {
            HYWEBAPP.nextPage = ui.nextPage;
            HYWEBAPP.page("list").execHandler('pagebeforehide');
        }
    }
});



HYWEBAPP.addRoute({
    "#list(?:[?](.*))?": {
        events: "i",
        handler: function(eventType, match, ui) {

            HYWEBAPP.prevPage = ui.prevPage;
            HYWEBAPP.nextPage = ui.nextPage;



            HYWEBAPP.page("list").execHandler('pageinit');

            for (itemName in HYWEBAPP.page("list").items()) {
                var item = HYWEBAPP.page("list").item(itemName);
                item.execHandler('pageinit');
            }
        }
    }
});


HYWEBAPP.page("list").addItem(
HYWEBAPP.page("list").createItem("itemList", "list"));

HYWEBAPP.page("list").addEventHandler("pageshow", function() {


    hylist.init('list_content', HYWEBAPP.page('list').item('itemList').getContext());


});