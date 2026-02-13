"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";

const times = ["morning", "afternoon", "evening", "night"];



export default function ReportTable({
  user,
  refreshKey,
  month,
  year,
  onReportUpdated,
  onEdit,
}) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef(null);

  // Wrap fetchReports in useCallback to prevent unnecessary re-renders
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        user,
        month: String(month),
        year: String(year),
      });

      const response = await fetch(`/api/reports?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setReports(result.data);
      } else {
        console.error("Error fetching reports:", result.message);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }, [user, month, year]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports, refreshKey]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      const response = await fetch(`/api/reports`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();

      if (result.success) {
        onReportUpdated();
      } else {
        alert("Error deleting report");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete the report");
    }
  };

  const handleExportPDF = async () => {
    if (reports.length === 0) {
      alert("No data to export");
      return;
    }

    setIsExporting(true);

    try {
      // Create a hidden iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);

      // Get the iframe document
      const iframeDoc = iframe.contentWindow.document;

      // Write the print-friendly content
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Health Report - ${user === "mom" ? "Mom" : "Dad"} - ${getMonthName(month)} ${year}</title>
          <style>
            @page {
              size: A4;
              margin: 2cm;
            }
            
            @media print {
              body {
                font-family: Arial, sans-serif;
                line-height: 1.3;
                color: #333;
              }
              
              .report-container {
                max-width: 100%;
                margin: 0 auto;
              }
              
              .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #333;
              }
              
              .header h1 {
                font-size: 24px;
                margin: 0;
                color: #000;
              }
              
              .header h2 {
                font-size: 20px;
                margin: 10px 0 5px;
                color: #444;
              }
              
              .header p {
                font-size: 14px;
                margin: 5px 0;
                color: #666;
              }
              
              .summary-box {
                background: #f5f5f5;
                padding: 15px;
                margin-bottom: 30px;
                border-radius: 5px;
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;
              }
              
              .summary-item {
                text-align: center;
                padding: 10px;
              }
              
              .summary-label {
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
              }
              
              .summary-value {
                font-size: 20px;
                font-weight: bold;
                color: #333;
              }
              
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
                page-break-inside: auto;
              }
              
              tr {
                page-break-inside: avoid;
                page-break-after: auto;
              }
              
              thead {
                display: table-header-group;
              }
              
              tfoot {
                display: table-footer-group;
              }
              
              th {
                background: #4a5568;
                color: white;
                padding: 10px 5px;
                text-align: center;
                font-size: 11px;
                font-weight: bold;
                border: 1px solid #2d3748;
              }
              
              td {
                padding: 8px 5px;
                border: 1px solid #e2e8f0;
                text-align: center;
              }
              
              .time-header {
                background: #718096;
                color: white;
                font-size: 10px;
              }
              
              .date-cell {
                background: #f7fafc;
                font-weight: bold;
                color: #2d3748;
              }
              
              .data-cell {
                background: white;
              }
              
              .empty-cell {
                color: #a0aec0;
                font-style: italic;
              }
              
              .time-display {
                font-size: 9px;
                color: #718096;
                margin-top: 2px;
              }
              
              .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 10px;
                color: #718096;
                border-top: 1px solid #e2e8f0;
                padding-top: 15px;
              }
              
              .watermark {
                position: fixed;
                bottom: 10px;
                right: 10px;
                opacity: 0.3;
                font-size: 8px;
                color: #999;
              }
            }
          </style>
        </head>
        <body>
          <div class="report-container">
            <!-- Header -->
            <div class="header">
              <h1>Health Monitoring Report</h1>
              <h2>${user === "mom" ? "Mom" : "Dad"}</h2>
              <p>${getMonthName(month)} ${year}</p>
              <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
            
            <!-- Summary Section -->
            <div class="summary-box">
              <div class="summary-item">
                <div class="summary-label">Total Days</div>
                <div class="summary-value">${reports.length}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Days with Data</div>
                <div class="summary-value">${daysWithData}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Total Entries</div>
                <div class="summary-value">${totalEntries}</div>
              </div>
            </div>
            
            <!-- Data Table -->
            <table>
              <thead>
                <tr>
                  <th rowspan="2">Date</th>
                  ${times.map(time => `
                    <th colspan="2" class="time-header">${time.charAt(0).toUpperCase() + time.slice(1)}</th>
                  `).join('')}
                </tr>
                <tr>
                  ${times.map(() => `
                    <th>BS (mg/dL)</th>
                    <th>BP (mmHg)</th>
                  `).join('')}
                </tr>
              </thead>
              <tbody>
                ${reports.map(report => {
                  const date = new Date(report.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  });
                  
                  let rowHtml = `<tr><td class="date-cell">${date}</td>`;
                  
                  times.forEach(time => {
                    const { bloodSugar, bloodPressure } = getTimeData(report, time);
                    
                    // Blood Sugar cell
                    if (bloodSugar?.value) {
                      rowHtml += `<td class="data-cell">${bloodSugar.value}`;
                      if (bloodSugar.time) {
                        rowHtml += `<div class="time-display">${bloodSugar.time}</div>`;
                      }
                      rowHtml += `</td>`;
                    } else {
                      rowHtml += `<td class="empty-cell">-</td>`;
                    }
                    
                    // Blood Pressure cell
                    if (bloodPressure?.systolic && bloodPressure?.diastolic) {
                      rowHtml += `<td class="data-cell">${bloodPressure.systolic}/${bloodPressure.diastolic}`;
                      if (bloodPressure.time) {
                        rowHtml += `<div class="time-display">${bloodPressure.time}</div>`;
                      }
                      rowHtml += `</td>`;
                    } else {
                      rowHtml += `<td class="empty-cell">-</td>`;
                    }
                  });
                  
                  rowHtml += `</tr>`;
                  return rowHtml;
                }).join('')}
              </tbody>
            </table>
            
            <!-- Footer -->
            <div class="footer">
              <p>This is a computer-generated report. For medical emergencies, please consult healthcare providers immediately.</p>
              <p>© ${new Date().getFullYear()} Health Monitoring System</p>
            </div>
            
            <div class="watermark">Confidential</div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 1000);
            };
          </script>
        </body>
        </html>
      `);
      iframeDoc.close();

      // Listen for after print event
      iframe.contentWindow.onafterprint = function() {
        document.body.removeChild(iframe);
      };

      // Fallback: remove iframe after timeout
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 5000);

    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Helper function to get data for a specific time period
  const getTimeData = (report, time) => {
    const timeData = report[time];
    if (!timeData) return { bloodSugar: null, bloodPressure: null };
    
    return {
      bloodSugar: timeData.bloodSugar || null,
      bloodPressure: timeData.bloodPressure || null
    };
  };

  // Helper function to get month name
  const getMonthName = (monthNumber) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNumber - 1];
  };

  // Calculate summary statistics
  const getSummaryStats = () => {
    let totalEntries = 0;
    let daysWithData = 0;

    reports.forEach(report => {
      let hasData = false;
      times.forEach(time => {
        const { bloodSugar, bloodPressure } = getTimeData(report, time);
        if (bloodSugar?.value || bloodPressure?.systolic) {
          totalEntries++;
          hasData = true;
        }
      });
      if (hasData) daysWithData++;
    });

    return { totalEntries, daysWithData };
  };

  const { totalEntries, daysWithData } = getSummaryStats();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-500">Loading reports...</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-500 text-lg">
          No reports found for {user === "mom" ? "Mom" : "Dad"} in this month.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with Export Button */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {user === "mom" ? "Mom's" : "Dad's"} Health Reports
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {getMonthName(month)} {year}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-sm text-gray-500 block">Total days: {reports.length}</span>
              <span className="text-xs text-gray-400">
                {daysWithData} days with data • {totalEntries} entries
              </span>
            </div>
            <button
              onClick={handleExportPDF}
              disabled={isExporting || reports.length === 0}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                ${isExporting || reports.length === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                } transition-colors`}
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Table (existing code remains the same) */}
      <div className="overflow-x-auto" ref={reportRef}>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            {/* Main Header Row */}
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>

              {times.map((time) => (
                <th
                  key={time}
                  colSpan={2}
                  className="px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200"
                >
                  {time.charAt(0).toUpperCase() + time.slice(1)}
                </th>
              ))}

              <th className="px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>

            {/* Sub Header Row */}
            <tr>
              <th className="px-4 py-2"></th>

              {times.map((time) => (
                <React.Fragment key={`${time}-headers`}>
                  <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center border-l border-gray-200">
                    BS
                  </th>
                  <th className="px-2 py-2 text-xs font-medium text-gray-500 text-center">
                    BP
                  </th>
                </React.Fragment>
              ))}

              <th className="px-4 py-2"></th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report._id} className="hover:bg-gray-50">
                {/* Date */}
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                  {formatDate(report.date)}
                </td>

                {/* For each time of day: BS + BP */}
                {times.map((time) => {
                  const { bloodSugar, bloodPressure } = getTimeData(report, time);
                  const hasData = bloodSugar?.value || bloodPressure?.systolic;

                  return (
                    <React.Fragment key={`${report._id}-${time}`}>
                      {/* Blood Sugar */}
                      <td className={`px-2 py-3 text-center border-l border-gray-200 ${
                        hasData ? 'text-gray-900 font-medium' : 'text-gray-400'
                      }`}>
                        {bloodSugar?.value ? (
                          <div>
                            <span className="block">{bloodSugar.value}</span>
                            {bloodSugar.time && (
                              <span className="text-xs text-gray-500 block">{bloodSugar.time}</span>
                            )}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* Blood Pressure */}
                      <td className={`px-2 py-3 text-center ${
                        hasData ? 'text-gray-900 font-medium' : 'text-gray-400'
                      }`}>
                        {bloodPressure?.systolic && bloodPressure?.diastolic ? (
                          <div>
                            <span className="block">
                              {bloodPressure.systolic}/{bloodPressure.diastolic}
                            </span>
                            {bloodPressure.time && (
                              <span className="text-xs text-gray-500 block">{bloodPressure.time}</span>
                            )}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                    </React.Fragment>
                  );
                })}

                {/* Actions */}
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3 justify-center">
                    <button
                      onClick={() => onEdit(report)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Edit this day's report"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(report._id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete this day's report"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Summary (existing code) */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            Showing {reports.length} day{reports.length !== 1 ? 's' : ''} • 
            {times.map(time => {
              const timeCount = reports.filter(report => report[time]).length;
              return ` ${time.charAt(0).toUpperCase() + time.slice(1)}:${timeCount}`;
            }).join(' • ')}
          </span>
          <span className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}