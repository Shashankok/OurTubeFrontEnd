import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Video from "./components/Video";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const myRoutes = createBrowserRouter([
    {
      path: "/",
      Component: Signup,
    },
    {
      path: "/signup",
      Component: Signup,
    },
    {
      path: "/login",
      Component: Login,
    },
    {
      path: "/video",
      Component: Video,
    },
  ]);
  return (
    <>
      <RouterProvider router={myRoutes}></RouterProvider>
      <ToastContainer />
    </>
  );
}

export default App;
