
export function addYearToDate(orig_str:string): string {
	const orig_split = orig_str
		.split(/[^0-9]/g)
		.filter((s)=>(s.length != 0));
	if(orig_split.length < 2){
		throw 'CANNOT_PARSE';
	}
	const orig_date = orig_split[orig_split.length - 1];
	const orig_month = orig_split[orig_split.length - 2];
	const now_year = (new Date(Date.now())).getFullYear();
	const last_year = (now_year - 1);
	const is_this_year = ( // Data's timestamp cannot be bigger than (after fetch time)'s timestamp
		Date.parse(`${now_year}-${orig_month}-${orig_date}`) <
		Date.now()
	);
	if(is_this_year){
		return `${now_year}-${orig_month.length == 1 ? '0' : ''}${orig_month}-${orig_date.length == 1 ? '0' : ''}${orig_date}`;
	} else {
		return `${last_year}-${orig_month.length == 1 ? '0' : ''}${orig_month}-${orig_date.length == 1 ? '0' : ''}${orig_date}`;
	}

}
