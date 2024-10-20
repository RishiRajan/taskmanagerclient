import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const TaskCard = ({ task, onClick }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        backgroundColor: "#f8f2f4",
        width: {
          xs: "90%", // Full width for extra small screens
          sm: "70%", // Wider for small screens
          md: "80%", // Medium size for medium screens
          lg: "80%", // Larger size for large screens
        },
        height: {
          xs: "auto", // Adjust height based on content for extra small screens
          sm: "180px", // Increase height for small screens
          md: "80%", // Medium size for medium screens
          lg: "80%", // Larger size for large screens
        },
        margin: "16px",
      }}>
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontFamily: "inter", fontSize: "1em", fontWeight: "Bold" }}>
          {task.title.toUpperCase()}
        </Typography>
        <Typography
          variant="body2"
          component="div"
          sx={{ fontFamily: "inter", fontSize: "0.9em", marginTop: "5px" }}>
          Assigned To: {task.assignedTo}
        </Typography>
        <div
          style={{
            alignItems: "center",
            marginTop: "8px",
            padding: "4px 12px",
            borderRadius: "16px",
            backgroundColor: "#F0F0F0",
          }}>
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              fontFamily: "inter",
              borderRadius: "50%",
              backgroundColor:
                task.state === "Todo"
                  ? "#f39c12"
                  : task.state === "In Progress"
                  ? "#2980b9"
                  : "#16a085",
              marginRight: "8px",
            }}
          />
          <span style={{ fontWeight: "bold" }}>{task.state}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
