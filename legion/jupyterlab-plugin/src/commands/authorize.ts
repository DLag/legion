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