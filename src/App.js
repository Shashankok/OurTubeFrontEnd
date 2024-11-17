import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Video from "./components/Video";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home";
import Account from "./components/Account";
import AppLayout from "./Layouts/AppLayout";
import UploadVideo from "./components/UploadVideo";
import VideoPlayer from "./components/VideoPlayer";
import Search from "./components/Search";

// Protected route check
const ProtectedRoute = ({ element }) => {
  const userToken = localStorage.getItem("token"); // Adjust this based on your auth logic

  if (!userToken) {
    return <Home />; // Redirect to home if not logged in
  }

  return element;
};

function App() {
  const myRoutes = createBrowserRouter([
    {
      element: <AppLayout />, // Wraps Header and MiniSideNav
      children: [
        {
          path: "/video",
          element: <Video />,
        },
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/account/:userId",
          element: <Account />,
        },
        {
          path: "/upload",
          element: <ProtectedRoute element={<UploadVideo />} />,
        },
        {
          path: "/videoPlayer",
          element: <VideoPlayer />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        { path: "/search", element: <Search /> },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={myRoutes} />
      <ToastContainer />
    </>
  );
}

export default App;
