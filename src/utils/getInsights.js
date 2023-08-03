export function getInsights(data) {
  let total_hours = 0;
    let total_focus = 0;
    let total_breaks = 0;
    for (let i = 0; i < data.length; i++) {
      total_hours += data[i].work_hours;
      total_focus += data[i].focus;
      total_breaks += data[i].breaks;
    }
    return ([
      { name: "Total Work Hours", value: total_hours },
      { name: "Total Focus Hours", value: total_focus },
      { name: "Total Break Hours", value: total_breaks }
    ]
    );
}