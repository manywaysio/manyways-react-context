import logo from "./logo.svg";
import "./App.css";
import { ManywaysProvider } from "./lib/ManywaysContext";

function App() {
  return (
    <ManywaysProvider
      classNamePrefix="amanda"
      slug="arjuna-test"
      mode="scroll"
    ></ManywaysProvider>
  );
}

export default App;
