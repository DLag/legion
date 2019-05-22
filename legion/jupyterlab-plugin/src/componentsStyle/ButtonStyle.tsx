import { style } from 'typestyle';

export const normalButtonStyle = style({
    cursor: 'pointer'
});

export const smallButtonStyle = style({
    background: 'var(--jp-layout-color1)',
    border: 'none',
    boxSizing: 'border-box',
    outline: 'none',
    appearance: 'none',
    padding: '0px 16px',
    margin: '0px',
    height: '24px',
    borderRadius: 'var(--jp-border-radius)',
    cursor: 'pointer',
    $nest: {
        '&:hover': {
            background: 'var(--jp-layout-color2)'
        }
    }
});

export const smallButtonStyleImage = style({
    padding: '0px',
    flex: '0 0 auto'
})

export const branchStyle = style({
    zIndex: 1,
    textAlign: 'center',
    overflowY: 'auto'
});
