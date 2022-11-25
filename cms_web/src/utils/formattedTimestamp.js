import { parse, parseISO, formatDistanceToNowStrict } from "date-fns";
import { format, utcToZonedTime, toDate } from "date-fns-tz";

/**
 * A Util function that returns formatted dateString.
 * @param {string} timestamp - timestamp string in ISO format
 * @param {string} timeformat - format of the time to be returned
 * @param {boolean}  convert - whether to convert based on timezone
 *
 * @returns {string} formattedTime - in string
 */

export const formattedTimestamp = ({ timestamp = new Date().toISOString(), timeformat = "do MMM yyyy, hh:mm:ss aa", convert = false }) => {
  if (convert) {
    const formatInTimeZone = (date, tz) => format(utcToZonedTime(date, tz), timeformat, { timeZone: tz });
    return formatInTimeZone(parseISO(timestamp), process.env.NEXT_PUBLIC_TZ);
  } else {
    return format(parseISO(timestamp), timeformat);
  }
};

export const parseDateTimestamp = (timestamp = new Date().toISOString()) => {
  return toDate(parseISO(timestamp));
};

export const parseTimestamp = (timestamp = new Date().toISOString(), format = "HH:mm") => {
  return parse(timestamp, format, new Date());
};

export const countdown = (date, endDate = new Date()) => {
  if (!date) return null;
  let color = "green.500";
  let countDownDate = date.getTime();
  let now = endDate.getTime();
  let difference = countDownDate - now;
  let isSlaBreached = false;

  // Time calculations for days, hours, minutes and seconds
  let days = Math.floor(difference / (1000 * 60 * 60 * 24));
  let hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  // hours += days * 24;
  let minutes = Math.floor((difference / 1000 / 60) % 60);
  // let seconds = Math.floor((difference /1000) % 60 );
  if (hours < 1) color = "orange.500";
  if (hours < 1 && days < 0);
  if (difference < 0) {
    color = "red.500";
    isSlaBreached = true;
  }

  return { timeLeft: `${hours}h ${minutes}m`, color, isSlaBreached };
};

export const dateOnly = date => {
  if(!date) return;

  date = new Date(date)
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-")
}
