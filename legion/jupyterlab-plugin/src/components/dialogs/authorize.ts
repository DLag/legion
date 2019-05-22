import * as style from '../../componentsStyle/dialogs';

import { Dialog, showDialog } from '@jupyterlab/apputils';
import { Widget } from '@phosphor/widgets';


interface ILoginDialogValues {
    cluster: string;
    authString: string;
}

class LoginDialog extends Widget {
    /**
     * Construct a new "rename" dialog.
     */
    constructor() {
        super({ node: Private.buildAuthorizeDialogBody() });
        //this.addClass(FILE_DIALOG_CLASS);
    }

    getInputNodeValue(no: number): string {
        let allInputs = this.node.getElementsByTagName('input');
        if (allInputs.length <= no) {
            return undefined;
        } else {
            return allInputs[no].value;
        }
    }

    /**
     * Get the value of the widget.
     */
    getValue(): ILoginDialogValues {
        return {
            cluster: this.getInputNodeValue(0),
            authString: this.getInputNodeValue(1)
        };
    }
}


export function showLoginDialog() {
    return showDialog({
        title: 'Authorization on a Legion cluster',
        body: new LoginDialog(),
        buttons: [Dialog.cancelButton(), Dialog.okButton({ label: 'Login' })]
    })
}

export function showLogoutDialog(clusterName) {
    return showDialog({
        title: 'Logging out on a Legion cluster',
        body: `Do you want to log out on legion cluster ${clusterName}?`,
        buttons: [Dialog.cancelButton(), Dialog.okButton({ label: 'Log out', displayType: 'warn' })]
    })
}

namespace Private {

    export function buildAuthorizeDialogBody() {
        let body = document.createElement('div');

        let clusterTitle = document.createElement('h3');
        clusterTitle.className = style.fieldLabelStyle;
        clusterTitle.textContent = 'Cluster (EDI) url';
        body.appendChild(clusterTitle);

        let inputTitle = document.createElement('input');
        inputTitle.type = 'text';
        inputTitle.placeholder = 'https://edi-company-a.example.com';
        inputTitle.className = style.inputFieldStyle;
        body.appendChild(inputTitle);

        let tokenTitle = document.createElement('h3');
        tokenTitle.className = style.fieldLabelStyle;
        tokenTitle.textContent = 'Dex token';
        body.appendChild(tokenTitle);

        let inputToken = document.createElement('input');
        inputToken.type = 'text';
        inputToken.placeholder = 'ZW1haWw6dGVzdHMtdXNlckBsZWdpb24uY....';
        inputToken.className = style.inputFieldStyle;
        body.appendChild(inputToken);

        return body;
    }
}