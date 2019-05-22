import { style } from 'typestyle';

export const widgetPane = style({
    background: 'var(--jp-layout-color0)',
    height: '100%',
});

export const authSubPane = style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
});

export const authIcon = style({
    backgroundImage: 'var(--jp-icon-legion-lock)',
    width: 80,
    height: 80,
    backgroundSize: 80,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
});

export const authDisclaimerText = style({
    color: 'var(--jp-ui-font-color1)',
    display: 'block',
    fontSize: 'var(--jp-ui-font-size2)',
    margin: '20px 0',
    textAlign: 'center'
});

export const localModeTabStyle = style({
    backgroundImage: 'var(--jp-icon-legion-local)'
});

export const cloudModeTabStyle = style({
    backgroundImage: 'var(--jp-icon-legion-cloud)'
});

