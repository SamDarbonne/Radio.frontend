import { ReactElement } from "react";
import { Outlet } from "react-router-dom";

// import "../styles/Home.css";

// const SongsTable = ({
//   songs,
//   height,
//   width,
// }: {
//   songs: Media["documents"];
//   height: number;
//   width: number;
// }) => {};

const Home: () => ReactElement = () => {
  return (
    <div className="home">
      <Outlet />
    </div>
  );
};

export default Home;
