const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Borrower = require('../../borrowers/models/Borrower.js');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../../../../config/app.config.js');

class AuthService {
    async register(userData) {
        const { email, password, name } = userData;
        
        // Check if user already exists
        const existingUser = await Borrower.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Hash password
        const passwordHash = await bcryptjs.hash(password, 10);

        // Create user
        const borrower = await Borrower.create({
            name,
            email,
            password_hash: passwordHash,
            registered_at: new Date(),
            is_verified: true, // For simplicity, we're setting this to true
        });

        // Generate token
        const token = this.generateToken(borrower);

        this.cleanUpBorrower(borrower);

        return { borrower, token };
    }

    async login(email, password) {
        // Find user
        const borrower = await Borrower.findOne({ where: { email } });
        if (!borrower) {
            throw new Error('Invalid credentials');
        }

        // Verify password
        const isValidPassword = await bcryptjs.compare(password, borrower.password_hash);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        // Generate token
        const token = this.generateToken(borrower);

        this.cleanUpBorrower(borrower);
        return { borrower, token };
    }

    generateToken(borrower) {
        return jwt.sign(
            { 
                id: borrower.id, 
                email: borrower.email,
                isAdmin: borrower.is_admin 
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
    }

    async verifyToken(token) {
        try {
            // Verify the token and get decoded data
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Check if user still exists
            const borrower = await Borrower.findOne({ where: { id: decoded.id } });
            if (!borrower) {
                throw new Error('User not found');
            }

            // Check if user is still active/valid
            if (!borrower.is_verified) {
                throw new Error('User is not verified');
            }

            // Calculate token expiration
            const tokenExp = new Date(decoded.exp * 1000); // Convert to milliseconds
            const now = new Date();

            // Check if token is expired
            if (tokenExp <= now) {
                throw new Error('Token has expired');
            }

            // Return relevant information
            return {
                id: borrower.id,
                email: borrower.email,
                isAdmin: borrower.is_admin,
            };
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                throw new Error('Invalid token');
            }
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token has expired');
            }
            throw error;
        }
    }
    cleanUpBorrower(borrower) {
        delete borrower.dataValues.password_hash;
        delete borrower.dataValues.is_verified;
        delete borrower.dataValues.registered_at;
        delete borrower.dataValues.id;
        delete borrower.dataValues.is_admin;
        delete borrower.dataValues.verification_token;
        delete borrower.dataValues.verification_token_expiry;
    }
}

module.exports = new AuthService();