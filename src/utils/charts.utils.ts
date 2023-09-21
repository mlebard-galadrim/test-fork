export const buildSegments = (data, valueLabel) => {
  let segment = [];
  for (let i = 0; i < data.length - 1; i++) {
    if (data[i][valueLabel]) {
      segment.push([
        data[i][valueLabel],
        data[i + 1][valueLabel],
        new Date(data[i]["date"].replace(" ", "T")).getTime(),
        new Date(data[i + 1]["date"].replace(" ", "T")).getTime(),
      ]);
    }
  }
  return segment;
};

export const buildDomain = (data, valueLabel) => {
  const rawValues = data.map((value) => value[valueLabel]);
  const rawDates = data.map((value) => new Date(value.date.replace(" ", "T")).getTime());
  const domain = [Math.min(...rawValues), Math.max(...rawValues)];
  const dateDomain = [Math.min(...rawDates), Math.max(...rawDates)];

  return [domain, dateDomain];
};

export const findSegment = (date, segments) => {
  let result;
  segments.data.some((segment) => {
    if (date >= segment[2] && date <= segment[3]) {
      result = ((segment[1] - segment[0]) / (segment[3] - segment[2])) * (date - segment[2]) + segment[0];
      return true;
    }
  });
  return result;
};
