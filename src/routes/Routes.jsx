import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import Plants from "../pages/Plants";
import Tools from "../pages/Tools";
import Soils from "../pages/Soils";
import Fertilizers from "../pages/Fertilizers";
import Cart from "../pages/Cart";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import Profile from "../pages/Profile";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Shipping from "../pages/Shipping";
import AdminDashboard from "../pages/admin/AdminDashboard";
import PrivateRoute from "../components/PrivateRoute";

// Error element component
const RouteError = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Route Error</h2>
        <p className="text-gray-600 mb-4">Something went wrong loading this page.</p>
        <a
          href="/"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-block"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
        errorElement: <NotFound />
      },
      {
        path: "cart",
        element: <Cart />,
        errorElement: <NotFound />
      },
      {
        path: "login",
        element: <Login />,
        errorElement: <NotFound />
      },
      {
        path: "register",
        element: <Register />,
        errorElement: <NotFound />
      },
      {
        path: "plants",
        element: <Plants />,
        errorElement: <NotFound />
      },
      {
        path: "tools",
        element: <Tools />,
        errorElement: <NotFound />
      },
      {
        path: "soils",
        element: <Soils />,
        errorElement: <NotFound />
      },
      {
        path: "fertilizers",
        element: <Fertilizers />,
        errorElement: <NotFound />
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
        errorElement: <NotFound />
      },
      {
        path: "checkout",
        element: <PrivateRoute><Checkout /></PrivateRoute>,
        errorElement: <NotFound />
      },
      {
        path: "profile",
        element: <PrivateRoute><Profile /></PrivateRoute>,
        errorElement: <NotFound />
      },
      {
        path: "about",
        element: <About />,
        errorElement: <NotFound />
      },
      {
        path: "contact",
        element: <Contact />,
        errorElement: <NotFound />
      },
      {
        path: "shipping",
        element: <PrivateRoute><Shipping /></PrivateRoute>,
        errorElement: <NotFound />
      },
      {
        path: "admin",
        element: <PrivateRoute><AdminDashboard /></PrivateRoute>,
        errorElement: <NotFound />
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default router;
