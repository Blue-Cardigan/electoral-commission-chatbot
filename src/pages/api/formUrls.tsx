export function formatSource(filename: string): string {
  if (filename.endsWith('.pdf')) {
    return `https://www.electoralcommission.org.uk/${filename
      .replace('sites_default_files', 'sites/default/files')
      .replace(/_(.+?)_/g, '/$1/')}`;
  }

  if (filename.includes('sites_default_files_pdf_file_')) {
    return `https://www.electoralcommission.org.uk/${filename
      .replace('sites_default_files_pdf_file_', 'sites/default/files/pdf_file/')
      .replace('.txt', '.pdf')}`;
  }

  return `https://www.electoralcommission.org.uk/${filename
    .replace(/_/g, '/')
    .replace('.txt', '')}`;
}