import React, { useCallback } from "react";
import { Button, Form, TextArea } from "semantic-ui-react";
import { getShareHash } from "../MainView/ImportData";
import { calculateHash, fetchConfigurationFromGitHub } from "./gist-helper";

const save = async (config: string) => {
	const configHash = await calculateHash(config);
	fetchConfigurationFromGitHub().then(savedConfig => {
		if (savedConfig.hash !== configHash) {
			alert("Config has been updated since it was last loaded. Refresh the page to load the latest changes");
			return;
		}

		const result = fetch(`https://githelper.davwil00.co.uk/${process.env.REACT_APP_GIST_ID}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				filename: "frosthaven-shop.json",
				content: config
			})
		}).then(response => {
			if (response.status === 200) {
				alert("Saved");
			} else {
				console.error(response.status);
			}
		}).catch(err => console.error(err));
	});
};

const Share = () => {
	const shareHash = useCallback(() => {
		return getShareHash(false);
	}, []);

	const configHash = shareHash()
	const config = atob(configHash)
	return (
		<>
			<p>
				Here you can generate a link to this app with your current spoiler
				configuration.
			</p>

			<Form>
				<TextArea label="Config" value={config} rows={20} />
				<Button onClick={() => save(config)}>Save</Button>
			</Form>

		</>
	);
};

export default Share;
