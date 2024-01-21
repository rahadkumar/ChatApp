export function sorting(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < i; j++) {
            if (parseInt(arr[i]) < parseInt(arr[j])) {
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}