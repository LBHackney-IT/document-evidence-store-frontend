import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import UploaderPanel from './UploaderPanel';
import { Formik, Form } from 'formik';

test('is properly named, and labelled', async () => {
  render(
    <Formik initialValues={{ exampleName: '' }} onSubmit={() => {}}>
      <Form>
        <UploaderPanel label="Example label" name="exampleName" />
      </Form>
    </Formik>
  );
  expect(screen.getByLabelText('Example label'));
  expect(screen.getByTestId('fileInput')).toHaveProperty('name', 'exampleName');
  expect(screen.getByTestId('fileInput')).toHaveProperty('value', '');
});

// test('accepts jpeg and pdf files', async () => {
//     render(
//       <Formik initialValues={{ exampleName: "" }} onSubmit={() => {}}>
//         {({ values }) => (
//             <Form>
//                 <UploaderPanel label="Example label" name="exampleName" />
//                 {values.exampleName && <p>{values.exampleName}</p>}
//             </Form>
//         )}
//       </Formik>
//     );

//     const mockImage = new File(['example'], 'file.jpg', { type: 'image/jpeg' });
//     fireEvent.change(screen.getByTestId('fileInput'), {
//         target: { files: [mockImage] },
//     });
//     await waitFor(() =>
//       expect(screen.getByText("file.jpg"))
//     );

//     const mockPdf = new File(['example'], 'file.pdf', { type: 'application/pdf' });
//     fireEvent.change(screen.getByTestId('fileInput'), {
//         target: { files: [mockPdf] },
//     });
//     await waitFor(() =>
//       expect(screen.getByText("file.pdf"))
//     );

// });

test('displays hints', async () => {
  render(
    <Formik initialValues={{ exampleName: '' }} onSubmit={() => {}}>
      <Form>
        <UploaderPanel
          label="Example label"
          name="exampleName"
          hint="Example hint"
        />
      </Form>
    </Formik>
  );
  expect(screen.getByText('Example hint'));
});

test('displays errors', async () => {
  render(
    <Formik initialValues={{ exampleName: '' }} onSubmit={() => {}}>
      <Form>
        <UploaderPanel
          label="Example label"
          name="exampleName"
          error="Example error"
        />
      </Form>
    </Formik>
  );
  expect(screen.getByText('Example error'));
});
