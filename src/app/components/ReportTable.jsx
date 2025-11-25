
// "use client";

// import React, { useEffect, useState } from "react";

// const times = ["morning", "afternoon", "evening", "night"];

// export default function ReportTable({
//   user,
//   refreshKey,
//   month,
//   year,
//   onReportUpdated,
//   onEdit,
// }) {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchReports();
//   }, [user, refreshKey, month, year]);

//   const fetchReports = async () => {
//     try {
//       setLoading(true);

//       const params = new URLSearchParams({
//         user,
//         month: String(month),
//         year: String(year),
//       });

//       const response = await fetch(`/api/reports?${params.toString()}`);
//       const result = await response.json();

//       if (result.success) {
//         setReports(result.data);
//       } else {
//         console.error("Error fetching reports:", result.message);
//       }
//     } catch (error) {
//       console.error("Error fetching reports:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this report?")) return;

//     try {
//       const response = await fetch(`/api/reports`, {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });

//       const result = await response.json();

//       if (result.success) {
//         onReportUpdated();
//       } else {
//         alert("Error deleting report");
//       }
//     } catch (error) {
//       console.error("Delete error:", error);
//       alert("Failed to delete the report");
//     }
//   };

//   const formatDate = (dateString) =>
//     new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow-lg p-8 text-center">
//         <p className="text-gray-500">Loading reports...</p>
//       </div>
//     );
//   }

//   if (reports.length === 0) {
//     return (
//       <div className="bg-white rounded-lg shadow-lg p-8 text-center">
//         <p className="text-gray-500 text-lg">
//           No reports found for {user === "mom" ? "Mom" : "Dad"} in this month.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//       {/* Header */}
//       <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//         <h2 className="text-2xl font-bold text-gray-800">
//           {user === "mom" ? "Mom's" : "Dad's"} Health Reports
//         </h2>
//         <span className="text-sm text-gray-500">Total days: {reports.length}</span>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200 text-sm">
//           <thead className="bg-gray-50">
//             {/* Main Header Row */}
//             <tr>
//               <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
//                 Date
//               </th>

//               {times.map((time) => (
//                 <th
//                   key={time}
//                   colSpan={2}
//                   className="px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider border-l"
//                 >
//                   {time.charAt(0).toUpperCase() + time.slice(1)}
//                 </th>
//               ))}

//               <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>

//             {/* Sub Header Row */}
//             <tr>
//               <th></th>

//               {times.map((time) => (
//                 <React.Fragment key={`${time}-headers`}>
//                   <th className="px-1 py-2 text-xs font-medium text-gray-500 text-center border-l">
//                     BS
//                   </th>
//                   <th className="px-1 py-2 text-xs font-medium text-gray-500 text-center">
//                     BP
//                   </th>
//                 </React.Fragment>
//               ))}

//               <th></th>
//             </tr>
//           </thead>

//           {/* Rows */}
//           <tbody className="bg-white divide-y divide-gray-200">
//             {reports.map((report) => (
//               <tr key={report._id} className="hover:bg-gray-50">
//                 {/* Date */}
//                 <td className="px-4 py-3 font-medium text-gray-900">
//                   {formatDate(report.date)}
//                 </td>

//                 {/* For each time of day: BS + BP */}
//                 {times.map((time) => {
//                   const bs = report.bloodSugar?.[time]?.value;
//                   const bp = report.bloodPressure?.[time];

//                   return (
//                     <React.Fragment key={`${report._id}-${time}`}>
//                       {/* Blood Sugar */}
//                       <td className="px-1 py-3 text-center border-l text-gray-700">
//                         {bs ?? "-"}
//                       </td>

//                       {/* Blood Pressure */}
//                       <td className="px-1 py-3 text-center text-gray-700">
//                         {bp?.systolic && bp?.diastolic
//                           ? `${bp.systolic}/${bp.diastolic}`
//                           : "-"}
//                       </td>
//                     </React.Fragment>
//                   );
//                 })}

//                 {/* Actions */}
//                 <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={() => onEdit(report)}
//                       className="text-blue-600 hover:text-blue-900"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(report._id)}
//                       className="text-red-600 hover:text-red-900"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }





"use client";

import React, { useEffect, useState } from "react";

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

  useEffect(() => {
    fetchReports();
  }, [user, refreshKey, month, year]);

  const fetchReports = async () => {
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
  };

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
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {user === "mom" ? "Mom's" : "Dad's"} Health Reports
          </h2>
          <div className="text-right">
            <span className="text-sm text-gray-500 block">Total days: {reports.length}</span>
            <span className="text-xs text-gray-400">
              {daysWithData} days with data • {totalEntries} entries
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
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

      {/* Footer Summary */}
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