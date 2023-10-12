import "./App.css";
import Page from "./Page";
import { useTranslation } from "react-i18next";
import { ThemeProvider, createTheme } from "@mui/material";
import { useDarkMode } from "usehooks-ts";

function App() {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();

  const darkTheme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  let name = "";

  if (location.hostname.endsWith(".playlist.incubator4.com")) {
    name = location.hostname.replace(".playlist.incubator4.com", "");
  } else {
    if (location.pathname !== "/") {
      name = location.pathname.slice(1, location.pathname.length);
    }
  }
  return (
    <ThemeProvider theme={darkTheme}>
      {name === "" ? <h1>Home</h1> : <Page name={name} />}

      <footer>
        <p>{t("Copyright")}</p>
      </footer>
    </ThemeProvider>
  );
}

export default App;
