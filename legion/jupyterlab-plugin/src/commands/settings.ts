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
            options.api.local.getLocalAllEntities().then(response => {
                options.apiState.updateEntireLocalState(response);
                console.log('Data synchronization end');
            }).catch(err => {
                showErrorMessage('Can not forcefully update data for local mode', err);
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