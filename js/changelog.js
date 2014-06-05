;(function($, window, document, undefined){

  var defaults = {
    buttonText: 'New updates!',
    reloadButtonText: 'Reload',
    listPosition: 'bottom',
    autoRefresh: false,
    githubRepo: 'uberVU/github-changelog-playground',
    githubLabels: ['bug', 'enhancement', 'feature'],
    githubParams: {}
  };

  var CSS_PREFIX = 'github-changelog';

  var LIST_POSITION_CLASSES = {
    'top': 'top',
    'top-left': 'top pull-left',
    'top-right': 'top pull-right',
    'bottom': 'bottom',
    'bottom-left': 'bottom pull-left',
    'bottom-right': 'bottom pull-right',
    'left-top': 'left pull-top',
    'left-bottom': 'left',
    'right-top': 'right pull-top',
    'right-bottom': 'right',
  };

  var GITHUB_API_URL = 'https://api.github.com';

  var Changelog = function(element, options) {
    this.$element = $(element);
    this.options = $.extend(true, {}, defaults, options);
    this.since = now();
    this.updateCount = 0;
    this.checkForUpdates();
  };

  $.extend(Changelog.prototype, {
    destroy: function() {
      if (this.$wrapper) {
        this.unbindEventListeners();
        this.$wrapper.remove();
      }

      if (this.options.autoRefresh) {
        clearTimeout(this._interval);
      }

      // Clear instance from the DOM element after destroying it
      this.$element.removeData('changelog');
    },

    checkForUpdates: function() {
      if (this._interval) {
        clearTimeout(this._interval);
      }

      var that = this,
          payload = $.extend({
            since: this.since,
            state: 'closed',
            sort: 'updated',
            random: Math.random() // prevent browser caching
          }, this.options.githubParams);

      $.get(this.getGitHubIssuesUrl(), payload)
        .done(function(issues) {
          that.addUpdatesToList(that.filterGitHubIssues(issues));

          if (that.options.autoRefresh) {
            that._interval = setTimeout(function() {
              that.checkForUpdates();
            }, that.options.autoRefresh * 1000);
          }
        });
    },

    addUpdatesToList: function(issues) {
      if (!issues.length) {
        return;
      }

      this.since = now();
      this.updateCount += issues.length;

      if (!this.$wrapper) {
        this.createDomStructure();
        this.bindEventListeners();
      }

      for (var i = 0, l = issues.length; i < l; i++) {
        this.addUpdateToList(issues[i]);
      }

      this.$badge.text(this.updateCount);
    },

    createDomStructure: function() {
      var positionClass = LIST_POSITION_CLASSES[this.options.listPosition],
          $wrapper = $('<div></div>', {
              "class": CSS_PREFIX + ' ' + positionClass + ' closed'
          }),
          $button = $('<a>', {
              "class": CSS_PREFIX + '-btn',
              "html": this.options.buttonText,
              "href": '#show-notifications'
          }),
          $badge = $('<span></span>', {
              "class": CSS_PREFIX + '-badge'
          }),
          $list = $('<div></div>', {
              "class": CSS_PREFIX + '-list'
          }),
          $listContainer = $('<ul></ul>'),
          $listFooter = $('<div></div>', {
              "class": CSS_PREFIX + '-footer'
          }),
          $reloadButton = $('<a>', {
              "class": CSS_PREFIX + '-btn ' + CSS_PREFIX + '-btn-reload',
              "html": this.options.reloadButtonText,
              "href": '#reload-for-updates'
          });

      $button.append($badge);

      $listFooter.append($reloadButton);

      $list.append($listContainer).$list.append($listFooter);

      $wrapper.append($button).append($list);

      this.$element.append($wrapper);

      // We'll use these references to bind events
      this.$wrapper = $wrapper;
      this.$button = $button;
      this.$reloadButton = $reloadButton;

      // We'll use these references to push new updates
      this.$listContainer = $listContainer;
      this.$badge = $badge;
    },

    addUpdateToList: function(issue) {
      var featuredLabel = this.getExpectedGitHubIssueLabel(issue),
          $update = $('<li>'),
          $label = $('<span>', {class: CSS_PREFIX + '-label',
                                text: featuredLabel.name,
                                css: {
                                  backgroundColor: '#' + featuredLabel.color
                                }}),
          $title = $('<p>', {text: issue.title});

      $update.append($label).append($title);
      this.$listContainer.prepend($update);
    },

    filterGitHubIssues: function(issues) {
      var relevantIssues = [];

      for (var i = 0, l = issues.length; i < l; i++) {
        var issue = issues[i],
            label = this.getExpectedGitHubIssueLabel(issue);
        if (!label) {
          continue;
        }

        relevantIssues.push(issue);
      }

      return relevantIssues;
    },

    bindEventListeners: function() {
      this._onButtonClick = bind(this.onButtonClick, this);
      this._onReloadButtonClick = bind(this.onReloadButtonClick, this);
      this._onWrapperClick = bind(this.onWrapperClick, this);
      this._onBodyClick = bind(this.onBodyClick, this);

      this.$button.on('click', this._onButtonClick);
      this.$reloadButton.on('click', this._onReloadButtonClick);
      this.$wrapper.on('click', this._onWrapperClick);

      $('html,body').on('click', this._onBodyClick);
    },

    unbindEventListeners: function() {
      this.$button.off('click', this._onButtonClick);
      this.$reloadButton.off('click', this._onReloadButtonClick);
      this.$wrapper.off('click', this._onWrapperClick);

      $('html,body').off('click', this._onBodyClick);
    },

    onButtonClick: function(e) {
      e.preventDefault();
      this.$wrapper.toggleClass('closed');
    },

    onReloadButtonClick: function(e) {
      e.preventDefault();
      window.location.reload(true);
    },

    onWrapperClick: function(e) {
      e.stopPropagation();
    },

    onBodyClick: function(e) {
      this.$wrapper.addClass('closed');
    },

    getGitHubIssuesUrl: function() {
      return GITHUB_API_URL + '/repos/' + this.options.githubRepo + '/issues';
    },

    getExpectedGitHubIssueLabel: function(issue) {
      if (!issue.labels || !issue.labels.length) {
        return null;
      }

      for (var i = 0, l = issues.labels.length; i < l; i++) {
        var label = issue.labels[i];
        if (this.options.githubLabels.indexOf(label.name) != -1) {
          return label;
        }
      }

      // At this point we found the issue to have none of the expected labels
      return null;
    }
  });

  var bind = function(fn, obj) {
    /**
     * Bind prototype method to instance scope (similar to CoffeeScript's fat
     * arrow)
     */
    return function() {
      return fn.apply(obj, arguments);
    };
  };

  var now = function() {
    return new Date().toISOString();
  };

  $.fn.changelog = function(method, options) {
    if (typeof(method) !== 'string') {
      options = method;
      method = null;
    }

    return this.each(function() {
      var instance = $(this).data('changelog');

      if (!instance) {
        instance = new Changelog(this, options);
        $(this).data('changelog', instance);
      } else if (method) {
        instance[method](instance);
      }
    });
  };

})(jQuery, window, document);

