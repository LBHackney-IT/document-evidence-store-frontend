import React, { FunctionComponent } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';

const Dialog: FunctionComponent<Props> = (props) => (
  <RadixDialog.Root
    open={props.open}
    aria-label={props.title}
    onOpenChange={(open) => !open && props.onDismiss}
  >
    <h2 className="lbh-heading-h2">{props.title}</h2>
    {props.children}
  </RadixDialog.Root>
);

interface Props {
  open: boolean;
  title: string;
  onDismiss(): void;
  children: React.ReactNode;
}

export default Dialog;
