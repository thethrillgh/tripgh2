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
//            $('.confirmationtext').text(user.charge.id);
//            $('.nametext').text(user.name);
//            $('.origintext').text(user.origin);
//            $('.destinationtext').text(user.destination);
//            $('.faretext').text(user.fare);
//            $('.timetext').text(user.time);
//            $('.daytext').text(user.day);
//            var rep = parseInt(user.time.split(":")[0])-1;
//            var report = rep+":"+user.time.split(":")[1];
//            $('.reportingtext').text(report);
            
        
        $('#check').on('click', function(){
            $.ajax({
                url: '/api/cookie',
                method: 'get',
                contentType: 'application/json',
                success: function(response) {                
                    console.log(response)
                },
                error: function(error){
                    console.log(error)
                }
            });      
        })
    }
});

