export default mapScoreToColor = (score) => {
  if (score >= 80) return "#15803d"; // green
  if (score >= 20) return "#f59e0b"; // yellow
  else return "#dc2626"; // for filled but no progress
};
