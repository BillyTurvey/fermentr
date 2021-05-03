import jwt from 'jsonwebtoken';

export const newToken = (user) => {
	return jwt.sign({id: user.id}, process.env.JWTSECRET, {
		expiresIn: '1d'
	});
};

export const verifyToken = (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWTSECRET, (err, payload) => {
			if (err) return reject(err);
			resolve(payload);
		});
	});
};
