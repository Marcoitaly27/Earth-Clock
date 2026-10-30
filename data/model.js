export const fact = (type, en, it, source) => ({ type, text: { en, it }, ...(source ? { source } : {}) });

export const event = (id, name_en, name_it, mya, category, description_en, description_it, source, note_en, note_it, curiosities, perspective) => ({
  id, name_it, name_en, mya, category, description_it, description_en, source, curiosities,
  ...(note_en ? { uncertain: true, note_en, note_it } : {}),
  ...(perspective ? { perspective } : {})
});
