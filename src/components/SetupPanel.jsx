function ChoiceGroup({ title, options, value, onChange }) {
  return (
    <div className="setup-block">
      <div className="section-label">{title}</div>
      <div className="choice-wrap">
        {options.map((option) => (
          <button
            type="button"
            key={option.value}
            className={`choice-pill ${value === option.value ? 'selected' : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function SetupPanel({
  mode,
  direction,
  setDirection,
  count,
  setCount,
  maxCount,
  onStart,
}) {
  const modeConfig = {
    quiz: {
      label: 'DẠNG CÂU HỎI',
      directionOptions: [
        { value: 'mixed', label: 'Trộn tất cả' },
        { value: 'hanziToMeaning', label: 'Hán tự → Nghĩa' },
        { value: 'meaningToHanzi', label: 'Nghĩa → Hán tự' },
        { value: 'pinyinToMeaning', label: 'Pinyin → Nghĩa' },
      ],
      button: 'Bắt đầu làm bài ▶',
    },
    self: {
      label: 'CHIỀU CÂU HỎI',
      directionOptions: [
        { value: 'mixedSelf', label: 'Trộn tất cả' },
        { value: 'hanziAndPinyin', label: 'Xem Hán tự → đoán nghĩa' },
        { value: 'meaningAndPinyin', label: 'Xem nghĩa → đoán Hán tự/Pinyin' },
      ],
      button: 'Bắt đầu ôn ▶',
    },
    translation: {
      label: 'CHIỀU DỊCH',
      directionOptions: [
        { value: 'zhToVi', label: 'Trung → Việt' },
        { value: 'viToZh', label: 'Việt → Trung' },
        { value: 'mixedTranslation', label: 'Trộn cả hai' },
      ],
      button: 'Bắt đầu dịch câu ▶',
    },
  }

  const config = modeConfig[mode]
  const countOptions = [10, 20, 40]
    .filter((option) => option <= maxCount)
    .map((option) => ({ value: option, label: `${option} câu` }))

  countOptions.push({ value: maxCount, label: `Tất cả (${maxCount})` })

  return (
    <section className="setup-panel">
      <ChoiceGroup
        title={config.label}
        options={config.directionOptions}
        value={direction}
        onChange={setDirection}
      />
      <ChoiceGroup
        title="SỐ CÂU HỎI"
        options={countOptions}
        value={count}
        onChange={setCount}
      />
      <button className="primary-button" type="button" onClick={onStart}>{config.button}</button>
    </section>
  )
}
