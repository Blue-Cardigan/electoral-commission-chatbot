export const Information = ({ dark = false }: { dark?: boolean }) => (
  <ul
    className={`${
      dark ? 'text-white/70' : 'text-gray-500'
    } py-2 px-6 text-sm list-disc`}
  >
    <li>This search tool uses Retrieval Augmented Generation to search pages and files downloaded from the Electoral Commission website</li>
    <li>Searching document versions from 08/01/2024</li>
    <li>
      Powered by GPT-4o. Remember to check sources on the Electoral Commission website.
    </li>
  </ul>
);
