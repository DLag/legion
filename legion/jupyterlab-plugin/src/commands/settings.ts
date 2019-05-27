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
import { showErrorMessage } from '@jupyterlab/apputils';

import { CommandIDs, IAddCommandsOptions } from './base';


/**
 * Add the commands for the legion extension.
 */
export function addCommands(options: IAddCommandsOptions) {
    let { commands } = options.app;

    commands.addCommand(CommandIDs.refreshLocal, {
        label: 'Force data refresh for local mode',
        caption: 'Force data synchronization for local mode',
        execute: () => {
            options.apiState.signalLocalLoadingStarted();

            options.api.local.getLocalAllEntities().then(response => {
                options.apiState.updateEntireLocalState(response);
                console.log('Data synchronization end');
            }).catch(err => {
                options.apiState.updateEntireLocalState();
                showErrorMessage('Can not forcefully update data for local mode', err);
            });
        }
    });

    commands.addCommand(CommandIDs.refreshLocalBuildStatus, {
        label: 'Force build status refresh for local mode',
        caption: 'Force data synchronization for local mode build status',
        execute: () => {
            options.api.local.getLocalBuildStatus().then(response => {
                options.apiState.updateLocalBuildState(response);
            }).catch(err => {
                console.warn('Can not get status of build', err);
            });
        }
    });

    commands.addCommand(CommandIDs.refreshCloud, {
        label: 'Force data refresh for cloud mode',
        caption: 'Force data synchronization for cloud mode',
        execute: () => {
            showErrorMessage('Not implemented yet', ':(');
        }
    });



}