/*------------------------------------------
 Profile Page
 ------------------------------------------*/
$(document).ready(function () {
    if($('body').is('.profile')){        
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
                        $('.loginlink').show();
                    }
                }
            });       
        $.ajax({
                url: '/api/user',
                method: 'get',
                contentType: 'application/json',
                success: function(response) {
                    console.log(response)
                },
                error: function(error){
                    console.log(error)
                }
            });
        
    }
});

