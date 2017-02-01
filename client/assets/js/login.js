/*------------------------------------------
 Buying Ticket
 ------------------------------------------*/
$(document).ready(function () {
    
    if($('body').is('.login')){
        //capitalize first letter
        function cap(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
//        var user = JSON.parse(sessionStorage.getItem("user"));
        $('#signup').on('click', function(e){
            e.preventDefault();
            var username = $("input[name=username]").val();
            var password= $("input[name=password]").val();
//            console.log(username+' '+password)
            $.ajax({
                url: '/api/signup/'+username+'/'+password,
                method: 'POST',
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

