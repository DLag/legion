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
            try {
                options.api.local.startLocalBuild().then(() => {
                    console.log('Image has been built');
                }).catch(err => {
                    showErrorMessage('Can not build model locally', err);
                });
            } catch (err) {
                showErrorMessage('Can not build model locally', err);
            }
        }
    });

    commands.addCommand(CommandIDs.newLocalDeployment, {
        label: 'Deploy Legion model locally',
        caption: 'Deploy Legion model (local mode)',
        execute: () => {
            try {
                console.log('Local model deploying has been started');
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
                const deploymentId = args['deploymentId'] as string;
                if (deploymentId){
                    showDialog({
                        title: `Removing deployment ${deploymentId}`,
                        body: `Do you want to remove deployment ${deploymentId}?`,
                        buttons: [Dialog.cancelButton(), Dialog.okButton({ label: 'Remove', displayType: 'warn' })]
                    }).then(({button}) => {
                        if (button.accept){
                            options.api.local.removeLocalDeployment({
                                name: deploymentId
                            }).then(() => {
                                console.log('Local model deployment ' + deploymentId + ' has been removed, refreshing');
                                commands.execute(CommandIDs.refreshLocal, {});
                            }).catch(err => {
                                showErrorMessage('Can not remove local deployment', err);
                                commands.execute(CommandIDs.refreshLocal, {});
                            })
                        }
                    })
                }
                else {
                    dialogs.showChooseDialog(
                        'Choose deployment to remove',
                        'Please choose one deployment from list',
                        [
                            {value: 'dep-a', text: 'dep-a'},
                            {value: 'dep-b', text: 'dep-b'},
                        ],
                        'Remove deployment',
                        true
                    ).then(({value}) => commands.execute(CommandIDs.removeLocalDeployment, {deploymentId: value.value}))
                }
            } catch (err) {
                showErrorMessage('Can not remove local deployment', err);
            }
        }
    });

    commands.addCommand(CommandIDs.showLocalDeploymentInformation, {
        label: 'Show information about local deployment',
        execute: args => {
            try {
                const deploymentId = args['deploymentId'] as string;
                if (deploymentId){
                    dialogs.showLocalDeploymentInformationDialog({
                        name: deploymentId,
                        image: 'test-image',
                        port: 2000
                    }).then(({ button }) => {
                        if (button.label == dialogs.REMOVE_DEPLOYMENT_LABEL){
                            commands.execute(CommandIDs.removeLocalDeployment, {deploymentId: deploymentId});
                        }
                    })
                }
            } catch (err) {
                showErrorMessage('Can not remove local deployment', err);
            }
        }
    });
}