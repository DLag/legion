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
import * as dialogs from '../components/dialogs';



/**
 * Add the commands for the legion extension.
 */
export function addCommands(options: IAddCommandsOptions) {
    let { commands } = options.app;

    commands.addCommand(CommandIDs.unAuthorizeOnCluster, {
        label: 'Reset cluster authorization',
        caption: 'Reset currently used cluster context',
        execute: () => {
            try {
                dialogs.showLogoutDialog('TestClusterName')
                .then(({ button }) => {
                    if (button.accept){
                        console.log('Resetting auth');
                    }
                });
            } catch (err) {
                showErrorMessage('Can not reset cluster authorization', err);
            }
        }
    });


    commands.addCommand(CommandIDs.authorizeOnCluster, {
        label: 'Authorize on cluster',
        caption: 'Authorize on Legion cluster',
        execute: () => {
            try {
                dialogs.showLoginDialog()
                .then(({ button, value }) => {
                    if (button.accept){
                        console.log('Authorizing on a cluster', value.cluster, 'with token', value.authString);
                    }
                });
            } catch (err) {
                showErrorMessage('Can not authorize on a cluster', err);
            }
        }
    });
}