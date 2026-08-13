import { useMemo, useState } from 'react'
import vocab from './data/vocab.json'
import grammar from './data/grammar.json'
import translations from './data/translation.json'
import ModeTabs from './components/ModeTabs.jsx'
import SetupPanel from './components/SetupPanel.jsx'
import MultipleChoice from './components/MultipleChoice.jsx'
import SelfStudy from './components/SelfStudy.jsx'
import Result from './components/Result.jsx'
import brand from './config/brand.js'
import {
  createSelfStudyQuestions,
  createTranslationQuestions,
  createVocabQuestions,
  sample,
  shuffle,
} from './utils/quiz.js'

const DEFAULTS = {
  quiz: { direction: 'pinyinToMeaning', count: 20 },
  self: { direction: 'hanziAndPinyin', count: 10 },
  translation: { direction: 'zhToVi', count: 20 },
}

export default function App() {
  const [activeMode, setActiveMode] = useState('quiz')
  const [stage, setStage] = useState('setup')
  const [settings, setSettings] = useState(DEFAULTS)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [runKey, setRunKey] = useState(0)

  const currentQuestion = questions[currentIndex]

  const translationMax = useMemo(() => {
    const direction = settings.translation.direction
    if (direction === 'mixedTranslation') return translations.length
    return translations.filter((item) => item.direction === direction).length
  }, [settings.translation.direction])

  const startSession = (mode = activeMode) => {
    let nextQuestions = []

    if (mode === 'quiz') {
      nextQuestions = createVocabQuestions(
        vocab,
        settings.quiz.direction,
        settings.quiz.count,
      )
    }

    if (mode === 'grammar') {
      nextQuestions = sample(grammar, Math.min(20, grammar.length)).map((question) => ({
        ...question,
        options: shuffle(question.options),
      }))
    }

    if (mode === 'self') {
      nextQuestions = createSelfStudyQuestions(
        vocab,
        settings.self.direction,
        settings.self.count,
      )
    }

    if (mode === 'translation') {
      nextQuestions = createTranslationQuestions(
        translations,
        settings.translation.direction,
        settings.translation.count,
      )
    }

    setQuestions(nextQuestions)
    setCurrentIndex(0)
    setCorrect(0)
    setSelected(null)
    setRevealed(false)
    setRunKey((key) => key + 1)
    setStage('playing')
  }

  const changeMode = (mode) => {
    setActiveMode(mode)
    setSelected(null)
    setRevealed(false)

    // Trong video, tab Ngữ pháp vào thẳng bộ 20 câu; 3 tab còn lại có màn cấu hình.
    if (mode === 'grammar') {
      startSession('grammar')
    } else {
      setStage('setup')
    }
  }

  const updateSetting = (mode, key, value) => {
    setSettings((previous) => ({
      ...previous,
      [mode]: {
        ...previous[mode],
        [key]: value,
      },
    }))
  }

  const handleSelect = (option) => {
    if (selected !== null) return
    setSelected(option)
    if (option === currentQuestion.answer) setCorrect((value) => value + 1)
  }

  const goNext = () => {
    if (currentIndex >= questions.length - 1) {
      saveRun()
      setStage('result')
      return
    }
    setCurrentIndex((index) => index + 1)
    setSelected(null)
    setRevealed(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const gradeSelf = (isCorrect) => {
    const nextCorrect = correct + (isCorrect ? 1 : 0)
    setCorrect(nextCorrect)
    if (currentIndex >= questions.length - 1) {
      saveRun(nextCorrect)
      setStage('result')
      return
    }
    setCurrentIndex((index) => index + 1)
    setRevealed(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const saveRun = (correctOverride = correct) => {
    const history = JSON.parse(localStorage.getItem('hsk-practice-history') || '[]')
    history.unshift({
      id: `${Date.now()}-${runKey}`,
      mode: activeMode,
      correct: correctOverride,
      total: questions.length,
      createdAt: new Date().toISOString(),
    })
    localStorage.setItem('hsk-practice-history', JSON.stringify(history.slice(0, 20)))
  }

  const maxForMode = activeMode === 'translation' ? translationMax : vocab.length
  const modeSettings = settings[activeMode]

  const brandStyle = {
    '--brand-primary': brand.colors.primary,
    '--brand-primary-dark': brand.colors.primaryDark,
    '--brand-secondary': brand.colors.secondary,
    '--brand-secondary-soft': brand.colors.secondarySoft,
    '--brand-danger-soft': brand.colors.dangerSoft,
    '--brand-background': brand.colors.background,
    '--brand-surface': brand.colors.surface,
    '--brand-surface-deep': brand.colors.surfaceDeep,
    '--brand-card': brand.colors.card,
    '--brand-ink': brand.colors.ink,
    '--brand-muted': brand.colors.muted,
    '--brand-border': brand.colors.border,
    '--brand-success': brand.colors.success,
    '--brand-success-soft': brand.colors.successSoft,
    '--brand-danger': brand.colors.danger,
    '--font-vi': brand.fonts.vietnamese,
    '--font-zh': brand.fonts.chinese,
    '--font-display': brand.fonts.display,
  }

  return (
    <main className="page-shell" style={brandStyle} lang="vi">
      <section className="app-card">
        <header className="hero">
          <div className="brand-lockup">
            {brand.logo ? (
              <img className="brand-logo" src={brand.logo} alt={`Logo ${brand.centerName}`} />
            ) : (
              <div className="brand-logo-placeholder" aria-hidden="true">TM</div>
            )}
            <div className="brand-copy">
              <div className="center-name">{brand.centerName}</div>
              <div className="brand-tagline">{brand.tagline}</div>
            </div>
          </div>
          <h1 className="hero-main-title">
            <span className="hero-title-text">Luyện tập HSK1</span>
          </h1>
          <p>Luyện từ vựng, ngữ pháp và dịch câu theo từng dạng bài</p>
        </header>

        <ModeTabs activeMode={activeMode} onChange={changeMode} />

        {stage === 'setup' && activeMode !== 'grammar' && (
          <SetupPanel
            mode={activeMode}
            direction={modeSettings.direction}
            setDirection={(value) => {
              updateSetting(activeMode, 'direction', value)
              if (activeMode === 'translation') {
                const filtered = value === 'mixedTranslation'
                  ? translations.length
                  : translations.filter((item) => item.direction === value).length
                if (modeSettings.count > filtered) updateSetting(activeMode, 'count', Math.min(20, filtered))
              }
            }}
            count={modeSettings.count}
            setCount={(value) => updateSetting(activeMode, 'count', value)}
            maxCount={maxForMode}
            onStart={() => startSession(activeMode)}
          />
        )}

        {stage === 'playing' && currentQuestion && activeMode !== 'self' && (
          <MultipleChoice
            key={`${runKey}-${currentQuestion.id}`}
            question={currentQuestion}
            current={currentIndex + 1}
            total={questions.length}
            correct={correct}
            selected={selected}
            onSelect={handleSelect}
            onNext={goNext}
          />
        )}

        {stage === 'playing' && currentQuestion && activeMode === 'self' && (
          <SelfStudy
            key={`${runKey}-${currentQuestion.id}`}
            question={currentQuestion}
            current={currentIndex + 1}
            total={questions.length}
            correct={correct}
            revealed={revealed}
            onReveal={() => setRevealed(true)}
            onGrade={gradeSelf}
          />
        )}

        {stage === 'result' && (
          <Result
            correct={correct}
            total={questions.length}
            onRetry={() => startSession(activeMode)}
            onHome={() => {
              setActiveMode('quiz')
              setStage('setup')
            }}
          />
        )}

        <footer className="data-footer">
          Trung tâm Tiếng Trung Thư Mẫn · {vocab.length} từ vựng · {grammar.length} câu ngữ pháp · {translations.length} câu dịch
        </footer>
      </section>
    </main>
  )
}
