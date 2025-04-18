const { exec } = require('child_process');

function getCPU() {
  return new Promise((resolve, reject) => {
    exec(`top -bn1 | grep "Cpu(s)"`, (err, stdout) => {
      if (err) return reject(err);
      const usageMatch = stdout.match(/(\d+\.\d+)\s+id/);
      const idle = usageMatch ? parseFloat(usageMatch[1]) : 0;
      const usage = (100 - idle).toFixed(2);
      resolve({ cpu_usage: usage });
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

module.exports={getMetrics};