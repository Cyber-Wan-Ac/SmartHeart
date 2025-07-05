// Smart Heart Pulse Monitoring Web App (React + Tailwind)

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Download, Stethoscope } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const dummySensorData = Array.from({ length: 30 }, () => 60 + Math.floor(Math.random() * 40));

export default function App() {
  const [page, setPage] = useState('home');
  const [sensorData, setSensorData] = useState(dummySensorData);
  const [patients, setPatients] = useState([
    { name: 'John Doe', id: 'P001', data: dummySensorData }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData((prevData) => [...prevData.slice(1), 60 + Math.floor(Math.random() * 40)]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const downloadPDF = (patient) => {
    const doc = new jsPDF();
    doc.text(`Heart Rate Report - ${patient.name}`, 20, 10);
    autoTable(doc, {
      head: [['Time (s)', 'Heart Rate (BPM)']],
      body: patient.data.map((val, idx) => [idx + 1, val])
    });
    doc.save(`${patient.name}_heart_rate.pdf`);
  };

  const chartData = {
    labels: sensorData.map((_, i) => i + 1),
    datasets: [
      {
        label: 'Heart Rate (BPM)',
        data: sensorData,
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

const BackgroundWrapper = ({ children }) => (
  <div className="relative">
    <div
      className="absolute inset-0 bg-cover bg-center opacity-10 z-0"
      style={{ backgroundImage: "url('/heart-bg.jpg')" }}
    />
    <div className="relative z-10">{children}</div>
  </div>
);

  const renderHome = () => (
    <div className="text-center py-40 bg-cover bg-center" style={{ backgroundImage: 'url(/pulse-bg.jpg)' }}>
      <h1 className="text-5xl font-bold text-white mb-4">Smart Heart Pulse Sensors</h1>
      <p className="text-white text-lg">Monitor, Record, and Download Your Heart Data</p>
      <Button className="mt-6" onClick={() => setPage('sensor')}>Get Started</Button>
    </div>
  );

  const renderSensor = () => (
    <BackgroundWrapper>
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Live Heart Rate</h2>
        <Line data={chartData} />
      </div>
    </BackgroundWrapper>
  );

  const renderAbout = () => (
    <BackgroundWrapper>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-2">About This Device</h2>
        <p className="mb-4">
          The Smart Heart Pulse and EKG Monitoring System is an advanced health monitoring solution designed for
          continuous, real-time tracking of cardiovascular data. Using high-precision sensors and integrated software,
          the system is capable of capturing detailed heart activity and visualizing it in real-time through dynamic charts.
        </p>
        <p className="mb-4">
          This device is especially useful in clinical environments and home care setups, allowing healthcare professionals
          and patients to stay informed about heart health without the need for bulky or complex equipment. It supports
          features such as instant PDF reporting, patient data management, and the ability to export vital statistics.
        </p>
        <p>
          With a focus on accessibility, the platform provides a simple interface and can operate in local environments,
          making it ideal for hospitals, remote diagnostics, and educational use cases. The live sensor feed ensures that
          any anomalies in heart rate can be immediately detected and addressed.
        </p>
      </div>
    </BackgroundWrapper>
  );

  const renderPatients = () => (
    <BackgroundWrapper>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Patient Data</h2>
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id}>
                <td className="border p-2">{p.id}</td>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">
                  <Button onClick={() => downloadPDF(p)}><Download className="inline-block mr-1" />Download PDF</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BackgroundWrapper>
  );

  return (
    <div>
      <nav className="bg-black text-white p-4 flex justify-between items-center">
        <div className="font-bold text-xl flex items-center gap-2">
          <Stethoscope className="w-6 h-6" /> Smart Heart
        </div>
        <div className="space-x-6">
          <button onClick={() => setPage('home')}>Home</button>
          <button onClick={() => setPage('about')}>About</button>
          <button onClick={() => setPage('sensor')}>Live Sensor</button>
          <button onClick={() => setPage('patients')}>Patients</button>
        </div>
      </nav>
      {page === 'home' && renderHome()}
      {page === 'about' && renderAbout()}
      {page === 'sensor' && renderSensor()}
      {page === 'patients' && renderPatients()}
    </div>
  );
}
