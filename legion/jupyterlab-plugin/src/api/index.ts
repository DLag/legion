import { LocalApi, ILocalApi } from './local';

export class LegionApi {
    localApi: ILocalApi;

    constructor(){
        this.localApi = new LocalApi();
    }

    get local(){
        return this.localApi;
    }
}