import * as Fetch from '../src/fetch';
import * as Type from '../src/type';
import * as Save from '../src/save';

async function __main__(){
	const res = await Fetch.fetchBoardListR();
	const json = await res.text();
	const data = Type.Data.fromJSON(json);
	Save.recursiveSave(data[0]);
	Save.latestSave(data[0]?.datas?.sort((a,b) => (
		Date.parse(`${b?.date?.end}`) - Date.parse(`${a?.date?.end}`)
	))[0]);
	console.log(data);
}

__main__();
