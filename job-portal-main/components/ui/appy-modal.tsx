"use client";

import { UserProfile } from "@prisma/client";
import { useEffect, useState } from "react";
import { Modal } from "./modal";
import Box from "../box";
import Link from "next/link";
import { Button } from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  userProfile: UserProfile | null;
}

export const ApplyModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  userProfile,
}: ModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Are you sure?"
      description=" This action cannot be undone!"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Box>
        <div className="grid grid-cols-2 gap-2 w-full">
          <label className="p-3 border rounded-md">
            {userProfile?.fullName}
          </label>
          <label className="p-3 border rounded-md">
            {userProfile?.contact}
          </label>
          <label className="p-3 border rounded-md">{userProfile?.email}</label>

          <div className="col-span-2 flex items-center justify-end text-sm text-muted-foreground">
            Change your details{" "}
            <Link href={"/user"} className="text-blue-700 ml-2">
            over here!
            </Link>
          </div>
        </div>
      </Box>

      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant={"outline"} onClick={onClose}>
            Cancel
        </Button>
        <Button disabled={loading} onClick={onConfirm} className="bg-blue-700 hover:bg-blue-800">
            Continue
        </Button>
      </div>
    </Modal>
  );
};