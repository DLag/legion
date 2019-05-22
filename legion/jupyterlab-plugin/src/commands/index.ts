import { JupyterLab } from '@jupyterlab/application';
import { ServiceManager } from '@jupyterlab/services';

import * as authorize from './authorize';
import * as local from './local';
import * as settings from './settings';
import * as ui from './ui';

const Handlers = [authorize, local, settings, ui];

export { CommandIDs, IAddCommandsOptions } from './base'

//import { Api } from './api';

/**
 * Add the commands for the legion extension.
 */
export function addCommands(app: JupyterLab, services: ServiceManager) {
    //  let api = new Api();
    const options = { app, services };

    Handlers.forEach(handler => handler.addCommands(options));
}
