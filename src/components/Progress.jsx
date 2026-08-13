export default function Progress({ current, total, correct }) {
  const percent = total ? ((current - 1) / total) * 100 : 0
  return (
    <div className="progress-section">
      <div className="progress-meta">
        <span>Câu <strong>{current}/{total}</strong></span>
        <span>Đúng: <strong>{correct}</strong></span>
      </div>
      <div className="progress-track" aria-label={`Tiến độ ${Math.round(percent)}%`}>
        <div className="progress-fill" style={{ width: `${Math.max(3, percent)}%` }} />
      </div>
    </div>
  )
}
