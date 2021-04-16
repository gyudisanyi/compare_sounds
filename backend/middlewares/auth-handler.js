import jwt from 'jsonwebtoken';

export default async (req, res, next) => {

  try {
    if (!req.headers.authorization) {
      throw { status: 401, message: 'No token provided' };
    }
    console.log("TOKEN", process.env.TOKEN_SECRET);
    const token = req.headers.authorization.split(' ')[1];
    const verified = jwt.verify(token, process.env.TOKEN_SECRET || 'someOtherSecret', { algorithms: ['HS256'] });
    console.log("YOOOOOOOOOOOOOOOOOOOOOOO", {verified});
    req.user = verified;
    next();
  } catch (err) {
    next(err);
  }
};
