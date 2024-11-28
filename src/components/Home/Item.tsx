import React, {useContext} from 'react';
import {Badge, Rate} from "antd";
import {FaCartPlus} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {CommonContext} from "../../context/CommonContext.tsx";
import {toast} from "react-toastify";
import {addProductToCart} from "../../Helper/Helper.ts";

type Props = {
    id: number,
    title : string,
    price : number,
    priceOld : number
    image : string,
    rate : number,
    selled : string,
    quantity : number,
    numberItem : number
    handleUpItem: () => void,
    handleDownItem : () => void
}
const Item = ( props : Props) => {

    const {numberItem} = useContext(CommonContext);
    const navigate = useNavigate();

    // function
    const handleAddToCart = async () => {
        if(localStorage.getItem('accessToken') === null ){
            navigate('/login');
            return;
        }
        const quantity = numberItem.filter(i=>i.item===props.id).length === 0 ? 1 :  numberItem.filter(i=>i.item===props.id)[0].number;
        if( quantity > props.quantity ){
            toast.error("Quantity large than stock");
            return;
        }
        if( localStorage.getItem("accessToken") === undefined ){
            if( localStorage.getItem("refreshToken") === undefined ){
                navigate("/login");
                return;
            }
            toast.warning("Please refresh page!!");
            return;
        }
        const token = localStorage.getItem("accessToken");
        const response = await addProductToCart(props.id,props.numberItem, token);
        if( response.hasOwnProperty("code") && response.code === "ERR_NETWORK"){
            toast.warning("Please Login Again");
            return;
        }
        console.log(response)
        if( response.status === 200 ){
            toast.success(response.data)
        }
        else if( response.status === 500 ){
            toast.error("Server failing...")
        }
        else{
            toast.error(response.message)
        }
    }
    const handleDetail = () => {
        navigate('/product/' + props.id);
        scroll(0,0)
    }
    return (
        <div className={'hover:border-gray_primary border-2 hover:scale-105 cursor-pointer transition-all duration-500 group h-full'} >
            <div className={'h-[200px]'} onClick={() => handleDetail()}>
                <Badge.Ribbon className={`${props.price === props.priceOld && 'hidden'}`} text={ '-' +  ((props.priceOld - props.price)/props.priceOld).toFixed(2)*100 + '%'} color="green">
                    <img src={props.image} alt={'image'} className={'w-full h-full object-contain'}/>
                </Badge.Ribbon>
            </div>
            <div className={'flex flex-col gap-2 p-4'}>
                <p className={'text-center font-bold'}>{props.title}</p>
                <div className={'group-hover:hidden flex items-center justify-center'}>
                    <Rate disabled defaultValue={props.rate} className={'text-base'}/>
                    <span className={'text-gray-300 text-xs'}>({props.selled})</span>
                </div>
                <div className={'flex justify-center items-center'}>
                    <div className={'group-hover:hidden transition-all duration-300 flex items-end gap-2 pb-5'} onClick={() => handleDetail()}>
                        <span className={'font-bold text-xl'}>${props.price}</span>
                        <del className={'text-gray-300'}>${props.priceOld}</del>
                    </div>
                    <div className={'hidden group-hover:block transition-all duration-300'}>
                        <div className={'flex items-center justify-center'}>
                            <button className={'border-2 px-2'} onClick={ () => props.handleDownItem()}>-</button>
                            <span className={'px-2'}>{props.numberItem}</span>
                            <button className={'border-2 px-2'} onClick={ () => props.handleUpItem()}>+</button>
                        </div>
                        <div className={'flex items-center gap-4 text-white bg-green_primary p-2 rounded-[7px] mt-2'}>
                            <FaCartPlus />
                            <button onClick={() => handleAddToCart()}>Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Item;