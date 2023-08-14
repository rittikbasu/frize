export function getCategories(data, restrictAccess = false) {  
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
    const uniqueNamesArray = Object.keys(uniqueNamesMap).map((name) => {
        const percentage = (uniqueNamesMap[name] / total_work_hours) * 100;
        const roundedPercentage = percentage < 10 ? Math.round(percentage * 10) / 10 : Math.round(percentage);
    
        return {
            name: `${name} → ${roundedPercentage}%`,
            value: uniqueNamesMap[name],
        };
    });

    // Sort the array by the value property
    uniqueNamesArray.sort((a, b) => b.value - a.value);
    if (restrictAccess) {
        // change the names to random names after the first 3 categories
        for (let i = 3; i < uniqueNamesArray.length; i++) {
            // get the percentage of the category from uniqueNamesArray[i].name
            const percentage = uniqueNamesArray[i].name.split("→")[1].split("%")[0].trim();
            uniqueNamesArray[i].name = `Category ${i + 1} → ${percentage}%`;
        }
    }

    return uniqueNamesArray
    
}