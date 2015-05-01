# tagbars
use templates as html tags.

```html
<inclusiontemplate/>

<blocktemplate name="value">
some content
</blocktemplate>

<template name="inclusiontemplate">
hello world
</template>

<template name="blocktemplate">
<h> header </h>
<content/>
</template>
```
becomes

```html
{{>inclusiontemplate}}

{{#blocktemplate name='value'}}
some content
{{/blocktemplate}}

<template name="inclusiontemplate">
hello world
</template>

<template name="blocktemplate">
<h> header </h>
{{> Template.contentBlock}}
</template>
```

