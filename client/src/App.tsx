import "./App.css";
import { SocketProvider } from "./context/SocketContext";
import Router from "./route/Router";
import ToastNotification from "./utils/ToastNotification";

function App() {
  return (
    <>
      <SocketProvider>
        {/* <Home/> */}
        <Router />
        <ToastNotification />
      </SocketProvider>
    </>
  );
}

export default App;
