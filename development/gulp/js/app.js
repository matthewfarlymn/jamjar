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

    $('.product-slider').slick({
        dots: true,
        customPaging : function(slider, i) {
            var thumb = $(slider.$slides[i]).data('thumb');
            return '<a><img src="' + thumb + '"></a>';
        },
        speed: 100,
      	fade: true,
      	cssEase: 'linear',
        prevArrow: null,
        nextArrow: null,
    });

    tinymce.init({
        selector: 'textarea.tinymce',
        themes: 'inlite',
        height: 300,
        resize: false,
        menubar: false,
        plugins: ['lists advlist link'],
        toolbar: 'undo redo | formatselect | bold bullist link',
    });

    $('.send-password').click(function() {
        $('.error, .success').remove();
        $('.access .sign-in').html(
            '<h1>Password</h1>' +
            '<form action="/send-password" method="post">' +
                '<label for="email">Email<label>' +
                '<input type="email" name="email" placeholder="Email" required>' +
                '<span class="flex between">' +
                    '<button class="button pink" type="submit">Send Password</button>' +
                    '<a href="/sign-in">Sign-In?</a>' +
                '</span>' +
            '</form>'
        );
    });

    $('#attributes').change(function() {
        $('span.price').html('$' + $(this).find(':selected').data('price'));
    });

    $('.details input').change(function() {
        $('input').attr('name', 'quantity');
        $(this).attr('name', 'quantityUpdate');
    });

    $('.details button').click(function() {
        $('button').attr('name', 'refresh');
        $(this).attr('name', 'refreshUpdate');
    });

    $('.billing-details :checkbox').change(function() {
        if($(this).is(':checked')) {
            $('.shipping-details').closest('.fieldset').addClass('inactive').find('input').attr('disabled', true);
        } else {
            $('.shipping-details').closest('.fieldset').removeClass('inactive').find('input').attr('disabled', false);
        }
    });

    $(':file').on('change', function() {
        _this = this;
        var files = !!this.files ? this.files : [];
        if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support
        if (/^image/.test( files[0].type)){ // only image file
            var reader = new FileReader(); // instance of the FileReader
            reader.readAsDataURL(files[0]); // read the local file
            reader.onloadend = function(){ // set image data as background of div
                $(_this).next('img').attr('src', this.result);
            };
        }
    });

    $('.status-product').change(function() {
        if($(this).val() === 'inactive') {
            $(this).closest('.grey').addClass('inactive').find('input, textarea').attr('disabled', true);
            $('.status-attributes').attr('disabled', true);
        } else {
            $(this).closest('.grey').removeClass('inactive').find('input, textarea').attr('disabled', false);
            $('.status-attributes').attr('disabled', false);
            $('.status-attributes').closest('.inactive').find('input').attr('disabled', true);
        }
    });

    $('.status-attributes').change(function() {
        if($(this).val() === 'inactive') {
            $(this).closest('.grey').addClass('inactive').find('input').attr('disabled', true);
        } else {
            $(this).closest('.grey').removeClass('inactive').find('input').attr('disabled', false);
        }
    });

    $(':reset').click(function(e) {
        e.preventDefault();
        $(this).closest('form').get(0).reset();
        if($('.status-product, .status-attributes').val() === 'inactive') {
            $('.status-product, .status-attributes').closest('.grey').addClass('inactive').find('input').attr('disabled', true);
            $('.item-attributes').find('.status-attributes').attr('disabled', true);
        } else {
            $('.status-product, .status-attributes').closest('.grey').removeClass('inactive').find('input').attr('disabled', false);
            $('.item-attributes').find('.status-attributes').attr('disabled', false);
        }
    });

    $('.color-input').on('change', function() {
        $(this).next('.color-select').val($(this).val());
    });

    $('.color-select').on('change', function() {
        $(this).prev('.color-input').val($(this).val());
    });

});