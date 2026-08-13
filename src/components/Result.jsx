export default function Result({ correct, total, onRetry, onHome }) {
  const percent = total ? Math.round((correct / total) * 100) : 0
  const message = percent >= 80 ? 'Rất tốt!' : percent >= 60 ? 'Khá ổn!' : 'Ôn thêm một lượt nhé!'

  return (
    <section className="result-card">
      <div className="result-kicker">HOÀN THÀNH</div>
      <div className="result-score">{correct}/{total}</div>
      <div className="result-percent">{percent}% chính xác</div>
      <h2>{message}</h2>
      <div className="result-actions">
        <button className="primary-button" type="button" onClick={onRetry}>Làm lại</button>
        <button className="secondary-button" type="button" onClick={onHome}>Đổi dạng bài</button>
      </div>
    </section>
  )
}
