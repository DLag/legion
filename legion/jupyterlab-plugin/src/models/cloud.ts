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

export interface ICloudTrainingRequest {

}

export interface ICloudTrainingResponse {

}

export interface ICloudDeploymentCreateRequest {

}

export interface ICloudDeploymentRemoveRequest {

}

export interface ICloudDeploymentResponse {

}

/**
 * All data for cloud widget
 */
export interface ICloudAllEntitiesResponse {
    trainings: Array<ICloudTrainingResponse>,
    deployments: Array<ICloudDeploymentResponse>
}