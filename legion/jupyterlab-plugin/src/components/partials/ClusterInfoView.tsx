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