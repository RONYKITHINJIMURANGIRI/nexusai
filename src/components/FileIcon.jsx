import React from 'react';

// Extension to icon mapping
const iconMap = {
  // Documents
  pdf: '📄',
  doc: '📘',
  docx: '📘',
  xls: '📙',
  xlsx: '📙',
  ppt: '📗',
  pptx: '📗',
  txt: '📓',
  rtf: '📓',
  
  // Code & Data
  js: '📜',
  ts: '📜',
  jsx: '⚛️',
  tsx: '⚛️',
  html: '🌐',
  css: '🎨',
  scss: '🎨',
  less: '🎨',
  json: '📋',
  yaml: '📋',
  yml: '📋',
  md: '📝',
  sql: '🗃️',
  
  // Images
  jpg: '🖼️',
  jpeg: '🖼️',
  png: '🖼️',
  gif: '🖼️',
  svg: '🖼️',
  webp: '🖼️',
  bmp: '🖼️',
  tiff: '🖼️',
  
  // Archives
  zip: '📦',
  rar: '📦',
  '7z': '📦',
  tar: '📦',
  gz: '📦',
  
  // Media
  mp3: '🎵',
  wav: '🎵',
  ogg: '🎵',
  mp4: '🎥',
  mov: '🎥',
  avi: '🎥',
  wmv: '🎥',
  flv: '🎥',
  
  // Fonts
  ttf: '🔤',
  otf: '🔤',
  woff: '🔤',
  woff2: '🔤',
  
  // Executables
  exe: '⚙️',
  msi: '⚙️',
  apk: '⚙️',
  app: '⚙️',
};

const FileIcon = ({ filename }) => {
  // Get file extension (lowercase, after last dot)
  const ext = filename.split('.').pop().toLowerCase();
  
  // Get icon from map or default to folder
  const icon = iconMap[ext] || '📁';

  return (
    <span className="file-icon" title={filename}>
      {icon}
    </span>
  );
};

export default FileIcon;