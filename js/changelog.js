;(function($, window, document, undefined){

  var defaults = {
    reloadText: 'Reload',
    iconText: 'Link',
    footerTitle: 'Changelog',
    owner: 'facebook',
    repo: 'react',
    state: 'closed',
    label: 'build/tooling',
    sort: 'updated'
  };

  var Changelog = function(element, options){
    this.element = element;
    this.$element = $(element);
    this.options = $.extend({}, defaults, options)

    //GitHub
    this.since = Date.now();
    this.apiBase = 'https://api.github.com';
    this.endPoint = this.apiBase + '/repos/' + this.options.owner + '/' + this.options.repo + '/issues';
  };

  Changelog.prototype.checkForUpdates = function(){
    var self = this;
    var options = {
      state: self.options.state,
      labels: self.options.label,
      sort: self.options.sort,
      since: new Date(2014, 0)
    };
    $.get(self.endPoint, options)
      .done(function(data){
        if(data.length !== 0){
          self.buildList(data.length);
        }
        $(data).each(function(key, value){
          if(value.labels.length > 1){
            value.labels = value.labels.filter(function( obj ) {
              return obj.name !== self.options.label;
            });
          }
          self.addListItem(value.title, value.labels[0].name, value.labels[0].color);    
        });
      });
  }

  Changelog.prototype.addListItem = function(title, label, labelColor){
    var list = this.$element.find('ul');
    console.log(labelColor);
    list.append(
      $('<li></li>')
        .append(
          $('<span class="label"></span>')
            .text(label)
            .css({'background-color': '#' + labelColor})
        )
        .append(
          $('<p></p>').text(title)
        )
    );
  };
  Changelog.prototype.buildList = function(notificationNum){
    var widget = 
      $('<div class="changelog-wrapper bottom"></div>')
        .append(
          $('<a class="btn" href="#"></a>')
            .text(this.options.iconText)
            .append($('<span class="badge"></span>')
              .text(notificationNum)
            )
          )
        .append(
          $('<div class="changelog"></div>')
            .append($('<ul></ul>'))
            .append($('<div class="changelog-footer"></div>')
              .text(this.options.footerTitle + ' (' + notificationNum + ')')
              .append($('<a class="btn" href="#"></a>')
                .text(this.options.reloadText)
              )
            )
        );    
    // add widget to selector
    this.$element.html('').append(widget);
  };

  $.fn.changelog = function(options){
    
    var args = arguments;
    
    return this.each(function(){
      var instance = $(this).data('changelog');

      if(instance && instance[options]){
        return instance[options].apply(instance, Array.prototype.slice.call(args, 1));

      }else if(typeof options === 'object' || !options){
        instance = new Changelog(this, options);
        $(this).data('changelog', instance );
      }else{
        $.error('Method ' +  options + ' does not exist');
      }
    });    
  };

})(jQuery, window, document);