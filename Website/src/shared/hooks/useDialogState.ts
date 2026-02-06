import { useState } from 'react';

/**
 * Generic hook for managing dialog open/close state and selected item
 */
export function useDialogState<T>(initialItem: T | null = null) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(initialItem);

  const open = (item?: T) => {
    if (item) setSelectedItem(item);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setSelectedItem(null);
  };

  const reset = () => {
    setSelectedItem(null);
    setIsOpen(false);
  };

  return {
    isOpen,
    selectedItem,
    open,
    close,
    reset,
  };
}
