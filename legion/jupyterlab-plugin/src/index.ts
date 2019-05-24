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
import { ICommandPalette } from "@jupyterlab/apputils";
import { ISettingRegistry } from "@jupyterlab/coreutils";
import { IMainMenu } from '@jupyterlab/mainmenu';

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
import { IApiState, buildInitialAPIState } from './models/apiState';

export const PLUGIN_ID = 'jupyter.extensions.legion';
export const EXTENSION_ID = 'jupyter.extensions.jupyter_legion';


// tslint:disable-next-line: variable-name
export const ILegionExtension = new Token<ILegionExtension>(EXTENSION_ID);

/** Interface for extension class */
export interface ILegionExtension {
}

/**
 * Plugin declaration
 */
const plugin: JupyterLabPlugin<ILegionExtension> = {
  id: PLUGIN_ID,
  requires: [
    IMainMenu,
    ILayoutRestorer,
    ICommandPalette,
    ISettingRegistry
  ],
  provides: ILegionExtension,
  activate,
  autoStart: true
};

/**
 * Export the plugin as default.
 */
export default plugin;

/**
 * Declare extension
 */
export class LegionExtension implements ILegionExtension {
  /**
   * Instance of Legion Widget for local mode
   */
  localTabWidget: LegionSideWidget;

  /**
   * Instance of Legion Widget for cloud mode
   */
  cloudTabWidget: LegionSideWidget;

  /**
   * API to back-end
   */
  api: LegionApi;

  /**
   * API state
   */
  apiState: IApiState;

  /**
   * Construct extension
   * @param app JupyterLab target JupyterLab
   * @param restorer ILayoutRestorer layout restorer
   */
  constructor(
    app: JupyterLab,
    restorer: ILayoutRestorer
  ) {
    //this.app = app;
    this.api = new LegionApi();
    this.apiState = buildInitialAPIState();

    if (true) {
      this.localTabWidget = createLocalSidebarWidget(
        app,
        { manager: app.serviceManager, state: this.apiState }
      );
      this.localTabWidget.id = 'legion-local-sessions-widget';
      this.localTabWidget.title.iconClass = `jp-SideBar-tabIcon ${localModeTabStyle}`;
      this.localTabWidget.title.caption = 'Legion local mode';

      this.apiState.onLocalDataChanged.connect(_ => this.localTabWidget.refresh());

      restorer.add(this.localTabWidget, 'legion-local-sessions');
      app.shell.addToLeftArea(this.localTabWidget, { rank: 200 });
    }


    if (true) {
      this.cloudTabWidget = createCloudSidebarWidget(
        app,
        { manager: app.serviceManager, state: this.apiState }
      );
      this.cloudTabWidget.id = 'legion-cloud-sessions-widget';
      this.cloudTabWidget.title.iconClass = `jp-SideBar-tabIcon ${cloudModeTabStyle}`;
      this.cloudTabWidget.title.caption = 'Legion cloud mode';

      this.apiState.onCloudDataChanged.connect(_ => this.cloudTabWidget.refresh());

      restorer.add(this.cloudTabWidget, 'legion-cloud-sessions');
      app.shell.addToLeftArea(this.cloudTabWidget, { rank: 210 });
    }


  }
}

function buildTopMenuItems(commands: CommandRegistry): Menu {
  let menu = new Menu({ commands });
  menu.title.label = 'Legion';

  let cloud = new Menu({ commands });
  cloud.title.label = 'Cloud ';
  menu.addItem({ type: 'submenu', submenu: cloud });

  let help = new Menu({ commands });
  help.title.label = 'Help ';
  menu.addItem({ type: 'submenu', submenu: help });

  let local = new Menu({ commands });
  local.title.label = 'Local ';
  menu.addItem({ type: 'submenu', submenu: local });

  [CommandIDs.openLocalModelPlugin, CommandIDs.openCloudModelPlugin, CommandIDs.openLocalMetrics].forEach(
      command => {
          menu.addItem({ command });
      }
  );

  [CommandIDs.refreshCloud, CommandIDs.authorizeOnCluster, CommandIDs.unAuthorizeOnCluster].forEach(
      command => {
          cloud.addItem({ command });
      }
  );

  [CommandIDs.mainRepository].forEach(
      command => {
          help.addItem({ command });
      }
  );

  [CommandIDs.refreshLocal].forEach(
      command => {
        local.addItem({ command });
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
  palette: ICommandPalette,
  settings: ISettingRegistry
): ILegionExtension {
  // Build extension
  let legionExtension = new LegionExtension(app, restorer);
  // Register commands in application (in top menu & palette)

  addCommands(app, app.serviceManager, legionExtension.apiState, legionExtension.api);

  for (let command in CommandIDs) {
    palette.addItem({
      command: CommandIDs[command],
      category: "Legion commands"
    });
  }
  let topMenuNode = buildTopMenuItems(app.commands);
  mainMenu.addMenu(topMenuNode, { rank: 60 });

  return legionExtension;
}