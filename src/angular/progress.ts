/** source : http://restlet.com/company/blog/2016/08/29/whats-new-in-the-http-module-of-angular-2/ */
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {BrowserXhr} from '@angular/http';

@Injectable()
export class ProgressService {
  downloadProgress: Subject<any> = new Subject();
  uploadProgress: Subject<any> = new Subject();
}

@Injectable()
export class CustomBrowserXhr extends BrowserXhr {
  constructor(private service: ProgressService) {
    super();
  }

  build(): any {
    const xhr = super.build();
    xhr.onprogress = (event) => {
      this.service.downloadProgress.next(event);
    };

    xhr.upload.onprogress = (event) => {
      this.service.uploadProgress.next(event);
    };
    return <any>(xhr);
  }
}
