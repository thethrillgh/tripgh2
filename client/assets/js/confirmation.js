/*------------------------------------------
 Buying Ticket
 ------------------------------------------*/
$(document).ready(function () {
    
    if($('body').is('.confirmation')){
        //footer issue
        if ($(window).width() < 768) {
            $('#footer').removeClass("navbar-fixed-bottom")
        }
        
        
        //capitalize first letter
        function cap(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        $.ajax({
                url: '/api/check',
                method: 'get',
                contentType: 'application/json',
                success: function(response, status, jqXHR) {
                    if ( jqXHR.getResponseHeader('content-type').indexOf('text/html') >= 0 ){
                        window.location.href = "login.html"
                    }
                    if(response != "not logged in"){
                        $('.loginlink').hide();
                        $('.profilelink').removeClass("hide");
                    }
                    else{
                        $('.loginlink').show();
                    }
                }
        });      
        $.ajax({
        url: '/api/cookie',
        contentType: 'application/json',
        success: function(response) { 
            response = JSON.parse(response)
            console.log(response.code)
                $('.confirmationtext').text(response.code);
                $('.nametext').text(response.name);
                $('.origintext').text(response.origin);
                $('.destinationtext').text(response.destination);
                $('.faretext').text(response.fare);
                $('.timetext').text(response.time);
                $('.daytext').text(response.day);
                var rep = parseInt(response.time.split(":")[0])-1;
                var report = rep+":"+response.time.split(":")[1];
                $('.reportingtext').text(report);
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
    }
});

