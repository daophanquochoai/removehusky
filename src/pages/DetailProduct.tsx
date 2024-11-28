import React, {useContext, useEffect, useState} from 'react';
import {IoCaretBack} from "react-icons/io5";
import {AiOutlineLine} from "react-icons/ai";
import {TiPlus} from "react-icons/ti";
import UploadComment from "../components/DetailProject/Upload.tsx";
import {Rate, Spin} from "antd";
import InfoDownload from "../components/DetailProject/InfoDownload.tsx";
import Item from "../components/Home/Item.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {addProductToCart, addWishList, getProductByProductId, removeWishList} from "../Helper/Helper.ts";
import {toast} from "react-toastify";
import {CommonContext} from "../context/CommonContext.tsx";
import {FaHeart, FaRegShareSquare} from "react-icons/fa";
import {CiHeart} from "react-icons/ci";

type productType = {
    id : number,
    title : string,
    price : number,
    priceOld : number
    image : string,
    image1 : string,
    image2 : string,
    image3 : string,
    rate : number,
    selled : string,
    quantity : number,
    description : string,
    unit : string,
    liked : boolean
}

const productInit : productType = {
    id : 0,
    title : '',
    price : 0,
    priceOld : 0,
    image : '',
    image1 : '',
    image2 : '',
    image3 : '',
    rate : 0,
    selled : '',
    quantity : 0,
    description : '',
    unit : 'Kg',
    liked : false
}

const DetailProduct : React.FC = () => {
    const {isLogin, setIsLogin} = useContext(CommonContext);

    const [number, setNumber] = useState<number>(1);
    const [select, setSelect] = useState<number>(0);
    const [product, setProduct] = useState<productType>(productInit);
    const [imagePr, setImagePr] = useState<string>('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const param = useParams()?.id;
    const handleSub = () => {
        if( number != 1 ){
            setNumber( e => e-1);
        }
    }
    const handleRise = () => {
        setNumber( e => e+1);
    }

    // useEffect
    useEffect(() => {
        const fetchProductById = async () => {
            setIsLoading(true)
            const data = await getProductByProductId(param, localStorage.getItem("accessToken"));
            setIsLoading(false)
            if( data.hasOwnProperty('code') && data.code === "ERR_NETWORK"){
                toast.error("Blog don't loading!");
                return;
            }
            if(data.status === 200 ){
                const productCurrent : productType = {
                    id : data.data.productId,
                    title : data.data.productTitle,
                    price : data.data.priceUnit,
                    priceOld : data.data.priceOld,
                    image : data.data.imageUrl,
                    image1 : data.data.imageUrl1,
                    image2 : data.data.imageUrl2,
                    image3 : data.data.imageUrl3,
                    rate : data.data.rate,
                    selled : data.data.selled,
                    quantity : data.data.quantity,
                    description : data.data.description,
                    unit : data.data.unit,
                    liked : data.data.like
                }
                setProduct(productCurrent);
                setImagePr(productCurrent.image);
            }else{
                toast.error(data.data.message)
            }
        }
        fetchProductById();
    }, []);

    const handleAddToWishList = async () => {
        if( localStorage.getItem('accessToken') === null ){
            navigate('/login');
            setIsLogin(false);
            localStorage.removeAll();
            return
        }
        const response = await addWishList(product.id, localStorage.getItem('accessToken'));
        if( response.hasOwnProperty("code") && response.code === "ERR_NETWORK"){
            toast.warning("NETWORK DON'T CONNECTED!!");
            return;
        }
        if( response.status === 200 ){
            toast.success(response.data.message)
            let productNew = {...product};
            productNew.liked = true;
            setProduct(productNew)
        }else{
            toast.error(response.data.message)
        }
    }
    const handleRemoveToWishList = async () => {
        if( localStorage.getItem('accessToken') === null ){
            navigate('/login');
            setIsLogin(false);
            localStorage.removeAll();
            return
        }
        const response = await removeWishList(product.id, localStorage.getItem('accessToken'));
        if( response.hasOwnProperty("code") && response.code === "ERR_NETWORK"){
            toast.warning("NETWORK DON;t CONNECTED!!");
            return;
        }
        if( response.status === 200 ){
            toast.success(response.data.message)
            let productNew = {...product};
            productNew.liked = false;
            setProduct(productNew)
        }else{
            toast.error(response.data.message)
        }
    }

    return (
        <Spin tip={"Loading..."} spinning={isLoading}>
            <div className={'mt-[100px]'}>
                <div className={'py-8 mx-[5%]'}>
                    <div
                        className={'flex items-center justify-start text-xl font-bold text-green_primary cursor-pointer'}
                        onClick={() => navigate(-1)}>
                        <IoCaretBack/> BACK
                    </div>
                    <div className={'grid grid-cols-[3fr_2fr] gap-12 mt-8'}>
                        <div className={'flex gap-4'}>
                            <div className={'flex flex-col gap-4'}>
                                <div className={'bg-gray-100 h-[120px] w-[120px] cursor-pointer'}
                                     onClick={() => setImagePr(product.image)}>
                                    <img src={product.image} alt={'product image'} className={'w-full h-auto'}/>
                                </div>
                                <div className={'bg-gray-100 h-[120px] w-[120px] cursor-pointer'}
                                     onClick={() => setImagePr(product.image1)}>
                                    <img src={product.image1} alt={'product image'} className={'w-full h-auto'}/>
                                </div>
                                <div className={'bg-gray-100 h-[120px] w-[120px] cursor-pointer'}
                                     onClick={() => setImagePr(product.image2)}>
                                    <img src={product.image2} alt={'product image'} className={'w-full h-auto'}/>
                                </div>
                                <div className={'bg-gray-100 h-[120px] w-[120px] cursor-pointer'}
                                     onClick={() => setImagePr(product.image3)}>
                                    <img src={product.image3} alt={'product image'} className={'w-full h-auto'}/>
                                </div>
                            </div>
                            <div className={'w-full px-[5%]'}>
                                <img src={imagePr} alt={'product image'} className={'w-full h-auto object-cover'}/>
                            </div>
                        </div>
                        <div className={'flex flex-col gap-4'}>
                            <h2 className={'text-black text-4xl font-bold'}>{product.title}</h2>
                            <div className={'flex items-center gap-4'}>
                                <Rate value={product.rate} disabled/>
                                <span className={'text-xl text-gray-300'}>({product.selled})</span>
                            </div>
                            <div className={'flex items-end gap-4'}>
                                <p className={'text-4xl text-green_primary font-bold'}>{product.price.toLocaleString()}đ/1{product.unit}</p>
                                <del className={'text-xl text-gray-300'}>{product.priceOld.toLocaleString()}đ</del>
                            </div>
                            <p className={'text-gray-400 shortcut'}>{product.description}</p>
                            <div className={'flex items-center'}>
                                <button className={'px-4 py-2 border-2 text-green_primary'} onClick={() => handleSub()}>
                                    <AiOutlineLine/></button>
                                <input className={'px-6 py-1 border-2 text-center w-[100px]'} type={"number"} onChange={(e) => setNumber(e.target.value)} value={number}/>
                                <button className={'px-4 py-2 border-2 text-green_primary'}
                                        onClick={() => handleRise()}><TiPlus/></button>
                            </div>
                            <p className={'text-gray-400'}>Chỉ còn {product.quantity}{product.unit}</p>
                            <div className={'flex gap-4 mt-2'}>
                                <button className={`p-4 text-white rounded-2xl ${product.quantity < number ? 'bg-gray-400' : 'bg-green_primary'}`} disabled={product.quantity < number} >ADD TO CART</button>
                            </div>
                            <div>
                                {
                                    isLogin &&
                                    <div className={'flex gap-2 text-2xl text-green-500'}>
                                        {product.liked ? <FaHeart className={'cursor-pointer'} onClick={() => handleRemoveToWishList()}/> : <CiHeart className={'cursor-pointer'} onClick={() => handleAddToWishList()}/> }
                                        <FaRegShareSquare/>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={'mt-16'}>
                        <div className={'flex items-center justify-center mb-8'}>
                            <button className={`${select == 0 && 'bg-gray-200'} px-4 py-2 rounded-xl`}
                                    onClick={() => setSelect(0)}>Description
                            </button>
                            <button className={`${select == 1 && 'bg-gray-200'} px-4 py-2 rounded-xl`}
                                    onClick={() => setSelect(1)}>Customer Reviews
                            </button>
                        </div>
                        <div>
                            {
                                select === 0 &&
                                <>
                                    <div className={'max-h-[500px] overflow-y-scroll'}>
                                        <p className={'text-gray-400 text-xl shortcut'}>{product.description}</p>
                                    </div>
                                    <div className={'mt-16'}>
                                        <h3 className={'text-4xl font-bold mb-8'}>Related Products</h3>
                                        <div className={'grid grid-cols-6 gap-4'}>
                                            {/*<Item />*/}
                                            {/*<Item />*/}
                                            {/*<Item />*/}
                                            {/*<Item />*/}
                                            {/*<Item />*/}
                                            {/*<Item />*/}
                                        </div>
                                    </div>
                                </>
                            }
                            {
                                select == 1 &&
                                <>
                                    {
                                        isLogin ?
                                            <UploadComment/>
                                            :
                                            <>
                                                <div className={'flex border-2 border-dotted h-[200px] items-center justify-center'}>
                                                    <button className={'border-2 bg-green-500 text-white font-bold border-green-500 px-4 py-2 hover:bg-white hover:text-green-500'} onClick={() => navigate('/login')}>LOGIN</button>
                                                </div>
                                            </>
                                    }
                                </>
                            }
                        </div>
                    </div>
                </div>
                <div className={'mt-16'}>
                    <InfoDownload/>
                </div>
            </div>
        </Spin>
    );
};

export default DetailProduct;