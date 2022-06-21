// Initialise Apps framework client. See also:
// https://developer.zendesk.com/apps/docs/developer-guide/getting_started
var client = ZAFClient.init()

client.get('ticket.organization').then(function(data) {    

    var orgId = data['ticket.organization.externalId'];
    
    // debug only
    if (orgId == undefined) {
        orgId = 'newidmock';
    }
    
    if (orgId != undefined) {
        request(orgId).then(
            function(orgnotes) {
                var handynotes ='';
                
                json = JSON.stringify(orgnotes, null, 2);
                console.log(json);
        
                for (var e of orgnotes["notes"]) {
                    //console.log(e);
                    handynotes += '<div class="' + e["class"] + '">' + e["value"] + '</div>';
                }

                setElementInnerHTML('handy-notes',handynotes);
            },
            function(response) {
                console.error(response.responseText);
            }
        );
    }

}).catch(function(error) {
    console.error(error.toString())
})

// function to resize widget size
function resizeWidgetSize() {
    var content = document.getElementsByClassName('content')[0]
    client.invoke('resize', { width: '100%', height: content.offsetHeight})
}

// set element inner html
function setElementInnerHTML(name, value) {
    // i hereby declare it is forbidden to have multiple elements with the same class name (- always using index 0 as the element where we're setting the name)
    document.getElementsByClassName(name)[0].innerHTML = value
}

function request(searchQuery) {
    var options = {
        url:'https://ciie7i6u2g.execute-api.us-east-1.amazonaws.com/organization/' + searchQuery,
        type:'GET',
        dataType: 'json'
    };
    //console.log(options)
    return client.request(options)
}