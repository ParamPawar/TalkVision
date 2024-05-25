import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Home";

import { SocketProvider } from "./providers/Socket";

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </SocketProvider>
    </div>
  );
}

export default App;
