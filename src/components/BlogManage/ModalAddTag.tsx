import {message, Modal} from "antd";
import {useNavigate} from "react-router-dom";
import {addTag} from "../../Helper/Helper.ts";

interface Tag{
    key : number;
    tag : string;
}


interface Props {
    item : Tag,
    setItem : Function,
    dataTagRender : Tag[],
    setDataTagRender : Function,
    open : boolean,
    setOpen : Function,
    loadingModal : boolean,
    setLoadingModal : Function,
    action : string,
}

const ModalAddTag = ( props :  Props) => {

    const {item, setItem, action , dataTagRender, setDataTagRender, open, setOpen, loadingModal, setLoadingModal} = props;
    const navigate =  useNavigate();

    const handleSubmit = async () => {

        if( localStorage.getItem("accessToken") == null ){
            message.error("Token expired!!");
            navigate("/login");
            return;
        }

        setLoadingModal(true);
        const response = await addTag(item.key, item.tag, localStorage.getItem("accessToken"));
        setLoadingModal(false);
        console.log(response)
        if( response.status === 200 ){
            if( action == "UPDATE"){
                setDataTagRender(
                    dataTagRender.map( d => {
                        if(d.key === response.data.key){
                            return {
                                ...response.data
                            }
                        }
                        return d;
                    })
                )
            }else{
                setDataTagRender([
                    response.data,
                    ...dataTagRender
                ])
            }
            setOpen(false);
        }else {
            message.error(response.message);
        }
    }

    const handleChangeTag = (e) => {
        setItem({
            ...item,
            tag : e.target.value,
        })
    }

    return (
        <Modal
            title={<p
                className={'font-bold text-green-500'}>{action === 'ADD' ? "Add Tag" : "Edit Tag With ID = " + item.key}</p>}
            footer={
                <div className={'flex gap-2 justify-end'}>
                    { action == "UPDATE" && <button onClick={() => handleSubmit()}
                             className={'bg-red-500 text-white px-2 py-1 rounded'}>DELETE</button>}
                    <button onClick={() => handleSubmit()}
                            className={'bg-green-500 text-white px-2 py-1 rounded'}> {action === "ADD" ? "Add Product" : "Save Product"}</button>
                </div>
            }
            centered
            width={300}
            loading={loadingModal}
            open={open}
            onCancel={() => setOpen(false)}
        >
            <div className={'flex gap-4 py-4'}>
                <label className={'font-bold'}>Tag :</label>
                <input value={item.tag} onChange={(e) => handleChangeTag(e)}
                       className={'border-0 outline-0 border-b-2 border-green-500'}/>
            </div>
        </Modal>
    );
};

export default ModalAddTag;