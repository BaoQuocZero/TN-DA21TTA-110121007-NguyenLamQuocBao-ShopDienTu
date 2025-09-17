// src/services/themeService.js

const themeConfigs = {
  light: {
    backgroundColor: "#FFFFFF", // màu nền
    color: "#343A40", // màu chữ
    secondaryColor: "#3ccaf0", // màu nhấn mạnh title
    accentColor: "#c5ebf6 ", //màu backgroundColor hover
    backgroundColorLow: "#dddddd",
    colorTitle: "#1976d2", //Nhấn đậm title
  },
  dark: {
    backgroundColor: "#1E1E1E",
    color: "#ffffff",
    secondaryColor: "#3ccaf0",
    accentColor: "#515157",
    backgroundColorLow: "#1f1f1f",
    colorTitle: "#1976d2", //Nhấn đậm title
  },

  // dark: {
  //   backgroundColor: "#FFFFFF", // màu nền
  //   color: "#343A40", // màu chữ
  //   secondaryColor: "#3ccaf0", // màu nhấn mạnh title
  //   accentColor: "#c5ebf6 ", //màu backgroundColor hover
  //   backgroundColorLow: "#dddddd",
  //   colorTitle: "#1976d2", //Nhấn đậm title
  // },
};

// Hàm lấy theme
export const getThemeConfig = (theme = "light") => {
  return themeConfigs[theme] || themeConfigs.light;
};
