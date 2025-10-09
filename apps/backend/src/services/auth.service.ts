import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword, generateVerificationCode, hashVerificationCode, compareVerificationCode } from '../utils/password';
import { generateTokenPair, verifyToken } from '../utils/jwt';
import { TokenPair } from '../types';
import { sendVerificationEmail } from './email.service';

const VERIFICATION_EXPIRY_MINUTES = 10;
const MAX_VERIFICATION_ATTEMPTS = 5;
const MAX_RESEND_COUNT = 3;

export class AuthService {
  // Sign up a new user
  async signup(email: string, password: string, name?: string) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      if (existingUser.emailVerifiedAt) {
        throw new Error('Email already registered');
      }
      // User exists but not verified - allow re-registration
      await prisma.user.delete({ where: { id: existingUser.id } });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || null,
      },
    });

    // Generate and send verification code
    await this.sendVerificationCode(user.id, email);

    return {
      userId: user.id,
      email: user.email,
      message: 'Verification code sent to your email',
    };
  }

  // Send verification code
  async sendVerificationCode(userId: string, email: string) {
    // Delete any existing verification codes for this user
    await prisma.emailVerification.deleteMany({ where: { userId } });

    // Generate 4-digit code
    const code = generateVerificationCode();
    const codeHash = await hashVerificationCode(code);

    // Create verification record
    const expiresAt = new Date(Date.now() + VERIFICATION_EXPIRY_MINUTES * 60 * 1000);

    await prisma.emailVerification.create({
      data: {
        userId,
        codeHash,
        expiresAt,
      },
    });

    // Send email
    await sendVerificationEmail(email, code);

    return { message: 'Verification code sent' };
  }

  // Verify email with code
  async verifyEmail(email: string, code: string) {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.emailVerifiedAt) {
      throw new Error('Email already verified');
    }

    // Find verification record
    const verification = await prisma.emailVerification.findFirst({
      where: {
        userId: user.id,
        consumedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!verification) {
      throw new Error('Verification code not found');
    }

    // Check expiry
    if (new Date() > verification.expiresAt) {
      throw new Error('Verification code expired');
    }

    // Check attempts
    if (verification.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      throw new Error('Too many verification attempts. Please request a new code');
    }

    // Verify code
    const isValid = await compareVerificationCode(code, verification.codeHash);

    if (!isValid) {
      // Increment attempts
      await prisma.emailVerification.update({
        where: { id: verification.id },
        data: { attempts: verification.attempts + 1 },
      });
      throw new Error('Invalid verification code');
    }

    // Mark as verified
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { emailVerifiedAt: new Date() },
      }),
      prisma.emailVerification.update({
        where: { id: verification.id },
        data: { consumedAt: new Date() },
      }),
    ]);

    // Generate tokens
    const tokens = generateTokenPair({ userId: user.id, email: user.email });

    // Store refresh token
    const tokenHash = await hashPassword(tokens.refreshToken);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      ...tokens,
    };
  }

  // Resend verification code
  async resendVerificationCode(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.emailVerifiedAt) {
      throw new Error('Email already verified');
    }

    // Check resend count
    const lastVerification = await prisma.emailVerification.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (lastVerification && lastVerification.sentCount >= MAX_RESEND_COUNT) {
      throw new Error('Maximum resend attempts reached. Please try again later');
    }

    // Send new code
    await this.sendVerificationCode(user.id, email);

    if (lastVerification) {
      await prisma.emailVerification.update({
        where: { id: lastVerification.id },
        data: {
          sentCount: lastVerification.sentCount + 1,
          lastSentAt: new Date(),
        },
      });
    }

    return { message: 'Verification code resent' };
  }

  // Login
  async login(email: string, password: string): Promise<TokenPair & { user: any }> {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.emailVerifiedAt) {
      throw new Error('Email not verified. Please verify your email first');
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokens = generateTokenPair({ userId: user.id, email: user.email });

    // Store refresh token
    const tokenHash = await hashPassword(tokens.refreshToken);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      ...tokens,
    };
  }

  // Refresh tokens
  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    // Verify token
    let payload;
    try {
      payload = verifyToken(refreshToken);
    } catch {
      throw new Error('Invalid refresh token');
    }

    // Find token in database
    const tokenHash = await hashPassword(refreshToken);
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        userId: payload.userId,
        revokedAt: null,
      },
    });

    if (!storedToken) {
      throw new Error('Refresh token not found or revoked');
    }

    // Revoke old token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Generate new tokens
    const tokens = generateTokenPair({ userId: payload.userId, email: payload.email });

    // Store new refresh token
    const newTokenHash = await hashPassword(tokens.refreshToken);
    await prisma.refreshToken.create({
      data: {
        userId: payload.userId,
        tokenHash: newTokenHash,
      },
    });

    return tokens;
  }

  // Logout
  async logout(refreshToken: string): Promise<void> {
    try {
      const payload = verifyToken(refreshToken);

      // Revoke the refresh token
      await prisma.refreshToken.updateMany({
        where: {
          userId: payload.userId,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      });
    } catch {
      // Token invalid or expired - no action needed
    }
  }

  // Get user by ID
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

export const authService = new AuthService();
