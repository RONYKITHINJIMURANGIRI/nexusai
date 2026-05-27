export function getFileType(filename = '') {
  const extension = filename.split('.').pop().toLowerCase();
  if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension)) return 'image';
  if (['md', 'txt', 'pdf'].includes(extension)) return 'document';
  if (['zip', 'tar', 'gz'].includes(extension)) return 'archive';
  return 'file';
}
