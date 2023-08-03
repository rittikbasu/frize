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

    // Convert the object back to an array of objects
    const uniqueNamesArray = Object.keys(uniqueNamesMap).map((name) => ({
    name,
    value: uniqueNamesMap[name],
    }));

    // Sort the array by the value property
    uniqueNamesArray.sort((a, b) => b.value - a.value);

    return uniqueNamesArray
    
}