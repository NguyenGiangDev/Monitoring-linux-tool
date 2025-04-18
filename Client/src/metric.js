function getCPU() {
  return new Promise((resolve) => {
    // Dữ liệu giả lập dựa trên output từ lệnh `top`
    const cpuRaw = "%Cpu(s):  3.5 us,  2.6 sy,  0.0 ni, 92.6 id,  0.0 wa,  0.0 hi,  1.3 si,  0.0 st";

    const labels = {
      us: "User",
      sy: "System",
      ni: "Nice",
      id: "Idle",
      wa: "I/O Wait",
      hi: "Hardware IRQ",
      si: "Soft IRQ",
      st: "Steal Time"
    };
    
    const descriptions = {
      us: "Thời gian CPU xử lý tiến trình của người dùng (user space)",
      sy: "Thời gian CPU xử lý tiến trình của hệ thống (kernel space)",
      id: "Thời gian CPU không làm gì (nhàn rỗi)",
      wa: "CPU chờ I/O",
      is: "Thời gian CPU xử lý ngắt phần cứng"
     
    };

    const parts = cpuRaw
      .replace('%Cpu(s):', '')
      .split(',')
      .map(part => part.trim());

    const result = parts.map(part => {
      const [value, key] = part.split(' ');
      return {
        name: labels[key],
        key,
        value: parseFloat(value),
        description: descriptions[key]
      };
    });

    resolve(result);
  });
}



function getMemory() {
  return new Promise((resolve, reject) => {
    // Giả lập Memory usage
    resolve({
      mem_total: '16G',
      mem_used: '8G',
      mem_free: '8G',
    });
  });
}

function getDisk() {
  return new Promise((resolve, reject) => {
    // Giả lập Disk usage
    resolve({
      disk_used: '50G',
      disk_avail: '150G',
      disk_usage_percent: '25%',
    });
  });
}

async function getMetrics() {
  const [cpu, mem, disk] = await Promise.all([
    getCPU(),
    getMemory(),
    getDisk()
  ]);

  return {
    timestamp: new Date().toISOString(),
    ...cpu,
    ...mem,
    ...disk
  };
}

module.exports = { getMetrics };
