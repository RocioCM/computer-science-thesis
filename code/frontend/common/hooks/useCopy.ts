import { useState } from 'react';
import copy from 'copy-to-clipboard';

interface Copy {
  copyToClipboard: (_textToCopy: string) => void;
  isCopied: boolean;
}

/**
 * Hook to copy text to clipboard. It will set a boolean value to check if the text was copied.
 * @returns Returns a function to copy text and a boolean value to check if the text was copied.
 */
const useCopy = (): Copy => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (textToCopy: string) => {
    copy(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  };

  return { copyToClipboard, isCopied };
};

export default useCopy;
