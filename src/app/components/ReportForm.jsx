"use client";

import { useState } from "react";
import { useEffect } from "react";

const times = ["morning", "afternoon", "evening", "night"];

export default function FlexibleReportForm({ user, onSaved, editingReport, cancelEdit }) {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [selectedTime, setSelectedTime] = useState("morning");
  
  const [formData, setFormData] = useState({
    bloodSugar: { value: "", time: "" },
    bloodPressure: { systolic: "", diastolic: "", time: "" },
    medication: "",
    food: "",
    notes: ""
  });

  // Load existing data when date or time period changes
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const response = await fetch(`/api/reports?user=${user}&date=${date}`);
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
          const existingReport = result.data[0];
          const timeData = existingReport[selectedTime] || {};
          
          setFormData({
            bloodSugar: timeData.bloodSugar || { value: "", time: "" },
            bloodPressure: timeData.bloodPressure || { systolic: "", diastolic: "", time: "" },
            medication: timeData.medication || "",
            food: timeData.food || "",
            notes: timeData.notes || ""
          });
        } else {
          // Reset form if no existing data
          setFormData({
            bloodSugar: { value: "", time: "" },
            bloodPressure: { systolic: "", diastolic: "", time: "" },
            medication: "",
            food: "",
            notes: ""
          });
        }
      } catch (error) {
        console.error("Error loading existing data:", error);
      }
    };

    loadExistingData();
  }, [date, selectedTime, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user,
      date: new Date(date),
      timePeriod: selectedTime,
      data: {
        bloodSugar: formData.bloodSugar.value ? {
          value: Number(formData.bloodSugar.value),
          time: formData.bloodSugar.time || `${selectedTime} time`
        } : undefined,
        bloodPressure: (formData.bloodPressure.systolic || formData.bloodPressure.diastolic) ? {
          systolic: formData.bloodPressure.systolic ? Number(formData.bloodPressure.systolic) : undefined,
          diastolic: formData.bloodPressure.diastolic ? Number(formData.bloodPressure.diastolic) : undefined,
          time: formData.bloodPressure.time || `${selectedTime} time`
        } : undefined,
        medication: formData.medication || undefined,
        food: formData.food || undefined,
        notes: formData.notes || undefined
      }
    };

    // Clean up undefined fields
    Object.keys(payload.data).forEach(key => {
      if (payload.data[key] === undefined) delete payload.data[key];
    });
    if (payload.data.bloodSugar) {
      Object.keys(payload.data.bloodSugar).forEach(key => {
        if (payload.data.bloodSugar[key] === undefined) delete payload.data.bloodSugar[key];
      });
    }
    if (payload.data.bloodPressure) {
      Object.keys(payload.data.bloodPressure).forEach(key => {
        if (payload.data.bloodPressure[key] === undefined) delete payload.data.bloodPressure[key];
      });
    }

    console.log('Sending single time period data:', payload);

    try {
      const url = "/api/reports";
      const method = editingReport ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log('Server response:', result);

      if (!result.success) {
        alert("Error saving report: " + (result.message || 'Unknown error'));
        return;
      }

      alert(`${selectedTime.charAt(0).toUpperCase() + selectedTime.slice(1)} report saved successfully!`);
      onSaved();
    } catch (error) {
      console.error("Error saving report:", error);
      alert("Error saving report: " + error.message);
    }
  };

  const handleInputChange = (field, value, subField = null) => {
    setFormData(prev => {
      if (subField) {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [subField]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Add {user === "mom" ? "Mom's" : "Dad's"} Report
        </h2>
        
        {/* Date and Time Selection */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Date</label>
            <input
              type="date"
              className="border rounded px-2 py-1 text-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Time</label>
            <select
              className="border rounded px-2 py-1 text-sm capitalize"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              {times.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Single Time Period Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Blood Sugar */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Blood Sugar (mg/dL)</label>
          <div className="flex gap-2">
            <input
              type="number"
              className="border rounded px-2 py-1 w-full text-sm"
              value={formData.bloodSugar.value}
              onChange={(e) => handleInputChange('bloodSugar', e.target.value, 'value')}
              placeholder="Value"
            />
            <input
              type="text"
              className="border rounded px-2 py-1 w-32 text-sm"
              value={formData.bloodSugar.time}
              onChange={(e) => handleInputChange('bloodSugar', e.target.value, 'time')}
              placeholder="Time (e.g., 8:30 AM)"
            />
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Blood Pressure</label>
          <div className="flex gap-2">
            <input
              type="number"
              className="border rounded px-2 py-1 w-full text-sm"
              value={formData.bloodPressure.systolic}
              onChange={(e) => handleInputChange('bloodPressure', e.target.value, 'systolic')}
              placeholder="Systolic"
            />
            <input
              type="number"
              className="border rounded px-2 py-1 w-full text-sm"
              value={formData.bloodPressure.diastolic}
              onChange={(e) => handleInputChange('bloodPressure', e.target.value, 'diastolic')}
              placeholder="Diastolic"
            />
            <input
              type="text"
              className="border rounded px-2 py-1 w-32 text-sm"
              value={formData.bloodPressure.time}
              onChange={(e) => handleInputChange('bloodPressure', e.target.value, 'time')}
              placeholder="Time"
            />
          </div>
        </div>

        {/* Medication & Food */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Medication</label>
          <input
            type="text"
            className="border rounded px-2 py-1 w-full text-sm"
            value={formData.medication}
            onChange={(e) => handleInputChange('medication', e.target.value)}
            placeholder="Medication details"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Food</label>
          <input
            type="text"
            className="border rounded px-2 py-1 w-full text-sm"
            value={formData.food}
            onChange={(e) => handleInputChange('food', e.target.value)}
            placeholder="Food intake"
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-gray-700">Notes</label>
          <textarea
            className="border rounded px-2 py-1 w-full text-sm"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Additional notes"
            rows="2"
          />
        </div>
      </div>

      {/* Quick Time Navigation */}
      <div className="flex gap-2 justify-center">
        {times.map(time => (
          <button
            key={time}
            type="button"
            onClick={() => setSelectedTime(time)}
            className={`px-3 py-1 rounded text-sm capitalize ${
              selectedTime === time 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-green-500 text-white text-sm font-semibold hover:bg-green-600"
        >
          Save {selectedTime.charAt(0).toUpperCase() + selectedTime.slice(1)} Report
        </button>
      </div>
    </form>
  );
}