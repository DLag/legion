import { LocalApi, ILocalApi } from './local';
import { CloudApi, ICloudApi } from './cloud';

export interface ILegionApi {
    local: ILocalApi,
    cloud: ICloudApi
};


export class LegionApi implements ILegionApi {
    localApi: ILocalApi;
    cloudApi: ICloudApi;

    constructor(){
        this.localApi = new LocalApi();
        this.cloudApi = new CloudApi();
    }

    get local() : ILocalApi {
        return this.localApi;
    }

    get cloud() : ICloudApi {
        return this.cloudApi;
    }
}