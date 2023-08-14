export function timeFormatter(total_hours, short = false, restrictAccess = false, isRittik = true) {
  console.log(isRittik)
  if (!isRittik) return "🚫";
  if (restrictAccess === true) return "🚫";
  // Calculate the hours and minutes
  const hours = Math.floor(total_hours);
  const minutes = Math.floor((total_hours - hours) * 60);

  // Format the time string
  let time_str;
  if (hours === 0) {
    time_str = `${minutes} min`;
  } else if (minutes === 0) {
    time_str = `${hours} hr`;
  } else {
    time_str = `${hours} hr ${minutes} min`;
  }

  if (short) {
    time_str = time_str.replace("hr", "h").replace("min", "m");
  }

  return time_str;
}

export function timePercentFormatter(total_hours, total_days) {
  // Calculate the hours and minutes
  const hours = Math.floor(total_hours);
  const minutes = Math.floor((total_hours - hours) * 60);

  // calculate the percentage rounded to 2 decimal places
  const percent = Math.round((total_hours / total_days) * 10000) / 100;

  let time_str;
  if (hours === 0) {
    time_str = `${minutes} min`;
  }
  else if (minutes === 0) {
    time_str = `${hours} hr`;
  }
  else {
    time_str = `${hours} hr ${minutes} min (${percent}%)`;
  }

}