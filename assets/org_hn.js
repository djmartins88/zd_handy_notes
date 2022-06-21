// Initialise Apps framework client. See also:
// https://developer.zendesk.com/apps/docs/developer-guide/getting_started
var client = ZAFClient.init();
var numNewElements = 0;

client.invoke('resize', {width: '100%'});

function addNewElement() {
    var select = document.getElementById('element-select')
    var selectedValue = select.value
    select.selectedIndex = 0;
    
    //console.log(selectedValue);

    var newElement = '<div id="' + numNewElements + '" class="' + selectedValue + '">';
    switch (selectedValue) {
        case "title":
            newElement += '<input type="text" value="Your title!"/>';
            break;
        case "text":
            newElement += '<input type="text" value="Your text!" />';
            break;
        case "label":
            newElement += '<input type="text" value="Your label!" />';
            break;
        case "url":
            newElement += '<input type="text" value="The url name" /><input type="text" value="The url!"/>';
            break;
    }
    newElement += '<button onclick="remove(' + numNewElements++ + ')">Remove</button></div>'

    addElementInnerHTML('handy-notes', newElement);

}

function remove(id) {
    console.log('removing ' + id);
    document.getElementById(id).remove();
    resizeWidgetSize();
}

function saveHandyNotes() {

    console.log('saving.. :)');

    var handyNotes = document.getElementById('handy-notes');
    var elements = handyNotes.getElementsByTagName('div');

    var orgnotes = []
    for (var e of elements) {
        
        var texts = e.getElementsByTagName('input');

        var value = '';
        if (e.className == 'url') {
            value = {text: texts[0].value, link: texts[1].value};
        } else {
            value = texts[0].value;
        }

        var element = {
            "class": e.className,
            "value": value
        };

        orgnotes.push(element);
    }

    json = JSON.stringify(orgnotes, null, 2);
    console.log(json);
}

// function to resize widget size
function resizeWidgetSize() {
    var content = document.getElementById('content');
    client.invoke('resize', { width: '100%', height: content.offsetHeight});
}

// set element inner html
function addElementInnerHTML(id, newElement) {
    var element = document.getElementById(id);
    element.innerHTML = element.innerHTML + newElement;
    resizeWidgetSize();
}
