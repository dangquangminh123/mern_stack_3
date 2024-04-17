const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const sendMail = require("../ultils/sendMail");
const crypto = require("crypto");
const user = require("../models/user");
const makeToken = require('uniqid');

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, mobile } = req.body
  if(!email || !password || !lastname || !firstname || !mobile)
      return res.status(400).json({
        success: false,
        mes: "Missing inputs",
      });
  // Tiếp tục kiểm tra email người dùng đăng ký đã tồn tại hay chưa 
  const user = await User.findOne({ email })
  if(user) throw new Error('User has existed!')
    else {
      const token = makeToken();
      const emailedited =  btoa(email) + "@" + token
      const newUser = await User.create({
        // btoa là hàm mã hóa 
        email: emailedited, password, firstname, lastname, mobile
      })
      if(newUser) {
        // res.cookie('dataRegister', {...req.body, token}, {httpOnly: true, maxAge: 15*60*1000})
        const html = `<h2>Register code:</h2><br/><blockquote>${token}</blockquote>`;
        await sendMail({email, html, subject: 'Xác nhận thành công đăng ký tài khoản digital World!'})
      }
      /* setTimeout này dùng để sau khi người dùng hoàn tất xác thực đăng ký thì lúc đã được giải mã chuỗi ký tự của email
      thì phải xóa đi chuỗi ký tự của email (khi ban đầu mã được hóa) để quá trình đăng ký tránh trường hợp người dùng không chịu 
      xác thực mã token khi đã xong các bước nhập email và password  */
      setTimeout(async() => {
        /* Tìm những email đang ở dạng chuỗi mã hóa và xóa email đó đi, còn những email mà được người dùng đã xác thực thì không 
        phải dạng chuỗi mã hóa mà ở dạng chuỗi giải mã nên sẽ không bị xóa! mục đích việc này là để người dùng phải xác thực mã khi 
        đã điền thông tin email password đầy đủ*/ 
        await User.deleteOne({email: emailedited})
      },[30000])
      return res.json({
        success: true,
        mes: 'Please check your email to active account!',
      })
    }
})

const finalRegister = asyncHandler(async(req, res) => {
    // const cookie = req.cookies
    const { token } = req.params
    // if (!cookie || cookie?.dataRegister?.token !== token) {
    //   res.clearCookie('dataRegister')
    //   return res.redirect(`${process.env.CLIENT_URL}/finalregister/failed`)
    // }
    // Dùng RegExp để thêm 2 dấu / / ngoài chuỗi token
    /* Token nhận về là 1 chuỗi nằm trong dãy chuỗi được hash (mã hóa) của email! Nên phải dùng findOne thay vì find. Vì find sẽ 
    trả về giá trị mảng, còn findOne thì chỉ trả về true false và khi thực thi tìm kiếm, chỉ tìm riêng giá trị chuỗi mình truyền vào */
    const notActivedEmail = await User.findOne({email: new RegExp(`${token}$`)})
  
    /* atob là hàm giải mã (ngược với btoa), là giải mã chuỗi ký tự email theo @ và lấy giá trị phần tử đầu tiên (0) */ 
    if(notActivedEmail) {
      notActivedEmail.email = atob(notActivedEmail?.email?.split('@')[0])
      notActivedEmail.save()
    }
    return res.json({
      success: notActivedEmail ? true : false,
      mess: notActivedEmail ? 'Hoàn tất đăng ký thành công' : 'Hoàn tất đăng ký đã xảy ra lỗi, vui lòng thử lại!'
    })

})
// Refresh token => Cấp mới access token
// Access token => Xác thực người dùng, phân quyền người dùng
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });

  //Plain object của mongoDB
  const response = await User.findOne({ email });
  if (response && await response.isCorrectPassword(password)) {
    // Tách password và role ra khỏi response
    const { password, role, refreshToken, ...userData } = response.toObject();
    // Tạo access token
    const accessToken = generateAccessToken(response._id, role);
    // Tạo refresh token
    const newRefreshToken = generateRefreshToken(response._id);
    // Lưu refreshToken vào database
    await User.findByIdAndUpdate(response._id,{ refreshToken: newRefreshToken },
      { new: true }
    );
    // Lưu refresh token vào cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Invalid credentials!");
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  // dấu - đằng trước là không lấy
  const user = await User.findById(_id).select("-refreshToken -password -role");
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? user : "User not found",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // Lấy token từ cookies
  const cookie = req.cookies;
  // Check xem có token hay không
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  // Check token có hợp lệ hay không
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response ? generateAccessToken(response._id, response.role) : "Refresh token not matched!",
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  //Xóa refresh token ở db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  //Xóa refresh token ở cookie trình duyệt
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mes: "Logout is done!",
  });
});

// Client gửi email
// Server check email có hợp lệ hay không => Gửi mail + kèm theo link (password change token)
//Client check email => click link
//  Client gửi api kèm token
// Check token có giống với token mà server gửi mail hay không
// Change password

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Missing email!");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangedToken();
  await user.save();

  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. 
    <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`;
  const data = {
    email,
    html,
    subject: 'Forgot Password',
  };

  const rs = await sendMail(data);
  return res.status(200).json({
    success: rs.response?.includes('OK') ? true : false,
    mes: rs.response?.includes('OK') ? 'Hãy kiểm tra gmail của bạn!' : 'Mail này không tồn tại!',
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;

  if (!password || !token) throw new Error("Missing inputs");
  //digest tạo thành mã băm
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  // gt là so sánh lớn hơn
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangedAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "Updated password" : "Something went wrong",
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const response = await User.find().select("-refreshToken -password -role");
  return res.status(200).json({
    success: response ? true : false,
    users: response,
  });
});

const deleteUsers = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("Missing inputs");
  const response = await User.findByIdAndDelete(_id);
  return res.status(200).json({
    success: response ? true : false,
    deletedUser: response
      ? `User with email ${response.email} deleted`
      : "No user delete",
  });
});

const updateUsers = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Some thing went wrong",
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-refreshToken -password -role");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Some thing went wrong",
  });
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!req.body.address) throw new Error("Missing inputs");
  const response = await User.findByIdAndUpdate(_id, { $push: {address: req.body.address } }, {new: true,}).select("-refreshToken -password -role");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Some thing went wrong",
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity, color } = req.body
  if (!pid || !quantity || !color ) throw new Error("Missing inputs");
  const user = await User.findById(_id).select('cart')
  const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid)
  if(alreadyProduct) {
    // Khi trùng màu sắc đối với sản phẩm đã có trong giỏ hàng
    if(alreadyProduct.color === color) {
      const response = await User.updateOne({ cart: {$elentMatch: alreadyProduct} }, { $set: {"cart.$.quantity": quantity} }, {new: true})
      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "Some thing went wrong",
      });
    } //Khi khác màu sắc đối với sản phẩm đã có trong giỏ hàng 
    else {
      const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color} } }, {new: true})
      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "Some thing went wrong",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color } } }, {new: true})
    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "Some thing went wrong",
    });
  }
});
module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUsers,
  updateUsers,
  updateUserByAdmin,
  updateUserAddress,
  updateCart,
  finalRegister
};
