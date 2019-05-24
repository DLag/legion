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
export interface ILocalAllEntitiesResponse {
    trainings: Array<ICloudTrainingResponse>,
    deployments: Array<ICloudDeploymentResponse>
}