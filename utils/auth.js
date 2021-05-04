import jwt from 'jsonwebtoken';

export const newToken = (user) => {
	return jwt.sign({id: user.id}, process.env.JWTSECRET, {
		expiresIn: '2h'
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

export const protect = async (req, res, next) => {
	//check for token in header
	//reformat token
	//verify token
	//put user on the req obj
	// if the token's about to expire renew it?
	//next
};
