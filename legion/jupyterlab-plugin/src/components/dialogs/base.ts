import * as style from '../../componentsStyle/dialogs';

import { Dialog, showDialog } from '@jupyterlab/apputils';
import { Widget } from '@phosphor/widgets';

// General dialogs

export interface IChooseVariant {
    value: string;
    text: string;
}

class ChooseDialog extends Widget {
    /**
     * Construct a new "rename" dialog.
     */
    constructor(body: string, variants: Array<IChooseVariant>) {
        super({ node: Private.buildChooseDialogBody(body, variants) });
    }

    getValue(): IChooseVariant {
        let selects = this.node.getElementsByTagName('select');
        const targetSelect = selects[0];

        return {
            value: targetSelect.options[targetSelect.selectedIndex].value,
            text: targetSelect.options[targetSelect.selectedIndex].text
        };
    }
}

export function showChooseDialog(title: string, body: string, variants: Array<IChooseVariant>, confirmChoose: string, warn: boolean) {
    return showDialog({
        title: title,
        body: new ChooseDialog(body, variants),
        buttons: [Dialog.cancelButton(), Dialog.okButton({ label: confirmChoose, displayType: warn ? 'warn' : 'default' })]
    })
}

namespace Private {
    export function buildChooseDialogBody(bodyText: string, variants: Array<IChooseVariant>) {
        let body = document.createElement('div');

        let description = document.createElement('span');
        description.className = 'jp-Dialog-body';
        description.textContent = bodyText;
        body.appendChild(description);

        let select = document.createElement('select');
        select.className = style.inputFieldStyle;
        variants.forEach(item => {
            var option = document.createElement("option");
            option.value = item.value;
            option.text = item.text;
            select.appendChild(option);
        });

        body.appendChild(select);

        return body;
    }
}