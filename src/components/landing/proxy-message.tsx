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
  fn: () => void;
}

export default function ProxyMessage({
  showDialog,
  setShowDialog,
  fn
}: ProxyMessageProps) {
  const handleClose = useCallback(() => {
    setShowDialog(false);
  }, [setShowDialog]);

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Retry using a proxy?</AlertDialogTitle>
          <AlertDialogDescription>
            Failed to load the database from the provided URL due to possible
            CORS restrictions.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="text-sm font-semibold">
          Using the proxy may expose your database to corsproxy.io services.
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={fn}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
