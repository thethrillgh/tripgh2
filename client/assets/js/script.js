///////////////////////////////
// One page Smooth Scrolling
///////////////////////////////
$('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
            $('html,body').animate({
                scrollTop: target.offset().top
            }, 1000);
            return false;
        }
    }
});


function collapseNavbar() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
}

$(window).scroll(collapseNavbar);
$(document).ready(collapseNavbar);

//flexslider
 $(window).load(function() {
     if(!$('body').is('.buyticket')){
        $('.flexslider').flexslider({
            controlNav: false
        });
     }
         //for autocomplete
     if($('body').is('.home')){
        var cities = [
            "Accra",
            "Kumasi",
            "Cape Coast",
            "Tarkwa",
            "Wa",
            "Paga/Navrongo",
            "Bolga",
            "Takoradi",
            "Ho",
            "Kpandu",
            "Hohoe",
            "Aflao",
            "Tema",
            "Dormaa",
            "Berekum",
            "Sunyani",
            "Tamale"
        ];
        $( "#origin, #destination").autocomplete({
            source: cities
        });
     }
  });



$(document).ready(function() {
    //$(".owl-carousel").owlCarousel();
    
    //capitalize first letter
    function cap(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    //Process ticket info
     $('#get-ticket').on('click', function() {
        $("#error").hide();
        var ticket = {
            'origin': cap($('#origin').val()),
            'destination': cap($('#destination').val()),
            'day': cap($("#citydropdown option:selected").text())
        };
//         console.log(ticket.day+' '+ticket.origin+' '+ticket.destination);
        $.ajax({
            url: '/api/tickets/'+ticket.origin+'/'+ticket.destination+'/'+ticket.day,
            contentType: 'application/json',
            success: function(response) {
                if(response.length > 0){
                    window.location.href = "buyticket.html?origin="+ticket.origin+"&destination="+ticket.destination+"&day="+ticket.day;
                }
                else{
                    $("#error").show();
                }
            }
        });
    });

    // static navigationbar
    var changeStyle = $('.navigation');

    function scroll() {
        if ($(window).scrollTop() > 645) {
            changeStyle.addClass('navbar-fixed-top');

        } else {
            changeStyle.removeClass('navbar-fixed-top');
        }
    }

    document.onscroll = scroll;

    $('.visit-carousel').owlCarousel({
        nav: true,
        navText: false,
        dots: false,
        loop: true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:2
            },
            1000:{
                items:3
            }
        }
    });
    $('.header-carousel').owlCarousel({
        items: 1,
        nav: true,
        navText: false,
        dots: false,
        loop: true
    });
     $('.services-owl-carousel').owlCarousel({
        items: 1,
        nav: true,
        navText: false,
        dots: false,
        loop: true
    });
    $('.sponsor-carousel').owlCarousel({
        loop:false,
        margin:10,
        nav:false,
        navText:false,
        responsive:{
            0:{
                items:2
            },
            600:{
                items:4
            },
            1000:{
                items:6
            }
        }
    });
});