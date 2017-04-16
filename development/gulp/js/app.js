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

    $('#size').change(function() {
        $('span.price').html('$' + $(this).find(':selected').data('price'));
    });

    $('#add-details').click(function() {
        var data = $('span.product-details').find('.row').last().data('row') + 1;
        if (data <= 5) {
            $('span.product-details').append(
                '<span class="row middle-xs grey" data-row="' + data +'">\
                    <span class="col-xs-12">\
                        <label>Item '+ data +'</label>\
                    </span>\
                    <span class="col-xs-12 col-sm">\
                        <input type="text" name="size' + data + '" placeholder="Size">\
                    </span>\
                    <span class="col-xs-12 col-sm">\
                        <input type="text" name="color' + data + '" placeholder="Color">\
                    </span>\
                    <span class="col-xs-12 col-sm">\
                        <input type="number" name="stock' + data + '" placeholder="100">\
                    </span>\
                    <span class="col-xs-12 col-sm">\
                        <input type="number" name="price' + data + '" placeholder="0.00" required>\
                    </span>\
                    <span class="col-xs-12 col-sm-3">\
                    <select name="action">\
                        <option>Enable</option>\
                        <option>Disable</option>\
                        <option>Delete</option>\
                    </select>\
                </span>'
            );
            if (data === 5) {
                $(this).remove();
            }
        }
    });

});