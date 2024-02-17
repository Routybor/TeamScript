import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

const MenuComonent = (props) => {
    const {
        MyOptions,
        handleClose,
        anchorEl,
        open
    } = props;
    return (
        <Menu
            anchorEl={anchorEl}
            keepMounted
            onClose={handleClose}
            open={open}
        >
            {MyOptions.map((option) => (
                <MenuItem
                    key={option}
                    onClick={handleClose}
                >
                    {option}
                </MenuItem>
            ))}
        </Menu>
    );
};

export default MenuComonent;