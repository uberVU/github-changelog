github-changelog
====

Use GitHub issues to communicate app updates directly to your customers.

[![changelog wireframe](https://dl.dropboxusercontent.com/u/42934143/images/changelog2.png)](http://ubervu.github.io/github-changelog/)

## How does it work?

A configurable jQuery plugin is wired to a GitHub project. The plugin notifies active users with app updates whenever issues are closed.

**Important:** This assumes your app is updated whenever closing a GitHub issue. This can be achived by using commit hooks to deploy changes to your app.

### Options

```js
// Checks GitHub for new updates since last fetch
$('.changelog-container').changelog({
  // Label for the button the appears when you got updates, supports HTML
  buttonText: 'Click me, I got updates!',
  // Label for the reload button shown below the list, supports HTML
  reloadButtonText: 'Reload',
  // Position of the list around the button. E.g. if the button is placed 
  // on the bottom-right corner, you probably want the list to be positioned 
  // top-left or left-top
  listPosition: 'top-left',
  // Poll GitHub for new updates at every set number of seconds
  // Set to false to disable auto-refresh
  autoRefresh: 2,
  // GitHub repository to fetch issues from
  githubRepo: 'facebook/react',
  // Only show updates that have one of these labels
  githubLabels: ['bug', 'enhancement', 'feature'],
  // Payload for the GitHub issues endpoint 
  // https://developer.github.com/v3/issues/#list-issues
  githubParams: {
    // Only get issues from GitHub that have ALL of these labels
    // It's best to set a single label here, e.g. 'release', that's common
    // to all issues. For deeper filtering 'githubLabels' can be used
    labels: 'release'
  }
});
```
Call the plugin on any DOM node to get started. The button will show up when updates arrive. Either by calling `checkForUpdates` manually or automatically if you enabled the `autoRefresh` option.

### checkForUpdates

```js
$('.changelog-container').changelog('checkForUpdates');
```
Checks GitHub for new updates since last fetch. Generates and updates the DOM strucuture when updates are available.  This is useful when the `autoRefresh` option is disabled.

### destroy

```js
$('.changelog-container').changelog('destroy');
```
Removes the list entirely from the DOM and unbinds it's event listeners.


## DOM structure

The jQuery plugin generates all the DOM elements, you just need a DOM container to place them in. All DOM elements generated have specific CSS classes and can be targeted to customize their styling.

```html
<div class="github-changelog">
  <a class="github-changelog-btn" href="#">
    New updates!
    <span class="github-changelog-badge">2</span>
  </a>

  <div class="github-changelog-list">
    <ul>
      <li>
        <span class="github-changelog-label"> issue label </span>
        <p> issue title </p>
      </li>
    </ul>
    <div class="github-changelog-footer">
      <a class="github-changelog-btn github-changelog-btn-reload">Reload</a>
    </div>
  </div>
</div>
```

### Button

![changelog button](https://dl.dropboxusercontent.com/u/42934143/images/changelog-btn.png)

Opens up the list of updates when clicked. The button is hidden by default and won't be shown until updates are available.

The text of the button defaults to "New updates!" and can be changed using the `buttonText` option. You can use HTML to insert an icon or any other child DOM elements.

#### Update counter

An update counter is displayed along with the button when updates arrive. The number is incremented with each update.

### Update list

![update list](https://dl.dropboxusercontent.com/u/42934143/images/changelog-list.png)

The list is shown when the user clicks on the [button](#button) (which is only visibile when updates are available) and hidden when clicking outside.

The list is positioned around the button and can be placed on any side, using the `listPosition` jQuery option. It supports the following values: `top, top-left, top-right, bottom, bottom-left, bottom-right, left-top, left-bottom, right-top, right-bottom`

![list positioning](https://dl.dropboxusercontent.com/u/42934143/images/list-positioning.png)

### Update entry

An item from the update list corresponds to a closed GitHub issues. It's composed of two elements:

- Label: `feature` `enhancement` or `bug`, issues that don't have any of these labels are ignored.
- Text: Issue title


## Customization
We use LESS to generate the CSS files for the widget. The styles can be easily changed to match your design by tweaking `less/variables.less` and re-generating the CSS. [Grunt](http://gruntjs.com/) can help with [this](https://github.com/gruntjs/grunt-contrib-less).
