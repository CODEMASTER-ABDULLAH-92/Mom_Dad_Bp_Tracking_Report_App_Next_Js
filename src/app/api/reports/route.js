import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Report from '@/app/models/Repost';

// GET /api/reports?user=mom&month=11&year=2025
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const filter = {};
    if (user) filter.user = user;

    if (month && year) {
      const m = Number(month) - 1;
      const y = Number(year);
      const start = new Date(y, m, 1);
      const end = new Date(y, m + 1, 0, 23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const reports = await Report.find(filter).sort({ date: 1 });
    return NextResponse.json({ success: true, data: reports });
  } catch (error) {
    console.error('GET /api/reports error', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

// CREATE or UPDATE report - FLEXIBLE VERSION
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    console.log('Received data:', body); // Debug log

    const { user, date, timePeriod, data, ...otherData } = body;

    // VALIDATION - Check minimum required fields
    if (!user || !date) {
      return NextResponse.json(
        { success: false, message: 'Missing user or date' },
        { status: 400 }
      );
    }

    // Normalize date to start of day
    const reportDate = new Date(date);
    const startOfDay = new Date(reportDate);
    startOfDay.setHours(0, 0, 0, 0);

    // Find existing report for this user and date
    let existingReport = await Report.findOne({
      user,
      date: startOfDay
    });

    let result;

    if (existingReport) {
      // UPDATE EXISTING REPORT
      const updateData = {};
      
      // If timePeriod is provided, update only that time period
      if (timePeriod && data) {
        updateData[timePeriod] = {
          ...data,
          updatedAt: new Date()
        };
      } 
      // If no timePeriod but other data (for bulk updates from form)
      else if (Object.keys(otherData).length > 0) {
        // Update all provided time periods
        Object.keys(otherData).forEach(key => {
          if (['morning', 'afternoon', 'evening', 'night'].includes(key)) {
            updateData[key] = {
              ...otherData[key],
              updatedAt: new Date()
            };
          }
        });
      }

      console.log('Updating with:', updateData); // Debug log

      result = await Report.findByIdAndUpdate(
        existingReport._id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } else {
      // CREATE NEW REPORT
      const newReportData = {
        user,
        date: startOfDay,
      };

      // If timePeriod is provided, use it
      if (timePeriod && data) {
        newReportData[timePeriod] = {
          ...data,
          createdAt: new Date()
        };
      }
      // If bulk data (from form), use all time periods
      else if (Object.keys(otherData).length > 0) {
        Object.keys(otherData).forEach(key => {
          if (['morning', 'afternoon', 'evening', 'night'].includes(key)) {
            newReportData[key] = {
              ...otherData[key],
              createdAt: new Date()
            };
          }
        });
      }

      console.log('Creating new report:', newReportData); // Debug log

      result = await Report.create(newReportData);
    }

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error('POST /api/reports error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}

// UPDATE - Keep your existing PUT method
export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { _id, timePeriod, data, dailySummary } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, message: 'Missing _id' },
        { status: 400 }
      );
    }

    let updateQuery = {};

    if (timePeriod && data) {
      updateQuery[timePeriod] = {
        ...data,
        updatedAt: new Date()
      };
    } else if (dailySummary) {
      updateQuery.dailySummary = dailySummary;
    }

    const updated = await Report.findByIdAndUpdate(
      _id,
      { $set: updateQuery },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PUT /api/reports error', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE - Keep your existing DELETE method
export async function DELETE(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, timePeriod } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Missing id' },
        { status: 400 }
      );
    }

    let result;

    if (timePeriod) {
      result = await Report.findByIdAndUpdate(
        id,
        { 
          $set: { 
            [timePeriod]: {
              bloodSugar: null,
              bloodPressure: null,
              medication: '',
              food: '',
              notes: ''
            }
          } 
        },
        { new: true }
      );
    } else {
      result = await Report.findByIdAndDelete(id);
    }

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('DELETE /api/reports error', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}