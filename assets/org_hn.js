// Initialise Apps framework client. See also:
// https://developer.zendesk.com/apps/docs/developer-guide/getting_started
var client = ZAFClient.init();
var numNewElements = 0;
var orgId;

client.get('organization').then(function(data) {

    orgId = data['organization.externalId'];
    if (orgId != undefined) {

        // TODO pre-fil editing screen

        request(orgId).then(
            function(orgnotes) {
                var handynotes ='';
                
                json = JSON.stringify(orgnotes, null, 2);
                console.log(json);
        
                for (var e of orgnotes) {
                    //console.log(e);
                    handynotes += '<div class="' + e["class"] + '">' + e["value"] + '</div>';
                }

                setElementInnerHTML('handy-notes',handynotes);
            },
            function(response) {
                console.error(response.responseText);
            }
        );
    } else {
        orgId = 'newidmock';
    }

}).catch(function(error) {
    console.error(error.toString())
})

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

    var org = {"id": orgId, "notes": orgnotes};

    json = JSON.stringify(org);
    console.log(json);

    var options = {
        url:'https://ciie7i6u2g.execute-api.us-east-1.amazonaws.com/organization/' + orgId,
        type:'PUT',
        contentType: 'application/json',
        data: json,
        //cors: true,
        //crossDomain: true
    };
    console.log(options)
    
    client.request(options).then(function(data) {
        console.log(data);
    }).catch(function(error) {
        console.error(erro);
    })
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
