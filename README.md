# tagbars
use html tags syntax for templates

```html
<inclusiontemplate/>

<blocktemplate>
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

{{#blocktemplate}}
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

