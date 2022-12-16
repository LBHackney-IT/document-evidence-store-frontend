import { AxiosInstance, AxiosResponse } from 'axios';
import { ResponseMapper } from 'src/boundary/response-mapper';
import { EvidenceRequestState } from 'src/domain/enums/EvidenceRequestState';
import DocumentSubmissionFixture from '../../cypress/fixtures/document_submissions/get-png.json';
import DocumentSubmissionsResponseObjectFixture from '../../cypress/fixtures/document_submissions/get-many-response-object.json';
import EvidenceRequestFixture from '../../cypress/fixtures/evidence_requests/index.json';
import { EvidenceApiGateway } from './evidence-api';
import { InternalServerError } from './internal-api';
import { Constants } from '../helpers/Constants';
import DocumentTypeFixture from '../../cypress/fixtures/document_types/index.json';
import StaffSelectedDocumentTypeFixture from '../../cypress/fixtures/document_types/staffSelected.json';

jest.mock('../boundary/response-mapper');
//this automatically mocks all instances of ResponseMapper in this suite
const mockedResponseMapper = ResponseMapper as jest.Mocked<
  typeof ResponseMapper
>;

const client = {
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  request: jest.fn(),
};

describe('Evidence api gateway', () => {
  const gateway = new EvidenceApiGateway({
    client: (client as unknown) as AxiosInstance,
  });
  const validateStatus = expect.any(Function);

  describe('getDocumentTypes', () => {
    const teamName = 'Document Type Team Name';

    describe('when successful', () => {
      const expectedJson = DocumentTypeFixture;

      beforeEach(() => {
        client.get.mockResolvedValue({
          data: expectedJson,
        } as AxiosResponse);
      });

      it('calls axios correctly without a query param', async () => {
        await gateway.getDocumentTypes(Constants.DUMMY_EMAIL, teamName);
        expect(client.get).toHaveBeenLastCalledWith(
          `/api/v1/document_types/${teamName}?enabled=undefined`,
          {
            headers: {
              Authorization: process.env.EVIDENCE_API_TOKEN_DOCUMENT_TYPES_GET,
              UserEmail: Constants.DUMMY_EMAIL,
            },
          }
        );
      });

      it('calls axios correctly with a true query param', async () => {
        await gateway.getDocumentTypes(Constants.DUMMY_EMAIL, teamName, true);
        expect(client.get).toHaveBeenLastCalledWith(
          `/api/v1/document_types/${teamName}?enabled=true`,
          {
            headers: {
              Authorization: process.env.EVIDENCE_API_TOKEN_DOCUMENT_TYPES_GET,
              UserEmail: Constants.DUMMY_EMAIL,
            },
          }
        );
      });

      it('calls axios correctly with a false query param', async () => {
        await gateway.getDocumentTypes(Constants.DUMMY_EMAIL, teamName, false);
        expect(client.get).toHaveBeenLastCalledWith(
          `/api/v1/document_types/${teamName}?enabled=false`,
          {
            headers: {
              Authorization: process.env.EVIDENCE_API_TOKEN_DOCUMENT_TYPES_GET,
              UserEmail: Constants.DUMMY_EMAIL,
            },
          }
        );
      });

      it('passes the json from the GET to the mapDocType method', async () => {
        await gateway.getDocumentTypes(Constants.DUMMY_EMAIL, teamName);

        for (let i = 0; i < expectedJson.length; i++) {
          expect(mockedResponseMapper.mapDocumentType).toHaveBeenNthCalledWith(
            i + 1,
            expectedJson[i]
          );
        }
      });
    });

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        client.get.mockRejectedValue(new Error('Network error'));
        const functionCall = () =>
          gateway.getDocumentTypes(Constants.DUMMY_EMAIL, teamName);
        await expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });

  describe('getStaffSelectedDocumentTypes', () => {
    const teamName = 'Staff Selected Doc Type Team Name';

    describe('when successful', () => {
      const expectedJson = StaffSelectedDocumentTypeFixture;

      beforeEach(() => {
        client.get.mockResolvedValue({
          data: expectedJson,
        } as AxiosResponse);
      });

      it('calls axios correctly without a query param', async () => {
        await gateway.getStaffSelectedDocumentTypes(
          Constants.DUMMY_EMAIL,
          teamName
        );
        expect(client.get).toHaveBeenLastCalledWith(
          `/api/v1/document_types/staff_selected/${teamName}?enabled=undefined`,
          {
            headers: {
              Authorization: process.env.EVIDENCE_API_TOKEN_DOCUMENT_TYPES_GET,
              UserEmail: Constants.DUMMY_EMAIL,
            },
          }
        );
      });

      it('calls axios correctly with a true query param', async () => {
        await gateway.getStaffSelectedDocumentTypes(
          Constants.DUMMY_EMAIL,
          teamName,
          true
        );
        expect(client.get).toHaveBeenLastCalledWith(
          `/api/v1/document_types/staff_selected/${teamName}?enabled=true`,
          {
            headers: {
              Authorization: process.env.EVIDENCE_API_TOKEN_DOCUMENT_TYPES_GET,
              UserEmail: Constants.DUMMY_EMAIL,
            },
          }
        );
      });

      it('calls axios correctly with a false query param', async () => {
        await gateway.getStaffSelectedDocumentTypes(
          Constants.DUMMY_EMAIL,
          teamName,
          false
        );
        expect(client.get).toHaveBeenLastCalledWith(
          `/api/v1/document_types/staff_selected/${teamName}?enabled=false`,
          {
            headers: {
              Authorization: process.env.EVIDENCE_API_TOKEN_DOCUMENT_TYPES_GET,
              UserEmail: Constants.DUMMY_EMAIL,
            },
          }
        );
      });

      it('passes the json from the GET to the mapDocType method', async () => {
        await gateway.getStaffSelectedDocumentTypes(
          Constants.DUMMY_EMAIL,
          teamName
        );

        for (let i = 0; i < expectedJson.length; i++) {
          expect(mockedResponseMapper.mapDocumentType).toHaveBeenNthCalledWith(
            i + 1,
            expectedJson[i]
          );
        }
      });
    });

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        client.get.mockRejectedValue(new Error('Network error'));
        const functionCall = () =>
          gateway.getStaffSelectedDocumentTypes(
            Constants.DUMMY_EMAIL,
            teamName
          );
        await expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });

  describe('GET request to /document_types', () => {
    const expectedData = {
      key: 'response to GET',
    };
    const expectedStatus = 200;
    const expectedResponse = {
      data: expectedData,
      status: expectedStatus,
    };
    const path = ['document_types', 'test-team-name'];
    const method = 'GET';

    beforeEach(() => {
      client.request.mockImplementation(
        async () =>
          ({
            data: expectedData,
            status: expectedStatus,
          } as AxiosResponse)
      );
    });

    it('the request returns the correct response', async () => {
      const response = await gateway.request(path, method, {
        useremail: Constants.DUMMY_EMAIL, // this is lowercase here because All HTTP header keys are converted to lowercase in both directions
      });
      expect(response).toEqual(expectedResponse);
      expect(client.request).toHaveBeenCalledWith({
        method,
        url: `/api/v1/${path.join('/')}`,
        data: undefined,
        validateStatus,
        headers: {
          Authorization: process.env.EVIDENCE_API_TOKEN_DOCUMENT_TYPES_GET,
          useremail: Constants.DUMMY_EMAIL,
        },
      });
    });
  });

  describe('GET request to /document_types/staff_selected', () => {
    const expectedData = {
      key: 'response to GET',
    };
    const expectedStatus = 200;
    const expectedResponse = {
      data: expectedData,
      status: expectedStatus,
    };
    const path = ['document_types', 'staff_selected', 'test-team-name'];
    const method = 'GET';

    beforeEach(() => {
      client.request.mockImplementation(
        async () =>
          ({
            data: expectedData,
            status: expectedStatus,
          } as AxiosResponse)
      );
    });

    it('the request returns the correct response', async () => {
      const response = await gateway.request(path, method, {
        useremail: Constants.DUMMY_EMAIL,
      });
      expect(response).toEqual(expectedResponse);
      expect(client.request).toHaveBeenCalledWith({
        method,
        url: `/api/v1/${path.join('/')}`,
        data: undefined,
        validateStatus,
        headers: {
          Authorization: process.env.EVIDENCE_API_TOKEN_DOCUMENT_TYPES_GET,
          useremail: Constants.DUMMY_EMAIL,
        },
      });
    });
  });

  describe('POST request to /evidence_requests', () => {
    describe('when the request is successful', () => {
      const path = ['evidence_requests'];
      const method = 'POST';
      const headers = {
        useremail: Constants.DUMMY_EMAIL,
      };
      const body = {
        data: 'bar',
      };
      const expectedData = 'response to POST';
      const expectedStatus = 200;
      const expectedResponse = { data: expectedData, status: expectedStatus };

      beforeEach(() => {
        client.request.mockImplementation(
          async () =>
            ({
              data: expectedData,
              status: expectedStatus,
            } as AxiosResponse)
        );
      });

      it('the request returns the correct response', async () => {
        const response = await gateway.request(path, method, headers, body);
        expect(response).toEqual(expectedResponse);
        expect(client.request).toHaveBeenCalledWith({
          method,
          url: `/api/v1/${path.join('/')}`,
          data: body,
          headers: {
            Authorization:
              process.env.EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_POST,
            useremail: Constants.DUMMY_EMAIL,
          },
          validateStatus,
        });
      });
    });

    describe('when request fails', () => {
      const path = ['evidence_requests'];
      const method = 'POST';
      const expectedData = 'error details';
      const expectedStatus = 400;
      const expectedResponse = { data: expectedData, status: expectedStatus };

      beforeEach(() => {
        client.request.mockImplementation(
          async () =>
            ({
              data: expectedData,
              status: expectedStatus,
            } as AxiosResponse)
        );
      });

      it('does not throw an error', async () => {
        const response = await gateway.request(path, method, {
          useremail: Constants.DUMMY_EMAIL,
        });
        expect(response).toEqual(expectedResponse);
      });

      describe('when axios request fails', () => {
        const expectedStatus = 500;
        const expectedResponse = { status: 500 };
        beforeEach(() => {
          client.request.mockRejectedValue({
            status: expectedStatus,
          } as AxiosResponse);
        });

        it('returns status code 500', async () => {
          const response = await gateway.request(path, method, {
            useremail: Constants.DUMMY_EMAIL,
          });
          expect(response).toEqual(expectedResponse);
        });
      });
    });
  });

  describe('GET request to /evidence_requests', () => {
    describe('for a nested path', () => {
      const path = ['evidence_requests', '0123456'];
      const expectedStatus = 200;
      const expectedData = { foo: 'bar' };
      const expectedResponse = {
        data: expectedData,
        status: expectedStatus,
      };
      const method = 'GET';

      beforeEach(() => {
        client.request.mockImplementation(
          async () =>
            ({
              data: expectedData,
              status: expectedStatus,
            } as AxiosResponse)
        );
      });

      it('returns the correct response', async () => {
        const response = await gateway.request(path, method, {
          useremail: Constants.DUMMY_EMAIL,
        });
        expect(response).toEqual(expectedResponse);
        expect(client.request).toHaveBeenCalledWith({
          method,
          url: `/api/v1/${path.join('/')}`,
          data: undefined,
          validateStatus,
          headers: {
            Authorization: process.env.EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_GET,
            useremail: Constants.DUMMY_EMAIL,
          },
        });
      });

      it('sends required headers only', async () => {
        // content-length is not present in EvidenceApiGateway.headersToSendToEvidenceApi
        // so it is filtered out before sending the request onto EvidenceApi
        await gateway.request(path, method, {
          useremail: Constants.DUMMY_EMAIL,
          'content-type': 'application/json',
          'content-length': 915,
        });
        expect(client.request).toHaveBeenCalledWith({
          method,
          url: `/api/v1/${path.join('/')}`,
          data: undefined,
          validateStatus,
          headers: {
            Authorization: process.env.EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_GET,
            useremail: Constants.DUMMY_EMAIL,
            'content-type': 'application/json',
          },
        });
      });
    });
  });

  describe('getEvidenceRequests', () => {
    describe('when successful', () => {
      const expectedData = EvidenceRequestFixture;
      const mappedData = EvidenceRequestFixture.map(
        ResponseMapper.mapEvidenceRequest
      );

      beforeEach(() => {
        mockedResponseMapper.mapEvidenceRequest.mockClear();
        client.get.mockResolvedValue({
          data: expectedData,
        } as AxiosResponse);

        for (let i = 0; i < expectedData.length; i++) {
          mockedResponseMapper.mapEvidenceRequest.mockReturnValueOnce(
            mappedData[i]
          );
        }
      });

      it('calls axios correctly', async () => {
        await gateway.getEvidenceRequests(
          Constants.DUMMY_EMAIL,
          'Housing benefit',
          null,
          EvidenceRequestState.PENDING
        );
        expect(client.get).toHaveBeenLastCalledWith(
          '/api/v1/evidence_requests',
          {
            headers: {
              Authorization:
                process.env.EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_GET,
              UserEmail: Constants.DUMMY_EMAIL,
            },
            params: {
              team: 'Housing benefit',
              residentId: null,
              state: EvidenceRequestState.PENDING,
            },
          }
        );
      });

      it('maps the response', async () => {
        await gateway.getEvidenceRequests(
          Constants.DUMMY_EMAIL,
          'Housing benefit'
        );

        for (let i = 0; i < expectedData.length; i++) {
          expect(
            mockedResponseMapper.mapEvidenceRequest
          ).toHaveBeenNthCalledWith(i + 1, expectedData[i]);
        }
      });

      it('returns mapped EvidenceTypes', async () => {
        const result = await gateway.getEvidenceRequests(
          Constants.DUMMY_EMAIL,
          'Housing benefit'
        );
        expect(result).toEqual(mappedData);
      });
    });

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        client.get.mockRejectedValue(new Error('Network error'));
        const functionCall = () =>
          gateway.getEvidenceRequests(Constants.DUMMY_EMAIL, 'Housing benefit');
        expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });

  describe('getEvidenceRequest', () => {
    const id = 'id';
    describe('returns the correct response', () => {
      const expectedData = EvidenceRequestFixture[0];
      const mappedData = ResponseMapper.mapEvidenceRequest(expectedData);

      beforeEach(() => {
        client.get.mockResolvedValue({
          data: expectedData,
        });

        mockedResponseMapper.mapEvidenceRequest.mockReturnValue(mappedData);
      });

      it('calls axios correctly', async () => {
        await gateway.getEvidenceRequest(Constants.DUMMY_EMAIL, id);
        expect(client.get).toHaveBeenLastCalledWith(
          `/api/v1/evidence_requests/${id}`,
          {
            headers: {
              Authorization:
                process.env.EVIDENCE_API_TOKEN_EVIDENCE_REQUESTS_GET,
              UserEmail: Constants.DUMMY_EMAIL,
            },
          }
        );
      });

      it('maps the response', async () => {
        await gateway.getEvidenceRequest(Constants.DUMMY_EMAIL, id);
        expect(mockedResponseMapper.mapEvidenceRequest).toHaveBeenCalledWith(
          expectedData
        );
      });

      it('returns mapped EvidenceTypes', async () => {
        const result = await gateway.getEvidenceRequest(
          Constants.DUMMY_EMAIL,
          id
        );
        expect(result).toEqual(mappedData);
      });
    });

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        client.get.mockRejectedValue(new Error('Network error'));
        const functionCall = () =>
          gateway.getEvidenceRequest(Constants.DUMMY_EMAIL, id);
        expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });

  describe('getDocumentSubmission', () => {
    const id = 'id';
    describe('returns the correct response', () => {
      const expectedData = DocumentSubmissionFixture;
      const mappedData = ResponseMapper.mapDocumentSubmission(expectedData);

      beforeEach(() => {
        client.get.mockResolvedValue({
          data: expectedData,
        });

        mockedResponseMapper.mapDocumentSubmission.mockReturnValue(mappedData);
      });

      it('calls axios correctly', async () => {
        await gateway.getDocumentSubmission(Constants.DUMMY_EMAIL, id);
        expect(client.get).toHaveBeenLastCalledWith(
          `/api/v1/document_submissions/${id}`,
          {
            headers: {
              Authorization:
                process.env.EVIDENCE_API_TOKEN_DOCUMENT_SUBMISSIONS_GET,
              UserEmail: Constants.DUMMY_EMAIL,
            },
          }
        );
      });

      it('maps the response', async () => {
        await gateway.getDocumentSubmission(Constants.DUMMY_EMAIL, id);
        expect(mockedResponseMapper.mapDocumentSubmission).toHaveBeenCalledWith(
          expectedData
        );
      });

      it('returns mapped EvidenceTypes', async () => {
        const result = await gateway.getDocumentSubmission(
          Constants.DUMMY_EMAIL,
          id
        );
        expect(result).toEqual(mappedData);
      });
    });

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        client.get.mockRejectedValue(new Error('Network error'));
        const functionCall = () =>
          gateway.getDocumentSubmission(Constants.DUMMY_EMAIL, id);
        expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });

  describe('getDocumentSubmissionsByResidentId', () => {
    const residentId = 'id';
    const team = 'service';
    const page = '1';
    const pageSize = '10';
    const state = 'APPROVED';
    describe('returns the correct response', () => {
      const expectedData = DocumentSubmissionsResponseObjectFixture;
      const mappedData = expectedData.documentSubmissions.map((ds) =>
        ResponseMapper.mapDocumentSubmission(ds)
      );

      beforeEach(() => {
        client.get.mockResolvedValue({
          data: expectedData,
        });

        mappedData.map((data) =>
          mockedResponseMapper.mapDocumentSubmission.mockReturnValue(data)
        );
      });

      it('calls axios correctly', async () => {
        await gateway.getDocumentSubmissionsForResident(
          Constants.DUMMY_EMAIL,
          residentId,
          team,
          page,
          pageSize,
          state
        );
        expect(client.get).toHaveBeenLastCalledWith(
          '/api/v1/document_submissions',
          {
            headers: {
              Authorization:
                process.env.EVIDENCE_API_TOKEN_DOCUMENT_SUBMISSIONS_GET,
              UserEmail: Constants.DUMMY_EMAIL,
            },
            params: {
              residentId: residentId,
              team: team,
              state: state,
              page: page,
              pageSize: pageSize,
            },
          }
        );
      });

      it('maps the response', async () => {
        await gateway.getDocumentSubmissionsForResident(
          Constants.DUMMY_EMAIL,
          team,
          residentId,
          page,
          pageSize,
          state
        );

        expectedData.documentSubmissions.map((ds) =>
          expect(
            mockedResponseMapper.mapDocumentSubmission
          ).toHaveBeenCalledWith(ds)
        );
      });

      it('returns mapped EvidenceTypes', async () => {
        const result = await gateway.getDocumentSubmissionsForResident(
          Constants.DUMMY_EMAIL,
          team,
          residentId,
          page,
          pageSize,
          state
        );
        expect(result.documentSubmissions).toEqual(mappedData);
      });
    });

    describe('when there is an error', () => {
      it('returns internal server error', async () => {
        client.get.mockRejectedValue(new Error('Network error'));
        const functionCall = () =>
          gateway.getDocumentSubmissionsForResident(
            Constants.DUMMY_EMAIL,
            team,
            residentId,
            page,
            pageSize,
            state
          );
        expect(functionCall).rejects.toEqual(
          new InternalServerError('Internal server error')
        );
      });
    });
  });
});
