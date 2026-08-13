export function shuffle(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function sample(items, count) {
  return shuffle(items).slice(0, Math.min(count, items.length))
}

export function createVocabQuestions(vocab, direction, count) {
  const chosen = sample(vocab, count)

  return chosen.map((word) => {
    const effectiveDirection = direction === 'mixed'
      ? shuffle(['hanziToMeaning', 'meaningToHanzi', 'pinyinToMeaning'])[0]
      : direction

    const pool = vocab.filter((item) => item.id !== word.id)

    if (effectiveDirection === 'meaningToHanzi') {
      const distractors = sample(pool, 3).map((item) => item.hanzi)
      return {
        id: `vocab-${word.id}-${effectiveDirection}`,
        type: 'vocab',
        label: 'NGHĨA → HÁN TỰ',
        prompt: word.vi,
        subPrompt: word.pinyin,
        answer: word.hanzi,
        options: shuffle([word.hanzi, ...distractors]),
      }
    }

    if (effectiveDirection === 'hanziToMeaning') {
      const distractors = sample(pool, 3).map((item) => item.vi)
      return {
        id: `vocab-${word.id}-${effectiveDirection}`,
        type: 'vocab',
        label: 'HÁN TỰ → NGHĨA (TIẾNG VIỆT)',
        prompt: word.hanzi,
        subPrompt: word.pinyin,
        answer: word.vi,
        options: shuffle([word.vi, ...distractors]),
      }
    }

    const distractors = sample(pool, 3).map((item) => item.vi)
    return {
      id: `vocab-${word.id}-${effectiveDirection}`,
      type: 'vocab',
      label: 'PINYIN → NGHĨA (TIẾNG VIỆT)',
      prompt: word.pinyin,
      subPrompt: '',
      answer: word.vi,
      options: shuffle([word.vi, ...distractors]),
    }
  })
}

export function createSelfStudyQuestions(vocab, direction, count) {
  return sample(vocab, count).map((word) => {
    const effectiveDirection = direction === 'mixedSelf'
      ? shuffle(['hanziAndPinyin', 'meaningAndPinyin'])[0]
      : direction

    if (effectiveDirection === 'meaningAndPinyin') {
      return {
        id: `self-${word.id}-meaning`,
        type: 'self',
        label: 'NHÌN NGHĨA, TỰ NHỚ HÁN TỰ VÀ PINYIN',
        prompt: word.vi,
        pinyin: '',
        answerMain: word.hanzi,
        answerSub: word.pinyin,
      }
    }

    return {
      id: `self-${word.id}-hanzi`,
      type: 'self',
      label: 'NHÌN HÁN TỰ, TỰ NHỚ NGHĨA VÀ PINYIN',
      prompt: word.hanzi,
      pinyin: '',
      answerMain: word.vi,
      answerSub: word.pinyin,
    }
  })
}

export function createTranslationQuestions(items, direction, count) {
  const filtered = items.filter((item) => direction === 'mixedTranslation' || item.direction === direction)
  const source = filtered.length >= count ? filtered : items
  return sample(source, count).map((item) => ({
    ...item,
    options: shuffle(item.options),
  }))
}
