import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword, generateVerificationCode, hashVerificationCode, compareVerificationCode, generateResetToken, hashResetToken, compareResetToken } from '../utils/password';
import { generateTokenPair, verifyToken } from '../utils/jwt';
import { TokenPair } from '../types';
import { sendVerificationEmail, sendPasswordResetEmail } from './email.service';

const VERIFICATION_EXPIRY_MINUTES = 10;
const MAX_VERIFICATION_ATTEMPTS = 5;
const MAX_RESEND_COUNT = 3;
const RESET_TOKEN_EXPIRY_HOURS = 1;

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
    const [updatedUser] = await prisma.$transaction([
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
    const tokens = generateTokenPair({ userId: updatedUser.id, email: updatedUser.email });

    // Store refresh token
    const tokenHash = await hashPassword(tokens.refreshToken);
    await prisma.refreshToken.create({
      data: {
        userId: updatedUser.id,
        tokenHash,
      },
    });

    return {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        emailVerifiedAt: updatedUser.emailVerifiedAt?.toISOString() || null,
        googleId: updatedUser.googleId,
        provider: updatedUser.provider,
        avatar: updatedUser.avatar,
        theme: updatedUser.theme,
        language: updatedUser.language,
        createdAt: updatedUser.createdAt.toISOString(),
        updatedAt: updatedUser.updatedAt.toISOString(),
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

    // Check if user signed up with OAuth (no password)
    if (!user.passwordHash) {
      throw new Error('This account uses social login. Please sign in with Google');
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
        role: user.role,
        emailVerifiedAt: user.emailVerifiedAt?.toISOString() || null,
        googleId: user.googleId,
        provider: user.provider,
        avatar: user.avatar,
        theme: user.theme,
        language: user.language,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
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
        role: true,
        googleId: true,
        provider: true,
        avatar: true,
        theme: true,
        language: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Update user profile
  async updateUserProfile(
    userId: string,
    data: { name?: string; theme?: string; language?: string }
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name !== undefined ? data.name : user.name,
        theme: data.theme !== undefined ? data.theme : user.theme,
        language: data.language !== undefined ? data.language : user.language,
      },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerifiedAt: true,
        role: true,
        googleId: true,
        provider: true,
        avatar: true,
        theme: true,
        language: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  // Find or create user from Google OAuth profile
  async findOrCreateGoogleUser(profile: any) {
    const email = profile.emails?.[0]?.value;
    const googleId = profile.id;
    const name = profile.displayName;
    const avatar = profile.photos?.[0]?.value;

    if (!email) {
      throw new Error('No email found in Google profile');
    }

    // Check if user exists by Google ID
    let user = await prisma.user.findUnique({
      where: { googleId },
    });

    if (user) {
      // Update avatar if changed
      if (user.avatar !== avatar) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { avatar },
        });
      }
      return user;
    }

    // Check if user exists by email
    user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Link Google account to existing user
      return await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId,
          provider: 'google',
          avatar,
          emailVerifiedAt: user.emailVerifiedAt || new Date(), // Auto-verify if from Google
        },
      });
    }

    // Create new user with Google account
    return await prisma.user.create({
      data: {
        email,
        name,
        googleId,
        provider: 'google',
        avatar,
        emailVerifiedAt: new Date(), // Google emails are pre-verified
      },
    });
  }

  // Request password reset
  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('No account found with this email address');
    }

    if (!user.emailVerifiedAt) {
      throw new Error('Email not verified. Please verify your email first');
    }

    // Delete any existing password reset codes for this user
    await prisma.passwordReset.deleteMany({
      where: { userId: user.id },
    });

    // Generate 4-digit PIN code (similar to email verification)
    const code = generateVerificationCode();
    const codeHash = await hashVerificationCode(code);

    // Create reset record (expires in 10 minutes, same as email verification)
    const expiresAt = new Date(Date.now() + VERIFICATION_EXPIRY_MINUTES * 60 * 1000);

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        tokenHash: codeHash, // Using tokenHash field to store code hash
        expiresAt,
      },
    });

    // Send reset email with PIN code
    await sendPasswordResetEmail(email, code);

    return { message: 'If the email exists, a password reset code has been sent' };
  }

  // Reset password with PIN code
  async resetPassword(email: string, code: string, newPassword: string) {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.emailVerifiedAt) {
      throw new Error('Email not verified');
    }

    // Find reset record
    const reset = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        consumedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!reset) {
      throw new Error('No password reset request found');
    }

    // Check expiry
    if (new Date() > reset.expiresAt) {
      throw new Error('Reset code expired');
    }

    // Check attempts (max 5, same as email verification)
    if (reset.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      throw new Error('Too many attempts. Please request a new reset code');
    }

    // Verify code
    const isValid = await compareVerificationCode(code, reset.tokenHash);

    if (!isValid) {
      // Increment attempts
      await prisma.passwordReset.update({
        where: { id: reset.id },
        data: { attempts: reset.attempts + 1 },
      });
      throw new Error('Invalid reset code');
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password and mark code as consumed
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      prisma.passwordReset.update({
        where: { id: reset.id },
        data: { consumedAt: new Date() },
      }),
      // Revoke all existing refresh tokens for security
      prisma.refreshToken.updateMany({
        where: {
          userId: user.id,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { message: 'Password reset successful' };
  }
}

export const authService = new AuthService();
