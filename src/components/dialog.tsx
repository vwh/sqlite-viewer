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

interface DialogProps {
  showDialog: boolean;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  fn: () => void;
}

export default function Dialog({ showDialog, setShowDialog, fn }: DialogProps) {
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
          <AlertDialogCancel onClick={() => setShowDialog(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={fn}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
