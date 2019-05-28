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
import { Dialog, showDialog } from '@jupyterlab/apputils';

import * as style from '../../componentsStyle/dialogs';
import * as model from '../../models/cloud';

export const REMOVE_DEPLOYMENT_LABEL = 'Remove deployment';
export const SCALE_DEPLOYMENT_LABEL = 'Scale deployment';
export const CREATE_DEPLOYMENT_LABEL = 'Deploy on a cluster';

export function showCloudTrainInformationDialog(training: model.ICloudTrainingResponse) {
  return showDialog({
    title: `Cloud training information}`,
    body: (
      <div>
        <h3 className={style.fieldLabelStyle}>Name</h3>
        <p className={style.fieldTextStyle}>{training.name}</p>
        <h3 className={style.fieldLabelStyle}>State</h3>
        <p className={style.fieldTextStyle}>{training.status.state}</p>
        <h3 className={style.fieldLabelStyle}>Model (id / version)</h3>
        <p className={style.fieldTextStyle}>{training.status.id} / {training.status.version}</p>
        <h3 className={style.fieldLabelStyle}>Image (toolchain)</h3>
        <p className={style.fieldTextStyle}>?? ({training.spec.toolchain})</p>
        <h3 className={style.fieldLabelStyle}>VCS (source codes repository)</h3>
        <p className={style.fieldTextStyle}>{training.spec.vcsName}</p>
        <h3 className={style.fieldLabelStyle}>File (working directory)</h3>
        <p className={style.fieldTextStyle}>{training.spec.entrypoint} ({training.spec.workDir})</p>
      </div>
    ),
    buttons: [
      Dialog.createButton({ label: CREATE_DEPLOYMENT_LABEL }),
      Dialog.okButton({ label: 'Close window' })
    ]
  })
}

export function showCloudDeploymentInformationDialog(deploymentInformation: model.ICloudDeploymentResponse) {
  return showDialog({
    title: `Cloud deployment information`,
    body: (
      <div>
        <h3 className={style.fieldLabelStyle}>Deployment name</h3>
        <p className={style.fieldTextStyle}>{deploymentInformation.name}</p>
        <h3 className={style.fieldLabelStyle}>Mode</h3>
        <p className={style.fieldTextStyle}>CLUSTER</p>
        <h3 className={style.fieldLabelStyle}>Image</h3>
        <p className={style.fieldTextStyle}>{deploymentInformation.spec.image}</p>
        <h3 className={style.fieldLabelStyle}>Replicas (actual / desired)</h3>
        <p className={style.fieldTextStyle}>{deploymentInformation.status.availableReplicas} / {deploymentInformation.spec.replicas}</p>
        <h3 className={style.fieldLabelStyle}>Probes (initial / readiness)</h3>
        <p className={style.fieldTextStyle}>{deploymentInformation.spec.livenessProbeInitialDelay} sec. / {deploymentInformation.spec.readinessProbeInitialDelay} sec.</p>
      </div>
    ),
    buttons: [
      Dialog.createButton({ label: REMOVE_DEPLOYMENT_LABEL, displayType: 'warn' }),
      Dialog.createButton({ label: SCALE_DEPLOYMENT_LABEL }),
      Dialog.okButton({ label: 'Close window' })
    ]
  })
}