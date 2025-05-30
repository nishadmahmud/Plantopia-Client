import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/Mainlayout";
import Home from "../pages/Home";
import Login from "../pages/login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import Plants from "../pages/Plants";
import Seeds from "../pages/Seeds";
import Pottery from "../pages/Pottery";
import Tools from "../pages/Tools";
import Cart from "../pages/Cart";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import Profile from "../pages/Profile";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Shipping from "../pages/Shipping";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      { index: true, element: <Home></Home> },
      {
        path: "login",
        element: <Login></Login>,
      },
      {
        path: "register",
        element: <Register></Register>,
      },
      {
        path: "plants",
        element: <Plants></Plants>,
      },
      {
        path: "seeds",
        element: <Seeds></Seeds>,
      },
      {
        path: "pottery",
        element: <Pottery></Pottery>,
      },
      {
        path: "tools",
        element: <Tools></Tools>,
      },
      {
        path: "cart",
        element: <Cart></Cart>,
      },
      {
        path: "product/:id",
        element: <ProductDetails></ProductDetails>,
      },
      {
        path: "checkout",
        element: <Checkout></Checkout>,
      },
      {
        path: "profile",
        element: <Profile></Profile>,
      },
      {
        path: "about",
        element: <About></About>,
      },
      {
        path: "contact",
        element: <Contact></Contact>,
      },
      {
        path: "shipping",
        element: <Shipping></Shipping>,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound></NotFound>,
  },
]);

export default router;
