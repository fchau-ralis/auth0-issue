import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable()
export class SEOService {
	constructor(private title: Title, private meta: Meta) {}

	updateTitle(title: string) {
		this.title.setTitle(title);
		this.meta.updateTag({ name: 'title', content: title });
	}

	updateDescription(desc: string) {
		this.meta.updateTag({ name: 'description', content: desc });
	}

	updateAuthor(author: string) {
		this.meta.updateTag({ name: 'author', content: author });
	}

	updateClassificiation(classification: string) {
		this.meta.updateTag({ name: 'classification', content: classification });
	}
}
