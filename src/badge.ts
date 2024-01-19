import fs from 'fs';
import path from 'path';
import { thousands } from '@taccl/thousands';
import { badgen } from 'badgen';

type s = string;
type n = number;
type b = boolean;
type f = Function;
function getSvg ({
	title,
	value
}: any) {
	const svgString = badgen({
		label: `${title}`, // <Text>
		labelColor: '2F2F2F', // <Color RGB> or <Color Name> (default: '555')
		status: `${value}`, // <Text>, required
		style: 'flat', // 'flat' or 'classic' (default: 'classic')
		// icon: 'data:image/svg+xml;base64,...', // Use icon (default: undefined)
		// iconWidth: 13, // Set this if icon is not square (default: 13)
		scale: 1 // Set badge scale (default: 1)
	});
	return svgString;
}

const g = {
	s: getSvg
};

export const saveBadges = () => {
    const json_path = `${process.env.PWD}/data/latest.json`;
    const json = JSON.parse(fs.readFileSync(json_path).toString());
    try {
        fs.mkdirSync(`${process.env.PWD}/badge`,{recursive:true});
    } catch(e){}
    fs.writeFileSync(`${process.env.PWD}/badge/start.svg`,getSvg({title:'start',value:json['date']['start']}));
    fs.writeFileSync(`${process.env.PWD}/badge/end.svg`,getSvg({title:'end',value:json['date']['end']}));
    fs.writeFileSync(`${process.env.PWD}/badge/total.svg`,getSvg({title:'total',value:thousands(json['total'])}));
    fs.writeFileSync(`${process.env.PWD}/badge/weekly.svg`,getSvg({title:'weekly',value:thousands(json['weekly'])}));
};
