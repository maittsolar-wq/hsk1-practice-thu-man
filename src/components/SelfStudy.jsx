import Progress from './Progress.jsx'
import { containsChinese } from '../utils/text.js'

export default function SelfStudy({ question, current, total, correct, revealed, onReveal, onGrade }) {
  const promptIsChinese = containsChinese(question.prompt)
  const answerIsChinese = containsChinese(question.answerMain)
  return (
    <>
      <Progress current={current} total={total} correct={correct} />
      <div className="question-card self-card">
        <div className="question-label">{question.label}</div>
        <div
          className={`question-prompt ${promptIsChinese ? 'chinese' : ''}`}
          lang={promptIsChinese ? 'zh-CN' : 'vi'}
        >
          {question.prompt}
        </div>
        {question.pinyin && <div className="question-sub accent-pinyin">{question.pinyin}</div>}
        {revealed && (
          <div className="revealed-answer">
            <strong className={answerIsChinese ? 'chinese-text' : ''} lang={answerIsChinese ? 'zh-CN' : 'vi'}>
              {question.answerMain}
            </strong>
            <span>{question.answerSub}</span>
          </div>
        )}
      </div>

      {!revealed ? (
        <button className="reveal-button" type="button" onClick={onReveal}>👁 Xem đáp án</button>
      ) : (
        <div className="self-grade-row">
          <button className="grade-button wrong-grade" type="button" onClick={() => onGrade(false)}>✕ Tôi trả lời sai</button>
          <button className="grade-button right-grade" type="button" onClick={() => onGrade(true)}>✓ Tôi trả lời đúng</button>
        </div>
      )}
    </>
  )
}
