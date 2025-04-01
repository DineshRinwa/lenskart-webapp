import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Navbar } from "./Components/Navbar/Navbar";
import { Routing } from "./Routes/Routes";


function App() {
  return (
    <Router>
      <Navbar />

      <Routing/>
    </Router>
  );
}

export default App;