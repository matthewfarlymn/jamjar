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

    $('#attributes').change(function() {
        $('span.price').html('$' + $(this).find(':selected').data('price'));
    });

    $('.billing-details :checkbox').change(function() {
        if($(this).is(':checked')) {
            $('.shipping-details').closest('.fieldset').addClass('inactive').find('input').attr('disabled', true);
        } else {
            $('.shipping-details').closest('.fieldset').removeClass('inactive').find('input').attr('disabled', false);
        }
    });

    $('.status-product').change(function() {
        if($(this).val() === 'inactive') {
            $(this).closest('.grey').addClass('inactive').find('input, textarea').attr('disabled', true);
            $('.item-attributes').find('.status-attributes').attr('disabled', true);
        } else {
            $(this).closest('.grey').removeClass('inactive').find('input, textarea').attr('disabled', false);
            $('.item-attributes').find('.status-attributes').attr('disabled', false);
        }
    });

    $('.status-attributes').change(function() {
        if($(this).val() === 'inactive') {
            $(this).closest('.grey').addClass('inactive').find('input, textarea').attr('disabled', true);
        } else {
            $(this).closest('.grey').removeClass('inactive').find('input, textarea').attr('disabled', false);
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

    // $('#add-details').click(function() {
    //     var data = $('span.product-details').find('.row').last().data('row') + 1;
    //     if (data <= 5) {
    //         $('span.product-details').append(
    //             '<span class="row middle-xs grey" data-row="' + data +'">\
    //                 <span class="col-xs-12">\
    //                     <label>Item '+ data +'</label>\
    //                 </span>\
    //                 <span class="col-xs-6 col-sm">\
    //                     <input type="text" name="size' + data + '" placeholder="Size">\
    //                 </span>\
    //                 <span class="col-xs-6 col-sm">\
    //                     <input type="text" name="color' + data + '" placeholder="Color">\
    //                 </span>\
    //                 <span class="col-xs-6 col-sm">\
    //                     <input type="number" name="stock' + data + '" min="0" placeholder="100">\
    //                 </span>\
    //                 <span class="col-xs-6 col-sm">\
    //                     <input type="number" name="price' + data + '" min="0" placeholder="0.00">\
    //                 </span>\
    //                 <span class="col-xs-12 col-sm-3">\
    //                 <select name="status' + data + '">\
    //                     <option>Active</option>\
    //                     <option>Inactive</option>\
    //                 </select>\
    //             </span>'
    //         );
    //         if (data === 5) {
    //             $(this).remove();
    //         }
    //     }
    // });

});