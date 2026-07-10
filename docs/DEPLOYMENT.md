# Deployment Guide

## 🚀 Deploy ke Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free)
- Repository di GitHub

### Steps

1. **Push ke GitHub**
```bash
git add .
git commit -m "Tournament TCG - Ready for deployment"
git push origin main
```

2. **Connect ke Vercel**
   - Buka https://vercel.com
   - Klik "New Project"
   - Import GitHub repository
   - Pilih `tournament-tcg`

3. **Configure Environment**
   - Di Vercel, tambah Environment Variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

4. **Deploy**
   - Klik "Deploy"
   - Tunggu ~5 menit
   - Done! 🎉

URL akan berupa: `https://tournament-tcg-[id].vercel.app`

---

## 🐳 Deploy dengan Docker

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Build & Run
```bash
docker build -t tournament-tcg .
docker run -p 3000:3000 tournament-tcg
```

---

## 🌐 Deploy ke Netlify

1. **Connect Repository**
   - Buka netlify.com
   - "New site from Git"
   - Select GitHub repo

2. **Configure Build**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Add Environment Variables**
   - Site settings → Build & deploy → Environment
   - Add Firebase credentials

4. **Deploy**
   - Klik "Deploy site"

---

## 💻 Deploy Lokal (Server)

### Requirements
- Node.js 16+
- Server/VPS

### Setup
```bash
# Clone
git clone https://github.com/ValentinoHarianto/tournament-tcg.git
cd tournament-tcg

# Install & Build
npm install
npm run build

# Run Production
npm start
```

### With PM2 (Keep Running)
```bash
npm install -g pm2

pm2 start npm --name "tournament-tcg" -- start
pm2 save
pm2 startup
```

---

## 🔐 Security Checklist

- [ ] Enable Firebase Security Rules
- [ ] Set Environment Variables (tidak hardcode)
- [ ] Use HTTPS (automatic di Vercel/Netlify)
- [ ] Regular backups
- [ ] Monitor logs

---

## 📈 Performance Tips

1. **Image Optimization**
   - Gunakan Next.js Image component

2. **Code Splitting**
   - Sudah built-in di Next.js

3. **Caching**
   - Browser cache enabled
   - Firebase caching

4. **Database**
   - Firestore indexes untuk query cepat

---

## 🆘 Troubleshooting

### Build Error
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Firebase Not Working
- Verify credentials di environment
- Check Firestore Rules
- Enable Anonymous Auth

### Slow Performance
- Check network tab
- Profile dengan DevTools
- Optimize Firestore queries

---

## 📊 Monitoring

### Vercel Analytics
- Built-in di Vercel dashboard
- Monitor performance & errors

### Firebase
- Firebase Console → Usage
- Monitor Firestore read/write

---

## 🎯 Next Steps

1. ✅ Deploy to production
2. ✅ Setup custom domain
3. ✅ Enable analytics
4. ✅ Setup monitoring
5. ✅ Plan scaling strategy

---

**Happy Deploying! 🚀**
