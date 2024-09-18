import { RouteObject } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import { Home, SongsTable, songsTableLoader } from "./components";

type LabelledRoute = RouteObject & {
  label?: string;
  children?: LabelledRoute[];
};

export const labelledRoutes: LabelledRoute[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/home",
        element: <Home />,
        label: "Home",
        // loader: () => homeLoader(),
        children: [
          {
            element: <SongsTable />,
            path: "",
            loader: () => songsTableLoader(),
          },
        ],
      },
      {
        path: "/artists",
        element: <div>Artists</div>,
        label: "Artists",
      },
    ],
  },
];

export const flattenedLabelledRoutes = labelledRoutes.reduce(
  (acc: LabelledRoute[], route) => {
    if (route.children) {
      return [...acc, route, ...route.children];
    }
    return [...acc, route];
  },
  []
);

const getUnlabelledRoutes = (
  labelledRoutes: LabelledRoute[]
): RouteObject[] => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return labelledRoutes.map(({ label, ...route }) => {
    if (route.children) {
      return {
        ...route,
        children: getUnlabelledRoutes(route.children),
      };
    }
    return route;
  });
};

const unlabelledRoutes = getUnlabelledRoutes(labelledRoutes);

export default unlabelledRoutes;
