import { useRoutes, Navigate } from "react-router-dom";
import Home from "./view-page/home.jsx";
import SelectGame from "./view-page/selectGame.jsx";
import LoginPage from "./view-page/login";
import RegistrationForm from "./view-page/register";
import BrowseProduct from "./view-page/browseGame.jsx";
import Cart from "../share-view/cartProduct.jsx";
import WishlistProducts from "../share-view/wishListProducts.jsx";
import CheckOutMoMo from "./component-view/checkOutMoMo.jsx";
import CheckOutVnpay from "./component-view/checkOutVnPay.jsx";

const RouterView = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/browser",
      element: <BrowseProduct />,
    },
    {
      path: "/select-game/:id",
      element: <SelectGame />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/cart",
      element: <Cart />,
    },
    {
      path: "/wishlist",
      element: <WishlistProducts />,
    },
    {
      path: "/checkout",
      element: <CheckOutMoMo />,
    },
    {
      path: "/checkout-vnpay",
      element: <CheckOutVnpay />,
    },
    {
      path: "/register",
      element: <RegistrationForm />,
    },
    {
      path: "*",
      element: <Navigate to="/contact" replace />,
    },
  ]);

  return <div> {element} </div>;
};

export default RouterView;
