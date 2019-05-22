import { style } from 'typestyle';

export const fieldLabelStyle = style({
    color: 'var(--jp-ui-font-color1)',
    display: 'block',
    fontSize: 'var(--jp-ui-font-size2)',
    marginBottom: 5
});

export const fieldTextStyle = style({
    margin: 0
});

export const inputFieldStyle = style({
    borderWidth: 1,
    borderColor: 'var(--jp-ui-font-color1)',
    backgroundColor: 'var(--jp-layout-color0)',
    width: '100%',
    resize: 'none'
})