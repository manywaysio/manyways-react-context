#manyways

## Running the SDK

#### Initialization

```jsx
import ManywaysProvider from "@manyways/run";

const MyApp = ({ children }) => {
  return (
    <>
      <ManywaysRunProvider
        slug="my-slug"
        customComponents={{
          choiceWithImage: MyComponent,
        }}
        disableRender={false}
      >
        {children}
      </ManywaysRunProvider>
    </>
  );
};
```

#### <ManywaysRunProvider /> Props

| Prop             | Description                                                                                                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| slug (required)  | Your Journey Slug                                                                                                                                                                            |
| disableRender    | This causes the Provider not to render any components at all, ideally used when in pure headless mode                                                                                        |
| customComponents | This is ignored if `disableRender` is true. Can provide a object mapped with name and value. Expects the value to be a react component. Full list of component names can be found here @todo |

##### customComponents

All Custom components will have `value` and `onChange` props passed to them.

ChoiceWithImage
Text
Date
DateTime
Checkbox
AutoComplete
MapWithDynamicSource
Slideshow
Prose

### useManyways hook

This is the main way to utilize the various methods and journey states used by manyways.

```jsx
import { useManyways } from "@manyways/run";
```

##### Getters, setters and actions

| Name                | Desc                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------- |
| currentNode         | The current node object from the api                                                          |
| currentResponse     | The current user response to the current node if it exists. Will return null if unanswered    |
| goBack              | Take the user to the previous node. Will return current node if the user is unable to go back |
| setResponse         | Set the current response                                                                      |
| goForward           | Go to the next node with the current response                                                 |
| responseHistory     | An array of response objects with node ids and responses                                      |
| getResponseByNodeID | Get response for node based on nodeID                                                         |
| treeConfig          | Get tree config                                                                               |
| journeyNodes        | Array of all journey nodes                                                                    |
| locale              | Get the current language                                                                      |
| setLocale           | Set the current language                                                                      |
| shareJourney        | Open the share journey panel                                                                  |
| copyLink            | Copies the link to continue later to the clipboard                                            |
