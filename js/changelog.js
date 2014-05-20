  /*
  var changelog = function(option){

    var defaults = {};
    var options = $.extend(defaults, option);

    $('.site-footer').html(" ").append($("<ul class='" + options.list_class + "'></ul>"));

    // $.each(data, function(){
    // $('.' + options.list_class).append(createItem(this.labels[0], this.title, this.issue_id));
    // });

    $.each(data, function(){
      $('ul.' + options.list_class).append(
        "<li class='item'> \
           <strong style='font-weight:bold;color:" + this.label_color + "'>" + this.label + "</strong> \
           <p>" + this.title + "</p> \
         </li>");
    });
  }
  */

$.fn.changelog = function(opt){
  var defaults = {
    reloadText: 'Reload',
    iconText: 'Link',
    footerTitle: 'Changelog'
  };
  var options = $.extend(defaults, opt);
  var notificationNum = data.length;

  // build HTML for widget
  var widget = 
    $('<div class="changelog-wrapper bottom"></div>')
      .append(
        $('<a class="btn" href="#"></a>')
          .text(options.iconText)
          .append($('<span class="badge"></span>')
            .text(notificationNum)
          )
        )
      .append(
        $('<div class="changelog"></div>')
          .append($('<ul></ul>'))
          .append($('<div class="changelog-footer"></div>')
            .text(options.footerTitle + ' (' + notificationNum + ')')
            .append($('<a class="btn" href="#"></a>')
              .text(options.reloadText)
            )
          )
      );
  
  var list = widget.find('ul');
  this.html(' ').append(widget);

  // populate list
  $.each(data, function(){
    list.append(
      $('<li></li>')
        .append($('<span class="label"></span>')
          .text(this.label)
          .css({
            'background-color': this.label_color
          })
        )
        .append($('<p></p>')
          .text(this.title)
        )
    );      
  });
}