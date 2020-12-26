function getOffSet(){
  var _offset = -100;
  var windowHeight = window.innerHeight;

 /* if(windowHeight > 780) {
 /  _offset = -500;
  } */
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

background_image_parallax($("#ABOUT"), 0, false);

// Paralax number 2
$(window).scroll(function() {
  var scrolledY = $(window).scrollTop();
   if (window.matchMedia("(max-width: 830px)").matches) {
     $('#HOME').css('background-position', '-50px ' + ((scrolledY)) + 'px');
     $('#MUSIC').css('background-position', '0px ' + ((scrolledY)) + 'px');
   } else {
     $('#HOME').css('background-position', '0px ' + ((scrolledY)) + 'px');
     $('#MUSIC').css('background-position', '0px ' + ((scrolledY)) + 'px');
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

//flash - prevent simultaneous video playback - pauses other playing videos upon play
$(document).ready(function(e) {
    $('audio,video').bind('play', function() {
    activated = this;
    $('audio,video').each(function() {
        if(this != activated) this.pause();
    });
});

$(".video-js").click(function(){
    activated = this;
    $('.video-js').each(function() {
        if(this != activated) _V_($(this).attr("id")).pause();
    });
});
});

// Show and hide header on scroll
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

// header carousel mobile only
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  if (window.matchMedia("(max-width: 767px)").matches) {
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "block";
  }
}

// welcome autoscroll
const welcomeContainer = document.getElementById('welcome');
const welcomeScrollWidth = welcomeContainer.scrollWidth;

window.addEventListener('load', () => {
  self.setInterval(() => {
    if (welcomeContainer.scrollLeft !== welcomeScrollWidth) {
      welcomeContainer.scrollTo(welcomeContainer.scrollLeft + 1, 0);
    }
  }, 15);
});
