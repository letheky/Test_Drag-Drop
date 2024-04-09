import { useEffect, useState } from 'react';

export const useDragAndDropWithStrictMode = () => {
  const [isDragAndDropEnabled, setIsDragAndDropEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setIsDragAndDropEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setIsDragAndDropEnabled(false);
    };
  }, []);

  return { isDragAndDropEnabled };
};