// convert filename with extension to content-type

const contentType = {
  md: "text/markdown",
  txt: "text/plain",
  html: "text/html",
  json: "application/json",
  js: "application/javascript",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  webp: "image/webp",
  mp4: "video/mp4",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  pdf: "application/pdf",
  zip: "application/zip",
  rar: "application/x-rar-compressed",
  tar: "application/x-tar",
  tgz: "application/gzip",
  bz2: "application/x-bzip2",
  exe: "application/x-msdownload",
  dll: "application/x-msdownload",
};

// convert filename with extension to content-type
export function convertFilenameToContentType(filename: string): string {
  const extension = filename.split(".").pop();
  return contentType[extension as keyof typeof contentType] || "text/plain";
}

// convert content-type to filename extension
export function convertContentTypeToFilenameExtension(contentType: string): string {
  const extension = Object.keys(contentType).find(key => contentType[key as keyof typeof contentType] === contentType);
  return extension || "txt";
}