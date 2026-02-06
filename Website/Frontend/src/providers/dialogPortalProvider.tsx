import { DialogPortalProvider, DialogPortal } from '@/shared/context/DialogPortalContext';

export default function DialogPortalProviderWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DialogPortalProvider>
            {children}
            <DialogPortal />
        </DialogPortalProvider>
    );
}
