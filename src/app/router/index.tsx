import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "@/config/menu.config";

const router = createBrowserRouter(routes);

export function AppRouter() {
  
  return <RouterProvider router={router} />;
}
