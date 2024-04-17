import React, { useEffect, useState } from "react";
import { apiGetProducts } from "../apis/product";
import { Product, CustomSlider } from "./";
import { getNewProducts } from "../store/products/asyncActions";
import { useDispatch, useSelector } from 'react-redux';
import Slider from "react-slick";

const tabs = [
  { id: 1, name: "Best Sellers" },
  { id: 2, name: "New Arrivals" },
];

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll:1 ,
};

const BestSeller = () => {
  const [bestSellers, setBestSellers] = useState(null);
  
  const [activedTab, setActivedTab] = useState(1);
  const [products, setProducts] = useState(null);
  const dispatch = useDispatch();
  const {newProducts} = useSelector(state => state.products)

  const fetchProducts = async () => {
    // dấu - là sắp xếp giảm dần -> products có sold cao thì đứng đầu
    const response = await apiGetProducts({ sort: "-sold" })
    if (response.success) {
      setBestSellers(response.products);
      setProducts(response.products);
    }
  };
  useEffect(() => {
    fetchProducts();
    dispatch(getNewProducts());
  }, []);

  useEffect(() => {
    if (activedTab === 1) setProducts(bestSellers);
    if (activedTab === 2) setProducts(newProducts);
  }, [activedTab]);

  return (
    <div>
      <div className="flex text-[20px] ml-[-32px]">
        {tabs.map((el) => (
          <span
            key={el.id}
            className={`font-semibold uppercase px-8 border-r cursor-pointer text-gray-400 ${
              activedTab === el.id ? "text-gray-900" : ""
            }`}
            onClick={() => setActivedTab(el.id)}
          >
            {el.name}
          </span>
        ))}
      </div>
      <div className="mt-4 mx-[-10px] border-t-2 border-main pt-4">
            <CustomSlider products={products} activedTab={activedTab}/>
      </div>
      <div className="w-full flex gap-4 mt-4">
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner2-home2_2000x_crop_center.png?v=1613166657"
          alt="Banner1"
          className="flex-1 object-contain"
        />
        <img
          src="https://digital-world-2.myshopify.com/cdn/shop/files/banner1-home2_2000x_crop_center.png?v=1613166657"
          alt="Banner2"
          className="flex-1 object-contain"
        />
      </div>
    </div>
  );
};

export default BestSeller;