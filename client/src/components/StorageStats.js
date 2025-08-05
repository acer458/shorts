import React, { useEffect, useState } from 'react';
import axios from "axios";
const HOST = "https://shorts-t2dk.onrender.com";

export default function StorageStats() {
  const [storageMB, setStorageMB] = useState(0);
  const [bandwidthMB, setBandwidthMB] = useState(0);

  useEffect(() => {
    axios.get(HOST + '/storage/stats')
      .then(res => {
        setStorageMB((res.data.storageBytes || 0) / 1024 / 1024);
        setBandwidthMB((res.data.bandwidthBytes || 0) / 1024 / 1024);
      })
      .catch(() => { setStorageMB(0); setBandwidthMB(0); });
  }, []);

  return (
    <div style={{ padding: 18 }}>
      <h2>Storage & Bandwidth Usage</h2>
      <div style={{ marginTop: 25 }}>
        <strong>Storage Used:</strong> <span style={{ color: "#2563eb" }}>{storageMB.toFixed(2)} MB</span>
      </div>
      <div style={{ marginTop: 16 }}>
        <strong>Bandwidth Used:</strong> <span style={{ color: "#395" }}>{bandwidthMB.toFixed(2)} MB</span>
      </div>
    </div>
  );
}



