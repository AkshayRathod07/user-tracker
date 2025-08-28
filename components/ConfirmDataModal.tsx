import React from "react";
import moment from "moment";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DeviceInfo from "@/components/DeviceInfo";

type UserData = {
  coords: { lat: number; lon: number };
  device: string;
  time: string;
  address?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData | null;
  onConfirm: () => void;
};

const ConfirmDataModal: React.FC<Props> = ({ open, onOpenChange, userData, onConfirm }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Your Data</DialogTitle>
        <DialogDescription>
          We will save the following details securely:
        </DialogDescription>
      </DialogHeader>
      <DeviceInfo />
      {userData && (
        <div className="space-y-2 p-2 bg-gray-50 rounded-lg">
          <p><b>Time:</b> {moment(userData.time).format("YYYY-MM-DD HH:mm:ss")}</p>
          <p><b>Address:</b> {userData.address}</p>
        </div>
      )}
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Confirm & Save</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ConfirmDataModal;
