import {
    createBrowserRouter,
} from "react-router-dom";
import Home from "../Pages/Home/Home/Home";
import MainOutlet from "../Layout/Mainoutlet";
import AboutUs from "../Pages/AboutUs/AboutUs";
import Notice from "../Pages/Notice/Notice";
import Ftp from "../Pages/FTP/Ftp";
import Support from "../Pages/Support/Support";
import Service from "../Pages/Home/Service/Service";



export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainOutlet></MainOutlet>,
        children: [
            {
                path: "/",
                element: <Home></Home>
            },
            {
                path: "/about",
                element: <AboutUs></AboutUs>
            },
            {
                path: "/notice",
                element: <Notice></Notice>
            },
            {
                path: "/ftp",
                element: <Ftp></Ftp>
            },
            {
                path: "/support",
                element: <Support></Support>
            },
            {
                path: "/service",
                element: <Service></Service>
            }
        ],
    },
]);