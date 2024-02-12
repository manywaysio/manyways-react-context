import styles from "./sass/sample.scss";

// import vars from "./styles/variables.css";
// import appStyles from "./styles/App.css";
// import layoutStyles from "./styles/layouts.css";
// import buttonStyles from "./styles/buttons.css";
// import mediaStyles from "./styles/media.css";
// import formStyles from "./styles/forms.css";
// import loaderStyles from "./styles/loader.css";
// import mescaStyles from "./styles/mesca2.css";

// import all styles as a var called css

import { ManywaysProvider } from "./lib/ManywaysContext";

function App() {

  console.log(styles)
  const stylesToString = ""
  

  return (
    <ManywaysProvider slug="rebates" mode="scroll">
      <style dangerouslySetInnerHTML={{ __html: stylesToString }}></style>
    </ManywaysProvider>
  );
}

export default App;
