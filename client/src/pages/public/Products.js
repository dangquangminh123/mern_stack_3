import React, { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Breadcrumd, Product, SearchItem } from "../../components";
import { apiGetProducts } from "../../apis";
import Masonry from "react-masonry-css";

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const Products = () => {
  const [products, setproducts] = useState(null);
  const [activeClick, setActiveClick] = useState(null)
  const [params] = useSearchParams()
  const fetchProductsByCategory = async (queries) => {
    const response = await apiGetProducts(queries);
    if(response.success) setproducts(response.products); 
  };


  const { category } = useParams();
  useEffect(() => {
    let param = [];
    // entries tạo các cặp key/value của 1 object thành mảng lồng vào nhau 
    for (let i of params.entries()) param.push(i)
    const queries = {}
    for (let i of params) queries[i[0]] = i[1];
    fetchProductsByCategory(queries);
  }, [params]);

  const changeActiveFitler = useCallback((name) => {
    if(activeClick === name) setActiveClick(null)
    else setActiveClick(name)
  }, [activeClick])
  return (
    <div className="w-full">
      <div className="h-[81px] flex justify-center items-center bg-gray-100">
        <div className="w-main">
          <h3 className="font-semibold uppercase">{category}</h3>
          <Breadcrumd category={category} />
        </div>
      </div>
      <div className="w-main border p-4 flex justify-between mt-8 m-auto">
        <div className="w-4/5 flex-auto flex flex-col gap-3">
          <span className="font-semibold text-sm">Filter By</span>
          <div className="flex items-center gap-4">
            <SearchItem name="price" activeClick={activeClick} changeActiveFitler={changeActiveFitler} type='input'/>
            <SearchItem name="color" activeClick={activeClick} changeActiveFitler={changeActiveFitler}/>
          </div>
        </div>
        <div className="w-1/5 flex">Sort By</div>
      </div>

      <div className="mt-8 w-main m-auto">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid flex mx-[-10px]"
          columnClassName="my-masonry-grid_column"
        >
          {products?.map(el => (
            <Product key={el._id} pid={el.id} productData={el} normal={true} />
          ))}
        </Masonry>
      </div>

      <div className="w-full h-[500px]"></div>
    </div>
  );
};

export default Products;
