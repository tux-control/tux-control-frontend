import { Injectable } from '@angular/core';
import { FileInfo } from '../models/file-info';
import { ApiService } from './api.service';
import { LazyLoadEvent } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseError } from '../models/response-error';
import { MySocket } from './socketio.service';
import { UserStorageService } from './user-storage.service';
import { Observable } from 'rxjs';
import { ChunkUploadInfo } from '../models/chunk-upload-info';
import { FileInfoUpdateResponse } from '../models/file-info-update-response';


@Injectable({
  providedIn: 'root'
})
export class FileService {

  public onListAll$ = this.socket.fromEvent<FileInfo[]>('file/on-list-all');

  public onDelete$ = this.socket.fromEvent<FileInfo>('file/on-delete');
  public onDeleteError$ = this.socket.fromEvent<ResponseError>('file/on-delete-error');

  public onUpdate$ = this.socket.fromEvent<FileInfoUpdateResponse>('file/on-update');
  public onUpdateError$ = this.socket.fromEvent<ResponseError>('file/on-update-error');

  public onGet$ = this.socket.fromEvent<FileInfo>('file/on-get');
  public onGetError$ = this.socket.fromEvent<ResponseError>('file/on-get-error');

  public onIsFree$ = this.socket.fromEvent<number | null>('file/on-is-free');
  public onIsFreeError$ = this.socket.fromEvent<ResponseError>('file/on-is-free-error');

  public onGetDefault$ = this.socket.fromEvent<FileInfo>('file/on-get-default');
  public onGetErrorDefault$ = this.socket.fromEvent<ResponseError>('file/on-get-default-error');

  constructor(
    private http: HttpClient,
    private socket: MySocket,
    private apiService: ApiService,
    private userStorageService: UserStorageService
  ) { }

  getFiles(params: LazyLoadEvent, parentFileInfo?: FileInfo) {
    this.socket.emit('file/do-list-all', {
      settings: this.apiService.gridEventToApi(params),
      parentFileInfo: parentFileInfo
    });
  }

  getFile(path: string) {
    this.socket.emit('file/do-get', {'path': path});
  }

  updateFile(newFileInfo: FileInfo, oldFileInfo?: FileInfo) {
    this.socket.emit('file/do-update', {
      oldFileInfo: oldFileInfo,
      newFileInfo: newFileInfo
    });
  }

  deleteFile(fileInfo: FileInfo) {
    this.socket.emit('file/do-delete', fileInfo);
  }

  checkIfPathIsFree(name: string, index: number, path?: FileInfo) {
    this.socket.emit('file/do-is-free', {'path': (path ? path.absolute : '/') + name, 'index': index});
  }

  getDefaultFile() {
    this.socket.emit('file/do-get-default');
  }

  beginFileUpload(parentFile?: FileInfo): Observable<ChunkUploadInfo> { 
    const url = `${this.apiService.baseUrl}/file/upload`;

    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');

    const options = {
      headers: headers
    }
    return this.http.post<ChunkUploadInfo>(url, {
      parentFile: parentFile
    }, options);
  }

  uploadFile(id: string, chunk: Blob, offset: number, size: number, index: number, chunks: number, fileName: string): Observable<ChunkUploadInfo> {
    const url = `${this.apiService.baseUrl}/file/upload`;

    const formData = new FormData();
    formData.append('chunk', chunk, fileName);
    formData.append('offset', offset.toString());
    formData.append('size', size.toString());
    formData.append('index', index.toString());
    formData.append('chunks', chunks.toString());
    formData.append('id', id);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    const options = {
      headers: headers
    }

    return this.http.put<ChunkUploadInfo>(url, formData, options);
  }



  getDownloadUrl(fileInfo: FileInfo) {
    const url = new URL(`${this.apiService.baseUrl}/file/download`);
    url.searchParams.append('path', fileInfo.absolute);
    const accessToken = this.userStorageService.getAccessToken();
    if (accessToken) {
      url.searchParams.append('jwt', accessToken);
    }
    
    return url.href;
  }

  getFileUrl(fileInfo: FileInfo) {
    const url = new URL(`${this.apiService.baseUrl}/file/get`);
    url.searchParams.append('path', fileInfo.absolute);
    const accessToken = this.userStorageService.getAccessToken();
    if (accessToken) {
      url.searchParams.append('jwt', accessToken);
    }
    
    return url.href;
  }

  getThumbnailUrl(fileInfo: FileInfo, dimensions?: string) {
    const url = new URL(`${this.apiService.baseUrl}file/thumbnail`);

    url.searchParams.append('path', fileInfo.absolute);

    const accessToken = this.userStorageService.getAccessToken();
    if (accessToken) {
      url.searchParams.append('jwt', accessToken);
    }

    if (dimensions) {
      url.searchParams.append('dimensions', dimensions);
    }
    
    return url.href;

  }
}
