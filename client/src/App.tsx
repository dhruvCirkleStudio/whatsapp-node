import "./App.css";
import { SocketProvider } from "./context/SocketContext";
import Home from "./pages/Home";
import Router from "./route/router";

function App() {
  return (
    <>
      <SocketProvider>
       <Home/>
      </SocketProvider>
    </>
  );
}

export default App;
