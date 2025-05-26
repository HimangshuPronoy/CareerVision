import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUnlock } from '@/contexts/UnlockContext';
import { useToast } from '@/components/ui/use-toast';

interface UnlockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  disableClose?: boolean;
}

export function UnlockDialog({ isOpen, onClose, disableClose = false }: UnlockDialogProps) {
  const [code, setCode] = useState('');
  const { unlockWithCode } = useUnlock();
  const { toast } = useToast();

  const handleUnlock = () => {
    if (unlockWithCode(code)) {
      toast({
        title: "Development Mode Unlocked",
        description: "You now have access to the development version for 12 hours.",
      });
      onClose();
    } else {
      toast({
        title: "Invalid Code",
        description: "The code you entered is incorrect.",
        variant: "destructive",
      });
      setCode(''); // Clear the input on invalid code
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!disableClose && !open) {
          onClose();
        }
      }}
    >
      <DialogContent onPointerDownOutside={(e) => disableClose && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Development Access Required</DialogTitle>
          <DialogDescription>
            This is a development version of CareerVision, exclusively for developers, partners, and advertisers.
            Please enter your access code to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Enter access code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            autoFocus
          />
          <Button onClick={handleUnlock} className="w-full">
            Unlock Access
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 