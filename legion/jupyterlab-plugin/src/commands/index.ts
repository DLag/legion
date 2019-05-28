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
import { JupyterLab } from '@jupyterlab/application';
import { ServiceManager } from '@jupyterlab/services';
import { ISplashScreen } from "@jupyterlab/apputils";

import * as authorize from './authorize';
import * as local from './local';
import * as cloud from './cloud';
import * as settings from './settings';
import * as ui from './ui';

const Handlers = [authorize, local, cloud, settings, ui];

export { CommandIDs, IAddCommandsOptions } from './base'

import { IApiState } from '../models';
import { ILegionApi } from '../api';

//import { Api } from './api';

/**
 * Add the commands for the legion extension.
 */
export function addCommands(app: JupyterLab, services: ServiceManager, apiState: IApiState, api: ILegionApi, splash: ISplashScreen) {
    const options = { app, services, apiState, api, splash };

    Handlers.forEach(handler => {
        handler.addCommands(options)
    });
}
