import { showErrorMessage } from '@jupyterlab/apputils';

import { CommandIDs, IAddCommandsOptions } from './base';


/**
 * Add the commands for the legion extension.
 */
export function addCommands(options: IAddCommandsOptions) {
    let { commands } = options.app;

    commands.addCommand(CommandIDs.refresh, {
        label: 'Force data refresh',
        caption: 'Force data synchronization',
        execute: () => {
            try {
                throw new Error('Not implemented');
            } catch (err) {
                showErrorMessage('Can not forcefully update data', err);
            }
        }
    });


    commands.addCommand(CommandIDs.setRefreshInterval, {
        label: 'Set refresh interval',
        caption: 'Set custom refresh interval',
        execute: () => {
            try {
                throw new Error('Not implemented');
            } catch (err) {
                showErrorMessage('Can not update refresh interval', err);
            }
        }
    });
}