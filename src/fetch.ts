import NodeFetch from 'node-fetch';

export async function fetchBoardListR(){
	return await NodeFetch(
		'https://ncov.kdca.go.kr/bdBoardListR.do'
	);
}

