export default function resolve(doc) {
	switch (doc.type) {
		case 'page':
			return `/${doc.uid}`;
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
