import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogIn, UserPlus } from "lucide-react";

interface ExistingAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onCreateNew: () => void;
  phoneNumber: string;
  userName?: string;
}

const ExistingAccountModal = ({ 
  isOpen, 
  onClose, 
  onLogin, 
  onCreateNew, 
  phoneNumber,
  userName 
}: ExistingAccountModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-foreground">
            Account Already Exists
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2">
            The phone number <strong>{phoneNumber}</strong> is already registered
            {userName && (
              <span> for <strong>{userName}</strong></span>
            )}. 
            <br />
            <br />
            Would you like to sign in to your existing account or create a new one?
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex-col sm:flex-col space-y-3 sm:space-y-3 sm:space-x-0">
          <Button 
            onClick={onLogin}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In to Existing Account
          </Button>
          
          <Button 
            onClick={onCreateNew}
            variant="outline"
            className="w-full"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            I Want to Create a New Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExistingAccountModal;