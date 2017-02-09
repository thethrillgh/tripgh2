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
                success: function(response, status, jqXHR) {
                    $('.profilename').text(response.username)
                    if ( jqXHR.getResponseHeader('content-type').indexOf('text/html') >= 0 ){
                        window.location.href = "login.html"
                    }
                    if(!response.ticket.length > 0){
                        $('.cardbody').append('\
                            <p class="profilename">No tickets bought yet!</p>\
                        ')
                    }
                    response.ticket.forEach(function(ticket){
                        $('.cardbody').append('\
                            <div class="card col-md-4"><p><span class="bold">Code:  </span>'+ticket.code+'</p><p><span class="bold">Origin:</span>'+ticket.origin+'</p><p><span class="bold">Dest.:</span>'+ticket.destination+'</p><p><span class="bold">Time:</span>'+ticket.time+'</p><p><span class="bold">Fare:</span>'+ticket.fare+'</p></div>\
                        ')
                    })
                },
                error: function(error){
                    console.log(error)
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
                     window.location.href="profile.html"
                }
            });
        })
        
    }
});

