import { createBrowserRouter } from "react-router";
import { Layout } from "./Layout";
import { MainPage } from "@/pages";

export const routerConfig = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <MainPage />,
            }
        ]
    }
])