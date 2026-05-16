import { createBrowserRouter, type RouteObject } from "react-router"
import RootLayout from "@/layouts/root"
import Home from "@/pages/home"
import Showcase from "@/pages/showcase"

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "showcase", element: <Showcase /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
