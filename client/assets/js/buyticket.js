/*------------------------------------------
 Buying Ticket
 ------------------------------------------*/
//Query String
function getUrlVars(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
//initialize ticket object
var ticket = {};


$(document).ready(function () {
    
    if($('body').is('.buyticket')){
        
        //capitalize first letter
        function cap(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    
        
        ticket = {
            'origin': cap(getUrlVars('origin')),
            'destination': cap(getUrlVars('destination')),
            'day': cap(getUrlVars('day'))
        };
        $.ajax({
            url: '/api/tickets/'+ticket.origin+'/'+ticket.destination+'/'+ticket.day,
            contentType: 'application/json',
            success: function(response) {
//                console.log(response);
                
                //Show list of tickets
                var table = $('#tickettable');
                var tablebody = $('#ticketlist');
                response[0].dep_time.forEach(function(time){
                  tablebody.append('\
                    <tr id="mytr"><td class="time">'+time+'</td>\
                        <td class="fare">'+response[0].fare+'</td>\
                        <td></tr>\
                 ');
                });
                table.show();
                
                
                //Click on ticket to buy
                tablebody.on('click', '#mytr', function(){
                   var rowEl = $(this).closest('tr');
                   var time = rowEl.find('.time').text();
                   var fare = rowEl.find('.fare').text();
                   console.log(time+' '+fare)
                });
                
                //todo: get estimated time of arrival
            }
        });


        
        
        
        $('#journey').html('');
        $('#journey').append('\
            <span>'+ ticket.origin+ '</span>\
            <i class="ion-arrow-right-a"></i><span> '+ticket.destination+'</span>\
            <span> on '+ticket.day+'</span>\
        ');
    }
});


//intialize map
function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('googleMap'), {
        zoom: 7,
        center: {lat: 11.175031, lng: 1.1994742}
    });
    directionsDisplay.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsDisplay);
}
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: ticket.origin+', gh',
        destination: ticket.destination+', gh',
        travelMode: 'DRIVING',
        drivingOptions: {
            departureTime: new Date(Date.now()),
            trafficModel: 'pessimistic'
        }
    }, function(response, status) {
        if (status === 'OK') {
            console.log(response)
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}


