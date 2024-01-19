import {addYearToDate} from "./date";
import * as HTMLParser from 'node-html-parser';

export class DateData {
	start?:string | undefined;
	end?:string | undefined;
	constructor(date_range:string){
		const result = date_range
			.split('~')
			.filter((s)=>(s.length != 0));
		if(result.length != 2){
				throw 'CANNOT_PARSE_DATE_RANGE';
		}
		this.start = addYearToDate(result[0]);
		this.end = addYearToDate(result[1]);
		if(Date.parse(this.start) > Date.parse(this.end)){
			throw 'START_CANNOT_BE_LATER_THAN_END';
		} else if(Date.parse(this.start) == Date.parse(this.end)){
			throw 'START_CANNOT_BE_SAME_AS_END';
		}
	}

	toString(){
		return JSON.stringify(this);
	}
}

export class PositiveData {
	date?: DateData | undefined;
	total?: string | undefined;
	weekly?: string | undefined;

	constructor(result:{
		date: string | DateData;
		total: string;
		weekly: string;
	}){
		if(result.date instanceof DateData){
			this.date = result.date;
		} else if(typeof result.date == 'string'){
			this.date = new DateData(result.date);
		} else {
			throw 'INCORRECT_DATE_TYPE';
		}

		if(typeof result.total != 'string'){
			throw 'INCORRECT_TOTAL_TYPE';
		} else if(result.total.replaceAll(/[^0-9]/g,'').length != result.total.length){
			throw 'INCORRECT_TOTAL_VALUE';
		} else {
			this.total = result.total;
		}

		if(typeof result.weekly != 'string'){
			throw 'INCORRECT_WEEKLY_TYPE';
		} else if(result.weekly.replaceAll(/[^0-9]/g,'').length != result.weekly.length){
			throw 'INCORRECT_WEEKLY_VALUE';
		} else {
			this.weekly = result.weekly;
		}
	}

	toString(){
		return JSON.stringify(this);
	}
}
export class Data {
	datas?: Array<PositiveData | undefined> | undefined;

	constructor(datas:Array<PositiveData | undefined>){
		if(datas.length == 0){
			throw 'DATA_IS_EMPTY';
		} else {
			this.datas = datas;
		}
	}

	static fromHtml(html:string): Array<Data | undefined> {
		const doc = HTMLParser.parse(html);
		let rtn:Array<Data | undefined> = [];
		const tables = doc
			.querySelectorAll('div.hdn > table');
		tables.forEach((e) => {
			const row_keys = HTMLParser.parse(e.innerHTML)
				.querySelectorAll('thead > tr > th[scope=col]')
				.map((k) => (k.innerText.trim()));

			const row_datas_arr:Array<PositiveData | undefined> = [];
			HTMLParser.parse(e.innerHTML)
				.querySelectorAll('tbody > tr')
				.forEach((tr) => {
					const row_datas = HTMLParser.parse(tr.innerHTML)
						.querySelectorAll('td')
						.map((td)=> (td.innerText.trim()));
					let p:{[x:string]:string | undefined} = {};
					p['date'] = row_datas[row_keys.indexOf('날짜')];
					p['total'] = row_datas[row_keys.indexOf(`${row_keys.filter((k) => (k.includes('누적')))[0]}`)];
					p['weekly'] = row_datas[row_keys.indexOf(`${row_keys.filter((k)=>(k.includes('주간')))[0]}`)];

					try {
						row_datas_arr.push(new PositiveData({
							date: p.date,
							total: p.total,
							weekly: p.weekly
						}));
					} catch(e){
						console.error(e);
					}
				});
			if(!row_datas_arr.length){
				return;
			}
			rtn.push(new Data(row_datas_arr));
		});
		return rtn;
	}

	toString(){
		return JSON.stringify(this);
	}
}
