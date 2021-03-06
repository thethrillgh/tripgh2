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
var user = {};


$(document).ready(function () {
    
    if($('body').is('.buyticket')){
        
        //capitalize first letter
        function cap(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    
        //get ticket div and populate with list of tickets
        ticket = {
            'origin': cap(getUrlVars('origin')),
            'destination': cap(getUrlVars('destination')),
            'day': cap(getUrlVars('day'))
        };
        
        $.ajax({
                url: '/api/check',
                method: 'get',
                contentType: 'application/json',
                success: function(response) {
                    if(response != "not logged in"){
                        $('.loginlink').hide();
                        $('.profilelink').removeClass("hide");
                    }
                    else{
                        $('.profilelink').addClass("hide");
                        $('.loginlink').show();
                    }
                }
            });
        
        $('.logout').on('click', function(){
            $.ajax({
                url: '/api/logout',
                method: 'get',
                contentType: 'application/json',
                success: function(response) {
                     $('.profilelink').addClass("hide");
                     $('.loginlink').show();
                     window.location.href="index.html"
                }
            });
        })
        $.ajax({
            url: '/api/tickets/'+ticket.origin+'/'+ticket.destination+'/'+ticket.day,
            contentType: 'application/json',
            success: function(response) {                
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
                   user.time = time;
                   user.fare = fare;
                   user.origin = ticket.origin;
                   user.destination = ticket.destination;
                    $("#ticketinfo2").hide();
                   $('#paymentsection').show();
                    $(".amount").text(user.fare);
                });
            }
        });

        //Ticket Header
        $('#journey').html('');
        $('#journey').append('\
            <span>'+ ticket.origin+ '</span>\
            <i class="ion-arrow-right-a"></i><span> '+ticket.destination+'</span>\
            <span> on '+ticket.day+'</span>\
        ');
        var selectedpayment='';        
        var isselected = {
                visa: false,
                paypal: false,
                mm: true
        }
        //selection logic
        function toggle(form){
            $(form).toggleClass("symbol-block-selected");
        }
        $('#selectpayment input').on('click', function() {
           selectedpayment=$('input[name="payrad"]:checked', '#selectpayment').val();
            if(selectedpayment=='visa'){
                if(isselected.paypal == true){
                     toggle('.paypal')
                     isselected.paypal = false;
                }
                else if(isselected.visa == true){
                     toggle('.visa')
                     isselected.paypal = false;
                }
                else if(isselected.mm == true){
                     toggle('.mm')
                     isselected.mm = false;
                }
                toggle('.visa')
                isselected.visa = true;
            }
            else if(selectedpayment=='paypal'){
                if (isselected.visa == true){
                    toggle('.visa')
                    isselected.visa = false;
                }
                else if (isselected.paypal == true){
                    toggle('.paypal')
                    isselected.paypal = false;
                }
                else if (isselected.mm == true){
                    toggle('.mm')
                    isselected.mm = false;
                }
                toggle('.paypal')
                isselected.paypal = true;
            }
            else if(selectedpayment=='mm'){
                if (isselected.mm == true){
                    toggle('.mm')
                    isselected.mm = false;
                }
                else if (isselected.paypal == true){
                    toggle('.paypal')
                    isselected.paypal = false;
                }
                else if (isselected.visa == true){
                    toggle('.visa')
                    isselected.visa = false;
                }
                toggle('.mm')
                isselected.mm = true;
            }
        });
        
        $("#pay-stripe").on('click', function(){
              $("#paymentsection").hide();
              $("#stripe-form").show();
        });
//          Form Validation
          $(function() {
          $('form.require-validation').bind('submit', function(e) {
            var $form         = $(e.target).closest('form'),
                inputSelector = ['input[type=email]', 'input[type=password]',
                                 'input[type=text]', 'input[type=file]',
                                 'textarea'].join(', '),
                $inputs       = $form.find('.required').find(inputSelector),
                $errorMessage = $form.find('div.error'),
                valid         = true;

            $errorMessage.addClass('hide');
            $('.has-error').removeClass('has-error');
            $inputs.each(function(i, el) {
              var $input = $(el);
              if ($input.val() === '') {
                $input.parent().addClass('has-error');
                $errorMessage.removeClass('hide');
                e.preventDefault(); // cancel on first error
              }
            });
          });
        });

        $(function() {
          var $form = $("#payment-form");

          $form.on('submit', function(e) {
            if (!$form.data('cc-on-file')) {
              e.preventDefault();
              Stripe.setPublishableKey($form.data('stripe-publishable-key'));
              Stripe.createToken({
                name: $('.name').val(),
                number: $('.card-number').val(),
                cvc: $('.card-cvc').val(),
                exp_month: $('.card-expiry-month').val(),
                exp_year: $('.card-expiry-year').val()
              }, stripeResponseHandler);
            }
              return false;
          });

          function stripeResponseHandler(status, response) {
            console.log(response)
            if (response.error) {
              $('.error')
                .removeClass('hide')
                .find('.alert')
                .text(response.error.message);
            } else {
              // token contains id, last4, and card type
              var token = response['id'];
              // insert the token into the form so it gets submitted to the server
              user.email = $('.emailadd').val();
              user.name = $('.name').val();
              user.charge= response;
              user.day= ticket.day;
              $form.find('input[type=text]').empty();
              $form.append("<input type='hidden' name='stripeToken' value='" + token + "'/>");
              $form.append("<input type='hidden' name='fare' value=" + user.fare + ">");
              $form.append("<input type='hidden' name='time' value=" + user.time + ">");
              $form.append("<input type='hidden' name='origin' value=" + user.origin + ">");
              $form.append("<input type='hidden' name='destination' value=" + user.destination + ">");
              $form.append("<input type='hidden' name='email' value=" + user.email + ">");
              $form.append("<input type='hidden' name='day' value=" + user.day + ">");
             
              $form.get(0).submit();
            }
          }
        });
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
            $("#duration").html('\
                             time: '+response.routes[0].legs[0].duration.text+'\
                                ')
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}


