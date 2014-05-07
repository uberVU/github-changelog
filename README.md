github-changelog
====
A simple CSS widget for showing notifications.

## Interface elements ##

## HTML Structure ##

```html
<!-- Changelog Wrapper -->
<div class="changelog-wrapper">

  <!-- #BUTTON -->
  <!-- Button appearance: .btn | .btn-link -->
  <!-- Button size: .small | .medium | .large -->
  <!-- Button color: xxx -->
  <a class="btn" href="#">
    <i class="fa fa-globe"></i>
    <!-- #BADGE -->
    <!-- Badge position: (top | middle | bottom) & (left | middle | right) -->
    <!-- Badge type: round (default) | square -->
    <!-- Badge color: xxx -->
    <span class="badge top right">2</span>
  </a>

  <!-- #LIST -->
  <!-- List position: (top | middle | bottom) & (left | middle | right) -->
  <ul class="bottom middle">
    <li>
      <p>
        <!-- #LABEL -->
        <!-- Label type: round (default) | square -->
        <!-- Label color: xxx -->
        <span class="label">featured</span>
        Lorem ipsum dolor sit amet, consectetur.
      </p>
    </li>
    <li>
      <p>
        <span class="label">enhancement</span>
        Lorem ipsum dolor sit amet, consectetur.
      </p>
    </li>
    <li>
      <p>
        <span class="label">bug</span>
        Lorem ipsum dolor sit amet, consectetur.
      </p>
    </li>
    <li>
      <p>
        <span class="label">new</span>
        Lorem ipsum dolor sit amet, consectetur.
      </p>
    </li>
    <li>
      <p>
        <span class="label">project</span>
        Lorem ipsum dolor sit amet, consectetur.
      </p>
    </li>
  </ul>

</div>

```

