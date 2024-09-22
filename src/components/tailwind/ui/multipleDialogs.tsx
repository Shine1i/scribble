import React, { createContext, useContext, useState, useId } from "react";
import { Dialog, DialogContent } from "@/components/tailwind/ui/dialog";
import { Slottable } from "@radix-ui/react-slot";

const DialogContext = createContext<{
  openDialog: string;
  setOpenDialog: (id: string) => void;
  instanceId: string;
}>({
  openDialog: "",
  setOpenDialog: () => {},
  instanceId: "",
});

function MultipleDialogs({
  children,
  openDialog: externalOpenDialog,
  setOpenDialog: externalSetOpenDialog,
}: {
  children: React.ReactNode;
  openDialog?: string;
  setOpenDialog?: (id: string) => void;
}) {
  const [internalOpenDialog, internalSetOpenDialog] = useState<string>("");

  const instanceId = useId();

  const openDialog = externalOpenDialog ?? internalOpenDialog;
  const setOpenDialog = externalSetOpenDialog ?? internalSetOpenDialog;

  return (
    <DialogContext.Provider value={{ openDialog, setOpenDialog, instanceId }}>
      {children}
    </DialogContext.Provider>
  );
}

function MultipleDialogTriggers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function MultipleDialogTrigger({
  id,
  asChild,
  children,
}: {
  id: string;
  asChild?: boolean;
  children: React.ReactNode;
}) {
  const { setOpenDialog, instanceId } = useContext(DialogContext);

  const Comp = asChild ? Slottable : "div";
  return <Comp onClick={() => setOpenDialog(`${instanceId}:${id}`)}>{children}</Comp>;
}

function MultipleDialogContents({ children }: { children: React.ReactNode }) {
  const { openDialog, setOpenDialog, instanceId } = useContext(DialogContext);
  return (
    <Dialog
      open={openDialog.startsWith(instanceId)}
      onOpenChange={(open) => !open && setOpenDialog("")}
    >
      <DialogContent>
        {React.Children.toArray(children).find(
          (child) =>
            React.isValidElement(child) &&
            child.type === MultipleDialogContent &&
            `${instanceId}:${child.props.id}` === openDialog
        )}
      </DialogContent>
    </Dialog>
  );
}

function MultipleDialogContent({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child);
        }
        return child;
      })}
    </>
  );
}

export {
  MultipleDialogs,
  MultipleDialogTriggers,
  MultipleDialogTrigger,
  MultipleDialogContents,
  MultipleDialogContent,
};
