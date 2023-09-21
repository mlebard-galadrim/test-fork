export const getFromTo = (period) => {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - period);
  return [from.toISOString().split("T")[0], to.toISOString().split("T")[0]];
};

const addDays = (startDate, days) => {
  var date = new Date(startDate);
  date.setDate(startDate.getDate() + days);
  return date;
};

const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const getLabelsFromData = (data) => {
  let labels = data.map((d) => {
    let date = d.split("-");
    return date[2] + " " + monthNames[parseInt(date[1])];
  });
  return labels;
};

export const getLabelsFromTo = (from, to) => {
  const startDate = new Date(Date.parse(from));
  const endDate = new Date(Date.parse(to));
  const difference = endDate.getTime() - startDate.getTime();
  const days = Math.floor(difference / (1000 * 3600 * 24));
  let labels = [];
  if (days > 5) {
    let increment = days / 4;
    for (let i = 0; i < 5; i++) {
      let temp = addDays(startDate, i * increment);
      if (days > 360) {
        labels.push(temp.toISOString().split("T")[0].split("-")[0]);
      } else {
        let date = temp.toISOString().split("T")[0].split("-");
        labels.push(date[2] + " " + monthNames[parseInt(date[1])]);
      }
    }
  }
  return labels;
};

export const convertTZ = (date, tzString, locale) => {
  return new Date(typeof date === "string" ? new Date(date) : date).toLocaleDateString(locale, {
    timeZone: tzString,
  });
};

export const convertTZMessage = (date, tzString, locale) => {
  return new Date(typeof date === "string" ? new Date(date) : date).toLocaleTimeString(locale, {
    timeZone: tzString,
  });
};
