
// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message:
      req.app.get('env') === 'development'
        ? err.message
        : 'Unknown error happened',
  });
};