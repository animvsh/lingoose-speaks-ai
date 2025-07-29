import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface StripeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string | null;
  title: string;
}

export const StripeModal = ({ isOpen, onClose, url, title }: StripeModalProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 p-4">
          {url && (
            <iframe
              src={url}
              className="w-full h-full border-0 rounded-lg"
              title={title}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};