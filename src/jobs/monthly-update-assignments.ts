import { CronJob } from "cron";
import Assignments from "../models/assignments";

const updateAssignments = async () => {
	try {
		const result = await Assignments.updateMany(
			{ finished: false, permanent: false },
			{ $set: { finished: true } }
		);

		console.info(`JOB [monthly-update-assignments] RESULT ==> ${result.modifiedCount}`);
	} catch (error) {
		console.error("JOB [monthly-update-assignments] ERROR ==> ", error);
	}
};

const cronExpression = "0 0 1 * *";
const monthlyUpdateAssignments = new CronJob(cronExpression, updateAssignments, null, true, "America/Sao_Paulo");

export default monthlyUpdateAssignments;
