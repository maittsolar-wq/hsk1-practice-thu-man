# HSK Practice React — MVP bám theo video

Project React/Vite dựng lại luồng chính của web HSK trong video tham chiếu:

- 4 tab: Trắc nghiệm, Ngữ pháp, Tự luận, Dịch câu.
- Trắc nghiệm: Trộn tất cả / Hán tự → Nghĩa / Nghĩa → Hán tự / Pinyin → Nghĩa.
- Ngữ pháp: bộ câu điền chỗ trống 4 lựa chọn, mở thẳng 20 câu như video.
- Tự luận: xem câu trước, bấm xem đáp án, tự chấm đúng/sai.
- Dịch câu: Trung → Việt / Việt → Trung / trộn cả hai.
- Chọn 10 / 20 / 40 / tất cả (khi dataset đủ số lượng).
- Progress, số câu đúng, trạng thái đúng/sai, câu tiếp theo, màn kết quả.
- Lịch sử 20 lần làm gần nhất được lưu trong localStorage (`hsk-practice-history`).
- Responsive mobile-first.

## Dữ liệu mẫu

- `src/data/vocab.json`: 150 mục từ.
- `src/data/grammar.json`: 37 câu ngữ pháp.
- `src/data/translation.json`: 83 câu dịch.

Bạn có thể thay toàn bộ nội dung JSON mà không phải đổi logic giao diện.

## Cấu trúc

```text
src/
├── components/
│   ├── ModeTabs.jsx
│   ├── MultipleChoice.jsx
│   ├── Progress.jsx
│   ├── QuestionCard.jsx
│   ├── Result.jsx
│   ├── SelfStudy.jsx
│   └── SetupPanel.jsx
├── data/
│   ├── grammar.json
│   ├── translation.json
│   └── vocab.json
├── utils/
│   └── quiz.js
├── App.jsx
├── main.jsx
└── styles.css
```

## Chạy local

Yêu cầu Node.js tương thích với Vite 8 (xem tài liệu Vite hiện hành).

```bash
npm install
npm run dev
```

Mở URL Vite hiển thị trong Terminal, thường là `http://localhost:5173`.

Build production:

```bash
npm run build
npm run preview
```

## Deploy Vercel — cách dễ nhất

1. Tạo repository GitHub và push thư mục project này lên.
2. Vào Vercel → Add New / Project.
3. Import repository GitHub.
4. Vercel nhận diện Vite; build command dùng `npm run build`, output là `dist`.
5. Nhấn Deploy.
6. Các lần push tiếp theo lên repository sẽ tạo deployment mới tự động.

Cách CLI:

```bash
npm i -g vercel
vercel
```

Chạy trong thư mục project và làm theo câu hỏi trên Terminal.

## Gợi ý nâng cấp sau MVP

- HSK 2–6 theo các file JSON riêng.
- Đăng nhập + đồng bộ tiến độ bằng Supabase/Firebase.
- Tạo danh sách câu sai để ôn lại.
- Audio phát âm từng từ/câu.
- Streak, XP, daily lesson.
- CMS/admin để nhập câu hỏi không cần sửa JSON.

## Tùy biến thương hiệu (brand-ready)

Bản này đã tách logo, tên trung tâm, màu sắc và font vào `src/config/brand.js`.

- Đổi `centerName` để đổi tên trung tâm.
- Đặt logo thật vào `public/logo.png`, sau đó đổi `logo: null` thành `logo: '/logo.png'`.
- Đổi các mã màu trong `colors` để đổi theme toàn bộ web.
- `fonts.vietnamese` là font cho tiếng Việt.
- `fonts.chinese` là font cho chữ Hán.
- Code tự gắn `lang="zh-CN"` cho nội dung có chữ Hán ở câu hỏi/đáp án để dùng font Trung riêng.

Mặc định bản brand-ready dùng Google Fonts: **Be Vietnam Pro** cho tiếng Việt và **Noto Sans SC** cho tiếng Trung.
