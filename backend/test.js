import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { password: 'amal123' },      // payload
  'your-secret-key',            // signing secret
);

console.log(token);