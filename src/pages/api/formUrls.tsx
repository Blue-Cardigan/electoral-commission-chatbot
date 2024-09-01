export function formatSource(filename: string): string {
  if (filename.endsWith('.pdf')) {
    return `https://www.electoralcommission.org.uk/${filename
      .replace('sites_default_files_', 'sites/default/files/')
      .replace(/file_/g, 'file/')}`;
  } else if (filename.includes('sites_default_files_pdf_file_')) {
    return `https://www.electoralcommission.org.uk/${filename
      .replace('sites_default_files_pdf_file_', 'sites/default/files/pdf_file/')
      .replace('.txt', '.pdf')}`;
  } else {
    return `https://www.electoralcommission.org.uk/${filename
    .replace(/_/g, '/')
    .replace('.txt', '')}`;
  }
}