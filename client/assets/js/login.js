/*------------------------------------------
 Buying Ticket
 ------------------------------------------*/
$(document).ready(function () {
    
    if($('body').is('.login')){
        //capitalize first letter
        function cap(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
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
                    console.log(response)
                },
                error: function(error){
                    console.log(error)
                }
            });      
        })
        $('#signup').on('click', function(){
            event.preventDefault();
            var formData2 = {
                'username' : $('#username').val(),
                'password' : $('#password').val(),    
                'name' : $('#name').val()     
            };
            console.log(formData2)
            $.ajax({
                url: '/api/signup',
                method: 'POST',
                data: formData2,
                dataType: 'json',
                success: function(response) {                
                    console.log(response)
                },
                error: function(error){
                    console.log(error)
                }
            });      
        })
        $('#check').on('click', function(){
            $.ajax({
                url: '/api/check',
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
        
        $('#logout').on('click', function(){
            $.ajax({
                url: '/api/logout',
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
        
//        var user = JSON.parse(sessionStorage.getItem("user"));
//        $('#signup').on('click', function(e){
//            e.preventDefault();
//            var username = $("input[name=username]").val();
//            var password= $("input[name=password]").val();
////            console.log(username+' '+password)
//            $.ajax({
//                url: '/api/signup/'+username+'/'+password,
//                method: 'POST',
//                contentType: 'application/json',
//                success: function(response) {                
//                    console.log(response)
//                },
//                error: function(error){
//                    console.log(error)
//                }
//            });           
//        })
        

    }   
});

