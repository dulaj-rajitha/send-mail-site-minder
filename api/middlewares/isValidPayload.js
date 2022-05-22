const isValidPayload = (payload, constraint) => {
  const { error } = constraint.validate(payload);
  if (error) {
    const message = error.details.shift().message.replace(/"/g, '');
    throw new Error(message);
  }
};

module.exports = (constraint) => (req, res, next) => {
  try {
    isValidPayload(req, constraint);
    next();
  } catch (error) {
    res.status(400).json({ ok: false, error: 'Invalid payload', data: error.message });
  }
};
