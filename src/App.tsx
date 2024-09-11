import "./App.css";
import "@mantine/core/styles.css";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/layouts/Layout";
import { MantineProvider } from "@mantine/core";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
  },
];

const router = createBrowserRouter(routes);

function App() {
  return (
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  );
}

export default App;
