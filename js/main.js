"use strict";



// Variables
// ===================

var $html = $('html'),
    $document = $(document),
    $window = $(window),
    i = 0;


// Scripts initialize
// ===================

document.write('<script async defer src="//maps.googleapis.com/maps/api/js?key=AIzaSyAYjhWq7DvCwCiRKotPu9_IXQxupSQbhuo" type="text/javascript"></script>');
document.write('<script src="https://code.highcharts.com/maps/highmaps.js"></script>');
document.write('<script src="https://code.highcharts.com/maps/modules/data.js"></script>');
document.write('<script src="https://code.highcharts.com/mapdata/countries/us/us-all.js"></script>');
document.write('<script src="https://code.highcharts.com/mapdata/custom/europe.js"></script>');

$(window).on('load', function () {

  // =======
  // Preloader
  // =======

  var $preloader = $('#page-preloader'),
      $spinner   = $preloader.find('.spinner');

  $spinner.fadeOut();
  $preloader.delay(500).fadeOut('slow');


  // =======
  // Google Map
  // =======
  var mapWrapper = $('#google-map'),
      latlng = new google.maps.LatLng(mapWrapper.data("x-coord"), mapWrapper.data("y-coord")),
      styles = [
          {
              "featureType": "landscape",
              "stylers": [
                  { "hue": "#FFA800" },
                  { "saturation": 0 },
                  { "lightness": 0 },
                  { "gamma": 1 }
              ]
          },
          {
              "featureType": "road.highway",
              "stylers": [
                  { "hue": "#53FF00" },
                  { "saturation": -73 },
                  { "lightness": 40 },
                  { "gamma": 1 }
              ]
          },
          {
              "featureType": "road.arterial",
              "stylers": [
                  { "hue": "#FBFF00" },
                  { "saturation": 0 },
                  { "lightness": 0 },
                  { "gamma": 1 }
              ]
          },
          {
              "featureType": "road.local",
              "stylers": [
                  { "hue": "#00FFFD" },
                  { "saturation": 0 },
                  { "lightness": 30 },
                  { "gamma": 1 }
              ]
          },
          {
              "featureType": "water",
              "stylers": [
                  { "hue": "#00BFFF" },
                  { "saturation": 6 },
                  { "lightness": 8 },
                  { "gamma": 1 }
              ]
          },
          {
              "featureType": "poi",
              "stylers": [
                  { "hue": "#679714" },
                  { "saturation": 33.4 },
                  { "lightness": -25.4 },
                  { "gamma": 1 }
              ]
          }
      ],
      myOptions = {
        scrollwheel: false,
        zoom: 14,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        styles: styles
      },
      map = new google.maps.Map(mapWrapper[0], myOptions),
      marker = new google.maps.Marker({
        position: {lat: mapWrapper.data("x-coord"), lng: mapWrapper.data("y-coord")},
        draggable: false,
        animation: false,
        map: map,
        icon: 'img/marker.png'
      }),
      infowindow = new google.maps.InfoWindow({
        content: "<div class='marker-popup'> Mr John Smith 132, My Street, Bigtown BG23 4YZ England </div>"
      });

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
});


$document.ready(function () {

  var ua = navigator.userAgent,
      bstype;

  // Get IE or Edge browser version
  var version = detectIE();

  if (version) bstype = 'Internet-Explorer'.toLowerCase();
  if (ua.search(/Firefox/) > 0) bstype = 'Firefox'.toLowerCase();
  if (ua.search(/Chrome/) > 0) bstype = 'Google-Chrome'.toLowerCase();
  if (ua.search(/Safari/) > 0) bstype = 'Safari'.toLowerCase();

  $html.addClass(bstype);

  function detectElement(dom) {
    return $window.height() + $window.scrollTop() >= dom.offset().top && $window.scrollTop() <= dom.outerHeight() + dom.offset().top;
  }

  function bar_progress(progress_line_object, direction) {
    var number_of_steps = progress_line_object.data('number-of-steps');
    var now_value = progress_line_object.data('now-value');
    var new_value = 0;
    if(direction == 'right') {
      new_value = now_value + ( 100 / number_of_steps );
    }
    else if(direction == 'left') {
      new_value = now_value - ( 100 / number_of_steps );
    }
    progress_line_object.attr('style', 'width: ' + new_value + '%;').data('now-value', new_value);
  }


  // ==========
  // jQuery ajaxChimp
  // ==========
  var chimpForm = $('.subscription-form form');

  chimpForm.ajaxChimp({
    callback: function(){
      var panel = $('.js-result');
      setTimeout(function () {
        panel.removeClass("error").removeClass("success");
      }, 4500);
    },
    language: 'cm',
    url: '//cear-studio.us13.list-manage.com/subscribe/post?u=5c10401fe692f6eddbd86220f&amp;id=b974661486'
    //http://xxx.xxx.list-manage.com/subscribe/post?u=xxx&id=xxx
  });


  $.ajaxChimp.translations.cm = {
    'submit': 'Submitting...',
    0: 'We have sent you a confirmation email',
    1: 'Please enter a value',
    2: 'An email address must contain a single @',
    3: 'The domain portion of the email address is invalid (the portion after the @: )',
    4: 'The username portion of the email address is invalid (the portion before the @: )',
    5: 'This email address looks fake or invalid. Please enter a real email address'
  };


  // ==========
  // AJAX form
  // ==========
  var jsForm = $('.contact-form');
  var panel = $("body").append("<div class='js-result'></div>").find(".js-result");

  if (jsForm.length) {

    jsForm.each(function(){
      var $form = $(this);

      $form.ajaxForm({
        success: function(json) {
          var jsJSON = JSON.parse(json);
          panel.text(jsJSON.message);

          if (jsJSON.valid) {

            panel[0].classList.add("success");

            setTimeout(function () {
              panel[0].classList.remove("success");
              $form.clearForm();
            }, 3000);

          } else {

            panel[0].classList.add("error");

            setTimeout(function () {
              panel[0].classList.remove("error");
            }, 4500);
          }
        }
      });

    });
  }


  // ==========
  // Video 
  // ==========
  var video = $('.video-section');

  if (video.length) {
    var videoItem = video.find('.video');

    video.on("click", function(){
      video.toggleClass("video-section-play");
      videoItem.get(0).paused ? videoItem.get(0).play() : videoItem.get(0).pause();
    });
  }

  // ==========
  // Responsive Nav
  // ==========
  var responsiveNav = new Navigation({
    initClass: "nav",
    mobileClass: "nav-mobile",
    desktopClass: "nav-desktop",
    checkHeight: false,
    stuck: true,
    stuckOffset: 1,
    onePage: true,
    onePageOffset: 100
  });

  // ==========
  // Magnific Popup
  // ==========
  var lightbox = $('[data-lightbox]').not('[data-lightbox="gallery"] [data-lightbox]');
  var lightboxGallery = $('[data-lightbox^="gallery"]');

  if (lightbox.length) {
    lightbox.each(function(){
      var item = $(this);
      item.magnificPopup({
        type: item.data("lightbox")
      });
    });
  }
  if (lightboxGallery.length) {
    lightboxGallery.each(function(){
      $(this).magnificPopup({
        delegate: '[data-lightbox]',
        type: "image",
        mainClass: 'mfp-with-zoom mfp-img-mobile',
        gallery: {
          enabled: true
        },
        zoom: {
          enabled: true,
          duration: 300, // don't foget to change the duration also in CSS
          opener: function(element) {
            return element.find('img');
          }
        }
      });
    });
  }

  /* Magnific Popup modal window */
  $('.popup-with-zoom-anim').magnificPopup({
    type: 'inline',

    fixedContentPos: false,
    fixedBgPos: true,

    overflowY: 'auto',

    closeBtnInside: true,
    preloader: false,

    midClick: true,
    removalDelay: 300,
    mainClass: 'my-mfp-zoom-in'
  });

  $('.popup-with-move-anim').magnificPopup({
    type: 'inline',

    fixedContentPos: false,
    fixedBgPos: true,

    overflowY: 'auto',

    closeBtnInside: true,
    preloader: false,

    midClick: true,
    removalDelay: 300,
    mainClass: 'my-mfp-slide-bottom'
  });

  // =======
  // Parallalx.js
  // =======
  var parallax = $('.parallax-bg');
  if (parallax.length ) {
    if(bstype === 'firefox'|| bstype === "internet-explorer"){
      parallax.each(function(){
        $(this).css({"background": "url(" + $(this).data("image-src") + ")", "background-size":'cover'});
      });
    }
  }


  // =======
  // Responsive Tabs
  // =======
  var tabs = $('.responsive-tabs');

  if (tabs.length > 0) {
    var i = 0;
    for (i = 0; i < tabs.length; i++) {
      var $this = $(tabs[i]);
      $this.easyResponsiveTabs({
        type: $this.attr("data-type"),
        tabidentify: $this.find(".resp-tabs-list").attr("data-group") || "tab"
      });
    };
    $(".resp-tabs-list li").on("click", function(){
      $window.trigger("resize");
    });
  }


  // =======
  // Countdown
  // =======
  var countDown = $('.countdown');

  if (countDown.length) {
    countDown.each(function(){
      var item = $(this),
          date = new Date(),
          settings = [],
          time = item[0].getAttribute('data-time'),
          type = item[0].getAttribute('data-type'),
          format = item[0].getAttribute('data-format');
      date.setTime(Date.parse(time)).toLocaleString();
      settings[type] = date;
      settings['format'] = format;
      item.countdown(settings);
    });
  }


  // =======
  // UIToTop
  // =======
  $().UItoTop();
 
 
  // =======
  // Owl carousel
  // =======
   var carousel = $('.owl-carousel');

  $(".owl-1").owlCarousel({
    mouseDrag: false,
    nav: false,
    loop: true,
    autoplay: false,
    dots: true,
    items: 1,
  });

  $(".owl-2").owlCarousel({
    mouseDrag: true,
    nav: false,
    loop: false,
    autoplay: false,
    dots: true,
    items: 1,
  });



  // =======
  // jQuery Count To
  // =======
  var counter = $('.counter');

  if (counter.length) {
    var counterToInit = counter.not(".init");
    $document.on("scroll", function () {
      counterToInit.each(function(){
        var item = $(this);

        if ((!item.hasClass("init")) && (detectElement(item))) {
          item.countTo({
            refreshInterval: 20,
            speed: item.attr("data-speed") || 1000
          });
          item.addClass('init');
        }
      });
      $document.trigger("resize");
    });
    $document.trigger("scroll");
  }

  // =======
  // WOW
  // =======
  if ($html.hasClass('desktop')) { new WOW().init(); }

  // =======
  // Popover
  // =======
  var popOver = $('[data-toggle="popover"]');

  if (popOver.length) {
    popOver.popover({
      placement: 'auto',
      trigger: 'hover focus'
    });
  }


  // =======
  // Pie Charts
  // =======
  var pieCharts = $('.pie-charts');
  var pieChart1 = $('.pie-chart-1');
  var pieChart2 = $('.pie-chart-2');

  if (pieChart1.length){


      function sliceSize(dataNum, dataTotal) {
        return (dataNum / dataTotal) * 360;
      }
      function addSlice(sliceSize, pieElement, offset, sliceID, color) {
        $(pieElement).append("<div class='slice1 "+sliceID+"'><span class='one'></span></div>");
        var offset = offset - 1;
        var sizeRotation = -179 + sliceSize;
        $(".slice1."+sliceID).css({
          "transform": "rotate("+offset+"deg) translate3d(0,0,0)"
        });
        $(".slice1."+sliceID+" span.one").css({
          "transform"       : "rotate("+sizeRotation+"deg) translate3d(0,0,0)",
          "background-color": color
        });
      }
      function iterateSlices(sliceSize, pieElement, offset, dataCount, sliceCount, color) {
        var sliceID = "s"+dataCount+"-"+sliceCount;
        var maxSize = 179;
        if(sliceSize<=maxSize) {
          addSlice(sliceSize, pieElement, offset, sliceID, color);
        } else {
          addSlice(maxSize, pieElement, offset, sliceID, color);
          iterateSlices(sliceSize-maxSize, pieElement, offset+maxSize, dataCount, sliceCount+1, color);
        }
      }

      function createPie(dataElement, pieElement) {
        var listData = [];
        $(dataElement+" span.one-1").each(function() {
          listData.push(Number($(this).html()));
        });
        var listTotal = 0;
        for(var i=0; i<listData.length; i++) {
          listTotal += listData[i];
        }
        var offset = 0;
        var color = [
          "#DA796C", 
          "#DAA36C", 
          "#457B87", 
          "#51A367", 
          "crimson", 
          "purple", 
          "turquoise", 
          "forestgreen", 
          "navy", 
          "gray"
        ];
        for(var i=0; i<listData.length; i++) {
          var size = sliceSize(listData[i], listTotal);
          iterateSlices(size, pieElement, offset, i, 0, color[i]);
          offset += size;
        }
      };
      createPie(".pieID-1.legend", ".pieID-1.pie");

  }


    if (pieChart2.length){

      function sliceSize(dataNum, dataTotal) {
        return (dataNum / dataTotal) * 360;
      }
      function addSlice(sliceSize, pieElement, offset, sliceID, color) {
        $(pieElement).append("<div class='slice2 "+sliceID+"'><span class='two'></span></div>");
        var offset = offset - 1;
        var sizeRotation = -179 + sliceSize;
        $(".slice2."+sliceID).css({
          "transform": "rotate("+offset+"deg) translate3d(0,0,0)"
        });
        $(".slice2."+sliceID+" span.two").css({
          "transform"       : "rotate("+sizeRotation+"deg) translate3d(0,0,0)",
          "background-color": color
        });
      }
      function iterateSlices(sliceSize, pieElement, offset, dataCount, sliceCount, color) {
        var sliceID = "s"+dataCount+"-"+sliceCount;
        var maxSize = 179;
        if(sliceSize<=maxSize) {
          addSlice(sliceSize, pieElement, offset, sliceID, color);
        } else {
          addSlice(maxSize, pieElement, offset, sliceID, color);
          iterateSlices(sliceSize-maxSize, pieElement, offset+maxSize, dataCount, sliceCount+1, color);
        }
      }
      function createPie(dataElement, pieElement) {
        var listData = [];
        $(dataElement+" span.two-2").each(function() {
          listData.push(Number($(this).html()));
        });
        var listTotal = 0;
        for(var i=0; i<listData.length; i++) {
          listTotal += listData[i];
        }
        var offset = 0;
        var color = [
          "#DA796C", 
          "#DAA36C", 
          "#457B87", 
          "#51A367", 
          "crimson", 
          "purple", 
          "turquoise", 
          "forestgreen", 
          "navy", 
          "gray"
        ];
        for(var i=0; i<listData.length; i++) {
          var size = sliceSize(listData[i], listTotal);
          iterateSlices(size, pieElement, offset, i, 0, color[i]);
          offset += size;
        }
      };
      createPie(".pieID-2.legend", ".pieID-2.pie");
  }


  // =======
  // Map Charts
  // =======
  var charts = $(".chart");

  if(charts.length){
    $(function () {
      $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=us-population-density.json&callback=?', function (data) {
        // Make codes uppercase to match the map data
        $.each(data, function () {
          this.code = this.code.toUpperCase();
        });

        // Instanciate the map
        $('#map-chart-1').highcharts('Map', {

          chart : {
            borderWidth : 0,
            backgroundColor: 'transparent'
          },

          title : {
            text : ''
          },

          mapNavigation: {
            enabled: false,
          },

          legend: {
            enabled: false
          },

          colorAxis: {
            min: 1,
            type: 'logarithmic',
            minColor: '#EEEEFF',
            maxColor: '#CCCCCC',
          },

          series : [{
            animation: {
              duration: 1000
            },
            data : data,
            mapData: Highcharts.maps['countries/us/us-all'],
            joinBy: ['postal-code', 'code'],
            dataLabels: {
              enabled: true,
              color: '#FFFFFF',
              format: '{point.code}'
            },

            states: {
              hover: {
                color: '#DA796C'
              }
            },
            
            tooltip: {
              headerFormat: '',
              pointFormat: '{point.name}'
            }
          }]
        });
      });
    });

    $(function () {
      // Instanciate the map
      $('#map-chart-2').highcharts('Map', {
        chart : {
          borderWidth : 0,
          backgroundColor: 'transparent'
        },

        title : {
          text : ''
        },

        mapNavigation: {
          enabled: false,
        },

        legend: {
          enabled: false
        },

        colorAxis: {
          min: 1,
          minColor: '#EEEEFF',
          maxColor: '#FFB4AA',
        },

        series : [{
          animation: {
            duration: 1000
          },
          name: 'Country',
          mapData: Highcharts.maps['custom/europe'],
          data: [{
            code: 'IS',
            value: 1
          }, {
            code: 'NO',
            value: 1
          }, {
            code: 'SE',
            value: 1
          }, {
            code: 'FI',
            value: 1
          }, {
            code: 'DE',
            value: 1
          }, {
            code: 'IT',
            value: 1
          }, {
            code: 'UA',
            value: 1
          }, {
            code: 'GB',
            value: 1
          }, {
            code: 'RU',
            value: 1
          }, {
            code: 'DK',
            value: 1
          }],
          states: {
            hover: {
              color: '#DA796C'
            }
          },
          joinBy: ['iso-a2', 'code'],
          dataLabels: {
            enabled: true,
            color: '#FFFFFF',
            formatter: function () {
              if (this.point.value) {
                return this.point.name;
              }
            }
          },
          tooltip: {
            headerFormat: '',
            pointFormat: '{point.name}'
          }
        }]
      });
    });

    $(function () {

      $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=australia.geo.json&callback=?', function (geojson) {

        // Prepare the geojson
        var states = Highcharts.geojson(geojson, 'map');
            

        // Skip or move some labels to avoid collision
        $.each(states, function () {

            // Move center for data label
            if (this.properties.code_hasc === 'AU.SA') {
                this.middleY = 0.3;
            }
            if (this.properties.code_hasc === 'AU.QL') {
                this.middleY = 0.7;
            }

        });

        // Initiate the chart
        $('#map-chart-3').highcharts('Map', {

          chart : {
            borderWidth : 0,
            backgroundColor: 'transparent'
          },

          title : {
            text : ''
          },

          legend: {
            enabled: false
          },

          mapNavigation: {
            enabled: false
          },

          series : [{
            animation: {
              duration: 1000
            },
            name: '',
            data: states,
            color: '#DDDDE6',
            states: {
              hover: {
                color: '#DA796C'
              }
            },
            dataLabels: {
              enabled: true,
              color: '#fff',
              format: '{point.name}',
              style: {
                width: '80px' // force line-wrap
              }
            },
            tooltip: {
              headerFormat: '',
              pointFormat: '{point.name}'
            }
          }]
        });
      });
    });

  }


  // =======
  // XY Charts
  // =======
  var XYcharts = $(".xy-charts");

  if(XYcharts.length){
    $(function () {
      // Create the chart
      $('#chart-1').highcharts({
        chart: {
          type: 'column',
          backgroundColor: 'transparent'
        },
        title: {
          text: ''
        },

        xAxis: {
          type: 'category',
          title: {
            text: 'Years',
            style: {
              fontSize: '20px',
              fontWeight: '500',
              fontFamily: '"Dosis"'
            }
          },
          labels: {
            style: {
              color: '#222',
              fontSize: '20px',
              fontFamily: '"Raleway"'
            }
          }
        },

        yAxis: {
          title: {
            text: 'Amount',
            style: {
              fontSize: '20px',
              fontWeight: '500',
              fontFamily: '"Dosis"'
            }
          },
          labels: {
            format: '{value}%',
            style: {
              color: '#222',
              fontSize: '20px',
              fontFamily: '"Raleway"'
            }
          }
        },

        colors: ['#2D8444', '#457B87', '#DAA36C', '#DA796C', '#81C293',],

        legend: {
          enabled: false
        },
        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: false,
              format: '{point.y:.1f}%'
            }
          }
        },

        tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
        },

        series: [{
          name: 'Age',
          colorByPoint: true,
          data: [{
            name: '18-20',
            y: 10
          }, {
            name: '20-25',
            y: 30
          }, {
            name: '25-30',
            y: 45
          }, {
            name: '30-35',
            y: 40
          }, {
            name: '35-40',
            y: 20
          }]
        }],
      });
    });

    $(function () {
      // Create the chart
      $('#chart-2').highcharts({
        chart: {
          type: 'column',
          backgroundColor: 'transparent'
        },
        title: {
          text: ''
        },
        xAxis: {
          type: 'category',
          title: {
            text: ''
          },
          labels: {
            style: {
              color: '#222',
              fontSize: '20px',
              fontFamily: '"Raleway"'
            }
          }
        },
        yAxis: {
          title: {
            text: ''
          },
          labels: { enabled: false },
          lineColor: 'transparent'
        },

        colors: ['#457B87', '#DA796C',],

        legend: {
          enabled: false
        },
        plotOptions: {
          series: {
            borderWidth: 0,
            dataLabels: {
              enabled: true,
              format: '{point.y:.1f}%'
            }
          }
        },

        tooltip: {
          headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
        },

        series: [{
          name: 'Gender',
          colorByPoint: true,
          data: [{
            name: 'Male',
            y: 54,
            dataLabels: '2'
          }, {
            name: 'Female',
            y: 49
          }]
        }],
      });
    });
  }


});

// =======
// Particles
// =======
var particles = $('#particles-js');

if (particles.length) {
  particlesJS('particles-js',

      {
        "particles": {
          "number": {
            "value": 80,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "color": {
            "value": "#fff"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#fff"
            },
            "polygon": {
              "nb_sides": 5
            },
            "image": {
              "src": "img/github.svg",
              "width": 100,
              "height": 100
            }
          },
          "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
              "enable": false,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 2,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 100,
            "color": "#fff",
            "opacity": 0.4,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 2,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "attract": {
              "enable": false,
              "rotateX": 600,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": false,
              "mode": "repulse"
            },
            "onclick": {
              "enable": true,
              "mode": "push"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 400,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 200
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true,
        "config_demo": {
          "hide_card": false,
          "background_color": "#137FEC",
          "background_image": "",
          "background_position": "50% 50%",
          "background_repeat": "no-repeat",
          "background_size": "cover"
        }
      }
  )
};










