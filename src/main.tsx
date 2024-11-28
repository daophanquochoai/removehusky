import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import {ParallaxProvider} from "react-scroll-parallax";
import CommonProvider from "./context/CommonContext.tsx";

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <ParallaxProvider>
            <CommonProvider >
                <App/>
            </CommonProvider>
        </ParallaxProvider>
    </BrowserRouter>
)
