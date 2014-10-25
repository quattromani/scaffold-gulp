/* ==========================================================================
    tooltips -- Version: 0.2.2 - Updated: 7/26/2014
    ========================================================================== */

(function($) {

  $.fn.tooltips = function() {
    $('.has-tooltip').each(function() {

        var tooltip = jQuery(this);
        var tip = tooltip.find('.tip');

        //open event
        tooltip.click(function() {
          tooltip.addClass('hover');
          if ($('.page-cover').length == 0) {
            $(".content").append($("<div>").attr("class","page-cover").bind('click', function() {
              closeTip();
            }));
          }
        });

        //close event
        tooltip.find('.close-tip-modal').bind('click', function() {
          closeTip();
        });

        //close function
        var closeTip = function() {
          event.stopPropagation();
          tooltip.removeClass('hover');
          $('.page-cover').remove();
        };

        var positionTooltip = function()
        {
            if($(window).width() < tooltip.outerWidth() * 1.5)
                tooltip.css('max-width', $(window).width() / 2);
            else
                tooltip.css('max-width', 340);
 
            var pos_left = target.offset().left + (target.outerWidth() / 2) - (tooltip.outerWidth() / 2),
                pos_top  = target.offset().top - tooltip.outerHeight() - 20;
 
            if(pos_left < 0)
            {
                pos_left = target.offset().left + target.outerWidth() / 2 - 20;
                tooltip.addClass('tip-left');
            }
            else
                tooltip.removeClass('tip-left');
 
            if(pos_left + tooltip.outerWidth() > $(window).width())
            {
                pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
                tooltip.addClass('tip-right');
            }
            else
                tooltip.removeClass('tip-right');
 
            if(pos_top < 0)
            {
                var pos_top  = target.offset().top + target.outerHeight();
                tooltip.addClass('tip-top');
            }
            else
                tooltip.removeClass('tip-top');
 
            tooltip.css({ left: pos_left, top: pos_top })
                   .animate({ top: '+=10', opacity: 1 }, 50);
        };
 
        positionTooltip();
        $(window).resize(positionTooltip);

    });
  }

}(jQuery));

$('.has-tooltip').tooltips();
