import React, { useEffect, useState, memo } from "react";
import { apiGetProducts } from "../apis/product";
import { Product } from "./";
import Slider from "react-slick";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};
const CustomSlider = ( {products, activedTab, normal} ) => {
  return (
    <>
      {products && <Slider className='custom-slider' {...settings}>
        {products?.map((el, index) => (
          <Product
            key={index}
            pid={el.id}
            productData={el}
            isNew={activedTab === 1 ? true : false}
            normal={normal}
          />
        ))}
        </Slider>}
    </>
  );
};

export default memo(CustomSlider);
