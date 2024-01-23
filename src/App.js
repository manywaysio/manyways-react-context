import "./styles/variables.css";
import "./styles/App.css";
import "./styles/layouts.css";
import "./styles/buttons.css";
import "./styles/media.css";
import "./styles/forms.css";
import "./styles/loader.css";

import "./styles/mesca2.css";

import { ManywaysProvider } from "./lib/ManywaysContext";

function App() {
  return <ManywaysProvider slug="rebates" mode="scroll"></ManywaysProvider>;
}

export default App;
