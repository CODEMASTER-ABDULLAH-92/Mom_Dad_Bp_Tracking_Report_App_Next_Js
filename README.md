# Health Tracker App

A comprehensive health monitoring application built with Next.js for tracking blood sugar and blood pressure readings throughout the day.

## 🩺 Overview

This application helps users monitor and track their health metrics across four time periods daily:
- **Morning** 🌅
- **Afternoon** ☀️
- **Evening** 🌆
- **Night** 🌙

## ✨ Features

### 📊 Health Monitoring
- **Blood Sugar Tracking** (mg/dL) for each time period
- **Blood Pressure Monitoring** (Systolic/Diastolic)
- **Medication & Food Intake** logging
- **Daily Notes** and observations

### 🗓️ Smart Data Management
- **One Document Per Day** - All time periods stored together
- **Flexible Data Entry** - Add data for different times throughout the day
- **Monthly View** - Browse reports by month and year
- **Real-time Updates** - Instant data synchronization

### 👥 Multi-User Support
- Separate tracking for **Mom** and **Dad**
- Individualized reports and statistics
- User-specific data isolation

### 📱 User Experience
- **Responsive Design** - Works on desktop and mobile
- **Intuitive Forms** - Easy data entry with validation
- **Comprehensive Tables** - Clear overview of all readings
- **Quick Actions** - Edit and delete functionality

## 🛠️ Technology Stack

- **Frontend**: Next.js 16.0.3, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Development**: Turbopack for fast builds

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── reports/
│   │       └── route.js          # API endpoints for reports
│   ├── lib/
│   │   └── mongodb.js            # Database connection
│   ├── models/
│   │   └── Report.js             # Mongoose data model
│   ├── page.js                   # Main application page
│   └── globals.css               # Global styles
├── components/
│   ├── ReportForm.jsx            # Form for adding/editing reports
│   └── ReportTable.jsx           # Table for displaying reports
```

## 🎯 Core Components

### ReportForm
- Single time period data entry
- Auto-loads existing data when switching time periods
- Real-time form validation
- Support for both creating and editing reports

### ReportTable
- Monthly report overview
- Color-coded data presentation
- Summary statistics
- Quick edit and delete actions

## 🗃️ Data Model

```javascript
{
  user: "mom" | "dad",
  date: Date,
  morning: {
    bloodSugar: { value: Number, time: String },
    bloodPressure: { systolic: Number, diastolic: Number, time: String },
    medication: String,
    food: String,
    notes: String
  },
  afternoon: { ... },
  evening: { ... },
  night: { ... },
  dailySummary: {
    weight: Number,
    sleepHours: Number,
    mood: String,
    generalNotes: String
  }
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Usage Guide

### Adding Daily Reports

1. **Select User** - Choose between Mom or Dad
2. **Choose Date** - Pick the relevant date
3. **Select Time Period** - Morning, Afternoon, Evening, or Night
4. **Enter Data** - Fill in blood sugar, blood pressure, medication, food, and notes
5. **Save** - Data is automatically saved to the database

### Viewing Reports

1. **Select Month & Year** - Use the date picker to navigate
2. **Choose User** - Switch between Mom and Dad views
3. **Browse Table** - See all readings in an organized table
4. **Take Actions** - Edit or delete entries as needed

### Editing Reports

1. **Click Edit** - On any report in the table
2. **Modify Data** - Update the relevant fields
3. **Save Changes** - Automatic update in the database

## 🔧 API Endpoints

### GET `/api/reports`
Fetch reports with optional filtering:
- `user` - Filter by user (mom/dad)
- `month` - Filter by month (1-12)
- `year` - Filter by year

### POST `/api/reports`
Create or update a report for a specific time period

### PUT `/api/reports`
Update existing report data

### DELETE `/api/reports`
Delete a report or specific time period data

## 🎨 Features in Detail

### Smart Data Consolidation
- All time periods for a day stored in a single document
- Prevents duplicate entries for the same day
- Efficient database queries and storage

### Flexible Data Entry
- Add morning readings in the morning
- Add afternoon readings in the afternoon
- Partial data entry supported
- Auto-saves without requiring all fields

### Comprehensive Reporting
- Monthly overview tables
- Visual indicators for missing data
- Time-stamped entries
- Export-ready format

## 🔒 Data Validation

- **Required Fields**: User and Date
- **Data Types**: Proper number validation for health metrics
- **Enum Validation**: User restricted to 'mom' or 'dad'
- **Date Normalization**: Consistent date formatting
- **Unique Constraints**: One document per user per day

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Friendly** - Adaptive layouts for medium screens
- **Desktop Optimized** - Full-featured on larger screens
- **Touch Friendly** - Appropriate button sizes and spacing

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

## 🏥 Health Disclaimer

This application is designed for health tracking purposes but should not replace professional medical advice. Always consult with healthcare professionals for medical decisions.

---

**Built with ❤️ using Next.js and modern web technologies**
