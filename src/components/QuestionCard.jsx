import { containsChinese } from '../utils/text.js'

export default function QuestionCard({ question }) {
  const promptIsChinese = containsChinese(question.prompt)
  return (
    <div className="question-card">
      <div className="question-label">{question.label}</div>
      <div
        className={`question-prompt ${promptIsChinese ? 'chinese' : ''}`}
        lang={promptIsChinese ? 'zh-CN' : 'vi'}
      >
        {question.prompt}
      </div>
      {question.subPrompt && <div className="question-sub">{question.subPrompt}</div>}
      {question.viHint && <div className="question-sub">({question.viHint})</div>}
    </div>
  )
}
