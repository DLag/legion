import { style } from 'typestyle';

export const listingHolder = style({
    color: 'var(--jp-ui-font-color1)',
    background: 'var(--jp-layout-color1)',
    fontSize: 'var(--jp-ui-font-size1)'
});

export const listingMetaHeader = style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'var(--jp-toolbar-header-margin)'
});

export const listingTitle = style({
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

export const listingHeader = style({
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    borderTop: 'var(--jp-border-width) solid var(--jp-border-color2)',
    borderBottom: 'var(--jp-border-width) solid var(--jp-border-color1)',
    boxShadow: 'rgba(0, 0, 0, 0.24) 2px 0px 2px 0px',
    //boxShadow: 'var(--jp-toolbar-box-shadow)',
    zIndex: 2
});

export const listingHeaderItem = style({
    padding: '4px 12px',
    fontWeight: 600
});

export const listingNonFirstHeaderItem = style({
    borderLeft: 'var(--jp-border-width) solid var(--jp-border-color2)',
});

export const listingFirstColumn = style({
    flex: '1 0 84px',
    padding: '4px 8px',
    wordWrap: 'normal'
});

export const listingRowItem = style({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    userSelect: 'text',
    textOverflow: 'ellipsis'
});

export const listingRow = style({
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    userSelect: 'none',
    cursor: 'pointer',
    $nest: {
        '&:hover': {
            background: 'var(--jp-layout-color2)'
        }
    }

});

export const listingAdditionalColumn = style({
    flex: '0 0 112px',
    padding: '4px 8px',
    textAlign: 'center',
    wordWrap: 'normal'
});