# 💰 Salary Compare India - Know Your Worth

A production-ready salary comparison web application with autocomplete search, salary predictions, and comprehensive validation. Compare salaries across job titles, industries, experience levels, and locations in India.

## ✨ New Features Added

### 🔍 Smart Autocomplete Search
- **Job Title Suggestions**: Type 2+ characters to see real job titles from database
- **Location Suggestions**: Instant suggestions for Indian cities (Bangalore, Mumbai, etc.)
- **Debounced API calls**: Optimized performance with 300ms delay
- **Click outside to close**: Better UX with automatic dropdown closing

### 🔐 Enhanced Authentication
- **Email Validation**: Proper email format checking
- **Strong Password Requirements**:
  - Minimum 6 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- **Real-time Validation**: Errors clear as you type
- **Loading States**: Visual feedback during login/registration
- **Better Error Messages**: Specific feedback for different error types

### 🎯 Salary Predictor
- Predicts salary for job switches based on:
  - Company size transition (startup → enterprise)
  - Experience level progression
  - Industry changes
  - Location differences
- Shows expected range (min, most likely, max)
- Displays confidence score and impact factors

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Setup database:**
```bash
cd server
npx prisma generate
npx prisma db push
npm run seed
cd ..
```

3. **Start development servers:**
```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5174/
- **Backend**: http://localhost:3001/

## 📁 Project Structure

```
/salary-compare
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   │   ├── SearchBar.jsx (with autocomplete)
│   │   │   ├── SalaryCard.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/       # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── SalaryDetail.jsx
│   │   │   ├── Compare.jsx
│   │   │   ├── SalaryPredictor.jsx
│   │   │   ├── Submit.jsx
│   │   │   ├── Login.jsx (with validation)
│   │   │   └── Register.jsx (with validation)
│   │   ├── api/         # API client
│   │   └── App.jsx
│   └── package.json
├── server/              # Express backend
│   ├── routes/          # API routes
│   │   ├── salaries.js (with autocomplete endpoint)
│   │   ├── auth.js
│   │   ├── stats.js
│   │   └── predictor.js
│   ├── middleware/      # Auth middleware
│   ├── prisma/          # Database schema & seed
│   └── index.js
└── package.json
```

## 🎨 Design System

**Colors:**
- Navy: `#0F172A` (background)
- Primary (Indigo): `#6366F1`
- Accent (Emerald): `#10B981`

**Fonts:**
- Inter (all text)

## 🔌 API Endpoints

### Salaries
- `GET /api/salaries` - List salaries with filters
- `GET /api/salaries/:id` - Get salary details
- `POST /api/salaries` - Submit salary (auth required)
- `GET /api/salaries/search?q=` - **NEW: Autocomplete job titles**
- `GET /api/salaries/compare` - Compare multiple roles

### Predictor
- `POST /api/predictor/predict` - **NEW: Predict salary for job switch**
- `POST /api/predictor/update-profile` - Update user profile
- `GET /api/predictor/profile` - Get user profile

### Stats
- `GET /api/stats/overview` - Homepage statistics

### Auth
- `POST /api/auth/register` - Register user (with validation)
- `POST /api/auth/login` - Login user (with validation)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

## 🌱 Seed Data

The database comes pre-seeded with 47 realistic salary entries:
- **Roles:** Software Engineer, Data Scientist, Product Manager, UX Designer, DevOps, Marketing Manager, Financial Analyst, Business Analyst, QA Engineer, Full Stack Developer
- **Locations:** Bangalore, Mumbai, Hyderabad, Pune, Delhi, Chennai
- **Experience:** Junior, Mid, Senior, Lead
- **Industries:** Tech, Finance, Healthcare, E-commerce, Consulting
- **Currency:** All in INR (Indian Rupees)

## 🎯 Key Features

✅ Smart autocomplete for job titles and locations  
✅ Enhanced login/registration with validation  
✅ Salary predictor for job switches  
✅ Clean indigo/emerald color scheme  
✅ Reduced animations for better performance  
✅ Advanced search with filters  
✅ Salary detail pages with charts  
✅ Side-by-side comparison tool  
✅ JWT authentication  
✅ Responsive design  
✅ RESTful API with Prisma ORM  
✅ All salaries in Indian Rupees (₹)  
✅ Lakhs format display (e.g., ₹15.50L)  

## 🔐 Authentication

### Registration Requirements:
- Valid email address
- Password with:
  - Minimum 6 characters
  - At least one uppercase letter (A-Z)
  - At least one lowercase letter (a-z)
  - At least one number (0-9)

### Example Valid Credentials:
- Email: `test@example.com`
- Password: `Test123`

## 🎯 How to Use

### 1. Search for Salaries
- Type job title (e.g., "Software") - see autocomplete suggestions
- Type location (e.g., "Ban") - see city suggestions
- Click on suggestion or press Enter to search

### 2. Predict Your Next Salary
- Go to "Predictor" page
- Enter current job details
- Enter target job details
- Get instant salary prediction with confidence score

### 3. Compare Roles
- Go to "Compare" page
- Enter up to 3 job titles
- See side-by-side comparison

### 4. Submit Your Salary
- Login/Register first
- Go to "Submit" page
- Fill in your salary details
- Help others with real data

## 📦 Production Build

### For Vercel Deployment:

**⚠️ Important:** SQLite doesn't work on Vercel. You need PostgreSQL.

1. **Setup PostgreSQL Database:**
   - Use Vercel Postgres, Neon, or Supabase
   - Get your DATABASE_URL connection string

2. **Update Prisma Schema:**
```bash
# Copy PostgreSQL schema
cp server/prisma/schema-postgres.prisma server/prisma/schema.prisma
```

3. **Set Environment Variables in Vercel:**
```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your-secret-key
CLIENT_URL=https://your-app.vercel.app
NODE_ENV=production
```

4. **Deploy and Seed:**
```bash
# After deployment, seed your production database
export DATABASE_URL="your_postgresql_connection_string"
cd server
npx prisma generate
npx prisma db push
npm run seed
```

See `DEPLOYMENT.md` for detailed deployment instructions.

### For Local Production Build:

```bash
# Build frontend
npm run build

# Start production server
cd server
NODE_ENV=production node index.js
```

## 🐛 Troubleshooting

### Port Already in Use
If you see "EADDRINUSE" error:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change port in server/.env
PORT=3002
```

### Database Issues
```bash
cd server
npx prisma db push --force-reset
npm run seed
```

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Feel free to open issues or submit PRs.

---

Built with ❤️ using React, Node.js, Tailwind CSS, and Prisma
