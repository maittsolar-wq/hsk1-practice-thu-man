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


// ======================================================
// CẤU HÌNH MẶC ĐỊNH
// ======================================================

const DEFAULTS = {
  quiz: {
    direction: 'pinyinToMeaning',
    count: 20,
  },

  self: {
    direction: 'hanziAndPinyin',
    count: 10,
  },

  translation: {
    direction: 'zhToVi',
    count: 20,
  },
}


// ======================================================
// APP
// ======================================================

export default function App() {

  // ====================================================
  // STATE
  // ====================================================

  const [activeMode, setActiveMode] = useState('quiz')

  // setup   = màn chọn bài
  // playing = đang làm bài
  // result  = kết quả
  const [stage, setStage] = useState('setup')

  const [settings, setSettings] = useState(DEFAULTS)

  // Bộ câu hiện tại
  const [questions, setQuestions] = useState([])

  const [currentIndex, setCurrentIndex] = useState(0)

  const [correct, setCorrect] = useState(0)

  const [selected, setSelected] = useState(null)

  const [revealed, setRevealed] = useState(false)

  const [runKey, setRunKey] = useState(0)


  // ====================================================
  // THEO DÕI CÂU ĐÃ HỌC
  // ====================================================
  //
  // Lưu ID gốc của câu/từ đã hoàn thành trong
  // chuỗi "Làm tiếp" hiện tại.
  //
  // Ví dụ:
  //
  // quiz:
  // ["1", "2", "3"...]
  //
  // grammar:
  // ["g1", "g2"...]
  //
  // translation:
  // ["t1a", "t2a"...]
  //
  // ====================================================

  const [
    completedQuestionIds,
    setCompletedQuestionIds,
  ] = useState([])


  const currentQuestion =
    questions[currentIndex]


  // ====================================================
  // SỐ CÂU DỊCH TỐI ĐA
  // ====================================================

  const translationMax = useMemo(() => {

    const direction =
      settings.translation.direction

    if (
      direction === 'mixedTranslation'
    ) {
      return translations.length
    }

    return translations.filter(
      (item) =>
        item.direction === direction
    ).length

  }, [settings.translation.direction])


  // ====================================================
  // LẤY ID GỐC CỦA CÂU
  // ====================================================

  const getSourceId = (
    question,
    mode = activeMode
  ) => {

    if (!question) {
      return null
    }


    // ----------------------------------------------
    // TRẮC NGHIỆM TỪ VỰNG
    //
    // ID:
    // vocab-12-pinyinToMeaning
    //
    // → lấy 12
    // ----------------------------------------------

    if (mode === 'quiz') {

      const match =
        String(question.id).match(
          /^vocab-(\d+)-/
        )

      if (match) {
        return match[1]
      }
    }


    // ----------------------------------------------
    // TỰ LUẬN
    //
    // ID:
    // self-12-hanzi
    //
    // → lấy 12
    // ----------------------------------------------

    if (mode === 'self') {

      const match =
        String(question.id).match(
          /^self-(\d+)-/
        )

      if (match) {
        return match[1]
      }
    }


    // ----------------------------------------------
    // GRAMMAR / TRANSLATION
    // ----------------------------------------------

    return String(question.id)
  }


  // ====================================================
  // TỔNG SỐ CÂU CỦA BÀI HIỆN TẠI
  // ====================================================

  const lessonTotal = useMemo(() => {

    if (
      activeMode === 'quiz' ||
      activeMode === 'self'
    ) {
      return vocab.length
    }


    if (activeMode === 'grammar') {
      return grammar.length
    }


    if (activeMode === 'translation') {

      const direction =
        settings.translation.direction

      if (
        direction ===
        'mixedTranslation'
      ) {
        return translations.length
      }

      return translations.filter(
        (item) =>
          item.direction === direction
      ).length
    }


    return 0

  }, [
    activeMode,
    settings.translation.direction,
  ])


  // ====================================================
  // SỐ CÂU ĐÃ HỌC
  // ====================================================

  const completedCount =
    Math.min(
      completedQuestionIds.length,
      lessonTotal
    )


  // ====================================================
  // ĐÃ HOÀN THÀNH TOÀN BỘ BÀI?
  // ====================================================

  const lessonCompleted =
    lessonTotal > 0 &&
    completedCount >= lessonTotal


  // ====================================================
  // RESET TRẠNG THÁI BÀI
  // ====================================================

  const resetQuestionState = () => {

    setCurrentIndex(0)

    setCorrect(0)

    setSelected(null)

    setRevealed(false)

    setRunKey(
      (key) => key + 1
    )
  }


  // ====================================================
  // BẮT ĐẦU MỘT BÀI MỚI
  // ====================================================
  //
  // Bắt đầu từ Home sẽ reset tiến độ của dạng bài.
  //
  // ====================================================

  const startSession = (
    mode = activeMode
  ) => {

    let nextQuestions = []


    // ----------------------------------------------
    // TRẮC NGHIỆM
    // ----------------------------------------------

    if (mode === 'quiz') {

      nextQuestions =
        createVocabQuestions(
          vocab,
          settings.quiz.direction,
          settings.quiz.count
        )
    }


    // ----------------------------------------------
    // NGỮ PHÁP
    // ----------------------------------------------

    if (mode === 'grammar') {

      nextQuestions =
        sample(
          grammar,
          Math.min(
            20,
            grammar.length
          )
        ).map(
          (question) => ({
            ...question,

            options:
              shuffle(
                question.options
              ),
          })
        )
    }


    // ----------------------------------------------
    // TỰ LUẬN
    // ----------------------------------------------

    if (mode === 'self') {

      nextQuestions =
        createSelfStudyQuestions(
          vocab,
          settings.self.direction,
          settings.self.count
        )
    }


    // ----------------------------------------------
    // DỊCH CÂU
    // ----------------------------------------------

    if (mode === 'translation') {

      nextQuestions =
        createTranslationQuestions(
          translations,
          settings.translation.direction,
          settings.translation.count
        )
    }


    // ----------------------------------------------
    // RESET TIẾN ĐỘ BÀI MỚI
    // ----------------------------------------------

    setCompletedQuestionIds([])

    setQuestions(nextQuestions)

    resetQuestionState()

    setStage('playing')


    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }


  // ====================================================
  // ĐỔI DẠNG BÀI
  // ====================================================

  const changeMode = (mode) => {

    setActiveMode(mode)

    setQuestions([])

    setCompletedQuestionIds([])

    setCurrentIndex(0)

    setCorrect(0)

    setSelected(null)

    setRevealed(false)


    // Ngữ pháp vào thẳng bài
    if (mode === 'grammar') {

      startSession('grammar')

      return
    }


    setStage('setup')


    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }


  // ====================================================
  // CẬP NHẬT SETTING
  // ====================================================

  const updateSetting = (
    mode,
    key,
    value
  ) => {

    setSettings(
      (previous) => ({
        ...previous,

        [mode]: {
          ...previous[mode],

          [key]: value,
        },
      })
    )
  }


  // ====================================================
  // CHỌN ĐÁP ÁN
  // ====================================================

  const handleSelect = (option) => {

    // Đã chọn rồi thì không cho chọn lại
    if (selected !== null) {
      return
    }


    setSelected(option)


    if (
      option ===
      currentQuestion.answer
    ) {

      setCorrect(
        (value) =>
          value + 1
      )
    }
  }


  // ====================================================
  // ĐÁNH DẤU BỘ CÂU VỪA LÀM ĐÃ HOÀN THÀNH
  // ====================================================

  const markCurrentBatchCompleted = () => {

    const batchIds =
      questions
        .map(
          (question) =>
            getSourceId(
              question,
              activeMode
            )
        )
        .filter(Boolean)


    setCompletedQuestionIds(
      (previous) => [

        ...new Set([
          ...previous,
          ...batchIds,
        ]),
      ]
    )
  }


  // ====================================================
  // CÂU TIẾP THEO
  // ====================================================

  const goNext = () => {

    // ----------------------------------------------
    // HẾT BỘ CÂU HIỆN TẠI
    // ----------------------------------------------

    if (
      currentIndex >=
      questions.length - 1
    ) {

      markCurrentBatchCompleted()

      saveRun()

      setStage('result')


      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      return
    }


    // ----------------------------------------------
    // CÂU TIẾP THEO
    // ----------------------------------------------

    setCurrentIndex(
      (index) =>
        index + 1
    )

    setSelected(null)

    setRevealed(false)


    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }


  // ====================================================
  // TỰ LUẬN - USER TỰ CHẤM
  // ====================================================

  const gradeSelf = (isCorrect) => {

    const nextCorrect =
      correct +
      (isCorrect ? 1 : 0)


    setCorrect(nextCorrect)


    // ----------------------------------------------
    // HẾT BỘ TỰ LUẬN
    // ----------------------------------------------

    if (
      currentIndex >=
      questions.length - 1
    ) {

      markCurrentBatchCompleted()

      saveRun(nextCorrect)

      setStage('result')


      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })

      return
    }


    setCurrentIndex(
      (index) =>
        index + 1
    )

    setRevealed(false)


    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }


  // ====================================================
  // LÀM LẠI
  // ====================================================
  //
  // QUAN TRỌNG:
  //
  // Không generate câu mới.
  // Giữ nguyên questions hiện tại.
  //
  // ====================================================

  const retryCurrentSession = () => {

    resetQuestionState()

    setStage('playing')


    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }


  // ====================================================
  // LÀM TIẾP
  // ====================================================
  //
  // Chỉ lấy những câu chưa học.
  //
  // ====================================================

  const continueLesson = () => {

    const completedSet =
      new Set(
        completedQuestionIds.map(String)
      )


    let nextQuestions = []


    // ==================================================
    // TRẮC NGHIỆM
    // ==================================================

    if (activeMode === 'quiz') {

      const remainingIds =
        new Set(
          vocab
            .filter(
              (word) =>
                !completedSet.has(
                  String(word.id)
                )
            )
            .map(
              (word) =>
                String(word.id)
            )
        )


      if (
        remainingIds.size === 0
      ) {
        return
      }


      /*
        Generate trên toàn bộ vocab
        để quiz.js vẫn xử lý chính xác
        pinyin trùng như tā / zuò.
      */

      const generated =
        createVocabQuestions(
          vocab,
          settings.quiz.direction,
          vocab.length
        )


      const remainingQuestions =
        generated.filter(
          (question) => {

            const sourceId =
              getSourceId(
                question,
                'quiz'
              )

            return remainingIds.has(
              String(sourceId)
            )
          }
        )


      nextQuestions =
        remainingQuestions.slice(
          0,
          Math.min(
            settings.quiz.count,
            remainingQuestions.length
          )
        )
    }


    // ==================================================
    // NGỮ PHÁP
    // ==================================================

    if (activeMode === 'grammar') {

      const remainingGrammar =
        grammar.filter(
          (item) =>
            !completedSet.has(
              String(item.id)
            )
        )


      if (
        remainingGrammar.length === 0
      ) {
        return
      }


      nextQuestions =
        sample(
          remainingGrammar,

          Math.min(
            20,
            remainingGrammar.length
          )
        ).map(
          (question) => ({
            ...question,

            options:
              shuffle(
                question.options
              ),
          })
        )
    }


    // ==================================================
    // TỰ LUẬN
    // ==================================================

    if (activeMode === 'self') {

      const remainingIds =
        new Set(
          vocab
            .filter(
              (word) =>
                !completedSet.has(
                  String(word.id)
                )
            )
            .map(
              (word) =>
                String(word.id)
            )
        )


      if (
        remainingIds.size === 0
      ) {
        return
      }


      const generated =
        createSelfStudyQuestions(
          vocab,
          settings.self.direction,
          vocab.length
        )


      const remainingQuestions =
        generated.filter(
          (question) => {

            const sourceId =
              getSourceId(
                question,
                'self'
              )

            return remainingIds.has(
              String(sourceId)
            )
          }
        )


      nextQuestions =
        remainingQuestions.slice(
          0,
          Math.min(
            settings.self.count,
            remainingQuestions.length
          )
        )
    }


    // ==================================================
    // DỊCH CÂU
    // ==================================================

    if (
      activeMode ===
      'translation'
    ) {

      const direction =
        settings.translation.direction


      const remainingTranslations =
        translations.filter(
          (item) => {

            const matchesDirection =
              direction ===
                'mixedTranslation'
              ||
              item.direction ===
                direction


            return (
              matchesDirection
              &&
              !completedSet.has(
                String(item.id)
              )
            )
          }
        )


      if (
        remainingTranslations.length === 0
      ) {
        return
      }


      nextQuestions =
        createTranslationQuestions(
          remainingTranslations,
          direction,

          Math.min(
            settings.translation.count,
            remainingTranslations.length
          )
        )
    }


    // ==================================================
    // KHÔNG CÒN CÂU
    // ==================================================

    if (
      nextQuestions.length === 0
    ) {
      return
    }


    // ==================================================
    // BẮT ĐẦU BỘ TIẾP THEO
    // ==================================================

    setQuestions(nextQuestions)

    resetQuestionState()

    setStage('playing')


    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }


  // ====================================================
  // ĐỔI DẠNG BÀI TỪ RESULT
  // ====================================================

  const changeExerciseType = () => {

    setActiveMode('quiz')

    setStage('setup')

    setQuestions([])

    setCompletedQuestionIds([])

    setCurrentIndex(0)

    setCorrect(0)

    setSelected(null)

    setRevealed(false)


    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }


  // ====================================================
  // LƯU LỊCH SỬ
  // ====================================================

  const saveRun = (
    correctOverride = correct
  ) => {

    const history =
      JSON.parse(
        localStorage.getItem(
          'hsk-practice-history'
        ) || '[]'
      )


    history.unshift({

      id:
        `${Date.now()}-${runKey}`,

      mode:
        activeMode,

      direction:
        settings[activeMode]
          ?.direction || null,

      correct:
        correctOverride,

      total:
        questions.length,

      createdAt:
        new Date().toISOString(),
    })


    localStorage.setItem(
      'hsk-practice-history',

      JSON.stringify(
        history.slice(0, 20)
      )
    )
  }


  // ====================================================
  // MAX CÂU Ở SETUP
  // ====================================================

  const maxForMode =
    activeMode === 'translation'
      ? translationMax
      : vocab.length


  const modeSettings =
    settings[activeMode]


  // ====================================================
  // BRAND STYLE
  // ====================================================

  const brandStyle = {

    '--brand-primary':
      brand.colors.primary,

    '--brand-primary-dark':
      brand.colors.primaryDark,

    '--brand-secondary':
      brand.colors.secondary,

    '--brand-secondary-soft':
      brand.colors.secondarySoft,

    '--brand-danger-soft':
      brand.colors.dangerSoft,

    '--brand-background':
      brand.colors.background,

    '--brand-surface':
      brand.colors.surface,

    '--brand-surface-deep':
      brand.colors.surfaceDeep,

    '--brand-card':
      brand.colors.card,

    '--brand-ink':
      brand.colors.ink,

    '--brand-muted':
      brand.colors.muted,

    '--brand-border':
      brand.colors.border,

    '--brand-success':
      brand.colors.success,

    '--brand-success-soft':
      brand.colors.successSoft,

    '--brand-danger':
      brand.colors.danger,

    '--font-vi':
      brand.fonts.vietnamese,

    '--font-zh':
      brand.fonts.chinese,

    '--font-display':
      brand.fonts.display,
  }


  // ====================================================
  // UI
  // ====================================================

  return (

    <main
      className="page-shell"
      style={brandStyle}
      lang="vi"
    >

      <section className="app-card">


        {/* ============================================
            HEADER
        ============================================= */}

        <header className="hero">

          <div className="brand-lockup">

            {brand.logo ? (

              <img
                className="brand-logo"
                src={brand.logo}
                alt={`Logo ${brand.centerName}`}
              />

            ) : (

              <div
                className="brand-logo-placeholder"
                aria-hidden="true"
              >
                TM
              </div>
            )}


            <div className="brand-copy">

              <div className="center-name">
                {brand.centerName}
              </div>

              <div className="brand-tagline">
                {brand.tagline}
              </div>

            </div>

          </div>


          <h1 className="hero-main-title">

            <span className="hero-title-text">
              Luyện tập HSK1
            </span>

          </h1>


          <p>
            Luyện từ vựng, ngữ pháp và dịch câu theo từng dạng bài
          </p>

        </header>


        {/* ============================================
            TAB DẠNG BÀI
        ============================================= */}

        <ModeTabs
          activeMode={activeMode}
          onChange={changeMode}
        />


        {/* ============================================
            SETUP
        ============================================= */}

        {stage === 'setup' &&
          activeMode !== 'grammar' && (

            <SetupPanel

              mode={activeMode}

              direction={
                modeSettings.direction
              }

              setDirection={(value) => {

                updateSetting(
                  activeMode,
                  'direction',
                  value
                )


                // Nếu đổi chiều dịch:
                // đảm bảo số câu không vượt max.
                if (
                  activeMode ===
                  'translation'
                ) {

                  const filtered =
                    value ===
                      'mixedTranslation'

                      ? translations.length

                      : translations.filter(
                          (item) =>
                            item.direction ===
                            value
                        ).length


                  if (
                    modeSettings.count >
                    filtered
                  ) {

                    updateSetting(
                      activeMode,
                      'count',

                      Math.min(
                        20,
                        filtered
                      )
                    )
                  }
                }
              }}

              count={
                modeSettings.count
              }

              setCount={(value) =>
                updateSetting(
                  activeMode,
                  'count',
                  value
                )
              }

              maxCount={
                maxForMode
              }

              onStart={() =>
                startSession(
                  activeMode
                )
              }
            />
          )}


        {/* ============================================
            TRẮC NGHIỆM / NGỮ PHÁP / DỊCH
        ============================================= */}

        {stage === 'playing' &&
          currentQuestion &&
          activeMode !== 'self' && (

            <MultipleChoice

              key={
                `${runKey}-${currentQuestion.id}`
              }

              question={
                currentQuestion
              }

              current={
                currentIndex + 1
              }

              total={
                questions.length
              }

              correct={
                correct
              }

              selected={
                selected
              }

              onSelect={
                handleSelect
              }

              onNext={
                goNext
              }
            />
          )}


        {/* ============================================
            TỰ LUẬN
        ============================================= */}

        {stage === 'playing' &&
          currentQuestion &&
          activeMode === 'self' && (

            <SelfStudy

              key={
                `${runKey}-${currentQuestion.id}`
              }

              question={
                currentQuestion
              }

              current={
                currentIndex + 1
              }

              total={
                questions.length
              }

              correct={
                correct
              }

              revealed={
                revealed
              }

              onReveal={() =>
                setRevealed(true)
              }

              onGrade={
                gradeSelf
              }
            />
          )}


        {/* ============================================
            RESULT
        ============================================= */}

        {stage === 'result' && (

          <Result

            correct={
              correct
            }

            total={
              questions.length
            }

            completedCount={
              completedCount
            }

            lessonTotal={
              lessonTotal
            }

            lessonCompleted={
              lessonCompleted
            }


            // Làm lại đúng bộ vừa làm
            onRetry={
              retryCurrentSession
            }


            // Bộ chưa học tiếp theo
            onContinue={
              continueLesson
            }


            // Quay về chọn dạng
            onChangeMode={
              changeExerciseType
            }
          />
        )}


        {/* ============================================
            FOOTER
        ============================================= */}

        <footer className="data-footer">

          Trung tâm Tiếng Trung Thư Mẫn
          {' · '}
          {vocab.length} từ vựng
          {' · '}
          {grammar.length} câu ngữ pháp
          {' · '}
          {translations.length} câu dịch

        </footer>

      </section>

    </main>
  )
}