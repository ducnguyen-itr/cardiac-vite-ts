export const LIMIT_FILE = 26214400;

export const INPUT_TYPE = {
  INPUT: 'INPUT',
  DROPPING_FILE: 'DROPPING_FILE',
};

export const ACCEPT_TYPE = 'image/png, .jpeg, .jpg, video/mp4, .xlsx, .pdf, .doc, .docx, .csv';

export const DESC_TEXT = 'Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files';

export const FILE_TYPE = {
  IMAGE: 'image',
  VIDEO: 'video',
  TEXT: 'text',

  PDF: 'application/pdf',

  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

  PPT: 'application/vnd.ms-powerpoint',
  PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',

  XLS: 'application/vnd.ms-excel',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

  ZIP: 'application/zip',
};

export const checkIsValidFileType = (type = '') => {
  if (!type) return false;
  // if (type?.includes(FILE_TYPE.IMAGE) || type?.includes(FILE_TYPE.VIDEO) || type?.includes(FILE_TYPE.TEXT)) return true;
  // if (type?.includes(FILE_TYPE.PDF)) return true;
  // if (type === FILE_TYPE.DOC || type === FILE_TYPE.DOCX) return true;
  return true;
};
