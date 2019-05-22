import { JupyterLab } from '@jupyterlab/application';
import { ServiceManager } from '@jupyterlab/services';

export namespace CommandIDs {
    export const openCloudModelPlugin = 'legion:ui-cloud-mode';
    export const openLocalModelPlugin = 'legion:ui-local-mode';
    export const mainRepository = 'legion:main-repository';
    export const refresh = 'legion:refresh';
    export const setRefreshInterval = 'legion:set-refresh-interval';
    export const unAuthorizeOnCluster = 'legion:cloud-reset-auth';
    export const authorizeOnCluster = 'legion:cloud-start-auth';
    export const openLocalMetrics = 'legion:open-local-metrics';

    export const newLocalBuild = 'legion:local-build-new';
    export const showLocalBuildInformation = 'legion:local-build-info';
    export const newLocalDeployment = 'legion:local-deployment-new';
    export const removeLocalDeployment = 'legion:local-deployment-remove';
    export const showLocalDeploymentInformation = 'legion:local-deployment-info';

    export const palleteCommands = [
        openCloudModelPlugin,
        openLocalModelPlugin,
        mainRepository,
        refresh,
        setRefreshInterval,
        unAuthorizeOnCluster,
        openLocalMetrics,

    ];
}

export interface IAddCommandsOptions {
    app: JupyterLab;
    services: ServiceManager;
}