const { utcToZonedTime, format } = require("date-fns-tz");
const { parseISO } = require("date-fns");

const padInt = (value) => (value < 10 ? "0" + value : value);

const dateString = (date) => [date.getFullYear(), padInt(date.getMonth() + 1), padInt(date.getDate())].join("-");

const combineDateTime = (date, time) => {
  date = new Date(date);
  const formattedDateString = dateString(date);

  try {
    return new Date(formattedDateString + " " + time);
  } catch (e) {
    console.log("e :>> ", e);
  }

  return date;
};

const addMinutes = (date, noOfMinutes) => {
  const minutesAddedDate = new Date(date.getTime() + noOfMinutes * 60000);
  return minutesAddedDate;
};

const subMinutes = (date, noOfMinutes) => {
  const minuteSubtractedDate = new Date(date.getTime() - noOfMinutes * 60000);
  return minuteSubtractedDate;
};

const addDays = (date, noOfDays) => {
  const daysAddedDate = date.setDate(date.getDate() + noOfDays);
  return daysAddedDate;
};

const subDays = (date, noOfDays) => {
  const daySubtractedDate = new Date(date.getDate() - noOfDays);
  return daySubtractedDate;
};

const dateDifference = (sourceDate, targetDate) => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  if (!sourceDate) return null;
  if (!targetDate) return null;

  // Discard the time and time-zone information.
  const utc1 = Date.UTC(sourceDate.getFullYear(), sourceDate.getMonth(), sourceDate.getDate());
  const utc2 = Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

function getUTCTime(date) {
  if (typeof date === "string") date = new Date(date);

  const isoTime = parseISO(date.toISOString());
  return isoTime;
}

const getTimeZoneDate = (date = new Date(), tz = process.env.TZ) => {
  if (typeof date === "string") date = new Date(date);

  const utcDate = getUTCTime(date);
  const convertedTime = utcToZonedTime(utcDate, tz);

  return convertedTime;
};

const formattedTime = (timestamp = new Date(), timeformat = "do MMM yyyy, hh:mm:ss aa") => {
  return format(utcToZonedTime(parseISO(timestamp.toISOString()), process.env.TZ), timeformat, { timeZone: process.env.TZ });
};

module.exports = {
  dateDifference,
  addDays,
  addMinutes,
  subDays,
  subMinutes,
  combineDateTime,
  dateString,
  getTimeZoneDate,
  getUTCTime,
  formattedTime,
};
