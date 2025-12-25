24/12/2024
# Đã tìm hiểu thêm về JWT-decode để kiểm tra expiry, lấy thông tin user và không dùng localStorage
# Thêm vào COOKIE_KEY để chứa cookie và thông tin người dùng 
# Thêm vào COOKIE_Options để tăng tính bảo mật khi chỉ gửi qua HTTPS và có expiry 7 ngày
# Thêm vào JwtPayload
# Cài đặt và sử dụng jwt-decode và js-cookie
    npm install jwt-decode js-cookie  // Thư viện chính để decode JWT token ở Client
    npm install -D @types/js-cookie     // Dùng cho dev để phát hiện lỗi sớm và gợi ý


 20/12/2025
# Đã chỉnh sửa các lỗi liên quan ERORR 404 NOT_FOUND cho Netlify sử dụng thêm file .toml để kết nối vào đường dẫn link html dựa trên hướng dẫn của Netlify về lỗi này trên React
# Thay đổi 1 số về constants các giá trị được khai báo chung
# Thêm vào CSS và không inline
# Thêm vào file .env để tăng tính bảo mật và không push các base URL hoặc key lên github
# Tìm hiểu thêm về cách hoạt động của JWTs, Access và Refresh Token


## Setup môi trường
# Tạo project React + TypeScript với Vite
npm create vite@latest course-management -- --template react-ts

# Di chuyển vào thư mục project
cd course-management

# Cài đặt dependencies mặc định
npm install

# Cài đặt Ant Design (UI Library)
npm install antd

# Cài đặt Ant Design Icons
npm install @ant-design/icons

# Cài đặt React Router (Routing)
npm install react-router-dom

# Chạy development server
npm run dev
## ROLLDOWN-VITE v7.2.5
## Local:   http://localhost:5173/

# Git push
git init
git add .

# Đổi branch hiện tại thành main
git branch -M main

git commit -m "Frist push"

git remote add origin https://github.com/NguyenNhatQuang-args/INTERN_TEST.git
# Push lên GitHub lần đầu tiên
git push -u origin main

# update code
# Xem code đã thay đổi
git status 

git add .

git commit -m "Update code"

git push



