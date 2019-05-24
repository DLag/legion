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
import { ISignal, Signal } from '@phosphor/signaling';

import { ICloudCredentials } from '../api/base';
import * as local from './local';
import * as cloud from './cloud';

export interface IApiLocalState {
    builds: Array<local.ILocalBuildInformation>,
    deployments: Array<local.ILocalDeploymentInformation>,
    buildStatus: local.ILocalBuildStatus
}

export interface IApiCloudState {
    trainings: Array<cloud.ICloudTrainingResponse>,
    deployments: Array<cloud.ICloudDeploymentResponse>
}

export interface IApiState {
    local: IApiLocalState;
    updateEntireLocalState(data: local.ILocalAllEntitiesResponse): void;
    onLocalDataChanged: ISignal<this, void>;

    cloud: cloud.ICloudDeploymentResponse;
    updateEntireCloudState(data: cloud.ICloudAllEntitiesResponse): void;
    onCloudDataChanged: ISignal<this, void>;

    credentials: ICloudCredentials;
    setCredentials(credentials?: ICloudCredentials): void;
};

class APIStateImplementation implements IApiState {
    private _local: IApiLocalState;
    private _localDataChanged = new Signal<this, void>(this);

    private _cloud: IApiCloudState;
    private _cloudDataChanged = new Signal<this, void>(this);

    private _credentials?: ICloudCredentials;

    constructor() {
        this._local = {
            builds: [],
            deployments: [],
            buildStatus: {
                started: false,
                finished: false
            }
        };

        this._cloud = {
            trainings: [],
            deployments: []
        }

        this._credentials = null;
    }

    get local(): IApiLocalState {
        return this._local;
    }

    get onLocalDataChanged(): ISignal<this, void> {
        return this._localDataChanged;
    }

    get cloud(): IApiCloudState {
        return this._cloud;
    }

    get onCloudDataChanged(): ISignal<this, void> {
        return this._cloudDataChanged;
    }

    updateEntireLocalState(data: local.ILocalAllEntitiesResponse): void {
        this._local = data;
        this._localDataChanged.emit(null);
    }

    updateEntireCloudState(data: cloud.ICloudAllEntitiesResponse): void {
        this._cloud = data;
        this._cloudDataChanged.emit(null);
    }

    get credentials(): ICloudCredentials {
        return this._credentials;
    }

    setCredentials(credentials?: ICloudCredentials): void {
        this._credentials = credentials;
    }
}

export function buildInitialAPIState(): IApiState {
    return new APIStateImplementation();
}