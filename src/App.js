import logo from "./logo.svg";
import "./App.css";
import { ManywaysProvider } from "./lib/ManywaysContext";

function App() {
  return <ManywaysProvider slug="rebates"></ManywaysProvider>;
}

export default App;
