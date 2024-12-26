// src/utils/loadIcons.js
export const loadIcons = () => {
    return [
      'icons8-graph-50.png',
      'icon_qa.png',
      'icons8-box-64.png',
      // Add more icon filenames here
    ].map((icon) => ({
      value: icon,
      label: <img src={`/icons/${icon}`} alt={icon} style={{ width: 30, height: 30 }} />,
    }));
  };
  