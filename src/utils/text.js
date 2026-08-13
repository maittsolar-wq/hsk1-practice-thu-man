export const containsChinese = (text = '') => /[\u3400-\u9FFF]/.test(String(text))
