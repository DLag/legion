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

import * as style from '../../componentsStyle/ListingStyle';


/** Interface for GitPanel component state */
export interface IListingViewNodeState {}

export interface IListingColumnInformation {
  name: string;
}

export interface IListingRowColumnValue {
  value: string;
}

export interface IListingRowValue {
  items: Array<IListingRowColumnValue>;
  onClick: () => void;
}

/** Interface for GitPanel component props */
export interface IListingViewNodeProps {
  title: string;
  topButton: any;

  columns: Array<IListingColumnInformation>;
  items: Array<IListingRowValue>;
}

/** A React component for the git extension's main display */
export class ListingView extends React.Component<
  IListingViewNodeProps,
  IListingViewNodeState
> {
  constructor(props: IListingViewNodeProps) {
    super(props);
    this.state = {

    };
  }

  getHeaderItemStyle(idx: number){
    let finalStyles = style.listingHeaderItem + ' ';
    if (idx == 0){
      finalStyles += style.listingFirstColumn;
    }
    else {
      finalStyles += style.listingAdditionalColumn + ' ' + style.listingNonFirstHeaderItem;
    }

    return finalStyles;
  }

  getDataRowItemStyle(idx: number){
    return style.listingRowItem + ' ' + (idx == 0 ? style.listingFirstColumn : style.listingAdditionalColumn);
  }

  renderRow(rowValue: IListingRowValue, idx: number){
    if (rowValue.items.length != this.props.columns.length){
      console.log('Row contains ' + rowValue.items.length + ' value(s), but header contains ' + this.props.columns.length + 'value(s)');
      return null;
    }

    return <div
      onClick={rowValue.onClick.bind(this)}
      key={idx}
      className={style.listingRow}>
      {rowValue.items.map((column, colIdx) =>
        <div key={colIdx} className={this.getDataRowItemStyle(colIdx)}>
          {column.value}
        </div>
      )}
    </div>
  }

  render() {
    return (
      <div className={style.listingHolder}>
        <div className={style.listingMetaHeader}>
          <h2 className={style.listingTitle}>{this.props.title}</h2>
          {this.props.topButton}
        </div>
        <div className={style.listingHeader}>
          {this.props.columns.map((columnInformation, idx) =>
            <span key={idx} className={this.getHeaderItemStyle(idx)}>{columnInformation.name}</span>
          )}
        </div>
        <div>
          {this.props.items.map((row, idx) => this.renderRow(row, idx))}
        </div>
      </div>
    );
  }
}