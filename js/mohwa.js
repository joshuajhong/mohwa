function getOffSet(){
  var _offset = 0;
  var windowHeight = window.innerHeight;

 if(windowHeight > 830) {
   _offset = 0;
 }

  return _offset;
}

function setParallaxPosition($doc, multiplier, $object){
  var offset = getOffSet();
  var from_top = $doc.scrollTop(),
    bg_css = 'center ' + (multiplier * from_top - offset) + 'px';
  $object.css({"background-position" : bg_css });
}

// Parallax function
// Adapted based on https://codepen.io/roborich/pen/wpAsm
var background_image_parallax = function($object, multiplier, forceSet){
  multiplier = typeof multiplier !== 'undefined' ? multiplier : 0.5;
  multiplier = 1 - multiplier;
  var $doc = $(document);
  // $object.css({"background-attatchment" : "fixed"});

  if(forceSet) {
    setParallaxPosition($doc, multiplier, $object);
  } else {
    $(window).scroll(function(){
      setParallaxPosition($doc, multiplier, $object);
    });
  }
};

background_image_parallax($("#HOME"), 0.10, false);

// Paralax number 2
$(window).scroll(function() {
  var scrolledY = $(window).scrollTop();
   if (window.matchMedia("(max-width: 767px)").matches) {
     $('#ABOUT').css('background-position', '-200px ' + ((scrolledY)) + 'px');
   } else {
     $('#ABOUT').css('background-position', '0px ' + ((scrolledY)) + 'px');
   }
});

  // Detect window scroll and update navbar
  $(window).scroll(function(e){
    if($(document).scrollTop() > 10) {
      $('.tm-navbar').addClass("scroll");
    } else {
      $('.tm-navbar').removeClass("scroll");
    }
  });

  // Close mobile menu after click
  $('.navbar-collapse a').click(function(){
  $(".navbar-collapse").collapse('hide');
  });

  $('.navbar-collapse button').click(function(){
  $(".navbar-collapse").collapse('hide');
  });

  // Scroll to corresponding section with animation
  $('#tmNav').singlePageNav({
    'easing': 'easeInOutExpo',
    'speed': 600
  });

  // Add smooth scrolling to all links
  // https://www.w3schools.com/howto/howto_css_smooth_scroll.asp
  $("a").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;

      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 600, 'easeInOutExpo', function(){
        window.location.hash = hash;
      });
    } // End if
  });

  $(function(){
  // Pop up
  $('.tm-gallery').magnificPopup({
    delegate: 'a',
    type: 'image',
    gallery: { enabled: true }
  });

  $('.picturerow').magnificPopup({
    delegate: 'a',
    type: 'image',
    gallery: { enabled: true }
  });

  $('.tm-testimonials-carousel').slick({
    dots: true,
    prevArrow: false,
    nextArrow: false,
    infinite: false,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
            slidesToShow: 1
        }
      }
    ]
  });

  // Gallery
  $('.tm-gallery').slick({
    dots: true,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
    {
      breakpoint: 1199,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
  });
});

$(document).ready(function(e) {
    $('audio,video').bind('play', function() {
    activated = this;
    $('audio,video').each(function() {
        if(this != activated) this.pause();
    });
});

//flash - prevent simultaneous video playback - pauses other playing videos upon play
$(".video-js").click(function(){
    activated = this;
    $('.video-js').each(function() {
        if(this != activated) _V_($(this).attr("id")).pause();
    });
});
});

// Scroll top function for other PAGES
function topFunction2() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
var currentScrollPos = window.pageYOffset;
if (prevScrollpos > currentScrollPos) {
  document.getElementById("tmNav").style.top = "40px";
} else {
  document.getElementById("tmNav").style.top = "0px";
}
prevScrollpos = currentScrollPos;
}

// fancybox
$(document).ready(function() {
  $('.fancybox').fancybox({
    padding   	: 0,
    maxWidth  	: '100%',
    maxHeight 	: '100%',
    width   		: 560,
    height    	: 315,
    autoSize  	: true,
    closeClick  : true,
    openEffect  : 'elastic',
    closeEffect : 'elastic'
  });
});

// chat box
function openForm() {
   document.getElementById("myForm").style.display = "block";
 }

 function closeForm() {
   document.getElementById("myForm").style.display = "none";
 }

 $(() => {
 $("#send").click(()=>{
   sendMessage({
       user: `User${Math.floor(Math.random() * 1000000)}`,
       message:$("#message").val(),
       formattedTime: new Date()});
     })
   getMessages()
 })

 function getMessages(){
   $.get('http://localhost:5000/messages', (data) => {
   data.forEach(addNewMessage);
   })
 }

 function sendMessage(message){
   $.post('http://localhost:5000/messages', message)
 }
