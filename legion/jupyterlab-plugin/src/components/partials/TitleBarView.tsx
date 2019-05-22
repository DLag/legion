import * as React from 'react';

import * as style from '../../componentsStyle/TitleBarStyle';

import { SmallButtonView } from './ButtonView';


/** Interface for GitPanel component state */
export interface ITitleBarViewNodeState { }

/** Interface for GitPanel component props */
export interface ITitleBarViewNodeProps {
  text: string;
  onRefresh: () => void;
}

/** A React component for the git extension's main display */
export class TitleBarView extends React.Component<
  ITitleBarViewNodeProps,
  ITitleBarViewNodeState
  > {
  constructor(props: ITitleBarViewNodeProps) {
    super(props);
  }

  render() {
    return (
      <div className={style.holder}>
        <h2 className={style.text}>
          {this.props.text}
        </h2>
        <SmallButtonView
          text={'Refresh'}
          iconClass={'jp-RefreshIcon'}
          onClick={this.props.onRefresh.bind(this)} />
      </div>
    );
  }
}