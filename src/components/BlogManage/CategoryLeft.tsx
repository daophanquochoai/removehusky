import {useEffect, useState} from "react";
import {Table, TableColumnsType} from "antd";
import {MdManageSearch} from "react-icons/md";
import ModalAddTag from "./ModalAddTag.tsx";

interface Tag{
    key : number;
    tag : string;
}

interface Props {
    categoryType : number;
    setCategoryType : Function;
    dataTag : Tag[];
    loading : boolean;
    setLoading : Function;
    setDataTag : Function;
}

const initTag = {
    key : 0,
    tag  : ""
}

const CategoryLeft = ( props : Props) => {
    //props
    const { categoryType,setCategoryType,dataTag,loading, setLoading, setDataTag} = props;

    //var
    const [dataTagRender, setDataTagRender] = useState<Tag[]>([]);
    const [q, setQ] = useState<string>(""); //search tag
    const [selectRow, setSelectRow] = useState<number[]>([]);

    //modal
    const [open,setOpen] = useState<boolean>(false);
    const [loadingModal, setLoadingModal] = useState<boolean>(false);
    const  [action, setAction] = useState<string>("ADD");
    const [item, setItem] = useState<Tag>({...initTag})

    useEffect(() => {
        setDataTagRender(dataTag)
    }, [dataTag]);
    // search when q change
    useEffect(() => {
        setLoading(true);
        setDataTagRender(dataTag.filter( tag => tag.tag.includes(q) ));
        setLoading(false);
    }, [q]);

    // column
    const columns: TableColumnsType<Tag> = [
        {
            title: 'Id',
            dataIndex: 'key',
            align: 'center'
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            sorter: (a, b) => a.tag.localeCompare(b.tag),
            align: 'center',
        }
    ];

    const rowSelection = {
        // selectRow, // Liên kết với state `selectedRowKeys`
        selectedRowKeys : selectRow,
        onSelect: (record : Tag) => {
            setSelectRow([record.key]);
            setCategoryType(record.key);
        },
        type: "radio", // Chỉ cho phép chọn một dòng
    };

    useEffect(() => {
        if( categoryType == 0 ){
            setSelectRow([])
        }
    }, [categoryType]);

    const handleModal = () => {
        setItem(initTag);
        setAction("ADD")
        setOpen(true);
    }

    return (
        <>
            <div className={'flex flex-col gap-y-6'}>
                <div className={'flex gap-4 items-end justify-between'}>
                    <div className={'font-bold text-base mb-2'}>List Category</div>
                    <div className={'flex gap-4 items-end'}>
                        <input value={q} onChange={(e) => setQ(e.target.value)} className={'border-0 outline-0 p-2 border-b-2 border-green-300'} placeholder={"Search tag"}/>
                        <MdManageSearch className={'text-2xl text-green-500 cursor-pointer'}/>
                    </div>
                </div>
                <Table<Tag> columns={columns} dataSource={dataTagRender} bordered={true}
                            loading={loading}
                            pagination={{position: ["bottomCenter"]}}
                            onRow={ (record) => {
                                return {
                                    onClick: () => {
                                       setItem(record);
                                       setAction("UPDATE");
                                        setOpen(true);
                                    },
                                };
                            }}
                            rowSelection={rowSelection}
                />
                <div className={'flex cursor-pointer'}>
                    <button className={'bg-green-500 flex-1 text-white py-2 font-bold'}
                            onClick={() => handleModal()}>ADD NEW TAG
                    </button>
                </div>
                <ModalAddTag item={item} setItem={setItem} dataTagRender={dataTag} setDataTagRender={setDataTagRender} open={open} setOpen={setOpen} loadingModal={loadingModal} setLoadingModal={setLoadingModal}  action={action}/>
            </div>
        </>
    );
};

export default CategoryLeft;