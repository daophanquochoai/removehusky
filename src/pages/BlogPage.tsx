// @ts-ignore
import React, {useEffect, useState} from 'react';
import HeaderBlog from "../components/BlogPage/HeaderBlog.tsx";
import RenderBlog from "../components/BlogPage/RenderBlog.tsx";
import Parallax from "../components/Common/Parallax.tsx";


const BlogPage : React.FC = () => {

    const [searchBlog, setSearchBlog] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("");
    const [pageBlog, setPageBlog] = useState<number>(1);
    const [totalPageBlog, setTotalPageBlog] = useState<number>(1);

    return (
        <div>
            <Parallax path={"BLOG"} image={'https://img.freepik.com/free-vector/flat-horizontal-banner-template-world-vegan-day-celebration_23-2150828514.jpg?size=626&ext=jpg&ga=GA1.1.2008272138.1726272000&semt=ais_hybrid'}/>
            <HeaderBlog
                sortBy={sortBy}
                searchBlog={searchBlog}
                setSearchBlog={setSearchBlog}
                setSortBy={setSortBy}
            />
            <RenderBlog
                searchBlog={searchBlog}
                setSearchBlog={setSearchBlog}
                sortBy={sortBy}
                setSortBy={setSortBy}
                pageBlog={pageBlog}
                setPageBlog={setPageBlog}
                totalPageBlog={totalPageBlog}
                setTotalPageBlog={setTotalPageBlog}/>
        </div>
    );
};

export default BlogPage;