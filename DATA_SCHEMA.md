# Thiết kế JSON

MVP dùng 3 file dữ liệu độc lập. Logic React chỉ đọc các field bên dưới, vì vậy có thể thay nội dung mà không cần đổi UI.

## 1. `src/data/vocab.json`

```json
{
  "id": 1,
  "hanzi": "爱",
  "pinyin": "ài",
  "vi": "yêu"
}
```

Các dạng Trắc nghiệm được sinh tự động từ cùng một record:
- `hanziToMeaning`: `hanzi` → chọn `vi`.
- `meaningToHanzi`: `vi` → chọn `hanzi`.
- `pinyinToMeaning`: `pinyin` → chọn `vi`.
- `mixed`: random một trong ba dạng trên.

Đáp án nhiễu cũng được lấy ngẫu nhiên từ các record khác, nên không cần lưu `options` trong vocab JSON.

## 2. `src/data/grammar.json`

```json
{
  "id": "g1",
  "type": "grammar",
  "label": "CHỌN ĐÁP ÁN ĐÚNG",
  "prompt": "我家有一___猫。",
  "viHint": "Nhà tôi có một con mèo.",
  "options": ["只", "条", "把", "个"],
  "answer": "只"
}
```

Quy tắc:
- `answer` phải trùng chính xác một phần tử trong `options`.
- Có thể thêm field `explanation` sau này mà không ảnh hưởng MVP hiện tại.

## 3. `src/data/translation.json`

```json
{
  "id": "t1a",
  "type": "translation",
  "direction": "zhToVi",
  "label": "CÂU TIẾNG TRUNG → CHỌN NGHĨA TIẾNG VIỆT",
  "prompt": "你是谁？",
  "subPrompt": "",
  "answer": "Bạn là ai?",
  "options": [
    "Bạn là ai?",
    "Bạn đi đâu?",
    "Cảm ơn bạn.",
    "Hôm nay tôi rất vui."
  ]
}
```

`direction` nhận:
- `zhToVi`: Trung → Việt.
- `viToZh`: Việt → Trung.

## LocalStorage

Key: `hsk-practice-history`

```json
[
  {
    "id": "timestamp-run",
    "mode": "quiz",
    "correct": 17,
    "total": 20,
    "createdAt": "2026-08-12T14:00:00.000Z"
  }
]
```

MVP hiện lưu tối đa 20 lượt gần nhất. Chưa có UI lịch sử; dữ liệu này được chuẩn bị để thêm màn Statistics sau này.
