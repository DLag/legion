
export interface ILocalBuildInformation {
    started: boolean;
    finished: boolean;

    imageName?: string;
    modelName?: string;
    modelVersion?: string;
}


export interface ILocalDeploymentInformation {
    name: string;
    image: string;
    port: number;
}

export interface ILocalDeploymentRequest {
    name: string;
    image: string;
    port?: number;
}

export interface ILocalUnDeployRequest {
    name: string;
}