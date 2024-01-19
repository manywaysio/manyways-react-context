import "./App.css";
import { ManywaysProvider } from "./lib/ManywaysContext";

function App() {
  return <ManywaysProvider slug="rebates" mode="scroll"></ManywaysProvider>;
}

export default App;
