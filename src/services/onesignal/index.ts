import axios from "axios";

const OneSignal = axios.create({
	baseURL: "https://api.onesignal.com",
	headers: {
		Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
	},
});

export default OneSignal;
