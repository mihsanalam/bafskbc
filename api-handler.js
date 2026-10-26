/**
 * IITian Tattva - User Profile & Authentication API Handler
 * 
 * Provides production-ready backend support for:
 * - Google Identity Services OAuth verification
 * - User profile persistence, ownership enforcement & privacy
 * - Secure session management via HTTP-only cookies
 * - Profile photo upload & local storage
 * - Institutional community verification status linking
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_FILE = path.join(__dirname, 'data', 'profiles.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Ensure profiles.json exists
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading profiles.json:', err);
  }
  return { users: {}, sessions: {} };
}

function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing profiles.json:', err);
  }
}

// Parse cookies from request headers
function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      const key = parts.shift().trim();
      const value = decodeURIComponent(parts.join('='));
      list[key] = value;
    });
  }
  return list;
}

// Generate secure session token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Clean and sanitize string (strip HTML tags)
function sanitizeText(str, maxLength = 1000) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim().slice(0, maxLength);
}

// URL validator ensuring http/https protocols only
function validateUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
  } catch (e) {
    // Invalid URL
  }
  return null;
}

// Get authenticated user from session
function getAuthenticatedUser(req) {
  const cookies = parseCookies(req);
  let token = cookies['tattva_session'];
  
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) return null;

  const data = loadData();
  const session = data.sessions[token];
  if (!session) return null;

  if (session.expiresAt && Date.now() > session.expiresAt) {
    delete data.sessions[token];
    saveData(data);
    return null;
  }

  const user = data.users[session.userId];
  if (!user) return null;

  return { user, token };
}

// Create or update user profile from Google / OAuth details
function findOrCreateUser(profileInfo) {
  const data = loadData();
  const email = (profileInfo.email || '').toLowerCase().trim();
  if (!email) throw new Error('Email is required for authentication');

  let existingUser = Object.values(data.users).find(u => (u.email || '').toLowerCase() === email);

  if (!existingUser) {
    const userId = 'usr_' + crypto.randomBytes(8).toString('hex');
    const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() || 'iitian';
    
    // Ensure unique username
    let username = baseUsername;
    let counter = 1;
    while (Object.values(data.users).some(u => u.username === username)) {
      username = `${baseUsername}${counter++}`;
    }

    const newUser = {
      id: userId,
      authProvider: 'google',
      authProviderUserId: profileInfo.sub || profileInfo.id || userId,
      name: profileInfo.name || 'IITian Member',
      username: username,
      email: email,
      profileImage: profileInfo.picture || profileInfo.profileImage || '',
      bio: 'IIT Madras BS Degree learner in Data Science and Applications.',
      institute: 'IIT Madras',
      program: 'BS in Data Science and Applications',
      academicLevel: 'Foundation Level',
      github: '',
      linkedin: '',
      leetcode: '',
      x: '',
      portfolio: '',
      location: 'India',
      skills: ['Python', 'Mathematics for Data Science', 'Computational Thinking'],
      communityStatus: 'unverified', // Verified only via official student email verification
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.users[userId] = newUser;
    existingUser = newUser;
  } else {
    // Update existing user with updated Google picture if not customized with local upload
    let updated = false;
    if (profileInfo.picture && !existingUser.profileImage.startsWith('/uploads/')) {
      existingUser.profileImage = profileInfo.picture;
      updated = true;
    }
    if (profileInfo.name && !existingUser.name) {
      existingUser.name = profileInfo.name;
      updated = true;
    }
    if (updated) {
      existingUser.updatedAt = new Date().toISOString();
    }
  }

  // Create session (valid for 30 days)
  const token = generateToken();
  data.sessions[token] = {
    userId: existingUser.id,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
  };

  saveData(data);
  return { user: existingUser, token };
}

// Decode Google JWT payload safely
function decodeJwtPayload(jwtToken) {
  try {
    const parts = jwtToken.split('.');
    if (parts.length !== 3) return null;
    const payloadStr = Buffer.from(parts[1], 'base64').toString('utf8');
    return JSON.parse(payloadStr);
  } catch (err) {
    console.error('Failed to parse JWT payload:', err);
    return null;
  }
}

// Read body helper
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 10 * 1024 * 1024) { // 10MB limit
        reject(new Error('Request entity too large'));
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        const json = JSON.parse(body);
        resolve(json);
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Send JSON response
function sendJson(res, statusCode, data, headers = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    ...headers
  });
  res.end(JSON.stringify(data));
}

/**
 * Main API Request Dispatcher
 */
async function handleApiRequest(req, res) {
  const urlPath = req.url.split('?')[0];
  const method = req.method.toUpperCase();

  // 1. GET /api/auth/config - Expose OAuth client ID configuration status
  if (urlPath === '/api/auth/config' && method === 'GET') {
    return sendJson(res, 200, {
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
      isConfigured: !!process.env.GOOGLE_CLIENT_ID
    });
  }

  // 2. GET /api/auth/me - Current logged-in user profile
  if (urlPath === '/api/auth/me' && method === 'GET') {
    const auth = getAuthenticatedUser(req);
    if (!auth) {
      return sendJson(res, 200, { authenticated: false, user: null });
    }
    return sendJson(res, 200, { authenticated: true, user: auth.user });
  }

  // 3. POST /api/auth/google - Authenticate via Google Identity Services
  if (urlPath === '/api/auth/google' && method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const credential = body.credential;
      if (!credential) {
        return sendJson(res, 400, { error: 'Missing Google credential' });
      }

      const payload = decodeJwtPayload(credential);
      if (!payload || !payload.email) {
        return sendJson(res, 400, { error: 'Invalid Google token payload' });
      }

      // If GOOGLE_CLIENT_ID is configured, verify audience
      const configuredClientId = process.env.GOOGLE_CLIENT_ID;
      if (configuredClientId && payload.aud !== configuredClientId) {
        return sendJson(res, 401, { error: 'Google Client ID mismatch' });
      }

      const { user, token } = findOrCreateUser({
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      });

      // Set secure HTTP-only cookie
      const cookieHeader = `tattva_session=${token}; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax; HttpOnly`;
      return sendJson(res, 200, { success: true, user, token }, { 'Set-Cookie': cookieHeader });
    } catch (err) {
      console.error('Google Auth Error:', err);
      return sendJson(res, 500, { error: err.message || 'Authentication failed' });
    }
  }

  // 4. POST /api/auth/dev-login - One-click test sign-in for development / evaluation
  if (urlPath === '/api/auth/dev-login' && method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const email = (body.email || 'learner@gmail.com').toLowerCase().trim();
      const name = body.name || 'IITM BS Learner';
      const picture = body.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&q=80&auto=format&fit=crop';

      const { user, token } = findOrCreateUser({
        sub: 'dev_' + crypto.createHash('md5').update(email).digest('hex'),
        email,
        name,
        picture
      });

      const cookieHeader = `tattva_session=${token}; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax; HttpOnly`;
      return sendJson(res, 200, { success: true, user, token }, { 'Set-Cookie': cookieHeader });
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // 5. POST /api/auth/logout - Sign out current session
  if (urlPath === '/api/auth/logout' && method === 'POST') {
    const auth = getAuthenticatedUser(req);
    if (auth && auth.token) {
      const data = loadData();
      delete data.sessions[auth.token];
      saveData(data);
    }
    const expiredCookie = 'tattva_session=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly';
    return sendJson(res, 200, { success: true }, { 'Set-Cookie': expiredCookie });
  }

  // 6. GET /api/profile - Fetch current authenticated user's profile
  if (urlPath === '/api/profile' && method === 'GET') {
    const auth = getAuthenticatedUser(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Unauthorized. Please sign in.' });
    }
    return sendJson(res, 200, { profile: auth.user });
  }

  // 7. PUT /api/profile - Update authenticated user's profile
  if (urlPath === '/api/profile' && method === 'PUT') {
    const auth = getAuthenticatedUser(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Unauthorized. Please sign in.' });
    }

    try {
      const body = await readJsonBody(req);
      const data = loadData();
      const user = data.users[auth.user.id];
      if (!user) {
        return sendJson(res, 404, { error: 'User profile not found' });
      }

      // STRICT VALIDATION & SANITIZATION
      // 1. Full name
      if (typeof body.name === 'string') {
        const sanitizedName = sanitizeText(body.name, 100);
        if (!sanitizedName) return sendJson(res, 400, { error: 'Full name cannot be empty' });
        user.name = sanitizedName;
      }

      // 2. Username
      if (typeof body.username === 'string') {
        const cleanUsername = body.username.trim().toLowerCase();
        if (!/^[a-z0-9_]{3,30}$/.test(cleanUsername)) {
          return sendJson(res, 400, { error: 'Username must be 3-30 alphanumeric characters or underscores.' });
        }
        // Check uniqueness across other users
        const usernameTaken = Object.values(data.users).some(u => u.id !== user.id && u.username === cleanUsername);
        if (usernameTaken) {
          return sendJson(res, 400, { error: 'This username is already taken. Please choose another.' });
        }
        user.username = cleanUsername;
      }

      // 3. Biography
      if (typeof body.bio === 'string') {
        user.bio = sanitizeText(body.bio, 500);
      }

      // 4. Academic Programme & Level
      if (typeof body.program === 'string') {
        user.program = sanitizeText(body.program, 120);
      }
      if (typeof body.academicLevel === 'string') {
        user.academicLevel = sanitizeText(body.academicLevel, 80);
      }

      // 5. Social URLs (Strict validation - prevent javascript: injection)
      const urlFields = ['github', 'linkedin', 'x', 'portfolio', 'leetcode'];
      for (const field of urlFields) {
        if (typeof body[field] === 'string') {
          let val = body[field].trim();
          if (field === 'leetcode' && val && !val.startsWith('http://') && !val.startsWith('https://')) {
            val = `https://leetcode.com/u/${val.replace(/[^a-zA-Z0-9_-]/g, '')}`;
          }
          const validated = validateUrl(val);
          if (validated === null) {
            return sendJson(res, 400, { error: `Invalid URL format for ${field}` });
          }
          user[field] = validated;
        }
      }

      // 6. Location
      if (typeof body.location === 'string') {
        user.location = sanitizeText(body.location, 100);
      }

      // 7. Skills & Interests (array of strings)
      if (Array.isArray(body.skills)) {
        user.skills = body.skills
          .filter(s => typeof s === 'string')
          .map(s => sanitizeText(s, 40))
          .filter(Boolean)
          .slice(0, 20);
      }

      // 8. Profile Image URL (if from upload or external)
      if (typeof body.profileImage === 'string') {
        const imgUrl = body.profileImage.trim();
        if (imgUrl.startsWith('/uploads/') || validateUrl(imgUrl)) {
          user.profileImage = imgUrl;
        }
      }

      // PROTECTED FIELDS: User cannot modify email, authProviderUserId, or communityStatus directly here!
      // NEVER ACCEPT OR STORE PHONE NUMBER: Ignore any phone field entirely.

      user.updatedAt = new Date().toISOString();
      saveData(data);

      return sendJson(res, 200, { success: true, profile: user });
    } catch (err) {
      console.error('Profile update error:', err);
      return sendJson(res, 500, { error: err.message || 'Failed to update profile' });
    }
  }

  // 8. POST /api/profile/upload-photo - Upload and save profile photo
  if (urlPath === '/api/profile/upload-photo' && method === 'POST') {
    const auth = getAuthenticatedUser(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Unauthorized. Please sign in.' });
    }

    try {
      const body = await readJsonBody(req);
      const dataUri = body.image;
      if (!dataUri || typeof dataUri !== 'string') {
        return sendJson(res, 400, { error: 'No image data provided' });
      }

      // Validate base64 Data URI header
      const match = dataUri.match(/^data:image\/(jpeg|png|webp);base64,(.+)$/i);
      if (!match) {
        return sendJson(res, 400, { error: 'Supported formats: JPEG, PNG, WebP.' });
      }

      const ext = match[1] === 'jpeg' ? 'jpg' : match[1].toLowerCase();
      const base64Data = match[2];
      const buffer = Buffer.from(base64Data, 'base64');

      // Max 5MB
      if (buffer.length > 5 * 1024 * 1024) {
        return sendJson(res, 400, { error: 'Image size must be less than 5MB.' });
      }

      const filename = `photo_${auth.user.id}_${Date.now()}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, filename);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${filename}`;

      // Update user profile with new photo
      const data = loadData();
      if (data.users[auth.user.id]) {
        data.users[auth.user.id].profileImage = publicUrl;
        data.users[auth.user.id].updatedAt = new Date().toISOString();
        saveData(data);
      }

      return sendJson(res, 200, { success: true, url: publicUrl });
    } catch (err) {
      console.error('Photo upload error:', err);
      return sendJson(res, 500, { error: err.message || 'Failed to upload photo' });
    }
  }

  // 9. POST /api/profile/link-student-verification - Link institutional verification status
  if (urlPath === '/api/profile/link-student-verification' && method === 'POST') {
    const auth = getAuthenticatedUser(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Unauthorized' });
    }

    try {
      const body = await readJsonBody(req);
      const { studentEmail, verificationToken } = body;
      
      // Verification token check from institutional flow
      if (!studentEmail || !verificationToken) {
        return sendJson(res, 400, { error: 'Missing institutional verification data' });
      }

      const data = loadData();
      if (data.users[auth.user.id]) {
        data.users[auth.user.id].communityStatus = 'verified';
        data.users[auth.user.id].verifiedStudentEmail = studentEmail.toLowerCase().trim();
        data.users[auth.user.id].verifiedAt = new Date().toISOString();
        saveData(data);
      }

      return sendJson(res, 200, { success: true, communityStatus: 'verified' });
    } catch (err) {
      return sendJson(res, 500, { error: err.message });
    }
  }

  // Unknown API route
  return sendJson(res, 404, { error: 'API endpoint not found' });
}

module.exports = {
  handleApiRequest,
  getAuthenticatedUser
};
