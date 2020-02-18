// Scripts applied to all pages
$(function(){
	$('#open_main_menu').on('click', function(){
		$("#main_menu_container").fadeToggle();
		$(this).hasClass('opened') ? $(this).removeClass('opened') : $(this).addClass('opened');
	});
})

//Prevent Carousel Blinking and resizing on loading
function animateBlock(block) {
	//setTimeout(function(){ 
		block.animate({
			opacity:1
		}, 300);
	//}, 1000);
}

jQuery.fn.calculateNaturalDimensions = function() {
	var image = this[0];
	if (!image) return;
	var img = image;
	var naturalWidth = img.naturalWidth,
	naturalHeight = img.naturalHeight;
	if (!naturalHeight || !naturalWidth) {
		var newImg = new Image();
		newImg.src = img.src;
		//Wait for image to load
		if (newImg.complete) {
			naturalWidth = newImg.width;
			naturalHeight = newImg.height;
		} else {
			$(newImg).on('load', function() {
				naturalWidth = newImg.width;
				naturalHeight = newImg.height;
			});
		}
		delete newImg;
	}
	return {"width":naturalWidth, "height":naturalHeight};
};

/*function preloadImages(obj) {
	if (obj && obj.length) {
		$(obj).each(function(){
			var newImg = new Image();
			newImg.src = this.src;
		});
	}
}

function preloadAllImages() {
	if(document.images && document.images.length > 0) {
		preloadImages(document.images);
	}
}*/
function cropToRect(imgArr) {
	if (imgArr) {
		imgArr.imagesLoaded(function() {
			$.each(imgArr, function() {
				var imgParent = $(this);
				var img = $(this).find('img');
				
				if (img.length == 0) return;
				var params = img.calculateNaturalDimensions();
				var width = params.width, height = params.height;

				if (width != height) {
					(width > height) ? imgParent.addClass('crop-width') : imgParent.addClass('crop-height');
				}
			});
		});
	}
}

// init Carousel with 4 products
function initProductsCarousel() {
	var carousel = $('.products-carousel .carousel');
	var images = $('.products-carousel .product_pic');
	
	cropToRect(images);

	carousel.carouFredSel({
		responsive: true,
		circular: true,
		auto: false,
		scroll: {
			items:1
		},
		items: {
			width:300,
			height:'variable',
			visible: {
				min: 0,
				max: 4
			}
		},
		prev: $('.products-carousel .carousel_prev'),
		next: $('.products-carousel .carousel_next'),
		swipe: {
			onMouse: true,
			onTouch: true
		}
	});
	animateBlock(carousel);
}

function initMainSlider() {
	var carousel = $('.main-slider .carousel');
	carousel.imagesLoaded(function() {
		carousel.carouFredSel({
			responsive: true,
			circular: true,
			items: {
				width: 1400,
				visible: 1
			},
			scroll: {
				duration: 300,
				timeoutDuration: 5000,
			},
			pagination: '.carousel_pagination',
			swipe: {
				onMouse: true,
				onTouch: true
			}
		});
		animateBlock(carousel);
	});
	image = carousel.find('img');
	$(window).bind('resize', function() {
		var height = image.height();
		carousel.height( height );
	}).trigger('resize');
}
// Init carousel for catalog page
function initCatalogCarousel() {
	$.each($('.catalog_item'), function() {
		var carousel = $(this).find('.carousel');
		var prev = $(this).find('.carousel_prev');
		var next = $(this).find('.carousel_next');
		var parent = $(this);
		carousel.imagesLoaded(function() {
			carousel.carouFredSel({
				responsive: true,
				circular: true,
				auto:false,
				items: {
					visible: 1,
					width: 500
				},
				scroll: {
					duration: 300,
					timeoutDuration: 5000
				},
				prev: prev,
				next: next,
				swipe: {
					onMouse: true,
					onTouch: true
				}
			});
			animateBlock(parent);
		});
		/*var catalog_item = $(this);
		$(window).bind('resize', function() {
			var height = catalog_item.height();
			carousel.height( height );
		}).trigger('resize');*/
	})
}

function initInstaCarousel(){
	var carousel = $("#insta_gallery .carousel");
	var caption = $('#insta_caption');
	carousel.carouFredSel({
		circular: true,
		auto: false,
		align:'center',
		scroll: {
			items:1,
			fx:'crossfade',
			onBefore: function(data) {
				caption.width(data.width - 50);
			}
		},
		items: {
			visible: 1,
			//width: 1400
		},
		prev: '.carousel_prev',
		next: '.carousel_next',
		swipe: {
			onMouse: true,
			onTouch: true
		},
		onCreate: function( data ) {
			caption.width(data.width - 50);
		}
	});
}

// Init 2 carousels in Product Page (Thumbnails + Main image, selected in thumbnails)
function initProductViewCarousel() {
	var product_carousel_thumbs = $('.product_gallery_thumbs .carousel');
	var product_carousel= $('.product_gallery_main-view .carousel');
	var product_carousel_thumbs_images = product_carousel_thumbs.find('img');
	product_carousel.imagesLoaded(function() {
		product_carousel.carouFredSel({
			circular: true,
			auto: false,
			responsive: true,
			items: {
				visible: 1,
				width:640
			},
			scroll: {
				items:1
			},
			swipe: {
				onMouse: true,
				onTouch: true
			}
		});
		animateBlock(product_carousel);
	});
	product_carousel_thumbs.imagesLoaded(function() {
		product_carousel_thumbs.carouFredSel({
			width: '100%',
			auto: false,
			items: {
				height:215,
				visible: 4
			},
			scroll: {
				items:1
			},
			direction:"up",
			prev: $('.product_gallery_thumbs .carousel_prev'),
			next: $('.product_gallery_thumbs .carousel_next'),
			swipe: {
				onMouse: true,
				onTouch: true
			}
		});
		animateBlock(product_carousel_thumbs);
	});

	product_carousel_thumbs_images.each(function(index) {
		$(this).click(function() {
			$(this).addClass('selected');
			product_carousel_thumbs_images.not(this).removeClass('selected');
			var img_num = $(this).data('image-val');
			product_carousel.trigger('slideTo', img_num );
		});
	});
}



// Init filters panel in catalog Page
function initFilters() {
	$.each($('.filters_item'), function() {
		var title = $(this).find('.filters_item_title');
		var dropdown = $(this).find('.filters_item_dd');
		title.on('click', function() {
			var parent = $(this).parent();
			parent.toggleClass("opened");
			parent.siblings().removeClass("opened");
			
		})
	});
}


// Init slider in filters Panel
function InitSlider() {
	var boundary_bottom = $('#slider_range_bottom'),
	boundary_top = $('#slider_range_top');

	$( "#slider_range" ).slider({
		range: true,
		min: 0,
		max: 20000,
		step: 500,
		values: [ 3000, 12000 ],
		slide: function( event, ui ) {
			boundary_bottom[0].value = ui.values[0] + " р.";
			boundary_top[0].value = ui.values[1]  + " р.";
		}
	});
	boundary_bottom[0].value = $( "#slider_range" ).slider( "values", 0 )  + " р.";
	boundary_top[0].value = $( "#slider_range" ).slider( "values", 1 )  + " р.";
}

