// Initialise Apps framework client. See also:
// https://developer.zendesk.com/apps/docs/developer-guide/getting_started
var client = ZAFClient.init()

client.invoke('resize', {width: '100%'})

client.get('ticket.organization.name').then(function(data) {
    setElementInnerHTML('org-name', data['ticket.organization.name'])
}).catch(function(error) {
    setElementInnerHTML('org-name', 'Looks like client doesn\'t belong to any organization!')
    console.error(error.toString())
})

client.get('ticket.organization.tags').then(function(data) {

    var tags = data['ticket.organization.tags']
    if (tags.length === 0) {
        throw 'no organization tags'
    } else {
        var tagsHtml = '<ul class="tags">'

        tags.forEach(function(tag){
            switch (tag){
                default:
                    tagsHtml += '<li>' + tag + '</li>'

            }
        })

        tagsHtml += '</ul>'

        setElementInnerHTML('org-tags', tagsHtml)
    }
}).catch(function(error) {
    setElementInnerHTML('org-tags', 'There are no tags!')
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

// request // https://handynotes.free.beeceptor.com
function request(searchQuery) {
    var options = {
        url:'https://handynotes.free.beeceptor.com' + searchQuery,
        type:'GET',
        dataType: 'json'
    };
    //console.log(options)
    return client.request(options)
}

request('/test').then(
    function(elements) {
        var handynotes ='';
        console.log(elements);

            for (e in elements) {
                //console.log(e);
                handynotes += '<div>' + e + ' - ' + elements[e] + '</div>';
            }

        setElementInnerHTML('handy-notes',handynotes);
    },
    function(response) {
        console.error(response.responseText);
    }
);
