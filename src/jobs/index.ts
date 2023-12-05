import monthlyUpdateAssignments from "./monthly-update-assignments";
import yearlyDeleteAssignments from "./yearly-delete-assignments";

const start = () => {
    monthlyUpdateAssignments.start();
    yearlyDeleteAssignments.start();
}

export default { start }