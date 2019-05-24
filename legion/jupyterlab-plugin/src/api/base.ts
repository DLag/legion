import { ServerConnection } from '@jupyterlab/services';
import { URLExt } from '@jupyterlab/coreutils';

export interface ICloudCredentials {
  cluster: string;
  authString: string;
}

/**
 * Create request promise
 * @param url string target URL (relevant)
 * @param method request method
 * @param request request payload (as JSON body)
 */
export function httpRequest(
  url: string,
  method: string,
  request: Object | null,
  credentials?: ICloudCredentials | null
): Promise<Response> {
  let fullRequest = {
    method: method,
    body: request != null ? JSON.stringify(request) : null
  };

  let setting = ServerConnection.makeSettings({
    init: {
      headers: credentials != null ? {
        'X-Legion-Cloud-Endpoint': credentials.cluster,
        'X-Legion-Cloud-Token': credentials.authString,
      } : {}
    }
  });
  let fullUrl = URLExt.join(setting.baseUrl, url);
  return ServerConnection.makeRequest(fullUrl, fullRequest, setting);
}

/**
 * Root API for all Legion endpoints
 */
export const legionApiRootURL = '/legion/api';

export interface IApiGroup {

}