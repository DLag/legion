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
import { showErrorMessage, showDialog, Dialog } from '@jupyterlab/apputils';

import { CommandIDs, IAddCommandsOptions } from './base';
import * as dialogs from '../components/dialogs';


/**
 * Add the commands for the legion extension.
 */
export function addCommands(options: IAddCommandsOptions) {
    let { commands } = options.app;

    commands.addCommand(CommandIDs.openLocalMetrics, {
        label: 'Local train metrics',
        caption: 'Open window with local training metrics',
        execute: () => {
            try {
                throw new Error('Not implemented');
            } catch (err) {
                showErrorMessage('Can not open metrics window', err);
            }
        }
    });

    commands.addCommand(CommandIDs.newLocalBuild, {
        label: 'Build local Legion model',
        caption: 'Capture Legion model (local mode)',
        execute: () => {
            options.api.local.startLocalBuild().then(() => {
                console.log('Image build has been started');
                commands.execute(CommandIDs.refreshLocalBuildStatus);
            }).catch(err => {
                showErrorMessage('Can not build model locally', err);
            });
        }
    });

    commands.addCommand(CommandIDs.newLocalDeployment, {
        label: 'Deploy Legion model locally',
        caption: 'Deploy Legion model (local mode)',
        execute: args => {
            try {
                const image = args['image'] as string;
                const name = args['name'] as string;
                if (name) {
                    let splashScreen = options.splash.show();
                    options.api.local.createLocalDeployment({
                        name,
                        image,
                        port: 0
                    }).then(_ => {
                        splashScreen.dispose();
                        commands.execute(CommandIDs.refreshLocal, {});
                    }).catch(err => {
                        splashScreen.dispose();
                        showErrorMessage('Can not deploy image locally', err);
                    })
                }
                else if (image) {
                    dialogs.showPromptDialog(
                        'Provide name for deployment',
                        'Please name your new deployment',
                        'Deploy',
                        false
                    ).then(({ value }) => commands.execute(CommandIDs.newLocalDeployment, { image: image, name: value }))
                } else {
                    dialogs.showChooseDialog(
                        'Choose image to deploy',
                        'Please choose one image from list',
                        options.apiState.local.builds.map(build => {
                            return {
                                value: build.imageName,
                                text: build.imageName
                            }
                        }),
                        'Deploy image',
                        false
                    ).then(({ value }) => commands.execute(CommandIDs.newLocalDeployment, { image: value.value }))
                }
            } catch (err) {
                showErrorMessage('Can not deploy model locally', err);
            }
        }
    });

    commands.addCommand(CommandIDs.removeLocalDeployment, {
        label: 'Remove Legion model local deploy',
        caption: 'Un-deploy Legion model (local mode)',
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
                            options.api.local.removeLocalDeployment({
                                name: name
                            }).then(() => {
                                splashScreen.dispose();
                                commands.execute(CommandIDs.refreshLocal, {});
                            }).catch(err => {
                                splashScreen.dispose();
                                showErrorMessage('Can not remove local deployment', err);
                                commands.execute(CommandIDs.refreshLocal, {});
                            })
                        }
                    })
                } else {
                    dialogs.showChooseDialog(
                        'Choose deployment to remove',
                        'Please choose one deployment from list',
                        options.apiState.local.deployments.map(deployment => {
                            return {
                                value: deployment.name,
                                text: deployment.name + ' on port ' + deployment.port
                            }
                        }),
                        'Remove deployment',
                        true
                    ).then(({ value }) => commands.execute(CommandIDs.removeLocalDeployment, { name: value.value }))
                }
            } catch (err) {
                showErrorMessage('Can not remove local deployment', err);
            }
        }
    });

}