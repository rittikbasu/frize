export function getTotalDays(from, to) {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((from - to) / oneDay) + 1);
    return diffDays;
  }