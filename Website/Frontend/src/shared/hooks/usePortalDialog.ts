import { useId } from 'react';
import { useDialogPortal } from '../context/DialogPortalContext';

/**
 * Hook to show any dialog via the portal system
 *
 * Usage:
 * const showDialog = usePortalDialog();
 *
 * showDialog(<PermissionDialog onClose={() => showDialog(null)} />);
 *
 * Or with auto-close:
 * const { show, hide } = usePortalDialog();
 * show(<PermissionDialog onClose={hide} />);
 */
export function usePortalDialog() {
  const id = useId();
  const { addDialog, removeDialog } = useDialogPortal();

  const show = (component: React.ReactNode) => {
    addDialog(id, component);
  };

  const hide = () => {
    removeDialog(id);
  };

  return { show, hide };
}
