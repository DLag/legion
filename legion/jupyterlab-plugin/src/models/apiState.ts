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
import { IStateDB } from "@jupyterlab/coreutils";

import { ICloudCredentials } from '../api/base';
import * as local from './local';
import * as cloud from './cloud';

export const PLUGIN_CREDENTIALS_STORE_CLUSTER = `legion.cluster:credentials-cluster`;
export const PLUGIN_CREDENTIALS_STORE_TOKEN = `legion.cluster:credentials-token`;

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
    localIsLoading: boolean;
    signalLocalLoadingStarted(): void;
    updateEntireLocalState(data?: local.ILocalAllEntitiesResponse): void;
    updateLocalBuildState(data: local.ILocalBuildStatus): void;
    onLocalDataChanged: ISignal<this, void>;

    cloud: IApiCloudState;
    cloudIsLoading: boolean;
    signalCloudLoadingStarted(): void;
    updateEntireCloudState(data?: cloud.ICloudAllEntitiesResponse): void;
    onCloudDataChanged: ISignal<this, void>;

    credentials: ICloudCredentials;
    setCredentials(credentials?: ICloudCredentials, skipPersisting?: boolean): void;
    tryToLoadCredentialsFromSettings(): void;
};

class APIStateImplementation implements IApiState {
    private _local: IApiLocalState;
    private _localIsLoading: boolean;
    private _localDataChanged = new Signal<this, void>(this);

    private _cloud: IApiCloudState;
    private _cloudIsLoading: boolean;
    private _cloudDataChanged = new Signal<this, void>(this);

    private _credentials?: ICloudCredentials;

    private _appState: IStateDB;

    constructor(appState: IStateDB) {
        this._local = {
            builds: [],
            deployments: [],
            buildStatus: {
                started: false,
                finished: false
            }
        };
        this._localIsLoading = false;

        this._cloud = {
            trainings: [],
            deployments: []
        }
        this._cloudIsLoading = false;

        this._credentials = null;
        this._appState = appState;
    }

    get local(): IApiLocalState {
        return this._local;
    }

    get localIsLoading(): boolean {
        return this._localIsLoading;
    }

    get onLocalDataChanged(): ISignal<this, void> {
        return this._localDataChanged;
    }

    get cloud(): IApiCloudState {
        return this._cloud;
    }

    get cloudIsLoading(): boolean {
        return this._cloudIsLoading;
    }

    get onCloudDataChanged(): ISignal<this, void> {
        return this._cloudDataChanged;
    }

    signalLocalLoadingStarted(): void {
        this._localIsLoading = true;
        this._localDataChanged.emit(null);
    }

    updateEntireLocalState(data?: local.ILocalAllEntitiesResponse): void {
        if (data) {
            this._local = data;
        }
        this._localIsLoading = false;
        this._localDataChanged.emit(null);
    }

    updateLocalBuildState(data: local.ILocalBuildStatus): void {
        this._local = {
            ...this._local,
            buildStatus: data
        };
        this._localDataChanged.emit(null);
    }

    signalCloudLoadingStarted(): void {
        this._cloudIsLoading = true;
        this._cloudDataChanged.emit(null);
    }

    updateEntireCloudState(data?: cloud.ICloudAllEntitiesResponse): void {
        if (data) {
            this._cloud = data;
        }
        this._cloudIsLoading = false;
        this._cloudDataChanged.emit(null);
    }

    get credentials(): ICloudCredentials {
        return this._credentials;
    }

    setCredentials(credentials?: ICloudCredentials, skipPersisting?: boolean): void {
        if (credentials != undefined) {
            console.log('Updating credentials for ', credentials.cluster);
            this._credentials = credentials;
        } else {
            console.log('Resetting credentials');
            this._credentials = null;
        }

        if (skipPersisting !== true) {
            if (this._credentials) {
                Promise.all([
                    this._appState.save(PLUGIN_CREDENTIALS_STORE_CLUSTER, this._credentials.cluster),
                    this._appState.save(PLUGIN_CREDENTIALS_STORE_TOKEN, this._credentials.authString),
                ]).then(() => {
                    console.log('Cluster and token have been persisted in settings');
                }).catch(err => {
                    console.error('Can not persist cluster and token in settings', err);
                });
            } else {
                Promise.all([
                    this._appState.remove(PLUGIN_CREDENTIALS_STORE_CLUSTER),
                    this._appState.remove(PLUGIN_CREDENTIALS_STORE_TOKEN)
                ]).then(() => {
                    console.log('Cluster and token have been removed from storage');
                }).catch(err => {
                    console.error('Can not remove cluster and token from storage', err);
                });
            }
        }
        this._cloudDataChanged.emit(null);
    }

    tryToLoadCredentialsFromSettings(): void {
        Promise.all([
            this._appState.fetch(PLUGIN_CREDENTIALS_STORE_CLUSTER),
            this._appState.fetch(PLUGIN_CREDENTIALS_STORE_TOKEN),
        ]).then((answers) => {
            if (!answers[0]) {
                console.warn('Empty data loaded from credentials store');
            } else {
                let credentials = {
                    cluster: answers[0] as string,
                    authString: answers[1] as string
                };
                this.setCredentials(credentials, true);
            }
        }).catch(err => {
            console.error('Can not load credentials from store', err);
        });
    }
}

export function buildInitialAPIState(appState: IStateDB): IApiState {
    return new APIStateImplementation(appState);
}