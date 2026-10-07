/**
 * Helper formatters for telemetry metrics
 */

export function formatBitrate(mbps) {
  if (mbps >= 1000) {
    return `${(mbps / 1000).toFixed(2)} Gbps`;
  }
  return `${mbps.toFixed(1)} Mbps`;
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num);
}

export function formatPercentage(val) {
  return `${val.toFixed(1)}%`;
}

export function formatTemperature(celsius) {
  return `${celsius.toFixed(0)}°C`;
}

/**
 * Generate smooth SVG path d attribute from array of values
 * [y0, y1, y2, ...] within width and height
 */
export function generateSvgPath(data, width = 300, height = 60, minVal = 0, maxVal = null) {
  if (!data || data.length < 2) return '';

  const max = maxVal !== null ? maxVal : Math.max(...data, 1);
  const min = minVal;
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((val, idx) => {
    const x = idx * stepX;
    const clampedVal = Math.max(min, Math.min(val, max));
    const y = height - ((clampedVal - min) / range) * height;
    return { x, y };
  });

  // Generate cubic bezier curve for ultra-smooth waveform
  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midX = (p0.x + p1.x) / 2;
    path += ` C ${midX.toFixed(1)} ${p0.y.toFixed(1)}, ${midX.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  return path;
}

export function generateSvgArea(data, width = 300, height = 60, minVal = 0, maxVal = null) {
  if (!data || data.length < 2) return '';
  const linePath = generateSvgPath(data, width, height, minVal, maxVal);
  return `${linePath} L ${width} ${height} L 0 ${height} Z`;
}
