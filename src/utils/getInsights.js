export function getInsights(data) {
  let total_work_hours = 0;
    let total_focus = 0;
    let total_breaks = 0;
    for (let i = 0; i < data.length; i++) {
      total_work_hours += data[i].work_hours;
      total_focus += data[i].focus;
      total_breaks += data[i].breaks;
    }

    const total_days = data.length;
    const total_hours = total_days * 24;
    // get percentage of time spent working, focus, and breaks rounded to 2 decimal places
    const percent_work = Math.round((total_work_hours / (total_hours)) * 100);
    const percent_focus = Math.round((total_focus / total_hours) * 100);
    const percent_breaks = Math.round((total_breaks / total_hours) * 100);
    
    // average work hours, focus, and breaks per day
    const avg_work_hours = Math.round((total_work_hours / total_days) * 100) / 100;
    const avg_focus = Math.round((total_focus / total_days) * 100) / 100;
    const avg_breaks = Math.round((total_breaks / total_days) * 100) / 100;


    return ([
      { name: `Total Work Hours → ${percent_work}%`, value: total_work_hours },
      { name: `Total Focus Time → ${percent_focus}%`, value: total_focus },
      { name: `Total Breaks → ${percent_breaks}%`, value: total_breaks },
      { name: `Average Work Hours`, value: avg_work_hours },
      { name: `Average Focus Time`, value: avg_focus },
      { name: `Average Breaks`, value: avg_breaks },
    ]
    );
}

export function getAverageWorkWeek(data) {
  // get the how many days a week worked on average
  let total_days = data.length;
  let total_weeks = Math.floor(total_days / 7);
  let remainder_days = total_days % 7;
  let avg_days = total_days / total_weeks;
  let avg_days_str = `${Math.floor(avg_days)} days`;
  if (remainder_days > 0) {
    avg_days_str += ` ${remainder_days} hours`;
  }
  

}