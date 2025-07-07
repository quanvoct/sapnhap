# Bộ dữ liệu Đơn vị hành chính Việt Nam theo Nghị quyết số 202/2025/QH15 của Quốc hội

Dữ liệu được cập nhật theo Nghị quyết số 202/2025/QH15 của Quốc hội

# Demo

Xem demo tại đây: [https://thongtin.vn/demo-don-vi-hanh-chinh](https://thongtin.vn/demo-don-vi-hanh-chinh)

# Ứng Dụng Chuyển Đổi Địa Chỉ Tỉnh Thành

Ứng dụng web giúp chuyển đổi địa chỉ từ trước khi sáp nhập tỉnh thành sang sau khi sáp nhập tỉnh thành tại Việt Nam.

## Tính Năng

- ✅ Giao diện đẹp và thân thiện với Bootstrap 5
- ✅ Chọn tỉnh/thành phố và phường/xã từ danh sách có sẵn
- ✅ Chuyển đổi địa chỉ tự động
- ✅ Hiển thị địa chỉ cũ và mới song song
- ✅ Sao chép địa chỉ mới vào clipboard
- ✅ Responsive design cho mobile và desktop
- ✅ Loading animation khi xử lý
- ✅ Thông báo lỗi rõ ràng

## Cấu Trúc Dự Án

```
dvhcvn/
├── index.html              # Trang chính của ứng dụng
├── js/
│   └── app.js             # Logic JavaScript chính
├── json/
│   └── data.json          # Dữ liệu tỉnh thành và phường xã
├── mapping_old_data/
│   └── ward_mappings.sql  # Dữ liệu mapping (cần cập nhật)
├── mysql/                 # Script SQL cho MySQL
├── pgsql/                 # Script SQL cho PostgreSQL
└── README.md              # Hướng dẫn này
```

## Cách Sử Dụng

### 1. Chạy Ứng Dụng

Mở file `index.html` trong trình duyệt web hoặc sử dụng local server:

```bash
# Sử dụng Python
python -m http.server 8000

# Sử dụng Node.js
npx http-server

# Sử dụng PHP
php -S localhost:8000
```

Sau đó truy cập: `http://localhost:8000`

### 2. Sử Dụng Ứng Dụng

1. **Chọn địa chỉ cũ:**
   - Chọn tỉnh/thành phố từ dropdown
   - Chọn phường/xã tương ứng

2. **Nhập địa chỉ chi tiết:**
   - Địa chỉ đường/số nhà (tùy chọn)
   - Địa chỉ chi tiết như tầng, phòng (tùy chọn)

3. **Chuyển đổi:**
   - Nhấn nút "Chuyển Đổi"
   - Xem kết quả địa chỉ mới

4. **Sao chép:**
   - Sử dụng nút "Sao chép địa chỉ mới"

## Cập Nhật Dữ Liệu Mapping

Để ứng dụng hoạt động chính xác, bạn cần cập nhật dữ liệu mapping trong file `js/app.js`:

```javascript
// Trong function createWardMappings()
wardMappings = {
    '00004': { 
        new_ward_code: '00004', 
        new_province_code: '01', 
        new_name: 'Phường Ba Đình' 
    },
    // Thêm các mapping khác...
};
```

### Cấu Trúc Mapping

```javascript
{
    'old_ward_code': {
        new_ward_code: 'new_ward_code',
        new_province_code: 'new_province_code', 
        new_name: 'Tên phường/xã mới'
    }
}
```

## Tùy Chỉnh

### Thay Đổi Giao Diện

- Chỉnh sửa CSS trong file `index.html`
- Thay đổi màu sắc, font chữ, layout

### Thêm Tính Năng

- Thêm validation cho form
- Thêm lịch sử chuyển đổi
- Thêm export kết quả ra file
- Thêm tìm kiếm địa chỉ

## Công Nghệ Sử Dụng

- **HTML5**: Cấu trúc trang
- **CSS3**: Styling và animation
- **JavaScript (ES6+)**: Logic xử lý
- **Bootstrap 5**: Framework UI
- **Font Awesome**: Icons

## Hỗ Trợ

Nếu gặp vấn đề hoặc cần hỗ trợ:

1. Kiểm tra console browser để xem lỗi
2. Đảm bảo file `json/data.json` tồn tại và đúng định dạng
3. Cập nhật dữ liệu mapping theo đúng cấu trúc

## Phiên Bản

- **v1.0.0**: Phiên bản đầu tiên với các tính năng cơ bản

## Tác Giả

Ứng dụng được phát triển để hỗ trợ việc chuyển đổi địa chỉ sau khi sáp nhập tỉnh thành tại Việt Nam.
