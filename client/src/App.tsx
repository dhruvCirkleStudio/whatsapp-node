import "./App.css";
import Router from "./route/Router";
import ToastNotification from "./utils/ToastNotification";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { SocketProvider } from "./context/SocketContext";
// import { CssVarsProvider } from "@mui/joy/styles";
// import { CssBaseline, ThemeProvider, extendTheme  } from "@mui/joy";

function App() {
  // const theme = createTheme({
  //   colorSchemes: {
  //     dark: true,
  //   },
  // });
  const theme = createTheme({
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: "#128c7e",
          },
          secondary: {
            main: "#ece5dd",
          },
        },
      },
      dark: {
        palette: {
          primary: {
            main: "#E0C2FF",
          },
          secondary: {
            main: "#242121",
          },
        },
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <SocketProvider>
          <CssBaseline />
          <Router />
          <ToastNotification />
        </SocketProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
