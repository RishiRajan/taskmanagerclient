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
        width: "275px", // Set a fixed width here
        height: "150px",
        margin: "16px", // Optional: add some margin for spacing between cards
      }}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ fontFamily: "inter" }}>
          {task.title}
        </Typography>
        <Typography
          variant="body3"
          component="div"
          sx={{ fontFamily: "inter" }}>
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
