/**
 * IITian Tattva - Official Social Media Channels Configuration
 * Extracted directly from official Linktree: https://linktr.ee/iitiantattva
 * 
 * Used across the website to keep all social links consistent, accessible,
 * and synchronized between header, footer, homepage, and contact desk.
 */

(function(root) {
  'use strict';

  var SOCIAL_PLATFORMS = [
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@iitiantattva',
      url: 'https://www.instagram.com/iitiantattva',
      description: 'Daily study tips, campus highlights, and community updates',
      badge: 'FOLLOW',
      brandColor: '#E1306C',
      contactPageExclusive: true,
      svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      handle: '@iitiantattva',
      url: 'https://www.youtube.com/@iitiantattva',
      description: 'Course breakdowns, term strategies, and academic workshops',
      badge: 'SUBSCRIBE',
      brandColor: '#FF0000',
      contactPageExclusive: false,
      svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      handle: '@iitiantattva',
      url: 'https://x.com/iitiantattva',
      description: 'Real-time announcements, IITM BS news, and tech threads',
      badge: 'FOLLOW',
      brandColor: '#000000',
      contactPageExclusive: true,
      svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      handle: 'IITian Tattva',
      url: 'https://www.linkedin.com/company/iitian-tattva/home/',
      description: 'Professional networking, capstone showcases, and career opportunities',
      badge: 'CONNECT',
      brandColor: '#0A66C2',
      contactPageExclusive: true,
      svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8Z"/></svg>'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      handle: 'iitiantattva',
      url: 'https://www.facebook.com/iitiantattva',
      description: 'Community notices, event reminders, and group activities',
      badge: 'FOLLOW',
      brandColor: '#1877F2',
      contactPageExclusive: false,
      svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
    },
    {
      id: 'twitch',
      name: 'Twitch',
      handle: 'iitiantattva',
      url: 'https://www.twitch.tv/iitiantattva',
      description: 'Live coding sessions, study-with-me streams, and OPPE prep',
      badge: 'FOLLOW',
      brandColor: '#9146FF',
      contactPageExclusive: false,
      svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0h1.714v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>'
    },
    {
      id: 'threads',
      name: 'Threads',
      handle: '@iitiantattva',
      url: 'https://www.threads.com/@iitiantattva',
      description: 'Quick discussions, student Q&A, and bitesize wisdom',
      badge: 'FOLLOW',
      brandColor: '#000000',
      contactPageExclusive: false,
      svg: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.186 24C5.452 24 0 18.618 0 12.055 0 5.494 5.452.11 12.186.11c6.643 0 11.97 5.253 12.028 11.758v.489h-3.447v-.489c-.055-4.576-3.805-8.31-8.581-8.31-4.793 0-8.694 3.864-8.694 8.497 0 4.634 3.901 8.497 8.694 8.497 3.407 0 6.37-1.974 7.753-4.912.443.275.923.518 1.436.721-1.782 4.316-5.836 7.644-10.384 7.644zm.006-16.326c2.518 0 4.566 2.023 4.566 4.512 0 .548-.103 1.074-.29 1.562-1.025-.262-2.146-.395-3.32-.395-3.056 0-5.184 1.59-5.184 3.863 0 2.235 2.046 3.738 4.79 3.738 2.035 0 3.802-.916 4.544-2.36.037.29.096.57.176.84-.79 1.543-2.585 2.585-4.72 2.585-3.64 0-6.6-2.92-6.6-6.505 0-3.585 2.96-6.505 6.6-6.505zm.743 7.822c1.076 0 2.083.155 2.964.44-.067 1.488-1.282 2.656-2.793 2.656-1.583 0-2.617-.842-2.617-2.072 0-1.218 1.054-2.024 2.446-2.024z"/></svg>'
    }
  ];

  var SOCIAL_LINKTREE_URL = 'https://linktr.ee/iitiantattva';

  var IITIAN_SOCIALS = {
    platforms: SOCIAL_PLATFORMS,
    linktreeUrl: SOCIAL_LINKTREE_URL,
    getById: function(id) {
      for (var i = 0; i < SOCIAL_PLATFORMS.length; i++) {
        if (SOCIAL_PLATFORMS[i].id === id) return SOCIAL_PLATFORMS[i];
      }
      return null;
    },
    getContactChannels: function() {
      return SOCIAL_PLATFORMS.filter(function(item) {
        return item.contactPageExclusive;
      });
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = IITIAN_SOCIALS;
  } else {
    root.IITIAN_SOCIALS = IITIAN_SOCIALS;
  }
})(typeof window !== 'undefined' ? window : this);
