// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from "./pages/Loading"; // import your Loading screen

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route shows Loading page */}
        <Route path="/" element={<Loading />} />
      </Routes>
    </Router>
  );
}

export default App;
