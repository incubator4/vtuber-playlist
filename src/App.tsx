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

  const match = window.location.hostname.match(
    /^(.*?)\.playlist\.incubator4\.com$/
  );

  let name = "";

  if (match) {
    const firstSegment = match[1];
    console.log(firstSegment); // 输出 "a"
    name = "/" + firstSegment;
  } else {
    name = location.pathname;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      {name === "/" ? <h1>Home</h1> : <Page name={name} />}

      <footer>
        <p>{t("Copyright")}</p>
      </footer>
    </ThemeProvider>
  );
}

export default App;
