import * as local from './local';

export interface IApiLocalState {
    builds: Array<local.ILocalBuildInformation>,
    deployments: Array<local.ILocalDeploymentInformation>,
    buildStatus: local.ILocalBuildStatus
}

export interface IApiState {
    local: IApiLocalState;
    updateEntireLocalState(data: local.ILocalAllEntitiesResponse): void;
};

class APIStateImplementation implements IApiState {
    _local: IApiLocalState;

    constructor(){
        this._local = {
            builds: [],
            deployments: [],
            buildStatus: {
                started: false,
                finished: false
            }
        };
    }

    get local(): IApiLocalState {
        return this._local;
    }

    updateEntireLocalState(data: local.ILocalAllEntitiesResponse): void {
        this._local = data;
    }
}

export function buildInitialAPIState(): IApiState {
    return new APIStateImplementation();
}