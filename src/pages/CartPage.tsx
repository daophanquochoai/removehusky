import {Spin, Table, TableColumnsType} from "antd";
import History from "../components/Cart/History.tsx";
import TableOrder from "../components/Cart/TableOrder.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {getCart} from "../Helper/Helper.ts";

interface DataType {
    key : number;
    productTitle: string;
    imageUrl : string;
    quantity: number;
    price : number;
    unit : string;
    stock : number;
}

const CartPage = () => {

    const [form, setForm] = useState<object[]>([]);
    const [cart, setCart] = useState<DataType[]>([])
    const [history, setHistory] = useState<object[]>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false)

    // useEffect
    useEffect(() => {
        const fetchCart = async () => {
            if( localStorage.getItem("accessToken") === undefined ){
                navigate("/login")
                localStorage.removeAll();
                return;
            }
            setLoading(true)
            const response = await getCart(localStorage.getItem("accessToken"));
            setLoading(false)
            console.log(response)
            if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
                toast.error("NETWORK CONNECTED FAIL!!!");
                return;
            }
            if( response.status === 200 ){
                setForm(response.data)
                setHistory(response.data)
            }else{
                toast.error(response.message);
            }
        }
        fetchCart()
    }, []);


    const removeToCart = ( id :number) => {
        let checked = false;
        const nub : number[] = []
        cart.filter( item => item.productId !== id).forEach( item => {
            nub.push(item.productId)
        })
        const historyObj : object[] = [];
        form.forEach( his => {
            const data = {
                time : his.time,
                orderId : his.orderId,
                listOrderItems: []
            }
            data.listOrderItems = his.listOrderItems.filter( item => !nub.includes(item.productId));
            historyObj.push(data);
        })
        setHistory(historyObj);
        if( checked ) return;
        setCart( cart.filter( item => item.productId !== id));
    }

    return (
        <div className={'mx-[5%] mt-[150px] mb-[100px]'}>
            <div className={'text-center'}>
                <p className={'text-3xl font-bold text-green-500'}>MY CART</p>
            </div>
            <Spin tip={"Loading..."} spinning={loading}>
                <div className={'grid grid-cols-[3fr_2fr] gap-8 mt-6'}>
                    <History setCart={setCart} cart={cart} history={history} setHistory={setHistory} setForm={setForm}/>
                    <TableOrder cart={cart} setCart={setCart} removeToCart={removeToCart}/>
                </div>
            </Spin>
        </div>
    );
};

export default CartPage;