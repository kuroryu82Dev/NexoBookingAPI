function message(issues) {
  return issues.map((issue) => `${issue.path.join('.') || 'datos'}: ${issue.message}`).join('; ');
}

function validate(source, target) {
  return (schema) => (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({ status: 'error', message: message(result.error.issues) });
    }
    req[target] = result.data;
    return next();
  };
}

export const validateBody = validate('body', 'validatedBody');
export const validateParams = validate('params', 'validatedParams');
export const validateQuery = validate('query', 'validatedQuery');
