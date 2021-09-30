import fs from "fs";

import chromeWebstoreUpload from "chrome-webstore-upload";
import zipFolder from "zip-folder";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const FOLDER_NAME = "src";
const ZIP_NAME = `archive.zip`;

const webstore = chromeWebstoreUpload({
	extensionId: "bhfbmochnkclmomfbpfaoiicanbamekb",
	clientId: CLIENT_ID,
	refreshToken: REFRESH_TOKEN,
});

async function upload() {
	const extensionSource = fs.createReadStream(ZIP_NAME);
	try {
		const token = await webstore.fetchToken();

		const r1 = await webstore.uploadExisting(extensionSource, token);
		console.log("uploaded", r1);

		const r2 = await webstore.publish();
		console.log("published", r2);
	} catch (err) {
		console.log("Error occured", err);
	}
}

zipFolder(FOLDER_NAME, ZIP_NAME, (err) => {
	if (err) {
		console.log("Error occured", err);
		return;
	}

	console.log(`Zipped ${FOLDER_NAME} --> ${ZIP_NAME}`);

	// upload to chrome web store
	upload();
});
