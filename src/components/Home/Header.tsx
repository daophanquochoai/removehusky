import  {useContext, useEffect, useState} from 'react';
import { Dropdown, Space} from 'antd';
import type { MenuProps } from 'antd';
import {DownOutlined} from '@ant-design/icons';
import {MdOutlineAccountCircle} from "react-icons/md";
import {FiHeart} from "react-icons/fi";
import {TiShoppingCart} from "react-icons/ti";
import {IoMdSearch} from "react-icons/io";
import {useNavigate} from "react-router-dom";
import {CommonContext} from "../../context/CommonContext.tsx";
import {getAllCategory} from "../../Helper/Helper.ts";
import {toast} from "react-toastify";
import MyAccount from "./MyAccount.tsx";
import MyCart from "./MyCart.tsx";


type Props = {
    state : number
}


const Header = (props : Props) => {
    const [open, setOpen] = useState(false);
    const [openCart, setOpenCart]  = useState<boolean>(false);

    // bien
    const navigation = useNavigate();
    const {isLogin, setInfo, setSearch, setIsLogin, setCategory} = useContext(CommonContext);
    const [searchValue, setSearchValue] = useState<string>('');

    const [items, setItems] = useState<MenuProps[]>([]);

    const showDrawer = () => {
        setOpen(true);
    };
    const showDrawerCart = () => {
        setOpenCart(true);
    };

    const onClose = () => {
        setOpen(false);
    };


    const handleLogout = () => {
        setIsLogin(false);
        localStorage.removeAll();
        setInfo({})
        navigation('/login');
    }

    const handleClickCategory = (key : number) => {
        setCategory(key);
        navigation('/product')
        scroll(0,500)
    }
    //
    // const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);
    //
    //

    useEffect(() => {

        const fetchCategogy = async () => {
            const data = await getAllCategory();
            if( data.hasOwnProperty('code') && data.code === "ERR_NETWORK"){
                toast.error("Product don't loading!");
                return;
            }
            if( data.status === 200 ){
                const itemList = [];
                data.data.forEach( (d,index) => {
                    itemList.push(
                        {
                            key: d.key,
                            label: <button onClick={() => handleClickCategory(d.key)}>{d.categoryTitle}</button>,
                        },
                    )
                })
                setItems(itemList)
            }
            else{
                toast.error(data.message)
            }
        }
        fetchCategogy();

    },[]);
    return (
       <div className={'h-[100px]'}>
           <div className={"px-[10%] pt-6 pb-4 fixed z-20 bg-white w-full top-0 right-0 shadow-bottom"}>
               {/* 1 */}
               <div className={`flex justify-between border-b-2 p-2 items-center`}>
                   <div onClick={ () => {navigation('/'); scroll(0,0)}} className={'cursor-pointer'}>
                       <img src={"https://demo.templatesjungle.com/foodfarm/images/logo.svg"} alt={"icon"}/>
                   </div>
                   <div className={'flex justify-between bg-gray_primary items-center flex-1 mx-[5%] p-2 rounded-2xl'}>
                       <Dropdown menu={{ items }} className={'p-2 text-gray-400 cursor-pointer'}>
                           <a onClick={(e) => e.preventDefault()}>
                               <Space>
                                   <p>All Categories</p>
                                   <DownOutlined />
                               </Space>
                           </a>
                       </Dropdown>
                       <input value={searchValue} onChange={e=> setSearchValue(e.target.value)} className={'text-xl p-1 outline-none text-gray-300 flex-1 mx-20 bg-gray_primary'} placeholder={"Search more than 200 products"}/>
                       <IoMdSearch className={'text-3xl cursor-pointer text-gray-200 text-end'} onClick={ () => {
                           setSearch(searchValue)
                           navigation('/product');
                       }}/>
                   </div>
                   {
                       !isLogin ?
                           <div className={'flex items-center justify-center gap-2'}>
                               <button className={'bg-green_primary px-4 py-2 text-white'} onClick={()=> navigation('/login')}>Sign In</button>
                               <button className={'bg-green_primary px-4 py-2 text-white'} onClick={()=> navigation('/register')}>Sign Up</button>
                           </div>
                           :
                           <>
                               <div className={'flex gap-4 items-center text-3xl'}>
                                   <div className={'relative group cursor-pointer'}>
                                       <MdOutlineAccountCircle/>
                                       <div className={'group-hover:block hidden absolute z-[9] right-[-100%] dropdown-menu text-base bg-green_primary'}>
                                           <div className={'flex flex-col w-[150px]'}>
                                               <button className={'p-2 text-white hover:bg-white hover:text-green_primary transition-all duration-300 cursor-pointer'} onClick={showDrawer}>My Account</button>
                                               <button className={'p-2 text-white hover:bg-white hover:text-green_primary transition-all duration-300 cursor-pointer'} onClick={showDrawerCart}>My Order</button>
                                               <button className={'p-2 text-white hover:bg-white hover:text-green_primary transition-all duration-300 cursor-pointer'} onClick={() => handleLogout()}>Logout</button>
                                           </div>
                                       </div>
                                   </div>
                                   <FiHeart className={'cursor-pointer'} onClick={() => {
                                       navigation('/wishlist')
                                       scroll(0,0)
                                   }}/>
                                   <TiShoppingCart className={'cursor-pointer'} onClick={() => {
                                       scroll(0,0);
                                       navigation('/cart')
                                   }}/>
                               </div>
                           </>
                   }
               </div>
               {/* 2 */}
               <div
                   className={`flex ${props.state == 1 ? 'h-0 overflow-hidden' : ''} transition-all duration-700 mt-2`}>
                   <div className={'bg-green_primary p-4'}>
                       <p className={'text-xl font-bold text-white'}>Fruits & Vegetables</p>
                   </div>
                   <div className={'p-4 cursor-pointer hover:bg-green_primary  text-gray-400 hover:hover:text-white'}
                        onClick={() => navigation('/product')}>
                       <p className={'font-bold'}>All Product</p>
                   </div>
                   <div className={'p-4 cursor-pointer hover:bg-green_primary group'}
                        onClick={() => navigation('/blog')}>
                       <p className={'font-bold  text-gray-400 group-hover:text-white'}>Recent Blogs</p>
                   </div>
               </div>
           </div>
           <MyAccount open={open} onClose={onClose}/>
           <MyCart open={openCart} onClose={setOpenCart}/>
       </div>
    );
};

export default Header;