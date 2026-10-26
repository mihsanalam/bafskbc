const https = require('https');
const fs = require('fs');

const users = ['leomouraire', 'marti.fenosa', 'julien.rno', 'ps'];
users.forEach(u => {
  https.get('https://okaydev.co/u/' + u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      const allAvatars = data.match(/https:\/\/images\.okaydev\.co\/production\/uploads\/u\/[^\/]+\/avatars\/[^"'\s>]+\.(jpg|png|webp)[^"'\s>]*/gi) || [];
      console.log(u, 'Avatars:', allAvatars);
      const projMatch = data.match(/https:\/\/images\.okaydev\.co\/production\/uploads\/u\/[^\/]+\/portfolio\/[^"'\s>]+\.(jpg|png|webp)[^"'\s>]*/gi) || [];
      console.log(u, 'Portfolio:', projMatch.slice(0, 2));
    });
  });
});
