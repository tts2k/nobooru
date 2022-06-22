import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { enableNavbar } from "../../features/navbar/navbarSlice";
import Sidebar from "../../components/Sidebar";
import Gallery from "../../components/Gallery";
import api from "../../utils/api";

import "./styles.scss";

export default function BrowsePage() {
  const dispatch = useDispatch();
  dispatch(enableNavbar());

  const [data, setData] = useState({});
  const [tags, setTags] = useState({});
  const [types, setTypes] = useState({});

  const getLatest = async () => {
    //Get data from api
    const res = await api.post.latest();
    const data = res.data;
    setData(data);

    //Types
    const typeMap = {};

    //Tags
    const copyrightMap = {};
    const characterMap = {};
    const normalMap = {};

    data.posts.forEach(post => {
      // map type
      typeMap[post.type] = typeMap[post.type] + 1 || 1;

      //map tags
      post.tags.forEach(tag => {
        if (tag.namespace === "copyright")
          copyrightMap[tag.name] = copyrightMap[tag.name] + 1 || 1;
        else if (tag.namespace === "character")
          characterMap[tag.name] = characterMap[tag.name] + 1 || 1;
        else
          normalMap[tag.name] = normalMap[tag.name] + 1 || 1;
      });
    });

    setTags({...tags, normal: normalMap, character: characterMap, copyright: copyrightMap });
    setTypes(typeMap);
  }

  useEffect(() => {
    getLatest();
  }, []);

  return (
    <div className="content">
      <Sidebar tags={ tags } types={ types }/>
      <Gallery posts={ data.posts } />
    </div>
  )
}
