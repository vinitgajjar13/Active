export const STANDARD_OPTIONS = [
  { value: "LKG", label: "LKG" },
  { value: "HKG", label: "HKG" },
  { value: "1", label: "Std 1" },
  { value: "2", label: "Std 2" },
  { value: "3", label: "Std 3" },
  { value: "4", label: "Std 4" },
  { value: "5", label: "Std 5" },
  { value: "6", label: "Std 6" },
  { value: "7", label: "Std 7" },
  { value: "8", label: "Std 8" },
  { value: "9", label: "Std 9" },
  { value: "10", label: "Std 10" },
  { value: "11", label: "Std 11" },
  { value: "12", label: "Std 12" },
];

export function getStandardHeading(standard) {
  if (!standard) {
    return "Select Standard";
  }

  if (standard === "LKG" || standard === "HKG") {
    return standard;
  }

  return `Std ${standard}`;
}
