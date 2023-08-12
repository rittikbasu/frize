export function getDaysData(data) {
    console.log(data);
    let days = [];
    for (let i = 0; i < data.length; i++) {
        let day = data[i].day;
        if (!days.includes(day)) {
            days.push(day);
        }
    }

    days.sort((a, b) => {
        const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return daysOrder.indexOf(a) - daysOrder.indexOf(b);
      });
      


    let days_data = [];
    for (let i = 0; i < days.length; i++) {
        let day = days[i];
        let work_hours = 0;
        let focus = 0;
        let breaks = 0;
        for (let j = 0; j < data.length; j++) {
            if (data[j].day === day) {
                work_hours += data[j].work_hours;
                focus += data[j].focus;
                breaks += data[j].breaks;
            }
        }
        days_data.push({data:[{name: "Work Hours", value: work_hours}, {name: "Focus", value: focus}, {name: "Breaks", value: breaks}], day: day});
    }
    return days_data;
}