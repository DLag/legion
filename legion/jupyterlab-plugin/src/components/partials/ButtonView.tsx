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
import * as style from '../../componentsStyle/ButtonStyle';

/** Interface for GitPanel component state */
export interface IButtonViewNodeState { }

/** Interface for GitPanel component props */
export interface IButtonViewNodeProps {
  text: string;
  onClick: () => void;
}
export interface IButtonViewWithIconNodeProps extends IButtonViewNodeProps {
  iconClass: string;
}

export interface IButtonViewWithStyleNodeProps extends IButtonViewNodeProps {
  style: string;
}

/** A React component for the git extension's main display */
export class ButtonView extends React.Component<
IButtonViewWithStyleNodeProps,
  IButtonViewNodeState
  > {
  constructor(props: IButtonViewWithStyleNodeProps) {
    super(props);
  }

  render() {
    return (
      <button className={"jp-Dialog-button " + this.props.style + " jp-mod-styled " + style.normalButtonStyle} onClick={e => this.props.onClick()}>
        <div className={"jp-Dialog-buttonIcon"}></div>
        <div className={"jp-Dialog-buttonLabel"}>{this.props.text}</div>
      </button>
    );
  }
}

export class SmallButtonView extends React.Component<
  IButtonViewWithIconNodeProps,
  IButtonViewNodeState
  > {
  constructor(props: IButtonViewWithIconNodeProps) {
    super(props);
  }

  render() {
    return (
      <button className={style.smallButtonStyle}
        onClick={e => this.props.onClick()}
        title={this.props.text}>
        <span className={'' + this.props.iconClass + ' jp-Icon jp-Icon-16 ' + style.smallButtonStyleImage}></span>
      </button>
    );
  }
}