/**
 *   Copyright 2019 EPAM Systems
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */
import { ServerConnection } from '@jupyterlab/services';

import { httpRequest, IApiGroup, legionApiRootURL } from './base';
import * as models from '../models/cloud';

export namespace URLs {
    export const cloudTrainingsUrl = legionApiRootURL + '/cloud/trainings';
    export const cloudDeploymentsUrl = legionApiRootURL + '/cloud/deployments';
    export const cloudAllDataUrl = legionApiRootURL + '/cloud';
}

export interface ICloudApi {
    // Builds
    createCloudTraining: (request: models.ICloudTrainingRequest) => Promise<models.ICloudTrainingResponse>,
    getCloudTrainings: () => Promise<Array<models.ICloudTrainingResponse>>,

    // Deployments
    getCloudDeployments: () => Promise<Array<models.ICloudDeploymentResponse>>,
    createCloudDeployment: (request: models.ICloudDeploymentCreateRequest) => Promise<models.ICloudDeploymentResponse>,
    removeCloudDeployment: (request: models.ICloudDeploymentRemoveRequest) => Promise<void>,

    // Aggregated
    getCloudAllEntities: () => Promise<models.ILocalAllEntitiesResponse>,
}

export class CloudApi implements IApiGroup, ICloudApi {
    // Trainings
    async createCloudTraining(request: models.ICloudTrainingRequest): Promise<models.ICloudTrainingResponse> {
        try {
            let response = await httpRequest(URLs.cloudTrainingsUrl, 'POST', request);
            if (response.status !== 200) {
                const data = await response.json();
                throw new ServerConnection.ResponseError(response, data.message);
            }
            return null;
        } catch (err) {
            throw new ServerConnection.NetworkError(err);
        }
    }
    async getCloudTrainings(): Promise<Array<models.ICloudTrainingResponse>> {
        try {
            let response = await httpRequest(URLs.cloudTrainingsUrl, 'GET', null);
            if (response.status !== 200) {
                const data = await response.json();
                throw new ServerConnection.ResponseError(response, data.message);
            }
            return response.json();
        } catch (err) {
            throw new ServerConnection.NetworkError(err);
        }
    }

    // Deployments
    async getCloudDeployments(): Promise<Array<models.ICloudDeploymentResponse>> {
        try {
            let response = await httpRequest(URLs.cloudDeploymentsUrl, 'GET', null);
            if (response.status !== 200) {
                const data = await response.json();
                throw new ServerConnection.ResponseError(response, data.message);
            }
            return response.json();
        } catch (err) {
            throw new ServerConnection.NetworkError(err);
        }
    }
    async createCloudDeployment(request: models.ICloudDeploymentCreateRequest): Promise<models.ICloudDeploymentResponse> {
        try {
            let response = await httpRequest(URLs.cloudDeploymentsUrl, 'POST', request);
            if (response.status !== 200) {
                const data = await response.json();
                throw new ServerConnection.ResponseError(response, data.message);
            }
            return response.json();
        } catch (err) {
            throw new ServerConnection.NetworkError(err);
        }
    }
    async removeCloudDeployment(request: models.ICloudDeploymentRemoveRequest): Promise<void> {
        try {
            let response = await httpRequest(URLs.cloudDeploymentsUrl, 'DELETE', request);
            if (response.status !== 200) {
                const data = await response.json();
                throw new ServerConnection.ResponseError(response, data.message);
            }
            return null;
        } catch (err) {
            throw new ServerConnection.NetworkError(err);
        }
    }

    // Aggregated
    async getCloudAllEntities(): Promise<models.ILocalAllEntitiesResponse> {
        try {
            let response = await httpRequest(URLs.cloudAllDataUrl, 'GET', null);
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