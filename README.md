# manyways

## Ideal state to support

```js

npm i @manyways/run --save

1. Do whatever you want with the context. Do not use the node renderer or abything - everything is custom except the travelsal of nodes and analytics and common functions

import useManyways {ManywaysContext} from '@manyways/run';


const MyCustomRenderer = () => {
  const {currentNode} = useManyways();
}

<ManywaysContext mode="slideshow">
  <MyCustomRenderer />
</ManywaysContext>

2. Use with defaults

import {ManywaysContext, NodeRenderer } from '@manyways/run'

<ManywaysContext mode="scroll">
  <NodeRenderer
    customWidgets={{
      RadioWidget: () => {  }
    }} />
</ManywaysContext>

3. Just use default only. Add custom CSS via wayfinder.

<script src="manyways.io/run/script.js">

<manyways-wrapper></manyways-wrapper>
```

## Tasks

1. Do the stuff above so it works as an npm package
2. Transition classes with NO transitions
3. Document all props for exposed components (eg, ManwaysContext, NodeRenderer, etc) and contexts ( useManywaysContext )
4. Add support for null field rendering
