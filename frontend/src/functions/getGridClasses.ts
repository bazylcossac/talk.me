export const getGridClasses = (groupCallStreamsLength: number) => {
  switch (groupCallStreamsLength) {
    case 2:
      return "grid grid-cols-2 place-items-center gap-2 justify-center";
    case 3:
      return "grid grid-cols-2 grid-rows-2 gap-2 place-items-center";
    case 4:
      return "grid grid-cols-2 gap-2 place-items-center";
    default:
      return "flex justify-center items-center";
  }
};
