/*------------------------------------------
 Buying Ticket
 ------------------------------------------*/
$(document).ready(function () {
    
    if($('body').is('.confirmation')){
        
        //capitalize first letter
        function cap(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        var user = JSON.parse(sessionStorage.getItem("user"));
        if(user != undefined){
//            $.ajax({
//            url: '/api/receipt/confirmation'+user.origin+'/'+user.destination+'/'+user.day+'/'+user.time+'/'+user.fare+'/'+user.day,
//            contentType: 'application/json',
//            success: function(response) {                
//                console.log(response)
//            }
//            });
            $('.confirmationtext').text(user.charge.id);
            $('.nametext').text(user.name);
            $('.origintext').text(user.origin);
            $('.destinationtext').text(user.destination);
            $('.faretext').text(user.fare);
            $('.timetext').text(user.time);
            $('.daytext').text(user.day);
            console.log(user)
        }
    }
});

