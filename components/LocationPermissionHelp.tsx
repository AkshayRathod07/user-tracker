import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// ...existing code...

export default function LocationPermissionHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable Location Access</DialogTitle>
          <DialogDescription>
            <div className="space-y-2">
              <p>
                This app requires your location to function properly. Please enable location access in your browser settings.
              </p>
              <ul className="list-disc ml-6 text-sm">
                <li>
                  <b>Chrome:</b> Click the lock icon or the info icon next to the URL, then set <b>Location</b> to <b>Allow</b>.
                </li>
                <li>
                  <b>Safari:</b> Go to <b>Preferences &gt; Websites &gt; Location</b> and set this site to <b>Allow</b>.
                </li>
                <li>
                  <b>Edge:</b> Click the lock icon next to the URL, then set <b>Location</b> to <b>Allow</b>.
                </li>
                <li>
                  <b>Mobile:</b> Check your browser or device settings to allow location for this site.
                </li>
              </ul>
              <p className="text-xs text-gray-500">After enabling, please refresh the page.</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
