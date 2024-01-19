import * as FS from 'fs';
import * as PATH from 'path';
import * as Type from './type';

export function recursiveSave(data:Type.Data | undefined){
	data?.datas?.forEach((positiveData:Type.PositiveData|undefined)=>{
		if(
			typeof positiveData?.date?.start != 'string'
		){
			throw 'START_DATE_WAS_NOT_STRING';
		}
		if(
			typeof positiveData?.date?.end != 'string'
		){
			throw 'END_DATE_WAS_NOT_STRING';
		}
		for(
			let d = Date.parse(positiveData.date?.start);
			d <= Date.parse(positiveData.date?.end);
			d += 86400000
		){
			const year = ((new Date(d)).getFullYear()).toString();
			const month = ((new Date(d)).getMonth() + 1).toString();
			const date = ((new Date(d)).getDate()).toString();

			const path = `${process.env.PWD}/artifacts/${year}-${month.length == 1 ? '0' : ''}${month}-${date.length == 1 ? '0' : ''}${date}.json`;
			try {
				FS.mkdirSync(PATH.dirname(path),{recursive:true});
			} catch(e){
				console.error(e);
			}
			console.log(path);
			console.log(positiveData.toString());
			FS.writeFileSync(path,positiveData.toString());
		}
	});
}

export function latestSave(positiveData:Type.PositiveData | undefined){
	const path = `${process.env.PWD}/artifacts/latest.json`;
	try {
		FS.mkdirSync(PATH.dirname(path),{recursive:true});
	} catch(e){
		console.error(e);
	}
	console.log(path);
	console.log(positiveData!.toString());
	FS.writeFileSync(path,positiveData!.toString());
}