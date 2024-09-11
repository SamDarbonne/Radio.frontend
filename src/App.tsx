import "./App.css";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/layouts/Layout";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
  },
];

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
