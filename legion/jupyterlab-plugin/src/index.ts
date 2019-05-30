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
import {
  ILayoutRestorer,
  JupyterLab,
  JupyterLabPlugin
} from '@jupyterlab/application';
import { ISplashScreen } from "@jupyterlab/apputils";
import { IStateDB } from "@jupyterlab/coreutils";
import { IMainMenu } from '@jupyterlab/mainmenu';
import {
  IFileBrowserFactory
} from '@jupyterlab/filebrowser';

import { Menu } from '@phosphor/widgets';
import { CommandRegistry } from '@phosphor/commands';

import { Token } from '@phosphor/coreutils';

import '../style/variables.css';

import {
  localModeTabStyle,
  cloudModeTabStyle
} from './componentsStyle/GeneralWidgetStyle';

import { createLocalSidebarWidget, createCloudSidebarWidget, LegionSideWidget } from './components/SideWidgets';
import { addCommands, CommandIDs } from './commands';

import { LegionApi } from './api';
import {
  IApiLocalState, IApiCloudState,
  buildInitialLocalAPIState, buildInitialCloudAPIState
} from './models/apiState';
import { ILegionPluginMode } from './models/core';

export const PLUGIN_ID = 'jupyter.extensions.legion';
export const PLUGIN_ID_CLOUD = PLUGIN_ID + ':cloud';
export const PLUGIN_ID_LOCAL = PLUGIN_ID + ':local';
export const EXTENSION_ID = 'jupyter.extensions.jupyter_legion';

const FILE_MANAGER_NOT_DIRECTORY = '.jp-DirListing-item[data-isdir="false"]';
const TRAIN_ON_CLOUD_COMMAND_RANK = 99;

// tslint:disable-next-line: variable-name
export const ILegionExtension = new Token<ILegionExtension>(EXTENSION_ID);

/** Interface for extension class */
export interface ILegionExtension {
}

const pluginRequirements = [
  IMainMenu,
  ILayoutRestorer,
  ISplashScreen,
  IStateDB,
  IFileBrowserFactory
];


/**
 * Plugins declarations
 */
const cloudPlugin: JupyterLabPlugin<ILegionExtension> = {
  id: PLUGIN_ID_CLOUD,
  requires: pluginRequirements,
  provides: ILegionExtension,
  activate: buildActivator(ILegionPluginMode.CLOUD),
  autoStart: true
};

const localPlugin: JupyterLabPlugin<ILegionExtension> = {
  id: PLUGIN_ID_LOCAL,
  requires: pluginRequirements,
  provides: ILegionExtension,
  activate: buildActivator(ILegionPluginMode.LOCAL),
  autoStart: true
};

/**
 * Export the plugins as default.
 */
const plugins: JupyterLabPlugin<any>[] = [cloudPlugin, localPlugin];
export default plugins;

/**
 * Declare extension constructor
 */
export class LegionExtension implements ILegionExtension {
  /**
   * Instance of Legion Widget for appropriate mode
   */
  sideWidget: LegionSideWidget;

  /**
   * API to back-end
   */
  api: LegionApi;

  /**
   * API state
   */
  apiLocalState?: IApiLocalState;
  apiCloudState?: IApiCloudState;

  localBuildStatusTimer: number;

  /**
   * Is it cloud plugin (otherwise local)
   */
  mode: ILegionPluginMode;

  /**
   * Construct extension
   * @param app JupyterLab target JupyterLab
   * @param restorer ILayoutRestorer layout restorer
   */
  constructor(
    app: JupyterLab,
    restorer: ILayoutRestorer,
    state: IStateDB,
    mode: ILegionPluginMode
  ) {
    this.mode = mode;

    this.api = new LegionApi();

    if (this.mode == ILegionPluginMode.CLOUD) {
      this.apiCloudState = buildInitialCloudAPIState(state);
      this.sideWidget = createCloudSidebarWidget(
        app,
        { manager: app.serviceManager, state: this.apiCloudState }
      );
      this.sideWidget.id = 'legion-cloud-sessions-widget';
      this.sideWidget.title.iconClass = `jp-SideBar-tabIcon ${cloudModeTabStyle}`;
      this.sideWidget.title.caption = 'Legion cloud mode';

      this.apiCloudState.onDataChanged.connect(_ => this.sideWidget.refresh());

      restorer.add(this.sideWidget, 'legion-cloud-sessions');
      app.shell.addToLeftArea(this.sideWidget, { rank: 210 });

      app.restored.then(() => {
        this.apiCloudState.tryToLoadCredentialsFromSettings();
      });
    } else {
      this.apiLocalState = buildInitialLocalAPIState();
      this.sideWidget = createLocalSidebarWidget(
        app,
        { manager: app.serviceManager, state: this.apiLocalState }
      );
      this.sideWidget.id = 'legion-local-sessions-widget';
      this.sideWidget.title.iconClass = `jp-SideBar-tabIcon ${localModeTabStyle}`;
      this.sideWidget.title.caption = 'Legion local mode';

      this.apiLocalState.onDataChanged.connect(_ => this.sideWidget.refresh());

      restorer.add(this.sideWidget, 'legion-local-sessions');
      app.shell.addToLeftArea(this.sideWidget, { rank: 200 });

      app.restored.then(() => {
        this.localBuildStatusTimer = setInterval(() => app.commands.execute(CommandIDs.refreshLocalBuildStatus), 1000);
      });
    }

  }
}

function buildTopMenu(commands: CommandRegistry, mode: ILegionPluginMode): Menu {
  let menu = new Menu({ commands });
  menu.title.label = mode == ILegionPluginMode.CLOUD ? 'Legion cloud' : 'Legion local';

  const commandsToAdd = (mode == ILegionPluginMode.CLOUD) ?
    [CommandIDs.refreshCloud, CommandIDs.authorizeOnCluster, CommandIDs.unAuthorizeOnCluster, CommandIDs.issueNewCloudAccessToken] :
    [CommandIDs.refreshLocal, CommandIDs.newLocalBuild, CommandIDs.refreshLocalBuildStatus, CommandIDs.openLocalMetrics];

  commandsToAdd.forEach(
    command => {
      menu.addItem({ command });
    }
  );

  return menu;
}

/**
 * Activate Legion plugin (build & return LegionExtension, register commands)
 */
function activate(
  app: JupyterLab,
  mainMenu: IMainMenu,
  restorer: ILayoutRestorer,
  splash: ISplashScreen,
  state: IStateDB,
  factory: IFileBrowserFactory,
  mode: ILegionPluginMode,
): ILegionExtension {
  // Build extension
  let legionExtension = new LegionExtension(app, restorer, state, mode);

  // Build options for commands
  const addCommandsOptions = {
    app,
    services: app.serviceManager,
    apiCloudState: legionExtension.apiCloudState,
    apiLocalState: legionExtension.apiLocalState,
    api: legionExtension.api,
    splash,
    tracker: factory.tracker,
    mode
  };

  // Register commands in JupyterLab
  addCommands(addCommandsOptions);

  // Add context menu for cloud mode
  if (mode == ILegionPluginMode.CLOUD) {
    app.contextMenu.addItem({
      command: CommandIDs.newCloudTrainingFromContextMenu,
      selector: FILE_MANAGER_NOT_DIRECTORY,
      rank: TRAIN_ON_CLOUD_COMMAND_RANK
    });
  }

  // Create top menu for appropriate mode
  mainMenu.addMenu(buildTopMenu(app.commands, mode), { rank: 60 });
  return legionExtension;
}

/**
 * Build activation function
 * @param mode mode of plugin (cloud or local)
 */
function buildActivator(mode: ILegionPluginMode): any {
  return (...args: any[]) => activate.call(this, ...args, mode);
}