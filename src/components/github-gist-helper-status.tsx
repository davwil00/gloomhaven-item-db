import { checkGithubHelperStatus, restoreFromGithubGist } from "./Tabs/Share/gist-helper";
import { Message } from "semantic-ui-react";
import React, { useEffect, useState } from "react";

const GithubGistHelperStatus = () => {
	const [githubHelperOnline, setGithubHelperOnline] = useState(true)
	useEffect(() => {
		checkGithubHelperStatus()
			.then(isOnline => {
				setGithubHelperOnline(isOnline)
				if (isOnline) {
					// restoreFromGithubGist().then()
				}
			})
	}, [setGithubHelperOnline]);

	if (githubHelperOnline) {
		return null
	}

	return (
		<Message negative>
			<Message.Header>Server offline</Message.Header>
			<p>You will not be able to save changes</p>
		</Message>
	)
};

export default GithubGistHelperStatus;