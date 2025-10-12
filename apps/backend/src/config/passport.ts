import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { authService } from '../services/auth.service';

/**
 * Configure Passport Google OAuth 2.0 Strategy
 */
export function configurePassport() {
  // Only configure Google OAuth if credentials are provided
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (googleClientId && googleClientSecret) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: googleClientId,
          clientSecret: googleClientSecret,
          callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8080/api/auth/google/callback',
        },
        async (
          accessToken: string,
          refreshToken: string,
          profile: Profile,
          done: VerifyCallback
        ) => {
          try {
            // Find or create user from Google profile
            const user = await authService.findOrCreateGoogleUser(profile);
            return done(null, user);
          } catch (error) {
            console.error('Google OAuth Error:', error);
            return done(error as Error);
          }
        }
      )
    );
    console.log('✅ Google OAuth configured');
  } else {
    console.warn('⚠️  Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
  }

  // Serialize user for session (we won't use sessions, but Passport requires it)
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await authService.getUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}
