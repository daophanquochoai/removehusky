import React, {useEffect, useState} from "react";
import {
    createNewProduct,
    deleteProductById,
    getAllCategory,
    getProductByProductId,
    getProductWithOption
} from "../Helper/Helper.ts";
import {toast} from "react-toastify";
import {
    GetProp,
    Image, message,
    Modal,
    Pagination,
    Popconfirm,
    Select,
    Table,
    TableProps,
    Upload,
    UploadFile,
    UploadProps
} from "antd";
import {SiQuicklook} from "react-icons/si";
import {PlusOutlined} from "@ant-design/icons";

interface Product{
    id : number;
    title : string;
    price : number;
    priceOld : number;
    image : string;
    rate : number;
    selled : string;
    quantity : number;
}

type Category = {
    value : number;
    label : string;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface Item {
    productId: number;
    productTitle: string;
    imageUrl: string;
    imageUrl1: string;
    imageUrl2: string;
    imageUrl3 : string;
    priceUnit : number;
    priceOld : number;
    quantity : number;
    description: string;
    unit : string;
    categoryId : number;
}

const initItem : Item = {
    productId : 0,
    productTitle: '',
    imageUrl: '',
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3 : '',
    priceUnit : 0,
    priceOld : 0,
    quantity : 0,
    description: '',
    unit : '',
    categoryId : 1
}
const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const ProductManage = () => {
    // confirm
    const [openConfirm, setOpenConfirm] = useState<number>(0);
    //modal
    const [previewOpen, setPreviewOpen] = useState(false);
    const [reload, setReload] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState('');
    const [loadingModal, setLoadingModal] = useState<boolean>(false)
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [itemForm, setItemForm] = useState<Item>(initItem);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>{
        setFileList( newFileList.map( item => {
           if( item.hasOwnProperty('response')){
               return {
                   uid: item.uid,
                   name: item.name,
                   status: 'done',
                   url: item.response,
               }
           }
           return item;
       }))
    }
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );
    //var
    const [loadingProduct, setLoadingProduct] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [dataProduct, setDataProduct] = useState<Product[]>([]);
    const [search, setSearch] = useState<string>('')
    const [category, setCategory] = useState<Category[]>([])
    const [loadingCategory, setLoadingCategory] = useState<boolean>(false);
    const [categoryChoose, setCategoryChoose] = useState<number>(0);
    const [searchAccept, setSearchAccept] = useState<string>('');

    //modal
    const [open, setOpen] = useState<boolean>(false)
    const [action, setAction] = useState<string>('ADD')

    //useEffect
    useEffect(() => {
        const fetchProduct = async () => {
            setLoadingProduct(true);
            const response = await  getProductWithOption(page-1,categoryChoose, 0, 0, 0,0, searchAccept);
            setLoadingProduct(false);
            if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
                toast.error("Product don't loading!");
                return;
            }
            if( response.status === 200 ){
                setTotalPage(response.data.totalPage);
                const dateItem: Product[] = [];
                response.data.product.forEach( (product) =>
                    dateItem.push(
                        {
                            id : product.productId,
                            title : product.productTitle,
                            price : product.priceUnit,
                            priceOld : product.priceOld,
                            image : product.imageUrl,
                            rate : product.rate,
                            selled : product.selled > 1000 ? product.selled/1000 + 'k' : product.selled,
                            quantity : product.quantity
                        }
                    )
                )
                setDataProduct(dateItem)
            }else{
                toast.error(response.message)
            }
        }
        fetchProduct()
    }, [page, categoryChoose, searchAccept, reload]);

    useEffect(() => {
        const fetchCategory = async () => {
            setLoadingCategory(true);
            const response = await getAllCategory();
            setLoadingCategory(false);
            if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
                toast.error("Product don't loading!");
                return;
            }
            if( response.status === 200 ){
                const arr: Category[] = [{
                    value : 0,
                    label : 'Tất cả'
                }];
                response.data.forEach( (item) =>
                    arr.push(
                        {
                            value : item.key,
                            label : item.categoryTitle
                        }
                    )
                )
                if(  response.data.length > 0 ) setItemForm({...itemForm, categoryId : response.data[0].key})
                setCategory(arr)
                setAction("EDIT")
            }else{
                toast.error(response.message)
            }
        }
        fetchCategory()
    }, []);

    // function
    const handleEdit = async ( id : string) => {
        setLoadingModal(true);
        const response = await getProductByProductId(id,'');
        setLoadingModal(false);
        if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
            toast.error("NETWORK DON'T CONNECT");
            return;
        }
        if( response.status === 200 ){
            setItemForm({
                productId : response.data.productId,
                productTitle: response.data.productTitle,
                imageUrl: '',
                imageUrl1: '',
                imageUrl2: '',
                imageUrl3 : '',
                priceUnit : response.data.priceUnit,
                priceOld : response.data.priceOld,
                quantity : response.data.quantity,
                description: response.data.description,
                unit : response.data.unit,
                categoryId : response.data.categoryId
            })
            const arr: UploadFile[] = []
            if( response.data.imageUrl != null ){
                arr.push({
                    uid: "1",
                    name: "image1",
                    status: 'done',
                    url: response.data.imageUrl
                })
            }
            if( response.data.imageUrl1){
                arr.push({
                    uid: "2",
                    name: "image2",
                    status: 'done',
                    url: response.data.imageUrl1
                })
            }
            if( response.data.imageUrl2){
                arr.push({
                    uid: "3",
                    name: "image3",
                    status: 'done',
                    url: response.data.imageUrl3
                })
            }
            if( response.data.imageUrl3){
                arr.push({
                    uid: "4",
                    name: "image4",
                    status: 'done',
                    url: response.data.imageUrl3
                })
            }
            setFileList(arr);
            setOpen(true)
        }else{
            toast.error(response.message)
        }
    }

    // confirm
    const confirm = async ( id : number) => {
        setOpenConfirm(0)
        if( localStorage.getItem("accessToken") == null ){
            message.error("SESSION EXPIRED!!!")
            return;
        }
        const response = await deleteProductById(id, localStorage.getItem("accessToken"));
        if( response.data.status === "ACCEPTED"  ){
            setReload(!reload);
            setPage(1);
            message.success("DELETE SUCCESS")
        }else{
            toast.error(response.message)
        }
    };
    const cancel = () => {
        setOpenConfirm(0);
    };
    //
    const columns : TableProps<Product>['columns'] = [
        {
            title: <p className={'text-green-600 font-bold'}>Product</p>,
            key: 'name',
            render : (item : Product)=> (
                <div className={'flex items-center justify-center gap-4'} key={item.id}>
                    <img src={item.image} alt={"icon"} className={'w-[40px] h-[40px]'}/>
                    <p>{item.title}</p>
                </div>
            ),
            align : "center"
        },
        {
            title: <p className={'text-green-600 font-bold'}>Price</p>,
            key: 'price',
            render: (item: Product) => <p key={item.id} className={'text-purple-600 font-bold'}>{item.price.toLocaleString()}đ</p>,
            align: "center"
        },
        {
            title: <p className={'text-green-600 font-bold'}>Discount</p>,
            key: 'discount',
            render: (item: Product) => <p  key={item.id}
                                           className={'text-pink-600 font-bold'}>{((item.priceOld - item.price) / item.priceOld * 100).toFixed(0) == 'NaN' ? 0 : ((item.priceOld - item.price) / item.priceOld * 100).toFixed(0)} %</p>,
            align: "center"
        },
        {
            title: <p className={'text-green-600 font-bold'}>Stock</p>,
            key: 'stock',
            render: (item: Product) => <p key={item.id}  className={'text-red-500 font-bold'}>{item.quantity}</p>,
            align: "center"
        },
        {
            title: <p className={'text-green-600 font-bold'}>Action</p>,
            key: 'action',
            render: (item: Product) => (
                <div key={item.id} className={'flex flex-col gap-2'}>
                    <button className={'bg-yellow-500 border-2 border-yellow-500 text-white font-bold px-4 py-1 rounded'} onClick={() => handleEdit(item.id)}>Edit</button>
                    <Popconfirm
                        title="Delete product"
                        description={`Are you sure to delete ${item.title}?`}
                        open={openConfirm == item.id}
                        onConfirm={() => confirm(item.id)}
                        onCancel={cancel}
                        okText="Delete"
                        cancelText="Cancel"
                    >
                        <button className={'bg-red-500 border-2 border-red-500 text-white font-bold px-4 py-1 rounded'}
                                onClick={() => setOpenConfirm(item.id)}>Delete
                        </button>
                    </Popconfirm>
                </div>
            ),
            align: "center"
        }
    ];

    const handleAddProduct = async () => {
        var itemTemp : Item = itemForm;
        if(  fileList[0] != undefined){
            itemTemp.imageUrl = fileList[0].url;
        }
        if(  fileList[1] != undefined){
            itemTemp.imageUrl1 = fileList[1].url;
        }
        if(  fileList[2] != undefined){
            itemTemp.imageUrl2 = fileList[2].url;
        }
        if(  fileList[3] != undefined){
            itemTemp.imageUrl3 = fileList[3].url;
        }
        if( localStorage.getItem("accessToken") == null ) {
            toast.warning("SESSION EXPIRED!!")
            return;
        }
        setLoadingModal(true);
        const response = await createNewProduct(
            itemTemp.productId,
            itemTemp.productTitle,
            itemTemp.imageUrl,
            itemTemp.imageUrl1,
            itemTemp.imageUrl2,
            itemTemp.imageUrl3,
            itemTemp.priceUnit,
            itemTemp.priceOld,
            itemTemp.quantity,
            itemTemp.description,
            itemTemp.unit,
            itemTemp.categoryId,
            localStorage.getItem("accessToken")
        )
        setLoadingModal(false);
        console.log(action)
        if( response.hasOwnProperty('code') && response.code === "ERR_NETWORK"){
            toast.error("NETWORK DON'T CONNECT!!!");
            return;
        }
        if( response.status === 200 ){
            setItemForm(initItem);
            setOpen(false);
            if( action == "ADD") {
                toast.success("ADD PRODUCT SUCCESS!!!");
            }else {
                toast.success("UPDATE PRODUCT SUCCESS!!!");
            }
            setReload(!reload);
        }else{
            toast.error(response.message)
        }
        
        
    }

    const handleAddClick = () => {
        setOpen(true);
        setAction("ADD");
        setItemForm(initItem)
        setFileList([])
    }


    return (
        <>
            <div>
                <div className={'flex justify-between mb-4'}>
                    <button className={'bg-green-500 text-white border-2 border-green-500 hover:text-green-500 hover:bg-white px-4 py-1 font-bold rounded'} onClick={() => handleAddClick()}>Add</button>
                    <div className={'flex gap-4'}>
                        <div>
                            <Select
                                loading={loadingCategory}
                                showSearch
                                value={categoryChoose}
                                onChange={(e) => { setCategoryChoose(e) ;setPage(1)}}
                                style={{ width: 200 }}
                                placeholder="Search to Select"
                                optionFilterProp="label"
                                filterSort={(optionA, optionB) =>
                                    (optionA?.value ?? '').toString().localeCompare((optionB?.value ?? '').toString())
                                }
                                options={category}
                            />

                        </div>
                        <div className={'flex items-center gap-4'}>
                            <input className={'outline-0 border-0 border-b-2 border-green-500'} value={search}
                                   onChange={(e) => setSearch(e.target.value)}/>
                            <SiQuicklook className={'text-green-600 text-2xl cursor-pointer'} onClick={() =>{ setSearchAccept(search); setPage(1)}}/>
                        </div>
                    </div>
                </div>
                <div>
                    <Table<Product> scroll={{y:400}} columns={columns}  dataSource={dataProduct.map((item) => ({ ...item, key: item.id }))} pagination={false} loading={loadingProduct}/>;
                    <div className={'flex justify-center'}>
                        {dataProduct.length > 0 &&
                            <Pagination current={page} total={totalPage * 8} onChange={(e)=> setPage(e)} responsive={true}/>}
                    </div>
                </div>
            </div>
            <Modal
                title={<p className={'text-xl font-bold text-green-500'}>{action == 'ADD' ? "Add Product" : "Edit Product With ID = " + itemForm.productId}</p>}
                footer={
                    action == 'ADD' ?
                        <button onClick={() => handleAddProduct()} className={'bg-green-500 text-white px-3 py-2 rounded'}>Add Product</button>
                        :
                        <button onClick={() => handleAddProduct()}  className={'bg-green-500 text-white px-3 py-2 rounded'}>Save Product</button>
                }
                centered
                width={1000}
                loading={loadingModal}
                open={open}
                onCancel={() => setOpen(false)}
            >
                <div className={'gap-4 flex flex-col'}>
                    <div className={'grid grid-cols-[1fr_2fr] items-end gap-4'}>
                        <div className={'flex flex-col gap-2'}>
                            <label>Product Name :</label>
                            <input className={'border-b-2 border-green-500 outline-0'} value={itemForm.productTitle}
                                   onChange={e => setItemForm({...itemForm, productTitle: e.target.value})}/>
                        </div>
                        <div>
                            <Upload
                                action="http://localhost:8080/api/image"
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                                maxCount={4}
                                name={"avatar"}
                            >
                                {fileList.length >= 4 ? null : uploadButton}
                            </Upload>
                            {previewImage && (
                                <Image
                                    wrapperStyle={{display: 'none'}}
                                    preview={{
                                        visible: previewOpen,
                                        onVisibleChange: (visible) => setPreviewOpen(visible),
                                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                    }}
                                    src={previewImage}
                                />
                            )}
                        </div>
                    </div>
                    <div className={'flex items-center gap-4 justify-between'}>
                        <div className={'flex flex-col gap-2'}>
                            <label>Stock :</label>
                            <input className={'border-b-2 border-green-500 outline-0'} value={itemForm.quantity}
                                   onChange={e => setItemForm({...itemForm, quantity: e.target.value})}/>
                        </div>
                        <div className={'flex flex-col gap-2'}>
                            <label>Price :</label>
                            <input className={'border-b-2 border-green-500 outline-0'} value={itemForm.priceUnit}
                                   onChange={e => setItemForm({...itemForm, priceUnit: e.target.value})}/>
                        </div>
                        <div className={'flex flex-col gap-2'}>
                            <label>Original Price :</label>
                            <input className={'border-b-2 border-green-500 outline-0'} value={itemForm.priceOld}
                                   onChange={e => setItemForm({...itemForm, priceOld: e.target.value})}/>
                        </div>
                        <div className={'flex flex-col gap-2'}>
                            <label>Unit :</label>
                            <input className={'border-b-2 border-green-500 outline-0'} value={itemForm.unit}
                                   onChange={e => setItemForm({...itemForm, unit: e.target.value})}/>
                        </div>
                    </div>
                    <div>
                        <Select
                            loading={loadingCategory}
                            showSearch
                            value={itemForm.categoryId}
                            onChange={(e) => setItemForm({...itemForm, categoryId: e})}
                            style={{width: 200}}
                            placeholder="Search to Select"
                            optionFilterProp="label"
                            filterSort={(optionA, optionB) =>
                                (optionA?.value ?? '').toString().localeCompare((optionB?.value ?? '').toString())
                            }
                            options={category.filter(item => item.value!= 0)}
                        />

                    </div>
                    <div className={'flex flex-col gap-2'}>
                        <label>Description :</label>
                        <textarea className={'border-2 border-green-500 outline-0 p-2'} value={itemForm.description}
                                  onChange={e => setItemForm({...itemForm, description: e.target.value})}/>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ProductManage;