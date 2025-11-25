// app/page.js
"use client";

import { useState } from 'react';
import ReportForm from '@/app/components/ReportForm';

import ReportTable from '@/app/components/ReportTable';

export default function Home() {
  const [selectedUser, setSelectedUser] = useState('mom');
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingReport, setEditingReport] = useState(null);

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1); // 1–12
  const [year, setYear] = useState(today.getFullYear());

  const handleReportSaved = () => {
    setEditingReport(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEdit = (report) => {
    setEditingReport(report);
  };

  return (
    <div className="space-y-6 text-black ">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Parents Health Dashboard
          </h1>
          <p className="text-gray-500">
            Track daily diabetes & blood pressure reports for Mom and Dad.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedUser('mom');
              setEditingReport(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedUser === 'mom'
                ? 'bg-pink-500 text-white'
                : 'bg-white border text-gray-700'
            }`}
          >
            Mom
          </button>
          <button
            onClick={() => {
              setSelectedUser('dad');
              setEditingReport(null);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedUser === 'dad'
                ? 'bg-blue-500 text-white'
                : 'bg-white border text-gray-700'
            }`}
          >
            Dad
          </button>
        </div>
      </header>

      {/* Month / Year filter */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Month</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
              <option key={m} value={m}>
                {new Date(2025, m - 1, 1).toLocaleString('en-US', { month: 'short' })}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Year</label>
          <input
            type="number"
            className="border rounded px-2 py-1 text-sm w-24"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Form */}
      <ReportForm
        user={selectedUser}
        onSaved={handleReportSaved}
        editingReport={editingReport}
        cancelEdit={() => setEditingReport(null)}
      />

      {/* Table */}
      <ReportTable
        user={selectedUser}
        refreshKey={refreshKey}
        month={month}
        year={year}
        onReportUpdated={handleReportSaved}
        onEdit={handleEdit}
      />
    </div>
  );
}
