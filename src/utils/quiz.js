export function shuffle(items) {
  const copy = [...items]

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }

  return copy
}


export function sample(items, count) {
  const safeCount = Math.max(
    0,
    Math.min(
      Number(count) || 0,
      items.length
    )
  )

  return shuffle(items).slice(0, safeCount)
}


function normalizePinyin(value = '') {
  return value
    .trim()
    .toLocaleLowerCase('vi')
}


function meaningOf(word) {
  return word.quizVi || word.vi
}


function duplicatePinyinSet(vocab) {
  const counts = new Map()

  vocab.forEach((word) => {
    const key = normalizePinyin(word.pinyin)

    counts.set(
      key,
      (counts.get(key) || 0) + 1
    )
  })

  return new Set(
    [...counts.entries()]
      .filter(([, count]) => count > 1)
      .map(([key]) => key)
  )
}


function uniqueDistractors(
  pool,
  selector,
  correctValue,
  count = 3
) {
  const seen = new Set([correctValue])

  const values = []

  for (const item of shuffle(pool)) {
    const value = selector(item)

    if (!value || seen.has(value)) {
      continue
    }

    seen.add(value)

    values.push(value)

    if (values.length === count) {
      break
    }
  }

  return values
}


function vocabQuestion(
  word,
  vocab,
  effectiveDirection,
  duplicatePinyins
) {
  const pool = vocab.filter(
    (item) => item.id !== word.id
  )


  // =====================================================
  // NGHĨA → HÁN TỰ
  // =====================================================

  if (
    effectiveDirection ===
    'meaningToHanzi'
  ) {
    const correct = word.hanzi

    const distractors =
      uniqueDistractors(
        pool,
        (item) => item.hanzi,
        correct
      )

    return {
      id:
        `vocab-${word.id}-${effectiveDirection}`,

      type: 'vocab',

      label:
        'NGHĨA → HÁN TỰ',

      prompt:
        meaningOf(word),

      subPrompt:
        word.pinyin,

      answer:
        correct,

      options:
        shuffle([
          correct,
          ...distractors
        ]),
    }
  }


  // =====================================================
  // HÁN TỰ → NGHĨA
  // =====================================================

  if (
    effectiveDirection ===
    'hanziToMeaning'
  ) {
    const correct =
      meaningOf(word)

    const distractors =
      uniqueDistractors(
        pool,
        meaningOf,
        correct
      )

    return {
      id:
        `vocab-${word.id}-${effectiveDirection}`,

      type:
        'vocab',

      label:
        'HÁN TỰ → NGHĨA (TIẾNG VIỆT)',

      prompt:
        word.hanzi,

      subPrompt:
        word.pinyin,

      answer:
        correct,

      options:
        shuffle([
          correct,
          ...distractors
        ]),
    }
  }


  // =====================================================
  // PINYIN → NGHĨA
  // =====================================================

  const correct =
    meaningOf(word)

  const distractors =
    uniqueDistractors(
      pool,
      meaningOf,
      correct
    )

  const needsDisambiguation =
    duplicatePinyins.has(
      normalizePinyin(
        word.pinyin
      )
    )


  return {
    id:
      `vocab-${word.id}-${effectiveDirection}`,

    type:
      'vocab',

    label:
      'PINYIN → NGHĨA (TIẾNG VIỆT)',

    prompt:
      word.pinyin,

    /*
      Các từ:

      他 / 她
      đều đọc tā

      坐 / 做
      đều đọc zuò

      Khi gặp pinyin trùng,
      hiển thị thêm Hán tự nhỏ
      để câu hỏi luôn chỉ có
      một đáp án đúng.
    */

    subPrompt:
      needsDisambiguation
        ? `Hán tự: ${word.hanzi}`
        : '',

    answer:
      correct,

    options:
      shuffle([
        correct,
        ...distractors
      ]),
  }
}


// ========================================================
// TẠO CÂU HỎI TRẮC NGHIỆM TỪ VỰNG
// ========================================================

export function createVocabQuestions(
  vocab,
  direction,
  count
) {
  const duplicatePinyins =
    duplicatePinyinSet(vocab)

  const chosen =
    sample(
      vocab,
      count
    )

  return chosen.map(
    (word) => {

      const effectiveDirection =
        direction === 'mixed'

          ? shuffle([
              'hanziToMeaning',
              'meaningToHanzi',
              'pinyinToMeaning',
            ])[0]

          : direction


      return vocabQuestion(
        word,
        vocab,
        effectiveDirection,
        duplicatePinyins
      )
    }
  )
}


// ========================================================
// TẠO CÂU TỰ LUẬN
// ========================================================

export function createSelfStudyQuestions(
  vocab,
  direction,
  count
) {
  return sample(
    vocab,
    count
  ).map(
    (word) => {

      const effectiveDirection =
        direction === 'mixedSelf'

          ? shuffle([
              'hanziAndPinyin',
              'meaningAndPinyin',
            ])[0]

          : direction


      // --------------------------------------------------
      // NHÌN NGHĨA → NHỚ HÁN TỰ + PINYIN
      // --------------------------------------------------

      if (
        effectiveDirection ===
        'meaningAndPinyin'
      ) {
        return {
          id:
            `self-${word.id}-meaning`,

          type:
            'self',

          label:
            'NHÌN NGHĨA, TỰ NHỚ HÁN TỰ VÀ PINYIN',

          prompt:
            meaningOf(word),

          pinyin:
            '',

          answerMain:
            word.hanzi,

          answerSub:
            word.pinyin,
        }
      }


      // --------------------------------------------------
      // NHÌN HÁN TỰ → NHỚ NGHĨA + PINYIN
      // --------------------------------------------------

      return {
        id:
          `self-${word.id}-hanzi`,

        type:
          'self',

        label:
          'NHÌN HÁN TỰ, TỰ NHỚ NGHĨA VÀ PINYIN',

        prompt:
          word.hanzi,

        pinyin:
          '',

        answerMain:
          meaningOf(word),

        answerSub:
          word.pinyin,
      }
    }
  )
}


// ========================================================
// TẠO CÂU DỊCH
// ========================================================

export function createTranslationQuestions(
  items,
  direction,
  count
) {

  const filtered =
    items.filter(
      (item) =>
        direction ===
          'mixedTranslation'
        ||
        item.direction ===
          direction
    )


  /*
    Không lấy câu từ chiều dịch khác
    nếu số câu yêu cầu lớn hơn
    số câu hiện có.
  */

  return sample(
    filtered,
    Math.min(
      Number(count) || 0,
      filtered.length
    )
  ).map(
    (item) => ({
      ...item,

      /*
        Loại bỏ option trùng
        trước khi random.
      */

      options:
        shuffle(
          [
            ...new Set(
              item.options
            )
          ]
        ),
    })
  )
}