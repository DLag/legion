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
import { SmallButtonView, ButtonView } from './partials/ButtonView';

import * as style from '../componentsStyle/GeneralWidgetStyle';
import * as dialog from '../components/dialogs/cloud';
import { CommandIDs } from '../commands';
import { IApiState } from '../models';
import { ICloudAllEntitiesResponse } from '../models/cloud';


/** Interface for GitPanel component state */
export interface ICloudWidgetViewNodeState {
  cloudData: ICloudAllEntitiesResponse;
  isLoading: boolean;
  credentialsIsNotEmpty: boolean;
}

/** Interface for GitPanel component props */
export interface ILocalWidgetViewNodeProps {
  app: JupyterLab;
  dataState: IApiState;
}

/** A React component for the git extension's main display */
export class CloudWidgetView extends React.Component<
  ILocalWidgetViewNodeProps,
  ICloudWidgetViewNodeState
  > {
  constructor(props: ILocalWidgetViewNodeProps) {
    super(props);
    this.state = {
      cloudData: props.dataState.cloud,
      isLoading: props.dataState.cloudIsLoading,
      credentialsIsNotEmpty: props.dataState.credentials != null
    };
  }

  /**
   * Refresh widget, update all content
   */
  refresh = async () => {
    try {
      this.setState({
        cloudData: this.props.dataState.cloud,
        isLoading: this.props.dataState.cloudIsLoading,
        credentialsIsNotEmpty: this.props.dataState.credentials != null
      });
    } catch (err) {
      showErrorMessage('Can not update local widget', err);
    }
  };

  renderAuthView() {
    return (
      <div className={style.widgetPane}>
        <TitleBarView text={'Legion cloud mode'} onRefresh={null} />
        <div className={style.authSubPane}>
          <div className={style.authIcon}>&nbsp;</div>
          <h2 className={style.authDisclaimerText}>Please, authorize on a cluster</h2>
          <ButtonView text={'Login'} style={'jp-mod-accept'} onClick={() => this.props.app.commands.execute(CommandIDs.authorizeOnCluster)} />
        </div>
      </div>
    );
  }

  renderDataView() {
    return (
      <div className={style.widgetPane}>
        <TitleBarView text={'Legion cluster mode'} onRefresh={() => this.props.app.commands.execute(CommandIDs.refreshCloud)} />
        <ListingView
          title={'Cloud trainings'}
          topButton={(
            <SmallButtonView
              text={'New training'}
              iconClass={'jp-AddIcon'}
              onClick={() => this.props.app.commands.execute(CommandIDs.openCloudModelPlugin)} />)}
          columns={[
            {
              name: 'Training',
              flex: {
                flexGrow: 1,
                flexBasis: 200
              }
            },
            {
              name: 'Status',
              flex: {
                flexGrow: 0,
                flexBasis: 120
              }
            }
          ]}
          isLoading={this.state.isLoading}
          items={this.state.cloudData.trainings.map(training => {
            return {
              items: [
                {
                  value: training.name
                },
                {
                  value: training.status.state
                }
              ],
              onClick: () => dialog.showCloudTrainInformationDialog(training)
              .then(({ button }) => {
                if (button.label == dialog.CREATE_DEPLOYMENT_LABEL) {
                  //this.props.app.commands.execute(CommandIDs.newLocalDeployment, { image: build.imageName });
                }
              })
            }
          })}
        />
        <ListingView
          title={'Cloud deployments'}
          topButton={(
            <SmallButtonView
              text={'New deployment'}
              iconClass={'jp-AddIcon'}
              onClick={() => this.props.app.commands.execute(CommandIDs.openCloudModelPlugin)} />)}
          columns={[
            {
              name: 'Deployment',
              flex: {
                flexGrow: 1,
                flexBasis: 70
              }
            },
            {
              name: 'Replicas',
              flex: {
                flexGrow: 0,
                flexBasis: 70
              }
            },
            {
              name: 'Image',
              flex: {
                flexGrow: 1,
                flexBasis: 70
              }
            }
          ]}
          isLoading={this.state.isLoading}
          items={this.state.cloudData.deployments.map(deployment => {
            return {
              items: [
                {
                  value: deployment.name
                },
                {
                  value: '' + deployment.status.availableReplicas + '/' + deployment.spec.replicas
                },
                {
                  value: deployment.spec.image
                }
              ],
              onClick: () => dialog.showCloudDeploymentInformationDialog(deployment)
              .then(({ button }) => {
                if (button.label == dialog.REMOVE_DEPLOYMENT_LABEL) {
                  //this.props.app.commands.execute(CommandIDs.newLocalDeployment, { image: build.imageName });
                }
              })
            }
          })}
        />
      </div>
    );
  }

  render() {
    if (this.state.credentialsIsNotEmpty) {
      return this.renderDataView();
    } else {
      return this.renderAuthView();
    }
  }
}