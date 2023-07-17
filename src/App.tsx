import { ThemeProvider } from "@emotion/react";
import Subnetter from "./Subnetter";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, useMediaQuery } from "@mui/material";
import { useMemo } from "react";

export default function App() {
    const preferedMode = useMediaQuery("(prefers-color-scheme: dark)");
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: preferedMode ? "dark" : "light",
                },
            }),
        [preferedMode]
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Subnetter />;
        </ThemeProvider>
    );
}
