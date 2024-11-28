import Home from "./pages/Home.tsx";
import { useRoutes} from "react-router-dom";
import {useEffect, useState} from "react";
import AllProduct from "./pages/AllProduct.tsx";
import Container from "./pages/Container.tsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Login from "./pages/Login.tsx";
import OAuth2Redict from "./pages/OAuth2Redict.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import DetailProduct from "./pages/DetailProduct.tsx";
import Register from "./pages/Register.tsx";
import {Spin} from "antd";
import BlogPage from "./pages/BlogPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import AcceptPage from "./pages/AcceptPage.tsx";
import WishListPage from "./pages/WishListPage.tsx";
import DashBoard from "./pages/DashBoard.tsx";
import OverView from "./pages/OverView.tsx";
import ProductManage from "./pages/ProductManage.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import OrderManage from "./pages/OrderManage.tsx";
import BlogManage from "./pages/BlogManage.tsx";

const routes = [
    {
        path : '/',
        element : <Container />,
        children : [
            {
                index : true,
                element : <Home />
            },
            {
                path: '/product',
                element: <AllProduct />
            },
            {
                path: '/product/:id',
                element: <DetailProduct />
            },
            {
                path: '/blog',
                element : <BlogPage />
            },{
                path: '/cart',
                element: <CartPage />
            },
            {
                path: '/wishlist',
                element: <WishListPage />
            }
        ]
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/oauth2/redirect',
        element: <OAuth2Redict />
    },{
        path: '*',
        element: <NotFoundPage />
    },
    {
        path: '/acceptcart',
        element: <AcceptPage />
    },
    {
        path: '/admin',
        element: <DashBoard />,
        children: [
            {
                index: true,
                element: <OverView />
            },
            {
                path: 'product',
                element : <ProductManage />
            },
            {
                path: 'category',
                element : <CategoryPage />
            },
            {
                path: 'order',
                element : <OrderManage />
            },
            {
                path: 'blog',
                element : <BlogManage />
            }
        ]
    }
]

function App() {
    const element = useRoutes(routes);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect( () => {
        window.addEventListener('load',() => setIsLoading(false))
    });
  return (
    <>
        <ToastContainer autoClose={1000}/>
        {
            isLoading ?
                <Spin tip={"Loading..."} spinning={isLoading} fullscreen={true} size={"large"}>
                </Spin>
                :
                <>
                    {element}
                </>
        }
    </>
  )
}

export default App
