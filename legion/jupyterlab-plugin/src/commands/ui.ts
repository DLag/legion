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
import { CommandIDs, IAddCommandsOptions } from './base';


/**
 * Add the commands for the legion extension.
 */
export function addCommands(options: IAddCommandsOptions) {
    let { commands } = options.app;

    commands.addCommand(CommandIDs.openCloudModelPlugin, {
        label: 'Cloud mode interface',
        caption: 'Go to Cloud mode interface',
        execute: () => {
            try {
                options.app.shell.activateById('legion-cloud-sessions-widget');
            } catch (err) { }
        }
    });
    commands.addCommand(CommandIDs.openLocalModelPlugin, {
        label: 'Local mode interface',
        caption: 'Go to Local mode interface',
        execute: () => {
            try {
                options.app.shell.activateById('legion-local-sessions-widget');
            } catch (err) { }
        }
    });

    commands.addCommand(CommandIDs.mainRepository, {
        label: 'Main Repository',
        caption: 'Open main Legion repository ',
        execute: () => {
            window.open('https://github.com/legion-platform/legion');
        }
    });



}