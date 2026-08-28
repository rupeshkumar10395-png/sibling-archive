const { z } = require('zod');

const createArchiveSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
});

const validateCreateArchiveInput = (data) => createArchiveSchema.parse(data);

module.exports = { validateCreateArchiveInput };
