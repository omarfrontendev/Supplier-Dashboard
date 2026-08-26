import { createHashRouter, RouterProvider } from "react-router-dom";
import { routes } from "@/config/menu.config";

const router = createHashRouter(routes);

export function AppRouter() {

  return <RouterProvider router={router} />;
}
