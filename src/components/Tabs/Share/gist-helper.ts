export async function fetchConfigurationFromGitHub(): Promise<{ [key: string]: unknown }> {
	const gistUrl = `https://gist.githubusercontent.com/davwil00/${process.env.REACT_APP_GIST_ID}/raw/frosthaven-shop.json?${new Date().getTime()}`;

	const response = await fetch(gistUrl)
	const loadedConfiguration = await response.json()
	loadedConfiguration.hash = await calculateHash(loadedConfiguration)
	return loadedConfiguration;
}

export const calculateHash = async (input: string): Promise<string> => {
	const encoder = new TextEncoder();
	const data = encoder.encode(input);
	const hash = await window.crypto.subtle.digest("SHA-256", data)
	return hash.toString();
}

export async function checkGithubHelperStatus(): Promise<boolean> {
	const githubHelperUrl = 'https://githelper.davwil00.co.uk/status'
	const response = await fetch(githubHelperUrl)
	return response.status === 200
}

export const restoreFromGithubGist = async () => {
	try {
		const configurationState = await fetchConfigurationFromGitHub()
		Object.entries(configurationState).forEach(([key, value]) => {
			window.localStorage.setItem(key, JSON.stringify(value));
		})
	} catch (error) {
		alert('Unable to load config')
	}
}

export const saveToGithubGist = () => {
	fetchConfigurationFromGitHub().then(savedConfig => {
		const hash = window.localStorage.getItem("hash");
		// if (savedConfig.hash !== hash) {
		// 	alert('Config has been updated since it was last loaded. Refresh the page to load the latest changes')
		// 	return
		// }
		const currentConfig = Object.entries(window.localStorage).reduce((acc, [key, value]) => ({
			...acc,
			[key]: value
		}), {})

		console.log('Saving to GH', currentConfig)

		const result = fetch(`https://githelper.davwil00.co.uk/${process.env.REACT_APP_GIST_ID}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				filename: 'frosthaven-shop.json',
				content: JSON.stringify(currentConfig, null, 2)
			})
		}).then(response => {
			if (response.status === 200) {
				alert('Saved');
			} else {
				console.error(response.status);
			}
		}).catch(err => console.error(err));
	})
}