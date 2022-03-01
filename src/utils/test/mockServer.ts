import { setupServer } from "msw/node";
import {
  rest,
  DefaultRequestBody,
  PathParams,
  ResponseResolver,
  RestContext,
  RestRequest,
} from "msw";

export const mockServer = setupServer();

beforeAll(() => {
  mockServer.listen();
});

afterEach(() => {
  mockServer.resetHandlers();
});

afterAll(() => {
  mockServer.close();
});

const mockRequestBuilder =
  (mockType: "get" | "post" | "patch" | "delete" | "put") =>
  (
    url: string,
    resolver: ResponseResolver<
      RestRequest<DefaultRequestBody, PathParams>,
      RestContext
    >
  ) =>
    mockServer.use(rest[mockType](url, resolver));

export const mockGET = mockRequestBuilder("get");
