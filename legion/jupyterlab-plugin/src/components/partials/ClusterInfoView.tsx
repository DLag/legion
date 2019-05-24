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

/** Interface for GitPanel component state */
export interface IClusterInfoViewNodeState {}

/** Interface for GitPanel component props */
export interface IClusterInfoViewNodeProps {
  clusterName: string;
  userName: string;
}

/** A React component for the git extension's main display */
export class ClusterInfoView extends React.Component<
  IClusterInfoViewNodeProps,
  IClusterInfoViewNodeState
> {
  constructor(props: IClusterInfoViewNodeProps) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>Cluster information</p>

        <p>Cluster: {this.props.clusterName}</p>
        <p>User name: {this.props.userName}</p>
      </div>
    );
  }
}