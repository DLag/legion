import { JupyterLab } from '@jupyterlab/application';
import { ServiceManager } from '@jupyterlab/services';

import { IApiState } from '../models';
import { ILegionApi } from '../api';


/**
 * CommandIDs contains IDs of all Legion commands.
 * This commands can be used outside of Legion system.
 */
export namespace CommandIDs {
    // UI
    export const openCloudModelPlugin = 'legion:ui-cloud-mode';
    export const openLocalModelPlugin = 'legion:ui-local-mode';
    export const mainRepository = 'legion:main-repository';

    // Authorize
    export const unAuthorizeOnCluster = 'legion:cloud-reset-auth';
    export const authorizeOnCluster = 'legion:cloud-start-auth';
    export const openLocalMetrics = 'legion:open-local-metrics';

    // Local
    export const newLocalBuild = 'legion:local-build-new';
    export const showLocalBuildInformation = 'legion:local-build-info';
    export const newLocalDeployment = 'legion:local-deployment-new';
    export const removeLocalDeployment = 'legion:local-deployment-remove';
    export const showLocalDeploymentInformation = 'legion:local-deployment-info';

    // Settings
    export const refreshLocal = 'legion:refresh-local-mode';
    export const refreshCloud = 'legion:refresh-cloud-mode';

    export const palleteCommands = [
        openCloudModelPlugin,
        openLocalModelPlugin,
        mainRepository,
        refreshLocal,
        refreshCloud,
        unAuthorizeOnCluster,
        openLocalMetrics
    ];
}

export interface IAddCommandsOptions {
    app: JupyterLab;
    services: ServiceManager;
    api: ILegionApi;
    apiState: IApiState;
}