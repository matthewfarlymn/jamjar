jQuery(document).ready(function($) {

    $(window).resize(function() {
        $('.search-field, .mobile-nav').removeClass('show');
    });

    $('.fa-search').click(function() {
        $('.search-field').toggleClass('show');
    });

    $('.fa-ellipsis-v').click(function() {
        $('.search-field, .mobile-nav').toggleClass('show');
    });

    $('.slider').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        adaptiveHeight: true,
        prevArrow: false,
        nextArrow: false
    });

});