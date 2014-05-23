;(function($, window, document, undefined){

  var defaults = {
    buttonText: 'New updates!',
    listPosition: 'bottom',
    githubRepo: 'uberVU/github-changelog',
    githubMilestone: null,
    githubLabels: ['bug', 'enhancement', 'feature'],
    githubParams: {
      labels: 'release'
    }
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

  var CHANGELOG = function(element, options) {
    /**
     * TODO: Add click events
     * TODO: Auto-refresh
     */
    this.$element = $(element);
    this.options = $.extend(true, {}, defaults, options);
    this.since = now();
    this.updateCount = 0;
    this.checkForUpdates();
  };

  $.extend(CHANGELOG.prototype, {
    checkForUpdates: function() {
      var _this = this,
          payload = $.extend({
            since: this.since,
            state: 'closed',
            sort: 'updated'
          }, this.options.githubParams);
      $.get(this.getGitHubIssuesUrl(), payload)
        .done(function(issues) {
          _this.addUpdatesToList(_this.filterGitHubIssues(issues));
        });
    },
    addUpdatesToList: function(issues) {
      if (!issues.length) {
        return;
      }
      var i;

      this.since = now();
      this.updateCount += issues.length;

      if (!this.$element.find('.github-changelog').length) {
        this.createDomStructure();
      }
      for (i = 0; i < issues.length; i++) {
        this.addUpdateToList(issues[i]);
      }
      this.$badge.text(this.updateCount);
    },
    createDomStructure: function() {
      var positionClass = LIST_POSITION_CLASSES[this.options.listPosition],
          $wrapper = $('<div>', {class: CSS_PREFIX + ' ' + positionClass}),
          $button = $('<a>', {class: CSS_PREFIX + '-btn',
                              html: this.options.buttonText,
                              href: '#show-notifications'}),
          $badge = $('<span>', {class: CSS_PREFIX + '-badge'}),
          $list = $('<div>', {class: CSS_PREFIX + '-list'}),
          $listContainer = $('<ul>'),
          $listFooter = $('<div>', {class: CSS_PREFIX + '-footer'}),
          $reloadButton = $('<a>', {class: CSS_PREFIX + '-btn ' +
                                           CSS_PREFIX + '-btn-reload',
                                    text: 'Reload',
                                    href: '#reload-for-updates'});

      this.$element.append(
        $wrapper.append($button.append($badge))
                .append(
                  $list.append($listContainer)
                       .append($listFooter.append($reloadButton))));

      // We'll use this references to push new updates
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

      this.$listContainer.prepend(
        $update.append($label)
               .append($title));
    },
    filterGitHubIssues: function(issues) {
      var relevantIssues = [],
          i,
          issue,
          milestone,
          label;
      for (i = 0; i < issues.length; i++) {
        issue = issues[i];
        label = this.getExpectedGitHubIssueLabel(issue);
        if (!label) {
          continue;
        }
        if (this.options.githubMilestone) {
          milestone = this.getGitHubIssueMilestone(issue);
          if (this.options.githubMilestone != milestone) {
            continue;
          }
        }
        relevantIssues.push(issue);
      }
      return relevantIssues;
    },
    getGitHubIssuesUrl: function() {
      return GITHUB_API_URL + '/repos/' + this.options.githubRepo + '/issues';
    },
    getGitHubIssueMilestone: function(issue) {
      return issue.milestone ? issue.milestone.title : null;
    },
    getExpectedGitHubIssueLabel: function(issue) {
      if (!issue.labels || !issue.labels.length) {
        return null;
      }
      var i,
          label;
      for (i = 0; i < issue.labels.length; i++) {
        label = issue.labels[i];
        if (this.options.githubLabels.indexOf(label.name) != -1) {
          return label;
        }
      }
      // At this point we found the issue to have none of the expected labels
      return null;
    }
  });

  var now = function() {
    return new Date().toISOString();
  };

  $.fn.changelog = function(method, options) {
    if (typeof(method) !== 'string') {
      options = method;
      method = null;
    }
    var instance;
    return this.each(function() {
      instance = $(this).data('changelog');
      if (!instance) {
        instance = new CHANGELOG(this, options);
        $(this).data('changelog', instance);
      } else if (method) {
        instance[method](instance);
      }
    });
  };

})(jQuery, window, document);
