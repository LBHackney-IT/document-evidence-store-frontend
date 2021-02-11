import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import ConfirmRequestDialog from './ConfirmRequestDialog';
import DocumentTypesFixture from '../../cypress/fixtures/document_types/index.json';
import { ResponseMapper } from '../boundary/response-mapper';
import { EvidenceRequestRequest } from '../gateways/internal-api';

const onAccept = jest.fn();
const onDismiss = jest.fn();
const DocumentTypes = DocumentTypesFixture.map(ResponseMapper.mapDocumentType);

describe('Confirm Request Dialog', () => {
  describe('when there is no request', () => {
    beforeEach(() => {
      render(
        <ConfirmRequestDialog
          onDismiss={onDismiss}
          onAccept={onAccept}
          documentTypes={DocumentTypes}
        />
      );
    });

    it('is closed', () => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });

  describe('when there is a request', () => {
    const baseRequest: EvidenceRequestRequest = {
      documentTypes: ['passport'],
      deliveryMethods: [],
      resident: {
        name: 'Frodo',
        email: 'frodo@bagend.com',
        phoneNumber: '0123',
      },
    };

    beforeEach(() => {
      render(
        <ConfirmRequestDialog
          request={baseRequest}
          onDismiss={onDismiss}
          onAccept={onAccept}
          documentTypes={DocumentTypes}
        />
      );
    });

    it('is open', () => {
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('has the correct text', () => {
      expect(
        screen.getByText("You're about to make a request to:")
      ).toBeVisible();

      Object.values(baseRequest.resident).forEach((text) =>
        expect(screen.getByText(text)).toBeVisible()
      );

      expect.assertions(4);
    });

    it('calls the accept callback', async () => {
      const promise = Promise.resolve();

      onAccept.mockReturnValue(promise);
      fireEvent.click(screen.getByText('Yes, send this request'));

      expect(onAccept).toHaveBeenCalled();

      const foundButton = screen
        .getByText('Yes, send this request')
        .closest('button');
      expect(foundButton?.disabled).toBeTruthy();

      await act(() => promise);

      expect(foundButton?.disabled).toBeFalsy();
    });

    it('calls the dismiss callback', () => {
      fireEvent.click(screen.getByText('No, cancel'));

      expect(onDismiss).toHaveBeenCalled();
    });

    describe('with one delivery method', () => {
      beforeEach(() => {
        const request = { ...baseRequest, deliveryMethods: ['SMS'] };
        render(
          <ConfirmRequestDialog
            request={request}
            onDismiss={onDismiss}
            onAccept={onAccept}
            documentTypes={DocumentTypes}
          />
        );
      });

      it('has the correct text', () => {
        expect(
          screen.getByText("You're about to send a request by SMS to:")
        ).toBeVisible();
      });
    });

    describe('with both delivery methods', () => {
      beforeEach(() => {
        const request = { ...baseRequest, deliveryMethods: ['SMS', 'EMAIL'] };
        render(
          <ConfirmRequestDialog
            request={request}
            onDismiss={onDismiss}
            onAccept={onAccept}
            documentTypes={DocumentTypes}
          />
        );
      });

      it('has the correct text', () => {
        expect(
          screen.getByText(
            "You're about to send a request by SMS and email to:"
          )
        ).toBeVisible();
      });
    });
  });
});
