import React from 'react';
import { render, screen } from '@testing-library/react';
import NewRequestForm from './NewRequestForm';
import documentTypesFixture from '../../test/fixture/document-types-response.json';
import { ResponseMapper } from '../boundary/response-mapper';

describe('NewRequestFormForm', () => {
  it('renders an uploader panel and a continue button', async () => {
    const documentTypes = documentTypesFixture.map((dt) =>
      ResponseMapper.mapDocumentType(dt)
    );

    render(<NewRequestForm documentTypes={documentTypes} />);

    expect(screen.getByLabelText('Name'));
    expect(screen.getByLabelText('Email'));
    expect(screen.getByLabelText('Mobile phone number'));

    expect(screen.getByLabelText('Send request by SMS'));
    expect(screen.getByLabelText('Send request by email'));

    expect(screen.getByLabelText('Passport'));
    expect(screen.getByLabelText('Driving license'));
    expect(screen.getByLabelText('Bank statement'));

    expect(screen.getByText('Send request'));
  });
});
