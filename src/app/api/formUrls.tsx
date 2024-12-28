export function formatSource(filename: string): string {
  console.log('Original filename:', filename);

  // Remove citation numbers and special characters
  const cleanFilename = filename
    .replace(/\d+:\d+†/, '') // Remove citation numbers and special characters
    .replace(/[【】\[\]]/g, '') // Remove any remaining brackets
    .trim();

  if (cleanFilename.endsWith('.pdf')) {
    return `https://www.electoralcommission.org.uk/${cleanFilename
      .replace('sites_default_files_', 'sites/default/files/')
      .replace(/file_/g, 'file/')}`;
  } else if (cleanFilename.includes('sites_default_files_pdf_file_')) {
    return `https://www.electoralcommission.org.uk/${cleanFilename
      .replace('sites_default_files_pdf_file_', 'sites/default/files/pdf_file/')
      .replace('.txt', '.pdf')}`;
  } else {
    return `https://www.electoralcommission.org.uk/${cleanFilename
      .replace(/_/g, '/')
      .replace('.txt', '')}`;
  }
}