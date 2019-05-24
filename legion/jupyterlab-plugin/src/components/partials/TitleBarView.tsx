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