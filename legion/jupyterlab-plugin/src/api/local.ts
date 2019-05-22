import { ServerConnection } from '@jupyterlab/services';

import { httpRequest, IApiGroup, legionApiRootURL } from './base';
import * as models from '../models/local';

export namespace URLs {
    export const startLocalBuildUrl = legionApiRootURL + '/local/build';
    export const getLocalBuildStatusUrl = legionApiRootURL + '/local/build/status';
    export const getLocalBuildsUrl = legionApiRootURL + '/local/build';
}

export interface ILocalApi {
    // Builds
    startLocalBuild: () => Promise<void>,
    getLocalBuildStatus: () => Promise<models.ILocalBuildInformation>,
    getLocalBuilds: () => Promise<Array<models.ILocalBuildInformation>>,

    // Deployments
    /*
    getLocalDeployments: () => Array<models.ILocalDeploymentInformation>,
    createLocalDeployment: (request: models.ILocalDeploymentRequest) => models.ILocalDeploymentInformation,
    removeLocalDeployment: (request: models.ILocalUnDeployRequest) => void
    */
}

export class LocalApi implements IApiGroup, ILocalApi {
    async startLocalBuild(): Promise<void> {
        try {
            let response = await httpRequest(URLs.startLocalBuildUrl, 'POST', {});
            if (response.status !== 200) {
                const data = await response.json();
                throw new ServerConnection.ResponseError(response, data.message);
            }
            return null;
        } catch (err) {
            throw new ServerConnection.NetworkError(err);
        }
    }
    async getLocalBuildStatus(): Promise<models.ILocalBuildInformation> {
        try {
            let response = await httpRequest(URLs.startLocalBuildUrl, 'GET', null);
            if (response.status !== 200) {
                const data = await response.json();
                throw new ServerConnection.ResponseError(response, data.message);
            }
            return response.json();
        } catch (err) {
            throw new ServerConnection.NetworkError(err);
        }
    }
    async getLocalBuilds(): Promise<Array<models.ILocalBuildInformation>> {
        try {
            let response = await httpRequest(URLs.getLocalBuildsUrl, 'GET', null);
            if (response.status !== 200) {
                const data = await response.json();
                throw new ServerConnection.ResponseError(response, data.message);
            }
            return response.json();
        } catch (err) {
            throw new ServerConnection.NetworkError(err);
        }
    }
}