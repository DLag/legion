/**
 * Response that contains information about found models (docker images)
 */
export interface ILocalBuildInformation {
    imageName: string;
    modelName: string;
    modelVersion: string;
}

/**
 * Response that contains information about current build status
 */
export interface ILocalBuildStatus {
    started: boolean;
    finished: boolean;
}


/**
 * Response that contains information about deployment
 */
export interface ILocalDeploymentInformation {
    name: string;
    image: string;
    port: number;
}

/**
 * Request to create new local deployment (to start docker container)
 */
export interface ILocalDeploymentRequest {
    name: string;
    image: string;
    port?: number;
}

/**
 * Request to remove local deployment (to stop docker container)
 */
export interface ILocalUnDeployRequest {
    name: string;
}

/**
 * All data for local widget
 */
export interface ILocalAllEntitiesResponse {
    builds: Array<ILocalBuildInformation>,
    deployments: Array<ILocalDeploymentInformation>,
    buildStatus: ILocalBuildStatus
}