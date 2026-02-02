// you can write to stdout for debugging purposes, e.g.
// console.log('this is a debug message');

function solution(S) {
    // Handle empty input
    if (!S || S.length === 0) return "";

    // Step 1: Split input into lines (each line = one photo)
    const lines = S.split('\n');

    // Step 2: Parse each line and store with original index
    const photos = lines.map((line, index) => {
        // "photo.jpg, Warsaw, 2013-09-05 14:08:15"
        const parts = line.split(', ');
        const filename = parts[0];               // "photo.jpg"
        const city = parts[1];                   // "Warsaw"
        const timestamp = parts[2];              // "2013-09-05 14:08:15"

        // Get extension from filename (last part after dot)
        const extension = filename.split('.').pop();

        return { index, city, timestamp, extension };
    });

    // Step 3: Group photos by city
    const cityGroups = {};
    for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        if (!cityGroups[photo.city]) {
            cityGroups[photo.city] = [];
        }
        cityGroups[photo.city].push(photo);
    }

    // Step 4: Sort each group by timestamp & assign numbers
    const result = new Array(photos.length);
    const cities = Object.keys(cityGroups);

    for (let c = 0; c < cities.length; c++) {
        const city = cities[c];
        const group = cityGroups[city];

        // Sort by timestamp (string comparison works for yyyy-mm-dd hh:mm:ss format)
        group.sort(function(a, b) {
            if (a.timestamp < b.timestamp) return -1;
            if (a.timestamp > b.timestamp) return 1;
            return 0;
        });

        // Calculate padding length (e.g., 10 photos = 2 digits)
        const padLength = String(group.length).length;

        // Assign new names with padded numbers
        for (let i = 0; i < group.length; i++) {
            const photo = group[i];
            let number = String(i + 1);
            // Pad with leading zeros
            while (number.length < padLength) {
                number = '0' + number;
            }
            const newName = city + number + '.' + photo.extension;
            result[photo.index] = newName;  // Put back in original position
        }
    }

    // Step 5: Return as newline-separated string
    return result.join('\n');
}
