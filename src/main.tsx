import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@emotion/react";
import { createTheme, StyledEngineProvider, CssBaseline } from "@mui/material";
import "./css/index.css";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement!);

// All `Portal`-related components need to have the the main app wrapper element as a container
// so that the are in the subtree under the element used in the `important` option of the Tailwind's config.

root.render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <App />
        </StyledEngineProvider>
    </React.StrictMode>
);
