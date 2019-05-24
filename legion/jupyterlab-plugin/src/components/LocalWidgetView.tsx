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
import * as React from 'react';

import { JupyterLab } from '@jupyterlab/application';
import { showErrorMessage } from '@jupyterlab/apputils';

import { TitleBarView } from './partials/TitleBarView';
import { ListingView } from './partials/ListingView';
import { SmallButtonView } from './partials/ButtonView';

import * as style from '../componentsStyle/GeneralWidgetStyle';
import * as dialog from '../components/dialogs/local';
import { CommandIDs } from '../commands';
import { IApiState } from '../models';
import { ILocalAllEntitiesResponse } from '../models/local';


/** Interface for GitPanel component state */
export interface ILocalWidgetViewNodeState {
  localData: ILocalAllEntitiesResponse;
}

/** Interface for GitPanel component props */
export interface ILocalWidgetViewNodeProps {
  app: JupyterLab;
  dataState: IApiState;
}

/** A React component for the git extension's main display */
export class LocalWidgetView extends React.Component<
  ILocalWidgetViewNodeProps,
  ILocalWidgetViewNodeState
  > {
  constructor(props: ILocalWidgetViewNodeProps) {
    super(props);
    this.state = {
      localData: props.dataState.local
    };
  }

  refresh = async () => {
    try {
      this.setState({
        localData: this.props.dataState.local
      });
    } catch (err) {
      showErrorMessage('Can not update local widget', err);
    }
  };

  emitNewBuild() {
    showErrorMessage('Can not start new build', 'Not implemented');
  }

  render() {
    console.log('State', this.state.localData);
    return (
      <div className={style.widgetPane}>
        <TitleBarView text={'Legion local mode'} onRefresh={() => this.props.app.commands.execute(CommandIDs.refreshLocal)} />
        <ListingView
          title={'Builds'}
          topButton={(
            <SmallButtonView
              text={'New build'}
              iconClass={'jp-AddIcon'}
              onClick={this.emitNewBuild.bind(this)} />)}
          columns={[
            {
              name: 'Docker image'
            },
            {
              name: 'Model'
            }
          ]}
          items={this.state.localData.builds.map(build => {
            return {
              items: [
                {
                  value: build.imageName
                },
                {
                  value: build.modelName + ':' + build.modelVersion
                }],
              onClick: () =>
                dialog.showLocalBuildInformationDialog(build)
                  .then(({ button }) => {
                    if (button.label == dialog.CREATE_DEPLOYMENT_LABEL) {
                      this.props.app.commands.execute(CommandIDs.newLocalDeployment, { image: build.imageName });
                    }
                  })
            }
          })}
        />
        <ListingView
          title={'Local deployments'}
          topButton={(
            <SmallButtonView
              text={'New deployment'}
              iconClass={'jp-AddIcon'}
              onClick={() => this.props.app.commands.execute(CommandIDs.newLocalDeployment)} />)}
          columns={[
            {
              name: 'Deployment'
            },
            {
              name: 'Port'
            },
            {
              name: 'Image'
            }
          ]}
          items={this.state.localData.deployments.map(deployment => {
            return {
              items: [
                {
                  value: deployment.name
                },
                {
                  value: '' + deployment.port
                },
                {
                  value: deployment.image
                }
              ],
              onClick: () =>
                dialog.showLocalDeploymentInformationDialog(deployment)
                  .then(({ button }) => {
                    if (button.label == dialog.REMOVE_DEPLOYMENT_LABEL) {
                      this.props.app.commands.execute(CommandIDs.removeLocalDeployment, { name: deployment.name });
                    }
                  })
            }
          })}
        />
      </div>
    );
  }
}