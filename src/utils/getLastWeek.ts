const getLastWeekDate = () => {
  const today = new Date();
  const lastWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );
  return lastWeek.toLocaleDateString("en-ZA").replaceAll("/", "-");
};

export default getLastWeekDate;
