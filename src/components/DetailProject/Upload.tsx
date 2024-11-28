import React, {useState} from 'react';
import {Rate, Upload, UploadFile, UploadProps} from "antd";

const UploadComment : React.FC = () => {

    const [image, setImage] = useState<UploadFile[]>([]);
    const [rating, setRating] = useState<number>(5);
    const [comment, setComment] = useState<string>('');

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setImage(newFileList)
        console.log(image)
    };
    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as FileType);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    return (
        <div>
            <div className={'grid grid-cols-2 gap-4'}>
                <div className={'flex gap-4 items-center border-2 border-gray-300 p-4'}>
                    <div className={'w-[120px] h-[120px] rounded-full overflow-hidden bg-red-500'}>
                        <img src={'https://demo.templatesjungle.com/foodfarm/images/reviewer-1.jpg'} alt={'avatar'} className={'w-full h-full'}/>
                    </div>
                    <div className={'flex flex-col gap-2 flex-1'}>
                        <Rate value={3} disabled />
                        <div className={'flex items-end text-xl text-gray-400'}>
                            <span>Tina Johnson</span>
                            <span>-</span>
                            <span>03/07/2023</span>
                        </div>
                        <div>
                            <p className={'title-shortcut text-gray-400'}>Vitae tortor condimentum lacinia quis vel eros donec ac. Nam at lectus urna duis convallis convallis</p>
                        </div>
                    </div>
                </div>
                <div className={'flex gap-4 items-center border-2 border-gray-300 p-4'}>
                    <div className={'w-[120px] h-[120px] rounded-full overflow-hidden bg-red-500'}>
                        <img src={'https://demo.templatesjungle.com/foodfarm/images/reviewer-1.jpg'} alt={'avatar'} className={'w-full h-full'}/>
                    </div>
                    <div className={'flex flex-col gap-2 flex-1'}>
                        <Rate value={3} disabled />
                        <div className={'flex items-end text-xl text-gray-400'}>
                            <span>Tina Johnson</span>
                            <span>-</span>
                            <span>03/07/2023</span>
                        </div>
                        <div>
                            <p className={'title-shortcut text-gray-400'}>Vitae tortor condimentum lacinia quis vel eros donec ac. Nam at lectus urna duis convallis convallis</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'mt-8'}>
                <h3 className={'text-3xl font-bold mb-4'}>Add a review</h3>
                <div className={'grid grid-cols-3 border-gray_primary border-2 p-4'}>
                    <div className={'flex flex-col gap-2'}>
                        <p>Your rating *</p>
                        <Rate value={rating} onChange={ (e) => setRating(e)}/>
                    </div>
                    <div  className={'flex flex-col gap-2'}>
                        <p>Your image</p>
                        <Upload
                            listType="picture-card"
                            fileList={image}
                            onChange={onChange}
                            onPreview={onPreview}
                        >
                            {!image.length && '+ Upload'}
                        </Upload>
                    </div>
                    <div className={'flex flex-col gap-2'}>
                        <p>Your Review *</p>
                        <input required={true} value={comment} onChange={ (e) => setComment(e.target.value)} className={'py-1 text-xl outline-0 border-2 border-green_primary'}/>
                        <button className={'bg-green_primary py-2 text-white text-xl mt-4 border-green_primary border-2 hover:bg-white hover:text-green_primary'}>SUBMIT</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadComment;