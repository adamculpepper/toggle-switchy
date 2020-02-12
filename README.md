# Toggle Switchy
A pure CSS toggle switch for form input checkboxes

## Preview
<img src="http://adamculpepper.net/repos/preview-toggle-switchy-github.png">

## Installation

### CSS
```<link rel="stylesheet" href="toggle-switchy.css">```

### HTML
```
<label for="ID_HERE" class="toggle-switchy">
	<input checked type="checkbox" id="ID_HERE">
	<span class="toggle">
		<span class="switch"></span>
	</span>
</label>
```

## Options

| Option | Data Attribute |
| ------ | ------ |
| Rounded | `data-style="rounded"`
| No Text | `data-text="false"`
| Disabled | add the `disabled` attribute to the input tag
| Sizes | `data-size="xl"`<br>`data-size="lg"`<br>medium (default)<br>`data-size="sm"`<br>`data-size="xs"`
| Colors | `data-color="red"`<br>`data-color="orange"`<br>`data-color="yellow"`<br>`data-color="green"`<br>`data-color="blue"`<br>`data-color="purple"`<br>`data-color="gray"`
| Labels | `data-label="left"`<br>label on right (default)<br>

## Features
* CSS only - no JavaScript!
* No dependencies
* Fully reponsive
* Fully customizable
* Fully self contained
* 7 color schemes
* Labels on the left and the right
* Supports all modern browsers
* Search engine friendly
* Screen reader friendly
* Doesn't dump a bunch of global styles that'll screw with your other CSS

## TODO
* Better a11y (accessibility) support

## Known Issues
* IE10 and below doesn't support the smooth slide

#### See also [Toggle Radios](https://github.com/adamculpepper/toggle-radios) - A CSS only toggle switch for form input checkboxes (not Bootstrap dependent)
