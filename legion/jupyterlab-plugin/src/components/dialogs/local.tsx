import * as React from 'react';
import { Dialog, showDialog } from '@jupyterlab/apputils';

import * as style from '../../componentsStyle/dialogs';
import { ILocalDeploymentInformation } from '../../models';

export const REMOVE_DEPLOYMENT_LABEL = 'Remove deployment';

export function showLocalDeploymentInformationDialog(deploymentInformation: ILocalDeploymentInformation) {
  return showDialog({
    title: `Local deployment ${deploymentInformation.name}`,
    body: (
      <div>
        <h3 className={style.fieldLabelStyle}>Deployment name</h3>
        <p className={style.fieldTextStyle}>{deploymentInformation.name}</p>
        <h3 className={style.fieldLabelStyle}>Mode</h3>
        <p className={style.fieldTextStyle}>LOCAL</p>
        <h3 className={style.fieldLabelStyle}>Image</h3>
        <p className={style.fieldTextStyle}>{deploymentInformation.image}</p>
        <h3 className={style.fieldLabelStyle}>Port</h3>
        <p className={style.fieldTextStyle}>{deploymentInformation.port}</p>
      </div>
    ),
    buttons: [
      Dialog.createButton({ label: REMOVE_DEPLOYMENT_LABEL, displayType: 'warn' }),
      Dialog.okButton({ label: 'Close window' })
    ]
  })
}