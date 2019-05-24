import { JupyterLab } from '@jupyterlab/application';
import { ServiceManager } from '@jupyterlab/services';

import * as authorize from './authorize';
import * as local from './local';
import * as settings from './settings';
import * as ui from './ui';

const Handlers = [authorize, local, settings, ui];

export { CommandIDs, IAddCommandsOptions } from './base'

import { IApiState } from '../models';
import { ILegionApi } from '../api';

//import { Api } from './api';

/**
 * Add the commands for the legion extension.
 */
export function addCommands(app: JupyterLab, services: ServiceManager, apiState: IApiState, api: ILegionApi) {
    const options = { app, services, apiState, api };

    Handlers.forEach(handler => {
        console.log('Processing handler ', handler);
        handler.addCommands(options)
    });
}
