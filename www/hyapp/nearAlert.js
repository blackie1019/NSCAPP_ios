HYWEBAPP.addPage(HYWEBAPP.createPage("nearAlert"));

HYWEBAPP.addRoute({
    "#nearAlert(?:[?](.*))?": {
        events: "bs",
        handler: function(eventType, match, ui) {

            HYWEBAPP.prevPage = ui.prevPage;
            HYWEBAPP.nextPage = ui.nextPage;



            HYWEBAPP.page("nearAlert").execHandler('pagebeforeshow');

            for (itemName in HYWEBAPP.page("nearAlert").items()) {
                var item = HYWEBAPP.page("nearAlert").item(itemName);
                console.log(itemName + " Start Init!!");
                item.execHandler('pagebeforeshow');
            }
        }
    }
});

HYWEBAPP.addRoute({
    "#nearAlert(?:[?](.*))?": {
        events: "s",
        handler: function(eventType, match, ui) {

            HYWEBAPP.prevPage = ui.prevPage;
            HYWEBAPP.nextPage = ui.nextPage;

            HYWEBAPP.page("nearAlert").execHandler('pageshow');

            for (itemName in HYWEBAPP.page("nearAlert").items()) {
                var item = HYWEBAPP.page("nearAlert").item(itemName);
                console.log(itemName + " Show!!");
                item.execHandler('pageshow');
            }
        }
    }
});

HYWEBAPP.addRoute({
    "#nearAlert(?:[?](.*))?": {
        events: "bh",
        handler: function(eventType, match, ui) {
            HYWEBAPP.nextPage = ui.nextPage;
            HYWEBAPP.page("nearAlert").execHandler('pagebeforehide');
        }
    }
});



HYWEBAPP.addRoute({
    "#nearAlert(?:[?](.*))?": {
        events: "i",
        handler: function(eventType, match, ui) {

            HYWEBAPP.prevPage = ui.prevPage;
            HYWEBAPP.nextPage = ui.nextPage;



            HYWEBAPP.page("nearAlert").execHandler('pageinit');

            for (itemName in HYWEBAPP.page("nearAlert").items()) {
                var item = HYWEBAPP.page("nearAlert").item(itemName);
                item.execHandler('pageinit');
            }
        }
    }
});


HYWEBAPP.page("nearAlert").addItem(
HYWEBAPP.page("nearAlert").createItem("resultList", "radio"));

HYWEBAPP.page("nearAlert").addItem(
HYWEBAPP.page("nearAlert").createItem("setBtn", "button"));

HYWEBAPP.page("nearAlert").addEventHandler("pageinit", function() {


    HYWEBAPP.page('nearAlert').item('setBtn').getContext().live('click', function() {
        var checkedItem = HYWEBAPP.page('nearAlert').item('resultList').getSelectedItem(),
            checkedValue = '',
            checkedName = '',
            position = [];
        if (checkedItem.length === 0) {
            return;
        }
        checkedValue = checkedItem.val();
        checkedName = $('label[for="' + checkedItem.attr('id') + '"]').text();
        position = checkedValue.split(',');
        console.log(checkedValue);
        console.log(checkedName);
        console.log(position);
        if (position.length >= 2) {
            //測試用
            //hymap.setAlert({ name:'台中火車站', lat:'24.137159', lon:'120.685029' });
            hymap.setAlert({
                name: checkedName,
                lat: position[0],
                lon: position[1]
            });
        }
    });


});

HYWEBAPP.page("nearAlert").addEventHandler("pagebeforeshow", function() {


    var target = hymap.getAlertTarget(),
        lastResult = hymap.getLastResult(),
        targetName = (target === null) ? '無' : target.name,
        liHtml = '';
    $('#target').text('目前已設定目的地：' + targetName);
    for (var i = 0; i < lastResult.length; i++) {
        var val = lastResult[i].lat + ',' + lastResult[i].lon,
            name = lastResult[i].name,
            ischecked = (i === 0) ? 'checked' : '';
        liHtml = liHtml + '<input type="radio" name="' + HYWEBAPP.page('nearAlert').item('resultList').getRealID() + '" id="' + HYWEBAPP.page('nearAlert').item('resultList').getRealID() + '_item' + (i + 1) + '" value="' + val + '" ' + ischecked + ' /><label for="' + HYWEBAPP.page('nearAlert').item('resultList').getRealID() + '_item' + (i + 1) + '">' + name + '</label>';
    }
    HYWEBAPP.page('nearAlert').item('resultList').getContext().html(liHtml);
    HYWEBAPP.page('nearAlert').item('resultList').refresh();


});