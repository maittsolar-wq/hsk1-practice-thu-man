import Progress from './Progress.jsx'
import QuestionCard from './QuestionCard.jsx'
import { containsChinese } from '../utils/text.js'

export default function MultipleChoice({
  question,
  current,
  total,
  correct,
  selected,
  onSelect,
  onNext,
}) {
  const answered = selected !== null

  return (
    <>
      <Progress current={current} total={total} correct={correct} />
      <QuestionCard question={question} />
      <div className={`answer-grid ${question.type === 'grammar' || question.type === 'translation' ? 'single-column' : ''}`}>
        {question.options.map((option) => {
          const isCorrect = option === question.answer
          const isSelected = option === selected
          const isChinese = containsChinese(option)
          let state = ''
          if (answered && isCorrect) state = 'correct'
          else if (answered && isSelected) state = 'wrong'

          return (
            <button
              key={option}
              className={`answer-button ${state} ${isChinese ? 'chinese-text' : ''}`}
              lang={isChinese ? 'zh-CN' : 'vi'}
              type="button"
              disabled={answered}
              onClick={() => onSelect(option)}
            >
              {option}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="feedback-zone">
          <div className={`feedback ${selected === question.answer ? 'success' : 'error'}`}>
            {selected === question.answer
              ? '✓ Chính xác!'
              : `✕ Chưa đúng. Đáp án đúng: ${question.answer}`}
          </div>
          <button className="next-button" type="button" onClick={onNext}>Câu tiếp theo ▶</button>
        </div>
      )}
    </>
  )
}
