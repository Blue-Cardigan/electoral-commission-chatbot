import * as Toast from '@radix-ui/react-toast';

interface ToastMessageProps {
  message: string;
  type: 'error';
  open: boolean;
  setOpen: () => void;
}

export const ToastMessage = ({ message, type, open, setOpen }: ToastMessageProps) => {
  return (
    <Toast.Provider swipeDirection="up">
      <Toast.Root
        className="ToastRoot bg-red-500 p-4 rounded-md flex flex-col text-white items-center"
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title>{type.toUpperCase()}</Toast.Title>
        <Toast.Description>{message}</Toast.Description>
        <Toast.Close />
      </Toast.Root>

      <Toast.Viewport className="ToastViewport fixed bottom-0 right-0 flex flex-col z-40" />
    </Toast.Provider>
  );
};
