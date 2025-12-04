import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CheckboxList({ todos, deleteTodo, toggleTodoState }) {
  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {todos.map((value) => {
        const labelId = `checkbox-list-label-${value.id}`;

        return (
          <ListItem
            sx={{ borderBottom: "1px solid gray" }}
            key={value.id}
            secondaryAction={
              <IconButton edge="end" aria-label="comments">
                <DeleteIcon
                  onClick={() => deleteTodo(value.id)}
                  color="error"
                />
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton role={undefined} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={value.done}
                  onChange={() => toggleTodoState(value.id, value.done)}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText
                className={value.done ? "text-decoration-line-through" : ""}
                id={labelId}
                primary={`${value.todo}`}
                primaryTypographyProps={{
                  // color: "primary",
                  fontWeight: "medium",
                  variant: "body2",
                  fontSize: 20,
                }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
