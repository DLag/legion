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