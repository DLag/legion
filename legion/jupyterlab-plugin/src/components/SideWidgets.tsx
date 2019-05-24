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
import * as ReactDOM from 'react-dom';

import { ServiceManager } from '@jupyterlab/services';
import { JupyterLab } from '@jupyterlab/application';

import { Message } from '@phosphor/messaging';
import { Widget } from '@phosphor/widgets';
import { ISignal, Signal } from '@phosphor/signaling';

import { LocalWidgetView } from './LocalWidgetView';
import { CloudWidgetView } from './CloudWidgetView';


/**
 * An options object for creating a running widget.
 */
export interface IOptions {
  /**
   * A service manager instance.
   */
  manager: ServiceManager.IManager;

  /**
   * The renderer for the running widget.
   * The default is a shared renderer instance.
   */
  renderer?: IRenderer;
}

export interface IExtendedOptions extends IOptions {

  defaultRenderHolder: string;

  targetReactComponent: any;

}

/**
 * A renderer for use with a running sessions widget.
 */
export interface IRenderer {
  createNode(): HTMLElement;
}

/**
 * The default implementation of `IRenderer`.
 */
export class Renderer implements IRenderer {
  nodeName: string;

  constructor(nodeName: string) {
    this.nodeName = nodeName;
  }

  createNode(): HTMLElement {
    let node = document.createElement('div');
    node.id = 'LegionSession-root';

    return node;
  }
}

/**
 * The default `Renderer` instance.
 */

/**
 * A class that exposes the plugin sessions.
 */
export class LegionSideWidget extends Widget {
  component: any;
  /**
   * Construct a new running widget.
   */
  constructor(app: JupyterLab, options: IExtendedOptions) {
    super({
      node: (options.renderer || new Renderer(options.defaultRenderHolder)).createNode()
    });

    const element = <options.targetReactComponent app={app} />;
    this.component = ReactDOM.render(element, this.node);
    this.component.refresh();
  }

  /**
   * Override widget's default show() to
   * refresh content every time widget is shown.
   */
  show(): void {
    super.show();
    this.component.refresh();
  }

  /**
   * The renderer used by the running sessions widget.
   */
  get renderer(): IRenderer {
    return this._renderer;
  }

  /**
   * A signal emitted when the directory listing is refreshed.
   */
  get refreshed(): ISignal<this, void> {
    return this._refreshed;
  }

  /**
   * Dispose of the resources used by the widget.
   */
  dispose(): void {
    this._renderer = null;
    clearTimeout(this._refreshId);
    super.dispose();
  }

  /**
   * Handle the DOM events for the widget.
   *
   * @param event - The DOM event sent to the widget.
   *
   * #### Notes
   * This method implements the DOM `EventListener` interface and is
   * called in response to events on the widget's DOM nodes. It should
   * not be called directly by user code.
   */
  handleEvent(event: Event): void {
    switch (event.type) {
      case 'change':
        this._evtChange(event as MouseEvent);
        break;
      case 'click':
        this._evtClick(event as MouseEvent);
        break;
      case 'dblclick':
        this._evtDblClick(event as MouseEvent);
        break;
      default:
        break;
    }
  }

  /**
   * A message handler invoked on an `'after-attach'` message.
   */
  protected onAfterAttach(msg: Message): void {
    this.node.addEventListener('change', this);
    this.node.addEventListener('click', this);
    this.node.addEventListener('dblclick', this);
  }

  /**
   * A message handler invoked on a `'before-detach'` message.
   */
  protected onBeforeDetach(msg: Message): void {
    this.node.addEventListener('change', this);
    this.node.removeEventListener('click', this);
    this.node.removeEventListener('dblclick', this);
  }

  /**
   * Handle the `'click'` event for the widget.
   *
   * #### Notes
   * This listener is attached to the document node.
   */
  private _evtChange(event: MouseEvent): void {}
  /**
   * Handle the `'click'` event for the widget.
   *
   * #### Notes
   * This listener is attached to the document node.
   */
  private _evtClick(event: MouseEvent): void {}

  /**
   * Handle the `'dblclick'` event for the widget.
   */
  private _evtDblClick(event: MouseEvent): void {}

  private _renderer: IRenderer = null;
  private _refreshId = -1;
  private _refreshed = new Signal<this, void>(this);
}

export function createLocalSidebarWidget(app: JupyterLab, options: IOptions) : LegionSideWidget {
  const extendedOptions = {
    ...options,
    defaultRenderHolder: 'legion-local-sidebar-widget',
    targetReactComponent: LocalWidgetView
  }
  return new LegionSideWidget(app, extendedOptions);
}

export function createCloudSidebarWidget(app: JupyterLab, options: IOptions) : LegionSideWidget {
  const extendedOptions = {
    ...options,
    defaultRenderHolder: 'legion-cloud-sidebar-widget',
    targetReactComponent: CloudWidgetView
  }
  return new LegionSideWidget(app, extendedOptions);
}