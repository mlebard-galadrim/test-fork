export default function (inputArray, columns) {
  return inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / columns);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
}
