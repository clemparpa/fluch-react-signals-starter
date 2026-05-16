import { createBrowserRouter } from "react-router"
import RootLayout from "@/layouts/root"
import Home from "@/pages/home"
import Showcase from "@/pages/showcase"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "showcase", element: <Showcase /> },
    ],
  },
])
