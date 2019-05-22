import { style } from 'typestyle';

export const holder = style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--jp-toolbar-header-margin)'
});

export const text = style({
    display: 'inline-block',
    color: 'var(--jp-ui-font-color1)',
    flex: '0 0 auto',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: 'var(--jp-ui-font-size0)',
    padding: '8px 8px 8px 12px',
    margin: '0px',
});
