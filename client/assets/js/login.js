/*------------------------------------------
 Buying Ticket
 ------------------------------------------*/
$(document).ready(function () {
    
    if($('body').is('.login')){
        //capitalize first letter
        function cap(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        
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
//                        $('.profilelink').addClass("hide");
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
                }
            });
        })
        
        $('#login').on('click', function(){
            event.preventDefault();
            var formData = {
                'username' : $('input[name=username]').val(),
                'password' : $('input[name=password]').val()     
            };
            $.ajax({
                url: '/api/login',
                method: 'POST',
                data: formData,
                dataType: 'json',
                success: function(response) {                
                    $('.hide-p').text("You have succesfully logged In");
                    $(".hide-p").addClass('black');
                    $('.form-body').removeClass('space');
                    $("#error").removeClass('alert-danger');
                    $("#error").addClass('alert-success');
                    $("#error").show();
                    $('.loginlink').hide();
                    $('.profilelink').removeClass("hide");
                },
                error: function(error){
                    $.ajax({
                        url: '/api/flash',
                        dataType: 'json',
                        success: function(response){
                            $('.hide-p').text(response.loginMessage);
                            $('.form-body').removeClass('space');
                            $("#error").show();
                        }
                    })
                }
            });      
        })
        $('#signup').on('click', function(){
            event.preventDefault();
            var formData2 = {
                'username' : $('#username').val(),
                'password' : $('#password').val(),    
                'email' : $('#email').val()     
            };
            $.ajax({
                url: '/api/signup',
                method: 'POST',
                data: formData2,
                dataType: 'json',
                success: function(response) {                            
                    $('.hide-p').text("You have succesfully signed up");
                    $(".hide-p").addClass('black');
                    $('.form-body').removeClass('space');
                    $("#error").removeClass('alert-danger');
                    $("#error").addClass('alert-success');
                    $("#error").show();
                },
                error: function(error){
                    $('.hide-p').text("Please fill out the form correctly to sign up");
                    $.ajax({
                        url: '/api/flash',
                        dataType: 'json',
                        success: function(response){
                            $('.hide-p').text(response.signupMessage);
                            $('.form-body').removeClass('space');
                            $("#error").show();
                        }
                    })
                }
            });      
        })
        
        $('.logout').on('click', function(){
            $.ajax({
                url: '/api/logout',
                method: 'get',
                contentType: 'application/json',
                success: function(response) {                
                    $('.profilelink').addClass("hide");
                    $('.loginlink').show();
                    $('.hide-p').text("You have succesfully logged Out");
                    $(".hide-p").addClass('black');
                }
            });      
        })
        

    }   
});

