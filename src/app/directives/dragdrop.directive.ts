import { Directive, HostListener, HostBinding, EventEmitter, Output, Input } from '@angular/core';

@Directive({
	selector: '[appDragdrop]',
})
export class DragdropDirective {
	@Input() private allowed_extensions: Array<string> = [];
	@Output() private filesChangeEmiter: EventEmitter<File[]> = new EventEmitter();
	@Output() private filesInvalidEmiter: EventEmitter<File[]> = new EventEmitter();
	@HostBinding('style.background') private background = '#fff';

	constructor() {}

	@HostListener('dragover', ['$event']) public onDragOver(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		this.background = '#F7F7F8';
	}

	@HostListener('dragleave', ['$event']) public onDragLeave(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		this.background = '#fff';
	}

	@HostListener('drop', ['$event']) public onDrop(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		this.background = '#fff';
		let files = evt.dataTransfer.files;
		let valid_files: Array<File> = [];
		let invalid_files: Array<File> = [];
		if (files.length > 0) {
			Object.keys(files).forEach(item => {
				let ext = files[item].name.split('.')[files[item].name.split('.').length - 1];
				if (this.allowed_extensions.lastIndexOf(ext) != -1) {
					valid_files.push(files[item]);
				} else {
					invalid_files.push(files[item]);
				}
			});

			this.filesChangeEmiter.emit(valid_files);
			this.filesInvalidEmiter.emit(invalid_files);
		}
	}
}
