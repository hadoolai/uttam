export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  description?: string;
  starred?: boolean;
  trashed?: boolean;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  iconLink?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  owners?: Array<{
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  }>;
  parents?: string[];
}

export interface DriveAboutInfo {
  user: {
    displayName: string;
    emailAddress: string;
    photoLink?: string;
  };
  storageQuota: {
    limit?: string; // in bytes
    usage?: string; // in bytes
    usageInDrive?: string;
    usageInDriveTrash?: string;
  };
}

export interface ListFilesOptions {
  folderId?: string;
  query?: string;
  mimeTypeCategory?: 'all' | 'folders' | 'docs' | 'sheets' | 'slides' | 'pdf' | 'media' | 'text';
  pageSize?: number;
  pageToken?: string;
  orderBy?: string;
}

export interface ListFilesResult {
  files: DriveFile[];
  nextPageToken?: string;
}

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';

/**
 * Fetch Drive User Profile and Storage Quota
 */
export async function getDriveAbout(accessToken: string): Promise<DriveAboutInfo> {
  const url = `${DRIVE_API_BASE}/about?fields=user(displayName,emailAddress,photoLink),storageQuota(limit,usage,usageInDrive,usageInDriveTrash)`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Failed to fetch Google Drive profile (${res.status})`);
  }

  return res.json();
}

/**
 * List files and folders from Google Drive
 */
export async function listDriveFiles(
  accessToken: string,
  options: ListFilesOptions = {}
): Promise<ListFilesResult> {
  const {
    folderId = 'root',
    query = '',
    mimeTypeCategory = 'all',
    pageSize = 30,
    pageToken,
    orderBy = 'folder,modifiedTime desc'
  } = options;

  const queryParts: string[] = ['trashed = false'];

  // Folder nesting query
  if (folderId && !query) {
    queryParts.push(`'${folderId}' in parents`);
  }

  // Text search query
  if (query.trim()) {
    const sanitizedQuery = query.replace(/'/g, "\\'");
    queryParts.push(`(name contains '${sanitizedQuery}' or fullText contains '${sanitizedQuery}')`);
  }

  // Category filter
  if (mimeTypeCategory === 'folders') {
    queryParts.push("mimeType = 'application/vnd.google-apps.folder'");
  } else if (mimeTypeCategory === 'docs') {
    queryParts.push("(mimeType = 'application/vnd.google-apps.document' or mimeType = 'text/plain' or mimeType = 'text/markdown')");
  } else if (mimeTypeCategory === 'sheets') {
    queryParts.push("(mimeType = 'application/vnd.google-apps.spreadsheet' or mimeType = 'text/csv')");
  } else if (mimeTypeCategory === 'slides') {
    queryParts.push("mimeType = 'application/vnd.google-apps.presentation'");
  } else if (mimeTypeCategory === 'pdf') {
    queryParts.push("mimeType = 'application/pdf'");
  } else if (mimeTypeCategory === 'media') {
    queryParts.push("(mimeType contains 'image/' or mimeType contains 'video/' or mimeType contains 'audio/')");
  }

  const q = queryParts.join(' and ');
  const fields = 'nextPageToken, files(id, name, mimeType, description, starred, trashed, size, createdTime, modifiedTime, iconLink, thumbnailLink, webViewLink, webContentLink, owners, parents)';

  const params = new URLSearchParams({
    q,
    fields,
    pageSize: String(pageSize),
    orderBy,
    supportsAllDrives: 'true',
    includeItemsFromAllDrives: 'true',
  });

  if (pageToken) {
    params.set('pageToken', pageToken);
  }

  const res = await fetch(`${DRIVE_API_BASE}/files?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Failed to list files from Google Drive (${res.status})`);
  }

  return res.json();
}

/**
 * Create a new folder in Google Drive
 */
export async function createDriveFolder(
  accessToken: string,
  folderName: string,
  parentFolderId?: string
): Promise<DriveFile> {
  const metadata: { name: string; mimeType: string; parents?: string[] } = {
    name: folderName.trim() || 'Untitled Folder',
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parentFolderId && parentFolderId !== 'root') {
    metadata.parents = [parentFolderId];
  }

  const res = await fetch(`${DRIVE_API_BASE}/files?fields=id,name,mimeType,webViewLink,createdTime,modifiedTime`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Failed to create folder in Google Drive (${res.status})`);
  }

  return res.json();
}

/**
 * Upload a local File/Blob into Google Drive using multipart upload
 */
export async function uploadFileToDrive(
  accessToken: string,
  file: File,
  parentFolderId?: string,
  description?: string
): Promise<DriveFile> {
  const metadata: { name: string; mimeType?: string; parents?: string[]; description?: string } = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
    description: description || 'Uploaded via HadoolAI Workspace',
  };

  if (parentFolderId && parentFolderId !== 'root') {
    metadata.parents = [parentFolderId];
  }

  const boundary = '-------HadoolAIDriveUploadBoundary' + Math.random().toString(36).substring(2);
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  const fileBytes = new Uint8Array(arrayBuffer);

  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`;
  const fileHeaderPart = `${delimiter}Content-Type: ${file.type || 'application/octet-stream'}\r\nContent-Transfer-Encoding: binary\r\n\r\n`;

  const enc = new TextEncoder();
  const metadataBytes = enc.encode(metadataPart);
  const fileHeaderBytes = enc.encode(fileHeaderPart);
  const closeBytes = enc.encode(closeDelimiter);

  // Combine parts into a single Uint8Array
  const combinedLength = metadataBytes.length + fileHeaderBytes.length + fileBytes.length + closeBytes.length;
  const combinedBody = new Uint8Array(combinedLength);
  
  let offset = 0;
  combinedBody.set(metadataBytes, offset);
  offset += metadataBytes.length;
  combinedBody.set(fileHeaderBytes, offset);
  offset += fileHeaderBytes.length;
  combinedBody.set(fileBytes, offset);
  offset += fileBytes.length;
  combinedBody.set(closeBytes, offset);

  const res = await fetch(`${DRIVE_UPLOAD_BASE}/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,webContentLink,modifiedTime`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: combinedBody,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Failed to upload file to Google Drive (${res.status})`);
  }

  return res.json();
}

/**
 * Save text / markdown / document directly to Google Drive
 */
export async function saveTextDocumentToDrive(
  accessToken: string,
  title: string,
  content: string,
  mimeType: 'text/markdown' | 'text/plain' | 'application/json' | 'text/html' = 'text/markdown',
  parentFolderId?: string
): Promise<DriveFile> {
  const filename = title.endsWith('.md') || title.endsWith('.txt') || title.endsWith('.json') || title.endsWith('.html') 
    ? title 
    : `${title}.md`;

  const metadata: { name: string; mimeType: string; parents?: string[] } = {
    name: filename,
    mimeType,
  };

  if (parentFolderId && parentFolderId !== 'root') {
    metadata.parents = [parentFolderId];
  }

  const boundary = '-------HadoolAIDriveTextBoundary' + Math.random().toString(36).substring(2);
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`;
  const fileHeaderPart = `${delimiter}Content-Type: ${mimeType}; charset=UTF-8\r\n\r\n`;

  const enc = new TextEncoder();
  const metadataBytes = enc.encode(metadataPart);
  const fileHeaderBytes = enc.encode(fileHeaderPart);
  const contentBytes = enc.encode(content);
  const closeBytes = enc.encode(closeDelimiter);

  const combinedLength = metadataBytes.length + fileHeaderBytes.length + contentBytes.length + closeBytes.length;
  const combinedBody = new Uint8Array(combinedLength);
  
  let offset = 0;
  combinedBody.set(metadataBytes, offset);
  offset += metadataBytes.length;
  combinedBody.set(fileHeaderBytes, offset);
  offset += fileHeaderBytes.length;
  combinedBody.set(contentBytes, offset);
  offset += contentBytes.length;
  combinedBody.set(closeBytes, offset);

  const res = await fetch(`${DRIVE_UPLOAD_BASE}/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,modifiedTime`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: combinedBody,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Failed to save document to Google Drive (${res.status})`);
  }

  return res.json();
}

/**
 * Find or create a default "HadoolAI Exports" folder in Google Drive
 */
export async function getOrCreateHadoolFolder(accessToken: string): Promise<string> {
  const folderName = 'HadoolAI Research & Exports';
  const q = `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}' and 'root' in parents and trashed = false`;
  
  const res = await fetch(`${DRIVE_API_BASE}/files?q=${encodeURIComponent(q)}&fields=files(id,name)`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (res.ok) {
    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
  }

  // Create folder if not found
  const created = await createDriveFolder(accessToken, folderName);
  return created.id;
}

/**
 * Permanently delete a file or folder from Google Drive
 * (Must be called only after user confirmation modal)
 */
export async function deleteDriveFile(accessToken: string, fileId: string): Promise<void> {
  const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Failed to delete item from Google Drive (${res.status})`);
  }
}

/**
 * Move file to Drive trash
 */
export async function trashDriveFile(accessToken: string, fileId: string): Promise<DriveFile> {
  const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}?fields=id,name,trashed`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ trashed: true }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Failed to move file to trash (${res.status})`);
  }

  return res.json();
}

/**
 * Format bytes to readable string (e.g. 1.2 MB, 14.5 GB)
 */
export function formatBytes(bytes?: string | number): string {
  if (!bytes) return '0 B';
  const num = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (isNaN(num) || num === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(num) / Math.log(k));
  return `${parseFloat((num / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Return friendly label & category for MIME types
 */
export function getMimeTypeDetails(mimeType: string): { label: string; category: string; color: string } {
  if (mimeType === 'application/vnd.google-apps.folder') {
    return { label: 'Folder', category: 'folder', color: 'text-amber-600 bg-amber-50 border-amber-200' };
  }
  if (mimeType === 'application/vnd.google-apps.document' || mimeType.includes('document') || mimeType.includes('word')) {
    return { label: 'Google Doc', category: 'doc', color: 'text-blue-600 bg-blue-50 border-blue-200' };
  }
  if (mimeType === 'application/vnd.google-apps.spreadsheet' || mimeType.includes('sheet') || mimeType.includes('csv')) {
    return { label: 'Spreadsheet', category: 'sheet', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
  }
  if (mimeType === 'application/vnd.google-apps.presentation' || mimeType.includes('presentation')) {
    return { label: 'Slides', category: 'slides', color: 'text-orange-600 bg-orange-50 border-orange-200' };
  }
  if (mimeType === 'application/pdf') {
    return { label: 'PDF Document', category: 'pdf', color: 'text-red-600 bg-red-50 border-red-200' };
  }
  if (mimeType.startsWith('image/')) {
    return { label: 'Image', category: 'image', color: 'text-purple-600 bg-purple-50 border-purple-200' };
  }
  if (mimeType.startsWith('video/')) {
    return { label: 'Video', category: 'video', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  }
  if (mimeType.startsWith('audio/')) {
    return { label: 'Audio', category: 'audio', color: 'text-cyan-600 bg-cyan-50 border-cyan-200' };
  }
  if (mimeType.includes('json') || mimeType.includes('javascript') || mimeType.includes('typescript') || mimeType.includes('text/')) {
    return { label: 'Text / Code', category: 'text', color: 'text-slate-600 bg-slate-100 border-slate-200' };
  }
  return { label: 'File', category: 'file', color: 'text-slate-600 bg-slate-50 border-slate-200' };
}
