import axios from 'axios'
// Instance là dùng để gọi api trong quá axios (thay vì sử dụng axios gọi api thì giờ dùng instance qua cơ chế axios để gọi api)
const instance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URI,
});

/* Thêm một bộ đón chặn request ( nghĩa là trước khi thực hiện chuyển thông tin 
api với server thì chạy thực hiện các lệnh dưới đây trước) */
instance.interceptors.request.use(function (config) {
  // Làm gì đó trước khi request dược gửi đi tới server
  // 
  let localStorageData = window.localStorage.getItem('persist:shop/user')
  // const jsonAccessToken = JSON.parse(localStorageData).token
  // const accessToken = jsonAccessToken.slice(1, jsonAccessToken.length - 1)
  // console.log(accessToken);
  // if (accessToken) {
  //   config.headers["Authorization"] = `Bearer ${accessToken}`;
  //   return config;
  // }
  if(localStorageData && typeof localStorageData === 'string') {
      localStorageData = JSON.parse(localStorageData) //1 là lấy toán bộ data và format thành json
      const accessToken = JSON.parse(localStorageData?.token) // 2 vào trong data và thiết lập token thành chuỗi json
      console.log(accessToken);
      // Phải thêm Bearer là quy ước dùng để đăng nhập token
      config.headers = { Authorization: `Bearer ${accessToken}`}
      return config;
  }
  else {
    return config;
  } 
}, function (error) {
  // Làm gì đó với lỗi request
  return Promise.reject(error);
});

/* Thêm một bộ đón chặn response (nghĩa là trước khi nhận kết quả từ backend trả về 
thì sẽ phải thực hiện đoạn code dưới đây trước) */
instance.interceptors.response.use(function (response) {
  // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
  // Làm gì đó với dữ liệu response
  return response.data;
}, function (error) {
  // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
  // Làm gì đó với lỗi response
  return error.response.data;
});

export default instance