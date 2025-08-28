import React from "react";
import moment from "moment";
import { Button } from "@/components/ui/button";

type UserData = {
  coords: { lat: number; lon: number };
  device: string;
  time: string;
  address?: string;
};

type Props = {
  savedData: UserData;
  onDelete: () => void;
};

const UserDataDisplay: React.FC<Props> = ({ savedData, onDelete }) => (
  <div className="p-6 bg-white rounded-xl shadow-md">
    <h2 className="font-semibold mb-2">Your Data </h2>
    <p><b>Latitude:</b> {savedData.coords.lat}</p>
    <p><b>Longitude:</b> {savedData.coords.lon}</p>
    <p><b>Device:</b> {savedData.device}</p>
    <p><b>Timestamp:</b> {moment(savedData.time).format("YYYY-MM-DD HH:mm:ss")}</p>
    <p><b>Address:</b> {savedData.address}</p>
    <Button variant="destructive" className="mt-4" onClick={onDelete}>Delete Data</Button>
  </div>
);

export default UserDataDisplay;
