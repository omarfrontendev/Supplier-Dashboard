import { AppRouter } from "@/app/router";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    const lang = localStorage.getItem("language") || "en";
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, []);

  return <AppRouter />;
}

export default App;
