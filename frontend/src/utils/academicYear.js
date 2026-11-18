export const YEAR_MAP = {
  "1st_year": "1st Year",
  "2nd_year": "2nd Year",
  "3rd_year": "3rd Year",
  "4th_year": "4th Year",
  "1st Year": "1st Year",
  "2nd Year": "2nd Year",
  "3rd Year": "3rd Year",
  "4th Year": "4th Year",
  "1": "1st Year",
  "2": "2nd Year",
  "3": "3rd Year",
  "4": "4th Year",
};

export const normalizeAcademicYear = (rawYear) => {
  if (!rawYear) return "1st Year";
  return YEAR_MAP[rawYear] || "1st Year";
};

export const getUserAcademicYear = (user) => {
  try {
    const fromUser = user?.academicYear;
    if (fromUser && YEAR_MAP[fromUser]) return YEAR_MAP[fromUser];
    const fromStorage = localStorage.getItem("edubits_academic_year");
    if (fromStorage && YEAR_MAP[fromStorage]) return YEAR_MAP[fromStorage];
  } catch {
    // ignore
  }
  return "1st Year";
};
