const { z } = require('zod');

const SUPPORTED_SLIDE_TYPES = ['PHOTO', 'QUESTION', 'BEFORE_AFTER', 'SIBLING_COURT', 'CHAT_SCREENSHOT'];

const createSlideSchema = z.object({
  type: z.enum(SUPPORTED_SLIDE_TYPES),
  position: z.number().int().nonnegative(),
  data: z.record(z.any()),
});

const validateCreateSlideInput = (data) => createSlideSchema.parse(data);

module.exports = { validateCreateSlideInput, SUPPORTED_SLIDE_TYPES };
