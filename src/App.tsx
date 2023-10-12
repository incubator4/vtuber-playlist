import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/*" element={<Page />} />
        </Routes>
      </Router>

      <footer>
        <p>{t("Copyright")}</p>
      </footer>
    </ThemeProvider>
  );
}

export default App;
