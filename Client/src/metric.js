const { exec } = require("child_process");

function getCPU() {
  return new Promise((resolve, reject) => {
    exec(`top -bn1 | grep "Cpu(s)"`, (err, stdout) => {
      if (err) return reject(err);

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
        ni: "Ưu tiên thấp hơn (nice)",
        id: "Thời gian CPU không làm gì (nhàn rỗi)",
        wa: "CPU chờ I/O",
        hi: "Thời gian CPU xử lý ngắt phần cứng",
        si: "Thời gian CPU xử lý ngắt phần mềm",
        st: "CPU bị đánh cắp bởi máy ảo"
      };

      // Loại bỏ phần mở đầu và lấy giá trị phần trăm CPU
      const parts = stdout
        .replace('%Cpu(s):', '')
        .replace('Cpu(s):', '')
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
  });
}




function getMemory() {
  return new Promise((resolve, reject) => {
    exec('free -h', (err, stdout) => {
      if (err) return reject(err);
      const lines = stdout.split('\n');
      const memLine = lines.find(line => line.toLowerCase().startsWith('mem'));
      if (!memLine) return resolve({});
      const parts = memLine.split(/\s+/);
      resolve({
        mem_total: parts[1],
        mem_used: parts[2],
        mem_free: parts[3],
      });
    });
  });
}

function getDisk() {
  return new Promise((resolve, reject) => {
    exec('df -h /', (err, stdout) => {
      if (err) return reject(err);
      const lines = stdout.split('\n');
      const data = lines[1].split(/\s+/);
      resolve({
        disk_used: data[2],
        disk_avail: data[3],
        disk_usage_percent: data[4],
      });
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
