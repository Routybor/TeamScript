import React from "react";

const CardHeaderComponent = () => {
    return (
        <CardHeader
            sx={{ px: 2, py: 1 }}
            avatar={
                <Checkbox
                    onClick={handleToggleAll(items)}
                    checked={numberOfChecked(items) === items.length && items.length !== 0}
                    indeterminate={
                        numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                    }
                    disabled={items.length === 0}
                    inputProps={{
                        'aria-label': 'all items selected',
                    }}
                />
            }
            title={title}
            subheader={`${numberOfChecked(items)}/${items.length} selected`}
            action={
                <IconButton aria-label="settings">
                    <MoreVertIcon />
                </IconButton>
            }
        />
    );
}


export default CardHeaderComponent;