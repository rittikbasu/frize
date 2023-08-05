export function getCategories(data) {      
    const flatArray = data.flatMap((obj) => obj.categories);

    // Create an object to store unique names as keys and their times as values
    const uniqueNamesMap = {};

    // Extract the names and times and store them in the object
    flatArray.forEach((obj) => {
    if (!uniqueNamesMap[obj.name]) {
        uniqueNamesMap[obj.name] = obj.time;
    } else {
        uniqueNamesMap[obj.name] += obj.time;
    }
    });

    // get total work hours
    let total_work_hours = 0;
    for (let i = 0; i < data.length; i++) {
        total_work_hours += data[i].work_hours;
    }

    // Convert the object back to an array of objects
    const uniqueNamesArray = Object.keys(uniqueNamesMap).map((name) => ({
    // add the percentage of time spent on each category rounded to 2 decimal places
    name: `${name} → ${Math.round((uniqueNamesMap[name] / total_work_hours) * 100)}%`,
    value: uniqueNamesMap[name],
    }));

    // Sort the array by the value property
    uniqueNamesArray.sort((a, b) => b.value - a.value);

    return uniqueNamesArray
    
}