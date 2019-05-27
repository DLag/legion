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
              name: 'Training'
            },
            {
              name: 'Status'
            }
          ]}
          isLoading={this.state.isLoading}
          items={[
            {
              items: [
                {
                  value: 'train-a'
                },
                {
                  value: 'IN PROGRESS'
                }
              ],
              onClick: () => console.log('Click on row 1')
            },
            {
              items: [
                {
                  value: 'train-b'
                },
                {
                  value: 'FINISHED'
                }
              ],
              onClick: () => console.log('Click on row 2')
            }

          ]}
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
              name: 'Deployment'
            },
            {
              name: 'Model'
            },
            {
              name: 'Image'
            }
          ]}
          isLoading={this.state.isLoading}
          items={[
            {
              items: [
                {
                  value: 'dep-a'
                },
                {
                  value: 'anomaly:0.1'
                },
                {
                  value: 'legion-model-columns-model:1.0.190213141453.root.0000'
                }
              ],
              onClick: () => console.log('Click on row 1')
            }

          ]}
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