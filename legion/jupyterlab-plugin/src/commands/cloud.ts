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
import { showErrorMessage , showDialog, Dialog } from '@jupyterlab/apputils';

import { CommandIDs, IAddCommandsOptions } from './base';
import * as dialogs from '../components/dialogs';

export interface ICloudScaleParameters {

}

/**
 * Add the commands for the legion extension.
 */
export function addCommands(options: IAddCommandsOptions) {
    let { commands } = options.app;

    commands.addCommand(CommandIDs.newCloudTraining, {
        label: 'Train model in a cloud',
        caption: 'Create new cloud training',
        execute: () => {

        }
    });

    commands.addCommand(CommandIDs.removeCloudTraining, {
        label: 'Remove cloud training',
        caption: 'Stop and remove cloud training',
        execute: args => {

        }
    });

    commands.addCommand(CommandIDs.newCloudDeployment, {
        label: 'Deploy model in a cloud',
        caption: 'Create cloud deployment',
        execute: args => {

        }
    });

    commands.addCommand(CommandIDs.scaleCloudDeployment, {
        label: 'Scale model in a cloud',
        caption: 'Change count of desired replicas in a cloud',
        execute: args => {
            try {
                const name = args['name'] as string;
                const currentAvailableReplicas = args['currentAvailableReplicas'] as number;
                const currentDesiredReplicas = args['currentDesiredReplicas'] as number;
                const newScale = args['newScale'] as number;
                if (newScale !== undefined) {
                    let splashScreen = options.splash.show();
                    options.api.cloud.scaleCloudDeployment({
                        name,
                        newScale
                    }, options.apiState.credentials).then(_ => {
                        splashScreen.dispose();
                        commands.execute(CommandIDs.refreshCloud, {});
                    }).catch(err => {
                        splashScreen.dispose();
                        showErrorMessage('Can not scale model in a cloud', err);
                    })
                }
                else if (name !== undefined) {
                    dialogs.showPromptDialog(
                        'Provide new desired count',
                        `Please provide new scale for model ${name} (currently ${currentAvailableReplicas}/${currentDesiredReplicas} replicas available)`,
                        'Scale',
                        false
                    ).then(({ value }) => commands.execute(CommandIDs.scaleCloudDeployment, {
                        name,
                        newScale: parseInt(value)
                    }))
                } else {
                    dialogs.showChooseDialog(
                        'Choose deployment to scale',
                        'Please choose one deployment from list',
                        options.apiState.cloud.deployments.map(deployment => {
                            return {
                                value: deployment.name,
                                text: deployment.name
                            }
                        }),
                        'Scale deployment',
                        false
                    ).then(({ value }) => {
                        const targetDeployment = options.apiState.cloud.deployments.find(deployment => deployment.name == value.value);
                        if (targetDeployment != undefined) {
                            commands.execute(CommandIDs.scaleCloudDeployment, {
                                name: value.value,
                                currentAvailableReplicas: targetDeployment.status.availableReplicas,
                                currentDesiredReplicas: targetDeployment.spec.replicas
                            })
                        }
                    })
                }
            } catch (err) {
                showErrorMessage('Can not scale cloud model', err);
            }

        }
    });

    commands.addCommand(CommandIDs.removeCloudDeployment, {
        label: 'Remove Legion cloud deployment',
        caption: 'Remove cloud deployment',
        execute: args => {
            try {
                const name = args['name'] as string;
                if (name) {
                    showDialog({
                        title: `Removing deployment`,
                        body: `Do you want to remove deployment ${name}?`,
                        buttons: [Dialog.cancelButton(), Dialog.okButton({ label: 'Remove', displayType: 'warn' })]
                    }).then(({ button }) => {
                        if (button.accept) {
                            let splashScreen = options.splash.show();
                            options.api.cloud.removeCloudDeployment({
                                name: name
                            }, options.apiState.credentials).then(() => {
                                splashScreen.dispose();
                                commands.execute(CommandIDs.refreshCloud, {});
                            }).catch(err => {
                                splashScreen.dispose();
                                showErrorMessage('Can not remove cloud deployment', err);
                                commands.execute(CommandIDs.refreshCloud, {});
                            })
                        }
                    })
                } else {
                    dialogs.showChooseDialog(
                        'Choose deployment to remove',
                        'Please choose one deployment from list',
                        options.apiState.cloud.deployments.map(deployment => {
                            return {
                                value: deployment.name,
                                text: deployment.name
                            }
                        }),
                        'Remove deployment',
                        true
                    ).then(({ value }) => commands.execute(CommandIDs.removeCloudDeployment, { name: value.value }))
                }
            } catch (err) {
                showErrorMessage('Can not remove cloud deployment', err);
            }
        }
    });

}