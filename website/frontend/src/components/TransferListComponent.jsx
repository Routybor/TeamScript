import React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';
import TaskCardComponent from './TaskCardComponent';


function TransferListComponent() {

    const not = (a, b) => {
        return a.filter((value) => b.indexOf(value) === -1);
    }
    const intersection = (a, b) => {
        return a.filter((value) => b.indexOf(value) !== -1);
    }
    const union = (a, b) => {
        return [...a, ...not(b, a)];
    }

    const [checked, setChecked] = useState([]);
    const [toDo, setToDo] = useState([0, 1, 2]);
    const [inProgress, setInProgress] = useState([40, 41, 42]);
    const toDoChecked = intersection(checked, toDo);
    const inProgressChecked = intersection(checked, inProgress);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };
    const numberOfChecked = (items) => intersection(checked, items).length;
    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };
    const handleCheckedInProgress = () => {
        setInProgress(inProgress.concat(toDoChecked));
        setToDo(not(toDo, toDoChecked));
        setChecked(not(checked, toDoChecked));
    };
    const handleCheckedToDo = () => {
        setToDo(toDo.concat(inProgressChecked));
        setInProgress(not(inProgress, inProgressChecked));
        setChecked(not(checked, inProgressChecked));
    };

    const addCardToDo = () => {
        toDo.push(toDo.at(toDo.length - 1) + 1);
        setToDo(toDo);
        handleCheckedToDo();
    }

    const addCardInProgress = () => {
        inProgress.push(inProgress.at(inProgress.length - 1) + 1);
        setToDo(inProgress);
        handleCheckedInProgress();
    }

    const customList = (title, items) => (
        <Card>
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

            <Divider />

            <List
                sx={{
                    width: 300,
                    height: 500,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <ListItem
                            key={value}
                            role="listitem"
                            button

                        >
                            <ListItemIcon>
                                <Checkbox
                                    onClick={handleToggle(value)}
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <TaskCardComponent taskName={"Task"} taskDescr={"Task description"}>

                            </TaskCardComponent>


                        </ListItem>
                    );
                })}
            </List>
        </Card >
    );
    return (
        <Grid container spacing={1} direction="row" justifyContent="center" alignItems="center" >
            <Grid direction="column" alignItems="center">

                <IconButton aria-label="settings" onClick={addCardToDo()}>
                    <AddIcon></AddIcon>
                </IconButton>
                <Grid item>{customList('to do', toDo)}</Grid>
            </Grid>
            <Grid item>
                <Grid container spacing={1} direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedInProgress()}
                        disabled={toDoChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedToDo}
                        disabled={inProgressChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid direction="column" alignItems="center">
                <IconButton aria-label="settings" onClick={addCardInProgress}>
                    <AddIcon></AddIcon>
                </IconButton>
                <Grid item>{customList('in progress', inProgress)}</Grid>
            </Grid>
        </Grid>
    );
}

export default TransferListComponent;