import React, { FunctionComponent } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';

const Dialog: FunctionComponent<Props> = (props) => (
  <RadixDialog.Root
    open={props.open}
    aria-label={props.title}
    onOpenChange={(open) => !open && props.onDismiss}
  >
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="lbh-dialog-overlay" />
      <RadixDialog.Content className="lbh-dialog lbh-dialog--radix">
        <RadixDialog.Title className="lbh-heading-h2">
          {props.title}
        </RadixDialog.Title>
        {props.children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  </RadixDialog.Root>
);

interface Props {
  open: boolean;
  title: string;
  onDismiss(): void;
  children: React.ReactNode;
}

export default Dialog;
