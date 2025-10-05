import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { DialogProvider } from "./context/Dialog.jsx";
import { LoadingProvider } from "./context/Loading.jsx";
import { ThemeProvider } from "./context/Theme.jsx";

createRoot(document.getElementById("root")).render(
    // <StrictMode>
    <BrowserRouter>
        <DialogProvider>
            <LoadingProvider>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </LoadingProvider>
        </DialogProvider>
    </BrowserRouter>
    // </StrictMode>,
);
