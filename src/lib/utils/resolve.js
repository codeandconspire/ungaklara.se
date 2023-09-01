export default function resolve(doc) {
	switch (doc.type) {
		case 'page':
			return `/${doc.uid}`;
		case 'events':
			return `/scen`;
		case 'event':
			return `/scen/${doc.uid}`;
		case 'your_visit':
			return `/besoket`;
		case 'Web':
		case 'Media':
			return doc.url?.replace(/^https?:\/\/#/, '#');
		default:
			switch (doc.link_type) {
				case 'Web':
				case 'Media':
					return doc.url?.replace(/^https?:\/\/#/, '#');
				default:
					return doc.uid;
			}
	}
}
