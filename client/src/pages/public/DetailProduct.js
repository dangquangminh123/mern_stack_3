import React, { useCallback, useEffect, useState } from "react";
import { apiGetDetailsProducts, apiGetProducts  } from "../../apis";
import { useParams } from "react-router-dom";
import {
  Breadcrumd,
  Button,
  SelectQuantity,
  ProductExtraInfoItem,
  ProductInfomation,
  CustomSlider
} from "../../components";
import ReactImageMagnify from "react-image-magnify";
import Slider from "react-slick";
import {
  formatPrice,
  formatMoney,
  renderStarFromNumber,
} from "../../ultils/helpers";
import { productExtraInfomation } from "../../ultils/contants";
import DOMPurify from 'dompurify';

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const DetailProducts = () => {
  const { pid, title, category } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState(null);
  const [update, setUpdate] = useState(false);

  const fetchProductData = async () => {
    const response = await apiGetDetailsProducts(pid);
    if (response.success) {
      setProduct(response.productData);
      setCurrentImage(response.productData?.thumb);
    }
  };

  const fetchProducts = async () => {
    const response = await apiGetProducts({category})
    if (response.success) setRelatedProducts(response.products)
  }

  useEffect(() => {
    if (pid) {
      fetchProductData();
      fetchProducts();
    }
    window.scrollTo(0, 0)
  }, [pid]);

  useEffect(() => {
    if(pid) fetchProductData()
  }, [update])

  const rerender = useCallback(() => {
    setUpdate(!update)
  }, [update])

  const handleQuantity = useCallback((number) => {
      if (!Number(number) || Number(number) < 1) {
        return;
      } else {
        setQuantity(number);
      }
    },
    [quantity]
  );

  const handleChangeQuantity = useCallback(
    (flag) => {
      // Dấu + đằng trước prev là để biết biến prev là số thực thi tính toán chứ không phải cộng thêm chuỗi
      if (flag === "minus" && quantity === 1) return;
      if (flag === "minus") setQuantity((prev) => +prev - 1);
      if (flag === "plus") setQuantity((prev) => +prev + 1);
    },
    [quantity]
  );


  const handleClickImage = (e, el) => {
    e.stopPropagation();
    setCurrentImage(el)
  }

  return (
    <div className="w-full">
      <div className="h-[81px] flex justify-center items-center bg-gray-100">
        <div className="w-main">
          <h3 className="font-semibold">{title}</h3>
          <Breadcrumd title={title} category={category} />
        </div>
      </div>
      <div className="w-main m-auto mt-4 flex">
        <div className="flex flex-col gap-4 w-2/5">
          <div className="w-[458px] h-[458px] border flex items-center overflow-hidden">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "Images Thumb",
                  isFluidWidth: true,
                  src: currentImage,
                },
                largeImage: {
                  src: currentImage,
                  width: 1800,
                  height: 1500,
                },
              }}
            />
          </div>
          {/* <img
            src={product?.images}
            alt="Product"
            className="h-[458px] w-[458px] border object-cover"
          /> */}
          <div className="w-[458px]">
            <Slider
              className="image-slider flex gap-2 justify-between"
              {...settings}
            >
              {product?.images?.map((el) => (
                <div className="flex-1" key={el}>
                  <img
                    onClick={(e) => handleClickImage(e, el)}
                    src={el}
                    alt="sub-product"
                    className="h-[143px] w-[143px] cursor-pointer border object-cover"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className="border w-2/5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[30px] font-semibold">{`${formatMoney(
              formatPrice(product?.price)
            )} VNĐ`}</h2>
            <span className="text-sm text-main">{`Kho: ${product?.quantity}`}</span>
          </div>
          <div className="flex items-center gap-1">
            {renderStarFromNumber(product?.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
            <span className="text-sm text-main italic">{`Đã bán: ${product?.sold} sản phẩm`}</span>
          </div>
          <ul className="list-square text-sm text-gray-500 pl-4">
            {product?.description?.length > 1 && product?.description?.map(el => (<li className='leading-6' key={el}>{el}</li>))}
            {product?.description?.length === 1 && <div className='code text-sm line-clamp-[8] mb-7'
              dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(product?.description[0])}}></div>}
            {/* {product?.description?.map((el) => (
              <li className="leading-6" key={el}>
                {el}
              </li>
            ))} */}
          </ul>
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <span className="font-semibold">Quantity</span>
              <SelectQuantity
                quantity={quantity}
                handleQuantity={handleQuantity}
                handleChangeQuantity={handleChangeQuantity}
              />
            </div>
            <Button fw>Add To Cart</Button>
          </div>
        </div>
        <div className="w-1/5 pl-4">
          {productExtraInfomation?.map((el) => (
            <ProductExtraInfoItem
              key={el.id}
              title={el.title}
              icon={el.icon}
              sub={el.sub}
            />
          ))}
        </div>
      </div>
      <div className='w-main m-auto mt-8'>
          <ProductInfomation
            pid={product?._id} 
            nameProduct={product?.title} 
            totalRatings={product?.totalRatings} 
            ratings={product?.ratings}
            rerender={rerender}
          />
      </div>
      <div className='w-main m-auto mt-8'>
          <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>ORDER CUSTOMER ALSO LIKED</h3>
          <CustomSlider normal={true} products={relatedProducts}/>
      </div>
      <div className="h-[100px] w-full"></div>
    </div>
  );
};

export default DetailProducts;
