export const cookieOptions = {
  httpOnly: true,        // JS cannot access cookie (protects from XSS)
  secure: false,         // true only in production (HTTPS)
  sameSite: "lax",       // prevents CSRF mostly
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
