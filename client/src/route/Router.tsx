import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../pages/Home";
import Auth from "../component/Auth";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";

export default function Router() {

  const routingArray = createBrowserRouter([
    {
      path: "/",
      element: <Auth/>,
      children:[
        {
            path:'/',
            element:<Home/>
        }
      ]
    },
    {
        path:'/auth',
        children:[
            {
                path:'/auth/login',
                element:<Login/>
            },
            {
                path:'/auth/signUp',
                element:<SignUp/>
            }
        ]
    }
  ]);

  return (
    <>
      <RouterProvider router={routingArray} />
    </>
  );
}
