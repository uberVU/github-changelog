github-changelog
====

Use GitHub issues to communicate app updates directly to your customers.

![changelog wireframe](https://dl.dropboxusercontent.com/u/42934143/images/changelog2.png)

## How does it work?

A configurable jQuery plugin is wired to a GitHub project. The plugin notifies active users with app updates whenever issues are closed. 

**Important:** This assumes your app is updated whenever closing a GitHub issue. This can be achived by using commit hooks to deploy changes to your app.

## DOM structure

The jQuery plugin generates all the DOM elements, you just need a DOM container to place them in. All DOM elements generated have specific CSS classes and can be targeted to customize their styling.


```html
<div class="github-changelog">
  <a class="changelog-btn" href="#">
    New updates!
    <span class="changelog-badge">2</span>
  </a>

  <div class="changelog-list">
    <ul>
      <li>
        <span class="changelog-label"> issue label </span>
        <p> issue title </p>
      </li>
    </ul>
    <div class="changelog-footer">
      <a class="changelog-btn changelog-btn-reload">Reload</a>
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






