import { AppShell } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { flattenedLabelledRoutes } from "../../routes";

const Navbar = () => {
  return (
    <AppShell.Navbar p="md">
      {flattenedLabelledRoutes
        .filter((route) => route.label)
        .map((route) => (
          <NavLink key={route.path} to={route.path!}>
            {route.label}
          </NavLink>
        ))}
    </AppShell.Navbar>
  );
};

export default Navbar;
