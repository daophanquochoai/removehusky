import Function from "../components/CategoryManage/Function.tsx";
import  {useEffect, useState} from "react";
import {addCategory, deleteCategory, getAllCategory, updateCategory} from "../Helper/Helper.ts";
import {toast} from "react-toastify";
import {message, Popconfirm, Table, TableProps} from "antd";
import ModalPop from "../components/CategoryManage/ModalPop.tsx";

// interface
interface Category {
    key: number;
    categoryTitle: string;
    imageUrl : string;
}

const initItem = {
    key: 0,
    categoryTitle: '',
    imageUrl : ''
}

const CategoryPage = () => {
    // confirm
    const [openConfirm, setOpenConfirm] = useState<number>(0);
    //var
    const [loadingCategory, setLoadingCategory] = useState<boolean>(false);
    const [searchAccept, setSearchAccept] = useState<string>('')
    const [dataSource, setDataSource] = useState<Category[]>([]);
    const [dataCategory, setDataCategory] = useState<Category[]>([])
    const [item, setItem] = useState<Category>(initItem)
    const [action, setAction] = useState<string>("ADD");
    const [open, setOpen] = useState<boolean>(false);
    const [loadingModal, setLoadingModal] = useState<boolean>(false);

    //useEffect
    useEffect(() => {
        const fetchCategory = async () => {
            setLoadingCategory(true);
            const response = await getAllCategory();
            setLoadingCategory(false);
            if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
                toast.error("NETWORK DON'T CONNECT");
                return;
            }
            if( response.status === 200 ){
                setDataSource(response.data)
                setDataCategory(response.data);
            }else{
                toast.error("Product load fail!")
            }
        }
        fetchCategory();
    }, []);

    useEffect(() => {
        setDataCategory(dataSource.filter( item => item.categoryTitle.toLowerCase().includes(searchAccept.toLowerCase()) ))
    }, [searchAccept]);

    const handeAddOrUpdate = async () => {
        if( localStorage.getItem("accessToken") == null){
            message.error("SESSTION EXPIRED");
            return;
        }
        if( action === "ADD"){
            setLoadingModal(true);
            const response = await addCategory(item.categoryTitle,item.imageUrl, localStorage.getItem("accessToken"));
            setLoadingModal(false);
            if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
                toast.error("NETWORK DON'T CONNECT");
                return;
            }
            if( response.status === 200 ){
                const temp : Category = {
                    key : response.data.key,
                    categoryTitle : response.data.categoryTitle,
                    imageUrl : response.data.imageUrl,
                }
                const arr : Category[] = dataSource;
                arr.push(temp)
                setDataSource(arr)
                setDataCategory(arr);
                setItem(initItem)
                setOpen(false);
            }else{
                toast.error(response.message)
            }
        }else{
            setLoadingModal(true);
            const response = await updateCategory(item.key,item.categoryTitle,item.imageUrl, localStorage.getItem("accessToken"));
            setLoadingModal(false);
            if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
                toast.error("NETWORK DON'T CONNECT");
                return;
            }
            if( response.status === 200 ){
                const temp : Category = {
                    key : response.data.key,
                    categoryTitle : response.data.categoryTitle,
                    imageUrl : response.data.imageUrl,
                }
                const arr : Category[] = dataSource;
                arr.map( ca => {
                    if( ca.key == temp.key){
                        ca.categoryTitle = temp.categoryTitle;
                        ca.imageUrl = temp.imageUrl;
                    }
                    return ca;
                })
                setDataSource(arr)
                setDataCategory(arr);
                setItem(initItem)
                setOpen(false);
            }else{
                toast.error(response.message)
            }
        }
    }
    //table columns
    // confirm
    const confirm = async ( id : number) => {
        if( localStorage.getItem("accessToken") == null){
            message.error("SESSTION EXPIRED");
            return;
        }
        setLoadingCategory(true);
        const response = await deleteCategory(id, localStorage.getItem("accessToken"));
        setLoadingCategory(false);
        console.log(response);
        if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
            toast.error("NETWORK DON'T CONNECT");
            return;
        }
        console.log(response)
        if( response.data.status === "ACCEPTED" ){
            var arr : Category[] = dataSource;
            arr = arr.filter(item => item.key !== id)
            setDataSource(arr)
            setDataCategory(arr);
            setOpenConfirm(0)
            message.success("DELETE SUCCESS")
        }else{
            toast.error(response.message)
        }
    };
    const cancel = () => {
        setOpenConfirm(0);
    };
    const handleEdit = async ( id : string) => {
        const itemFilter = dataSource.filter( item => item.key === id).length > 0 ? dataSource.filter( item => item.key == id)[0] : null;
        if( itemFilter == null ){
            message.error("Item not found")
            return;
        }
        setAction("Edit")
        setOpen(true);
        setItem(itemFilter)
    }
    const columns : TableProps<Category>['columns'] = [
        {
            title: <p className={'text-green-600 font-bold'}>ID</p>,
            sorter: (a, b) => a.key - b.key,
            dataIndex: 'key',
            key : 'key',
            align:  'center'
        },
        {
            title: <p className={'text-green-600 font-bold'}>Category Name</p>,
            dataIndex : 'categoryTitle',
            key: 'name',
            sorter: (a, b) => a.categoryTitle.localeCompare(b.categoryTitle),
            align : "center"
        },
        {
            title: <p className={'text-green-600 font-bold'}>Image</p>,
            key: 'imageUrl',
            render : (item : Category)=> (
                <div className={'flex justify-center'}><img src={item.imageUrl} className={'h-[40px] w-[40px]'} alt={'image'}/></div>
            ),
            align: "center"
        },
        {
            title: <p className={'text-green-600 font-bold'}>Action</p>,
            key: 'action',
            width : '20%',
            render : (item : Category)=> (
                <div key={item.key} className={'gap-4 flex justify-center'}>
                    <button
                        className={'bg-yellow-500 border-2 border-yellow-500 text-white font-bold px-4 py-1 rounded'}
                        onClick={() => handleEdit(item.key)}>Edit
                    </button>
                    <Popconfirm
                        title="Delete product"
                        description={`Are you sure to delete ${item.categoryTitle}?`}
                        open={openConfirm == item.key}
                        onConfirm={() => confirm(item.key)}
                        onCancel={cancel}
                        okText="Delete"
                        cancelText="Cancel"
                    >
                        <button className={'bg-red-500 border-2 border-red-500 text-white font-bold px-4 py-1 rounded'}
                                onClick={() => setOpenConfirm(item.key)}>Delete
                        </button>
                    </Popconfirm>
                </div>
            ),
            align: "center"
        },
    ];

    useEffect(() => {

    }, []);
    return (
        <div>
            <Function setSearchAccept={setSearchAccept} setAction={setAction} setOpen={setOpen}/>
            <Table<Category> columns={columns} dataSource={dataCategory} loading={loadingCategory}
                             pagination={{position: ["bottomCenter"], pageSize: 5}}
            />
            <ModalPop action={action} open={open} setOpen={setOpen} item={item} handle={handeAddOrUpdate} setItem={setItem} loadingModal={loadingModal}/>
        </div>
    );
};

export default CategoryPage;