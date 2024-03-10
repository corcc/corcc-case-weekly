import NodeFetch from 'node-fetch';

export async function fetchBoardListR(){
	return await NodeFetch(
		'https://ncov.kdca.go.kr/pot/cv/trend/dmstc/ND_selectMntrgSttusChart.do'
	);
}

