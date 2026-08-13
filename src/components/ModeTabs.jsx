const modes = [
  { id: 'quiz', icon: '📝', label: 'Trắc\nnghiệm' },
  { id: 'grammar', icon: '📐', label: 'Ngữ\npháp' },
  { id: 'self', icon: '📕', label: 'Tự luận' },
  { id: 'translation', icon: '📖', label: 'Dịch câu' },
]

export default function ModeTabs({ activeMode, onChange }) {
  return (
    <div className="mode-tabs" role="tablist" aria-label="Chọn dạng bài">
      {modes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          className={`mode-tab ${activeMode === mode.id ? 'active' : ''}`}
          onClick={() => onChange(mode.id)}
        >
          <span>{mode.icon}</span>
          <span>{mode.label.split('\n').map((line, index) => <span key={index} className="mode-line">{line}</span>)}</span>
        </button>
      ))}
    </div>
  )
}
