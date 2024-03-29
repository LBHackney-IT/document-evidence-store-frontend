import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import ConfirmRequestDialog from './ConfirmRequestDialog';
import DocumentTypesFixture from '../../cypress/fixtures/document_types/index.json';
import { ResponseMapper } from '../boundary/response-mapper';
import { Form, Formik } from 'formik';

const onAccept = jest.fn();
const onDismiss = jest.fn();
const documentTypes = DocumentTypesFixture.map(ResponseMapper.mapDocumentType);

describe('Confirm Request Dialog', () => {
  describe('when there is a request', () => {
    const request = {
      documentTypes: ['passport'],
      deliveryMethods: ['EMAIL', 'SMS'],
      resident: {
        name: 'Frodo',
        email: 'frodo@bagend.com',
        phoneNumber: '0123',
      },
      team: 'Example Service',
      reason: 'example-reason',
      noteToResident: 'you shall not pass!',
    };

    beforeEach(() => {
      render(
        <Formik initialValues={request} onSubmit={onAccept}>
          <Form>
            <ConfirmRequestDialog
              onDismiss={onDismiss}
              onAccept={onAccept}
              documentTypes={documentTypes}
              deliveryMethods={request.deliveryMethods}
            />
          </Form>
        </Formik>
      );
    });

    it('is open', () => {
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('has the correct text', () => {
      expect(
        screen.getByText('Are you sure you want to send this request?')
      ).toBeVisible();
      expect(screen.getByText('For the following evidences:')).toBeVisible();
      expect(screen.getByText('Confirm')).toBeVisible();
      expect(screen.getByText(request.resident.name)).toBeVisible();
      expect(screen.getByText(request.resident.email)).toBeVisible();
      expect(screen.getByText(request.resident.phoneNumber)).toBeVisible();
      expect(screen.getByText('you shall not pass!')).toBeVisible();
      expect.assertions(7);
    });

    it('calls the accept callback', async () => {
      const promise = Promise.resolve();

      await waitFor(() => {
        fireEvent.click(screen.getByText('Confirm'));
      });

      // https://egghead.io/lessons/jest-fix-the-not-wrapped-in-act-warning
      await act(() => promise);

      expect(onAccept).toHaveBeenCalled;
    });

    it('calls the dismiss callback', () => {
      fireEvent.click(screen.getByText('No, cancel'));

      expect(onDismiss).toHaveBeenCalled();
    });
  });
});
