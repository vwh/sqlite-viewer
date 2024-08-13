import { useCallback } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface ProxyMessageProps {
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
}

export default function ProxyMessage({
  showDialog,
  setShowDialog,
  onConfirm
}: ProxyMessageProps) {
  const handleClose = useCallback(() => {
    setShowDialog(false);
  }, [setShowDialog]);

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Use Proxy to Load Database?</AlertDialogTitle>
          <AlertDialogDescription>
            We couldn't load the database from the provided URL due to CORS
            restrictions. Would you like to try using a proxy?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="font-semibold text-yellow-600 md:text-left">
          Warning: Using the proxy will route your database traffic through
          cors.eu.org.
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Use Proxy</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
