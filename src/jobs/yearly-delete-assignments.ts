import { CronJob } from "cron";
import Assignments from "../models/assignments";

const deleteAssignments = async () => {
	try {
		const oneYearAgo = new Date();
		oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

		const result = await Assignments.deleteMany({ created_at: { $lt: oneYearAgo }, permanent: false });

		console.info(`JOB [yearly-delete-assignments] RESULT ==> ${result.deletedCount}`);
	} catch (error) {
		console.error("JOB [yearly-delete-assignments] ERROR ==> ", error);
	}
};

const cronExpression = "0 0 * * *";
const yearlyDeleteAssignments = new CronJob(cronExpression, deleteAssignments, null, true, "America/Sao_Paulo");

export default yearlyDeleteAssignments;
