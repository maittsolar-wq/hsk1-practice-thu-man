# Phân tích video tham chiếu

Video dài khoảng 76 giây, quay giao diện mobile. Web trong video nằm bên trong Claude Artifacts nhưng phần cần dựng là nội dung HSK ở card màu beige.

## 1. Header
- Dòng nhỏ: `150 TỪ VỰNG · CẤP ĐỘ 1`.
- Tiêu đề lớn: `练 Bài tập HSK1`.
- Mô tả: chọn dạng bài và xem đáp án ngay.

## 2. Thanh mode
Bốn tab nằm ngang:
1. Trắc nghiệm.
2. Ngữ pháp.
3. Tự luận.
4. Dịch câu.

Tab active có nền gần đen, chữ trắng; các tab khác nền beige trong suốt và viền mảnh.

## 3. Setup Trắc nghiệm
- Dạng câu hỏi: Trộn tất cả, Hán tự → Nghĩa, Nghĩa → Hán tự, Pinyin → Nghĩa.
- Số câu: 10, 20, 40, Tất cả.
- CTA đỏ: Bắt đầu làm bài.

## 4. Màn quiz
- `Câu x/y` bên trái, `Đúng: n` bên phải.
- Progress bar nằm dưới.
- Card trắng ngà hiển thị loại câu + câu hỏi lớn.
- Trắc nghiệm từ vựng dùng lưới 2×2.
- Ngữ pháp và dịch câu dùng danh sách 1 cột.

## 5. Trạng thái trả lời
- Đáp án đúng chuyển xanh.
- Đáp án sai người dùng chọn chuyển đỏ/hồng.
- Hiện feedback `Chưa đúng. Đáp án đúng: ...` hoặc `Chính xác!`.
- Nút đen `Câu tiếp theo`.

## 6. Ngữ pháp
- Khi chọn tab Ngữ pháp trong video, bài 20 câu mở thẳng.
- Card: câu Hán có chỗ trống + nghĩa tiếng Việt.
- 4 lựa chọn Hán tự theo hàng dọc.

## 7. Tự luận
- Có màn setup chiều câu hỏi và số câu.
- Card hiển thị Hán tự/Pinyin hoặc nghĩa.
- Nút `Xem đáp án`.
- Sau khi mở đáp án có 2 nút: `Tôi trả lời sai` và `Tôi trả lời đúng`.

## 8. Dịch câu
- Setup chiều dịch: Trung → Việt / Việt → Trung.
- Chọn số câu 10/20/40/Tất cả.
- Question card + 4 đáp án theo hàng dọc.
- Đúng/sai sử dụng cùng interaction của quiz.

## 9. Footer
Hiển thị tổng số dữ liệu từ vựng, ngữ pháp và câu dịch.

## 10. Kiến trúc MVP đã chọn
Không cần backend cho bản đầu:
- React + Vite.
- CSS thuần để dễ chỉnh giao diện.
- JSON local cho nội dung học.
- localStorage cho lịch sử làm bài.
- Vercel cho hosting static.
