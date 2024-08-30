export function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 = (performance && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// handle form submission
export async function handleApiRequest(
  question: string,
  history: [string, string][],
  conversationId: string,
): Promise<{ error?: string; sourceDocuments?: any; text?: string }> {
  try {
    // Send the question to the server and get the response
    const response = await fetch(process.env.CHAT_API_URL || '/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        history,
        conversationId,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: 'An error occurred while fetching the data. Please try again.',
    };
  }
}

//Adjust the source back to URL format and handle PDFs
export function formatSource(source: string, url?: string): JSX.Element {
  if (url) {
    // If url is provided, use it directly
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="source-link"
      >
        {url}
      </a>
    );
  }

  if (typeof source !== 'string') {
    return <span>Source not available</span>;
  }

  // Remove the terms '1/', '2/', and 'Big/' from the source string
  let adjustedSource = source
    .replace(/^.*\/docs\//, '') // Remove the directory structure
    .replace(/(1\/|2\/|Big\/)/g, '');

  // Check if the source string ends with '.pdf'
  const isPdf =
    adjustedSource.includes('sites_default') || adjustedSource.endsWith('.pdf');
  if (isPdf) {
    // Extract the filename without the extension and directory prefix
    const filename = adjustedSource
      .replace('sites_default_files_', '')
      .replace('pdf_file_', '')
      .slice(0, -4) // Remove the '.pdf'
      .replace(/-/g, '+'); // Replace '-' with '+'

    // Create the search query URL
    const searchUrl = `https://www.electoralcommission.org.uk/search?search=${filename}`;
    return (
      <a
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="source-link"
      >
        Search the Website for this PDF
      </a>
    );
  } else {
    // Replace underscores with slashes and remove the file extension
    adjustedSource = adjustedSource.replace(/_/g, '/').slice(0, -4);

    const finalUrl = 'https://www.electoralcommission.org.uk/' + adjustedSource;
    return (
      <a
        href={finalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="source-link"
      >
        {finalUrl}
      </a>
    );
  }
}

// Helper function to format the document content for display
export function formatDocumentContent(content: string): string {
  // Replace multiple newlines and spaces with a single space
  let cleanedContent = content
    .replace(/\n+/g, '\n') // Replace multiple newlines with a single newline
    .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with a single space
    .trim(); // Trim whitespace from the start and end

  // Add '...' to the beginning if it doesn't start with a capital letter
  if (cleanedContent && !cleanedContent.charAt(0).match(/[A-Z]/)) {
    cleanedContent = '...' + cleanedContent;
  }

  // Add '...' to the end if it doesn't end with a full stop
  if (cleanedContent && !cleanedContent.endsWith('.')) {
    cleanedContent += '...';
  }
  return cleanedContent;
}