(function($){

  var Changelog = function(target, options){

    // Defaults
    this._options = $.extend(
      {
        reloadText: 'Reload',
        iconText: 'Link',
        footerTitle: 'Changelog'
      }, options
    );

    this._widget = null;
    this._list = null;
    this._listWrapper = null;
    this._reloadButton = null;
    this._mainButton = null;
    this._currentTimestamp = Date.now();
    this._target = target;
    this._init(target, options);
    return this;
  };

  Changelog.prototype._updateTimestamp = function(){
    this._currentTimestamp = Date.now();
  };

  Changelog.prototype._addListItem = function(title, label, labelColor){
    this._list.append(
      $('<li></li>')
        .append(
          $('<span class="label"></span>')
            .text(label)
            .css({'background-color': labelColor})
        )
        .append(
          $('<p></p>').text(title)
        )
    );
  };

  Changelog.prototype._buildList = function(){
    var iconText = this._options.iconText;
    this._widget = 
      $('<div class="changelog-wrapper bottom"></div>')
        .append(
          $('<a class="btn" href="#"></a>')
            .text(this._options.iconText)
            .append($('<span class="badge"></span>')
              .text(22)
            )
          )
        .append(
          $('<div class="changelog"></div>')
            .append($('<ul></ul>'))
            .append($('<div class="changelog-footer"></div>')
              .text(this._options.footerTitle + ' (' + 22 + ')')
              .append($('<a class="btn" href="#"></a>')
                .text(this._options.reloadText)
              )
            )
        );
    this._list = this._widget.find('ul');
    this._listWrapper = this._widget.find('.changelog');
    this._reloadButton = this._widget.find('.changelog-footer .btn');
    this._mainButton = this._widget.children('.btn').first();
    
    // add widget to selector
    this._target.html(' ').append(this._widget);
  };

  Changelog.prototype._init = function(){
    this._buildList();
  };

  Changelog.prototype.checkForUpdates = function(){
  };

  $.fn.changelog = function(options){

    var instance = this.data('changelog');

    if(instance && instance[options]){
      return instance[options].apply(instance, Array.prototype.slice.call(arguments, 1));

    }else if(typeof options === 'object' || !options){
      instance = new Changelog(this, options);
      this.data('changelog', instance );
      return this;

    }else{
      $.error('Method ' +  options + ' does not exist');
    }    
  };

})(jQuery);