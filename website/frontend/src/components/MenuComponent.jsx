import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

const MenuComonent = (props) => {
    const {
        MyOptions,
        handleClose,
        anchorEl,
        open,
        id
    } = props;
    return (
        <Menu
            anchorEl={anchorEl}
            keepMounted
            onClose={handleClose}
            open={open}
            id={id}
        >
            {MyOptions.map((option, index) => (
                <MenuItem
                    key={index}
                    onClick={handleClose}
                >
                    {option}
                </MenuItem>
            ))}
        </Menu>
    );
};

export default MenuComonent;