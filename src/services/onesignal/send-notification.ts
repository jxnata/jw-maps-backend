import OneSignal from ".";
import { Push } from "./types/push";
import { PushResponse } from "./types/push-response";

export const sendNotification = async (external_id: string, data: Push) => {
	try {
		const notification = {
			app_id: process.env.ONESIGNAL_APP_ID!,
			include_aliases: { external_id: [external_id] },
			target_channel: "push",
			contents: {
				en: data.content,
			},
			headings: {
				en: data.title,
			},
		};

		const res = await OneSignal.post<PushResponse>("/notifications", notification);

		return res.data.result;
	} catch (error: any) {
		return { id: null, error: error.response.data };
	}
};
