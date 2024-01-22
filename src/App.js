import "./styles/App.css";
import "./styles/mesca.css";
import { ManywaysProvider } from "./lib/ManywaysContext";

function App() {
  return <ManywaysProvider slug="rebates" mode="slideshow"></ManywaysProvider>;
}

export default App;
